from pathlib import Path
import hashlib
import json
import shutil
from PIL import Image

ROOT = Path(__file__).resolve().parents[4]
MANIFEST = ROOT / "docs/combat/production/20261127-lignes-de-maree/bosses-generation.json"
data = json.loads(MANIFEST.read_text())

def inspect(path):
    path = Path(path)
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    with Image.open(path) as im:
        im.load()
        meta = {"sourceId": path.stem, "nativeDimensions": {"width": im.width, "height": im.height}, "nativeFormat": im.format, "nativeMode": im.mode, "sha256": digest, "bytes": path.stat().st_size, "nativeAlpha": "A" in im.getbands()}
        if meta["nativeAlpha"]:
            a = im.getchannel("A")
            h = a.histogram()
            count = im.width * im.height
            meta["alpha"] = {"min": a.getextrema()[0], "max": a.getextrema()[1], "zeroPixelCount": h[0], "nearTransparentPixelCountAlpha0to8": sum(h[:9]), "fullyOpaquePixelCount": h[255], "nearOpaquePixelCountAlpha250to255": sum(h[250:]), "pixelCount": count, "cornerSamples": [a.getpixel(p) for p in [(0,0),(im.width-1,0),(0,im.height-1),(im.width-1,im.height-1)]], "nonzeroAlphaBounds": a.getbbox(), "alphaAtLeast16Bounds": a.point(lambda p: 255 if p >= 16 else 0).getbbox()}
    return meta

seen = set()
for record in data["assets"]:
    assert record["id"] not in seen
    seen.add(record["id"])
    source = Path(record["source"])
    target = ROOT / record["assetPath"]
    target.parent.mkdir(parents=True, exist_ok=True)
    meta = inspect(source)
    assert meta["nativeFormat"] == "PNG" and meta["nativeAlpha"], (record["id"], "PNG alpha required")
    assert meta["alpha"]["zeroPixelCount"] > 0 and meta["alpha"]["nearTransparentPixelCountAlpha0to8"] > meta["alpha"]["pixelCount"] * 0.05, (record["id"], "insufficient transparent pixels")
    if target.exists():
        assert hashlib.sha256(target.read_bytes()).hexdigest() == meta["sha256"], (record["id"], "destination already differs")
    else:
        shutil.copy2(source, target)
    target_hash = hashlib.sha256(target.read_bytes()).hexdigest()
    assert target_hash == meta["sha256"]
    record.update(meta)
    record["sourceSha256"] = meta["sha256"]
    record["destinationSha256"] = target_hash
    record["destinationAbsolute"] = str(target)
    record["byteIdenticalToSource"] = True
    record["rasterProcessing"] = "None. Byte-for-byte file copy only; no crop, scaling, alpha cleanup, recoloring, re-encoding, or compositing."
    for rejected in record.get("supersededCandidates", []):
        rejected.update(inspect(rejected["source"]))
        rejected["preservedAtSource"] = True

brief = ROOT / data["briefsSource"]
data["briefsSha256"] = hashlib.sha256(brief.read_bytes()).hexdigest()
data["status"] = "completed-static-bases"
data["generationCount"] = len(data["assets"]) + sum(len(a.get("supersededCandidates", [])) for a in data["assets"])
data["acceptedBaseCount"] = len(data["assets"])
data["supersededCandidateCount"] = sum(len(a.get("supersededCandidates", [])) for a in data["assets"])
data["gameplayStatus"] = {"playableBossesAdded": 0, "aiAdded": 0, "animationCyclesAdded": 0, "staticVisualBasesAdded": len(data["assets"])}
data["reviewScope"] = "Each full native image viewed individually; checks cover one subject, complete silhouette, overall right-facing direction, recognizable design and native alpha. All 20 unchanged PNG files were also drawn through native Canvas over a checkerboard and the five QA sheets inspected. No animated combat readiness is claimed."
data["knownLimitations"] = ["The requested 8 percent clear margin is not met consistently, although accepted subjects remain in frame.", "Several subjects use a slight three-quarter perspective; technical orthographic views are not supplied.", "Minor design interpretations are listed in each visualReview entry.", "Native alpha reaches 254 rather than 255; the source channel is preserved without normalization."]
data["bytesTotal"] = sum(a["bytes"] for a in data["assets"])
MANIFEST.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"count":len(data["assets"]),"bytes":data["bytesTotal"],"sha256CopiesVerified":True,"nativeAlphaEveryImage":all(a["nativeAlpha"] for a in data["assets"]),"dimensions":sorted({(a["nativeDimensions"]["width"],a["nativeDimensions"]["height"]) for a in data["assets"]}),"alphaRanges":sorted({(a["alpha"]["min"],a["alpha"]["max"]) for a in data["assets"]}),"zeroAlphaRatios":[[a["id"],round(a["alpha"]["zeroPixelCount"]/a["alpha"]["pixelCount"],4)] for a in data["assets"]]},ensure_ascii=False,indent=2))
