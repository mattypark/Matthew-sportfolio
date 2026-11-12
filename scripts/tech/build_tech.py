"""The tech section's pictures (src/casefile/tech): his project shots, resized to webp, plus code cards
rendered from his own code. Writes public/casefile/tech/*.webp and src/casefile/tech/pictures.json.

Run from the repo root with any Python that has Pillow:  python scripts/tech/build_tech.py
Sources are his public-facing images only (App Store screens, posted banners, design boards), plus
whatever he drops in ~/Downloads/current-projects/matthewportfolio/tech-photos/<kind>/ (jpg, png or
webp; <kind> is one of the list's kinds: iphone, ai, web, 3d, code, brand, or me for photos of him). Nothing with real messages in it.
"""
import json
import textwrap
import re
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
HOME = Path.home() / "Downloads" / "current-projects"
OUT = ROOT / "public" / "casefile" / "tech"
MANIFEST = ROOT / "src" / "casefile" / "tech" / "pictures.json"
LONG_SIDE = 1600  # sharp on a retina screen at the collage's largest card

NUDGY = HOME / "appscurrent" / "nudgy" / "build" / "all-images"
FLY = HOME / "nudgy-flyover" / "out"
# Built-in pictures that don't go stale (brand art, 3D boards, the flyover). Everything current
# (app screens, sites, AI tools) comes from tech-photos/, newest first, so it can be refreshed by
# dropping files in.
SOURCES = {
    "3d": [HOME / "matthewportfolio/build/all-images/boards" / f for f in ["gear-round2-board.jpg", "gear-board.jpg", "casefile-board.jpg"]]
    + [FLY / f for f in ["still-1.00.png", "still-5.40.png", "still-13.00.png", "hero-phone-small.png"]],
    "brand": [NUDGY / "banners" / f for f in ["say-it-once-wide-16x9.png", "say-it-once-x-header@2x.png"]]
    + [NUDGY / "brand" / f for f in ["altruistic-mascot-pair.png", "altruistic-app-icon-1024.png"]]
    + [NUDGY / "app-store/mushy" / f for f in ["face-sleepy.png", "act-headphones.png", "act-phone.png"]],
}

# Nudgy's code is read from its main branch (the checkout on disk can lag behind it).
NUDGY_REPO = HOME / "appscurrent" / "nudgy"
NUDGY = lambda path: ("git", NUDGY_REPO, "main", path)
CODE = [
    ("FacingMushy.swift", "swift", NUDGY("ios/Nudgy/Sources/DesignSystem/FacingMushy.swift"), "var body", 13),
    ("security.ts", "ts", NUDGY("worker/src/security.ts"), "export async function sameSecret", 9),
    ("stripe.ts", "ts", NUDGY("worker/src/stripe.ts"), "  if ((first.meta.changes", 10),
    ("bands.js", "js", ROOT / "src/casefile/fx/bands.js", "export function bandClip", 14),
    ("field.frag", "glsl", ROOT / "src/casefile/tech/field.js", "precision highp float", 10),
    # AI: Nudgy's agent loop, one step of a run (shown under "AI", not "Code")
    ("agent/engine.ts", "ts", NUDGY("worker/src/agent/engine.ts"), "export async function runAgentStep", 14, "ai"),
    ("models.ts", "ts", NUDGY("worker/src/models.ts"), "export const EFFORTS", 12, "ai"),
]
KEYWORDS = r"\b(?:let|var|const|func|struct|some|View|async|await|return|if|else|guard|try|while|export|function|import|from|for|of|float|vec2|vec3|vec4|uniform|varying|void|sampler2D|precision|highp|new|throw|catch)\b"


def keep_picture(src: Path, name: str) -> dict:
    im = Image.open(src).convert("RGB")
    im.thumbnail((LONG_SIDE, LONG_SIDE), Image.LANCZOS)
    im.save(OUT / f"{name}.webp", "WEBP", quality=80, method=6)
    return {"src": f"/casefile/tech/{name}.webp", "w": im.width, "h": im.height}


def read_source(source) -> str:
    if isinstance(source, tuple):
        _, repo, ref, path = source
        return subprocess.run(["git", "-C", str(repo), "show", f"{ref}:{path}"], check=True, capture_output=True, text=True).stdout
    return Path(source).read_text()


def code_card(title: str, source, start: str, lines: int) -> Image.Image:
    text = read_source(source).splitlines()
    at = next(i for i, l in enumerate(text) if l.startswith(start) or start in l)
    body = [l.rstrip()[:58] for l in textwrap.dedent("\n".join(text[at:at + lines])).splitlines()]
    font = ImageFont.truetype("/System/Library/Fonts/Menlo.ttc", 17)
    head = ImageFont.truetype("/System/Library/Fonts/Menlo.ttc", 14)
    w, pad, lh = 720, 28, 25
    h = pad * 2 + 34 + lh * len(body)
    im = Image.new("RGB", (w, h), (12, 15, 13))
    d = ImageDraw.Draw(im)
    for i, c in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        d.ellipse((pad + i * 20, pad, pad + i * 20 + 11, pad + 11), fill=c)
    d.text((pad + 72, pad - 2), title, font=head, fill=(150, 160, 152))
    y = pad + 34
    for n, line in enumerate(body):
        d.text((pad, y), f"{n + 1:>2}", font=font, fill=(70, 80, 72))
        x = pad + 40
        for part in re.split(f"({KEYWORDS}|//.*|\"[^\"]*\"|`[^`]*`)", line):
            if not part:
                continue
            color = (225, 230, 226)
            if re.fullmatch(KEYWORDS, part):
                color = (219, 233, 74)
            elif part.startswith("//"):
                color = (110, 140, 118)
            elif part[:1] in "\"`":
                color = (120, 200, 150)
            d.text((x, y), part, font=font, fill=color)
            x += d.textlength(part, font=font)
        y += lh
    return im


DROP = HOME / "matthewportfolio" / "tech-photos"


def dropped() -> dict:
    """His own picks: one folder per kind, files in name order."""
    found = {}
    if not DROP.exists():
        return found
    for folder in sorted(p for p in DROP.iterdir() if p.is_dir()):
        # newest first, so a fresh shot leads its word
        files = sorted((f for f in folder.iterdir() if f.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}), key=lambda f: -f.stat().st_mtime)
        if files:
            found[folder.name] = files
    return found


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    pictures = []
    for kind, paths in dropped().items():
        for i, src in enumerate(paths):
            pictures.append({"kind": kind, **keep_picture(src, f"drop-{kind}-{i + 1:02d}")})
    for kind, paths in SOURCES.items():
        for i, src in enumerate(paths):
            if not src.exists():
                print("missing", src)
                continue
            pictures.append({"kind": kind, **keep_picture(src, f"{kind}-{i + 1:02d}")})
    for i, (title, lang, source, start, lines, *kind) in enumerate(CODE):
        try:
            card = code_card(title, source, start, lines)
        except (OSError, subprocess.CalledProcessError, StopIteration) as error:
            print("missing", title, error)
            continue
        card.save(OUT / f"code-{i + 1:02d}.webp", "WEBP", quality=82, method=6)
        pictures.append({"kind": kind[0] if kind else "code", "src": f"/casefile/tech/code-{i + 1:02d}.webp", "w": card.width, "h": card.height, "lang": lang})
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(pictures, indent=2) + "\n")
    total = sum((OUT / Path(p["src"]).name).stat().st_size for p in pictures)
    print(f"{len(pictures)} pictures, {total // 1024} KB")


if __name__ == "__main__":
    main()
