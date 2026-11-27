#!/usr/bin/env python3
"""Rebuild the offline expansion catalogue and native image inventory, without editing PNGs."""
import hashlib
import json
from pathlib import Path
from PIL import Image

REPO = Path(__file__).resolve().parents[3]
MODE = REPO / 'modes/echos-de-la-greve'
DOC = REPO / 'docs/combat/extensions/lignes-de-maree'
OUT = REPO / 'docs/combat/production/20261127-lignes-de-maree'
GROUPS = {'characters': ('char', '-stance', 'character'), 'stages': ('stage', '-panorama', 'stage'),
          'enemies': ('enemy', '-base', 'enemy'), 'bosses': ('boss', '-base', 'boss')}

def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

def build():
    catalogue = json.loads((DOC / 'catalog.json').read_text(encoding='utf-8'))
    floor_file = OUT / 'stage-geometry.json'
    floors = json.loads(floor_file.read_text()) if floor_file.exists() else {}
    records = {}
    known = {item['id'] for category in GROUPS for item in catalogue.get(category, [])}
    for directory, (prefix, suffix, kind) in GROUPS.items():
        for path in sorted((MODE / 'assets/lignes-de-maree' / directory).glob('*.png')):
            slug = path.stem.removesuffix(suffix)
            identity = 'ldm-' + prefix + '-' + slug
            if identity not in known:
                raise ValueError('An image has no catalogue entry: ' + identity)
            raw = path.read_bytes()
            with Image.open(path) as source:
                source.load()
                alpha = source.getchannel('A') if 'A' in source.getbands() else None
                record = {'id': identity, 'kind': kind, 'src': str(path.relative_to(MODE)),
                          'width': source.width, 'height': source.height, 'mode': source.mode,
                          'bytes': len(raw), 'sha256': hashlib.sha256(raw).hexdigest(),
                          'gitBlobSha': hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest(),
                          'alphaMin': alpha.getextrema()[0] if alpha else 255,
                          'alphaMax': alpha.getextrema()[1] if alpha else 255}
                if kind != 'stage':
                    if alpha is None or record['alphaMin'] != 0:
                        raise ValueError('Native alpha missing: ' + identity)
                    record['subjectBBoxAlpha128'] = alpha.point(lambda value: 255 if value >= 128 else 0).getbbox()
            if kind == 'stage' and identity in floors:
                floor = floors[identity]['floorY']
                if not isinstance(floor, (int, float)) or not 0 < floor < 1:
                    raise ValueError('Invalid floor measurement: ' + identity)
                record['floorY'] = floor
            records[identity] = record
    for directory, (_, _, kind) in GROUPS.items():
        for item in catalogue[directory]:
            image = records.get(item['id'])
            item['production']['art'] = ({'character': 'stance_received', 'stage': 'panorama_received'}.get(kind, 'base_received') if image else 'pending')
            item['production']['runtime'] = 'static_arena' if image and 'floorY' in image else 'planned'
    catalogue['status'] = 'design_catalog_with_received_bases_and_static_arenas'
    catalogue['production'] = {'design': 'complete', 'art': 'base_set_received' if len(records) == 70 else 'base_set_in_progress',
                               'runtime': 'static_arenas_only', 'receivedImages': len(records),
                               'staticArenas': sum('floorY' in r for r in records.values()),
                               'playableOriginalCharacters': 0, 'playableOriginalEnemies': 0, 'playableOriginalBosses': 0}
    write_json(DOC / 'catalog.json', catalogue)
    asset_data = {'schemaVersion': 1, 'date': '2026-11-27', 'items': records}
    (MODE / 'extension-data.js').write_text('/* Generated from docs/combat/extensions/lignes-de-maree/catalog.json. */\nwindow.StrandOriginalExtension = ' + json.dumps(catalogue, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
    (MODE / 'extension-assets.js').write_text('/* Received native images only. No animation or playable fighter is inferred. */\nwindow.StrandExtensionAssets = ' + json.dumps(asset_data, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
    write_json(OUT / 'assets-manifest.json', asset_data)
    counts = {category: sum(r['kind'] == meta[2] for r in records.values()) for category, meta in GROUPS.items()}
    print(json.dumps({'catalogueEntities': len(known), 'received': counts, 'staticArenas': sum('floorY' in r for r in records.values()), 'bytes': sum(r['bytes'] for r in records.values())}))

if __name__ == '__main__':
    build()
