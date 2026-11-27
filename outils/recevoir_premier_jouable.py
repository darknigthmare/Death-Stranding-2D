#!/usr/bin/env python3
"""Measure native PNGs and build opt-in art registries. Never edit image pixels."""
from pathlib import Path
from PIL import Image
import hashlib, json, sys

REPO = Path(__file__).resolve().parents[1]
MODE = REPO / "modes/echos-de-la-greve"
OUT = REPO / "docs/combat/production/20261127-first-playable"
MANIFEST = OUT / "art-generation.json"
REQUIRED_POSES = ("stance", "guard", "crouch", "jump", "light", "heavy", "hurt", "tether", "anchor", "reel", "fall", "taunt", "victory", "walk1", "walk2")
BOSS_POSES = ("guard", "shield-push", "pole-strike", "stagger", "kneel", "surrender")
manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
inventory, errors = [], []

def measure(relative, strict=True):
    path = REPO / relative
    data = path.read_bytes()
    with Image.open(path) as source:
        source.load()
        if source.format != "PNG" or source.mode != "RGBA":
            raise ValueError("Native RGBA PNG required: " + relative)
        width, height = source.size
        alpha = source.getchannel("A")
        histogram = alpha.histogram()
        mask = alpha.point(lambda value: 255 if value > 8 else 0)
        bbox = mask.getbbox()
        opaque = alpha.point(lambda value: 255 if value >= 224 else 0).getbbox()
        if not bbox or not opaque:
            raise ValueError("No visible subject: " + relative)
        left, top, right, bottom = bbox
        perimeter = [alpha.crop((0, 0, width, 1)), alpha.crop((0, height-1, width, height)), alpha.crop((0, 0, 1, height)), alpha.crop((width-1, 0, width, height))]
        border_max = max(edge.getextrema()[1] for edge in perimeter)
        total = width * height
        item = {"path": relative, "sha256": hashlib.sha256(data).hexdigest(), "bytes": len(data), "width": width, "height": height, "mode": source.mode,
                "alphaMin": alpha.getextrema()[0], "alphaMax": alpha.getextrema()[1], "transparentFraction": round(histogram[0] / total, 6),
                "opaqueFraction": round(sum(histogram[224:]) / total, 6), "borderAlphaMax": border_max,
                "sampledAlpha": {str(x) + "," + str(y): alpha.getpixel((min(x, width-1), min(y, height-1))) for x, y in [(50,750),(100,750),(50,400),(width//2,30),(width-50,750)]},
                "crop": [left, top, right-left, bottom-top], "opaqueBBox": list(opaque)}
        if strict and (histogram[0] / total < .03 or border_max > 64):
            errors.append({"path": relative, "reason": "Insufficient transparent margin or visible subject touches native canvas", "transparentFraction": item["transparentFraction"], "borderAlphaMax": border_max})
        return item

for asset in manifest["assets"]:
    measured = measure(asset["path"])
    measured.update({key: asset[key] for key in ("id", "runtimeKey", "subject", "pose", "facing", "heightRatio") if key in asset})
    inventory.append(measured)
    print("MEASURE|" + json.dumps(measured, ensure_ascii=False))

def geometry(item):
    return {"src": str(Path(item["path"]).relative_to("modes/echos-de-la-greve")), "crop": item["crop"], "anchorX": .5, "baselineY": 1,
            "heightRatio": item.get("heightRatio", 1), "nativeFacing": -1 if item.get("facing") == "left" else 1}

kit = {"ready": False, "poses": {}, "props": {}}
boss = {"ready": False, "sprites": {"consignateur": {}}, "geometry": {"bosses": {"consignateur": {}}}, "props": {}, "propGeometry": {}}
for item in inventory:
    subject, pose, facing = item.get("subject"), item.get("pose"), item.get("facing")
    if subject == "balise" and pose in REQUIRED_POSES and facing in ("left", "right"):
        kit["poses"].setdefault(pose, {})[facing] = geometry(item)
    elif subject == "consignateur" and pose in BOSS_POSES and facing == "left":
        meta = geometry(item)
        boss["sprites"]["consignateur"][pose] = meta.pop("src")
        boss["geometry"]["bosses"]["consignateur"][pose] = meta
    elif item.get("runtimeKey") in ("anchor", "ropeHook") and not subject:
        kit["props"][item["runtimeKey"]] = geometry(item)
    elif item.get("runtimeKey") in ("console-active", "console-inactive", "register"):
        meta = geometry(item)
        boss["props"][item["runtimeKey"]] = meta.pop("src")
        boss["propGeometry"][item["runtimeKey"]] = meta

kit["ready"] = not errors and all(all(direction in kit["poses"].get(pose, {}) for direction in ("left", "right")) for pose in REQUIRED_POSES) and all(key in kit["props"] for key in ("anchor", "ropeHook"))
boss["ready"] = not errors and all(pose in boss["sprites"]["consignateur"] for pose in BOSS_POSES) and all(key in boss["props"] for key in ("console-active", "console-inactive", "register"))

def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

def write_registry(name, export, value):
    (MODE / name).write_text("/* Generated from native PNG measurements; sources remain byte-for-byte intact. */\nwindow." + export + " = " + json.dumps(value, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")

write_registry("original-kits-assets.js", "StrandOriginalKitsAssets", {"version": 1, "kits": {"balise": kit}})
write_registry("original-bosses-assets.js", "StrandOriginalBossArt", boss)
report = {"schemaVersion": 1, "baseCommit": manifest["baseCommit"], "nativeImagesModified": False, "thresholdAlpha": 8, "assets": inventory, "errors": errors,
          "ready": {"balise": kit["ready"], "consignateur": boss["ready"]}, "scope": "Native file, alpha and crop reception. Pose identity and alignment also require visual review."}
write_json(OUT / "assets-reception.json", report)
print("RECEPTION|" + json.dumps({"assets": len(inventory), "ready": report["ready"], "errors": errors}))
if errors or ("--require-complete" in sys.argv and not all(report["ready"].values())):
    raise SystemExit(1)
