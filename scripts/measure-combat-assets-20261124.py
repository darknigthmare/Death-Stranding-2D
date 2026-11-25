#!/usr/bin/env python3
"""Measure native production PNGs; never alter, resize or re-encode them."""
from pathlib import Path
import argparse
import hashlib
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MODE = ROOT / 'modes/echos-de-la-greve'
PRODUCTION = ROOT / 'art/sources/echos-de-la-greve/production-20261124'
PHASES = ('guard', 'crouch', 'rise', 'apex', 'fall')
# Art-direction proportions, separate from measured pixel bounds. These change
# visual height only; fighter dimensions, hurtboxes and simulation stay intact.
HEIGHTS = {
    'sam': (1.0, .70, .94, .76, .96),
    'fragile': (.98, .66, .94, .80, .96),
    'higgs': (.99, .73, .94, .84, 1.04),
    'cliff': (.99, .66, .94, .80, .96),
    'mule': (1.0, .70, .94, .82, .96),
    'diehardman': (.99, .68, .94, .82, .96),
    'heartman': (.99, .70, .94, .80, .96),
}
SHOT_WIDTHS = {'sam': 36, 'higgs': 86, 'cliff': 45, 'recall': 54,
               'gate': 36, 'heartman': 32, 'memory': 128}
# These two effects originate at the floor. Fit their visible height to the
# existing attack envelope, preserving native aspect ratio and simulation.
SHOT_HEIGHTS = {'higgs': 100, 'gate': 143}
# Anatomical measurements reviewed in native sources. Accessories can extend
# beyond a boot or above a head; alpha extrema alone are insufficient here.
POSE_CALIBRATION = {
    ('fragile', 'apex'): {
        'footY': 1324,
        'note': 'Umbrella tip reaches y1370; rear boot sole ends at y1324.',
    },
    ('higgs', 'apex'): {
        'footY': 1078,
        'note': 'Cape reaches y1102; rear boot sole ends at y1078.',
    },
    ('higgs', 'fall'): {
        'headYApprox': 220, 'footY': 1374,
        'note': 'Cape rises to y8 above hood at approximately y220; height ratio reviewed against guard head and torso.',
    },
}

def measure(path, threshold):
    with Image.open(path) as original:
        assert original.format == 'PNG' and 'A' in original.getbands(), path
        alpha = original.getchannel('A')
        histogram = alpha.histogram()
        bounds = alpha.point(lambda value: 255 if value > threshold else 0).getbbox()
        assert bounds and histogram[0] > 0, path
        left, top, right, bottom = bounds
        # Three pixels retain the antialiased outline while excluding distant
        # RGB data hidden beneath zero/near-zero alpha in some native outputs.
        left, top = max(0, left-3), max(0, top-3)
        right, bottom = min(original.width, right+3), min(original.height, bottom+3)
        record = {
            'runtime': str(path.relative_to(ROOT)),
            'width': original.width, 'height': original.height,
            'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
            'bytes': path.stat().st_size,
            'alphaThreshold': threshold,
            'alphaBounds': list(bounds),
            'crop': [left, top, right-left, bottom-top],
            'transparentPixels': histogram[0],
            'nativePixelsPreserved': True,
        }
        # Contact-band center estimates the grounded feet's support position.
        # Airborne poses use the crop center, independent of a trailing boot.
        band_y = max(top, bounds[3] - max(3, round((bottom-top)*.015)))
        contact = alpha.crop((left, band_y, right, bounds[3]))
        contact_box = contact.point(lambda value: 255 if value > 96 else 0).getbbox()
        support = ((contact_box[0]+contact_box[2])/2/(right-left)) if contact_box else .5
        baseline = (bounds[3]-top)/(bottom-top)
        return record, round(support, 6), round(baseline, 6)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--allow-partial', action='store_true')
    args = parser.parse_args()
    geometry = {'fighters': {}, 'projectiles': {}}
    records, missing = [], []
    for fighter, ratios in HEIGHTS.items():
        geometry['fighters'][fighter] = {}
        for pose, height_ratio in zip(PHASES, ratios):
            path = MODE / 'assets/fighters' / fighter / (pose+'.png')
            if not path.is_file():
                missing.append(str(path.relative_to(ROOT)))
                continue
            info, support, baseline = measure(path, 8)
            calibration = POSE_CALIBRATION.get((fighter, pose))
            if calibration:
                baseline = round((calibration['footY'] - info['crop'][1]) / info['crop'][3], 6)
            geometry['fighters'][fighter][pose] = {
                'crop': info['crop'],
                'anchorX': support if pose in ('guard', 'crouch') else .5,
                'baselineY': baseline,
                'heightRatio': height_ratio,
            }
            record = {'type': 'fighter', 'id': fighter, 'pose': pose, **info,
                      'renderGeometry': geometry['fighters'][fighter][pose]}
            if calibration:
                record['anatomicalCalibration'] = calibration
            records.append(record)
    for kind, width in SHOT_WIDTHS.items():
        path = MODE / 'assets/projectiles' / (kind+'.png')
        if not path.is_file():
            missing.append(str(path.relative_to(ROOT)))
            continue
        info, _, baseline = measure(path, 2)
        if kind in SHOT_HEIGHTS:
            visible_height = info['alphaBounds'][3] - info['alphaBounds'][1]
            width = round(SHOT_HEIGHTS[kind] * info['crop'][2] / visible_height, 6)
        geometry['projectiles'][kind] = {
            'crop': info['crop'], 'width': width, 'anchorX': .5,
            'anchorY': baseline if kind in ('higgs', 'gate') else .5,
        }
        records.append({'type': 'projectile', 'id': kind, **info,
                        'renderGeometry': geometry['projectiles'][kind],
                        **({'visibleHeightTarget': SHOT_HEIGHTS[kind]} if kind in SHOT_HEIGHTS else {})})
    if missing and not args.allow_partial:
        raise SystemExit('Production unfinished: '+', '.join(missing))
    PRODUCTION.mkdir(parents=True, exist_ok=True)
    output = MODE / 'asset-geometry-20261124.js'
    output.write_text('/* Native source bounds; generated by scripts/measure-combat-assets-20261124.py. */\n'
                      '/* Height ratios are art-direction values, not canonical measurements. */\n'
                      'window.StrandGeneratedGeometry = '+json.dumps(geometry, indent=2)+';\n')
    report = {
        'date': '2026-11-24', 'sourceBranch': 'main',
        'baseCommit': 'ba4431587f861823e453c85bdf7e6967778329a9',
        'scope': 'Seven existing DS1/DC fighters, five poses each, seven existing combat effects.',
        'expectedAssets': 42, 'presentAssets': len(records), 'missing': missing,
        'nativeImagesUntouched': True,
        'canonicalFidelity': 'Not certified: local costume continuity checked; official pose-by-pose comparison remains open.',
        'assets': records,
    }
    (PRODUCTION / 'production-assets.json').write_text(json.dumps(report, indent=2, ensure_ascii=False)+'\n')
    print(json.dumps({'present': len(records), 'expected': 42, 'missing': len(missing), 'geometry': str(output)}))

if __name__ == '__main__':
    main()
