#!/usr/bin/env python3
"""Regenerate the low-poly "spires" recreation from inspo/spires4.jpg.

Samples the source on an equilateral-triangle lattice, quantizes each facet to
PALETTE, and writes two artifacts:
  - playground/spires4.svg                      (standalone, hex colors inlined)
  - src/components/playground/spiresData.ts     (data for the <Spires/> component)

Run from anywhere:  python3 playground/gen_spires.py     (needs Pillow)
"""
import math
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent          # repo root
SRC = ROOT / "inspo" / "spires4.jpg"
SVG_OUT = ROOT / "playground" / "spires4.svg"
TS_OUT = ROOT / "src" / "components" / "playground" / "spiresData.ts"

VB = 640                      # square viewBox
S = 80.0                      # triangle side (horizontal); smaller = finer detail
H = S * math.sqrt(3) / 2.0    # row height

# role -> (rgb anchor for quantizing, hex for output). Tuned to the image + site.
PALETTE = {
    "ink":      ((0x14, 0x20, 0x1c), "#14201c"),
    "slate":    ((0x2c, 0x3e, 0x3d), "#2c3e3d"),
    "pine":     ((0x0f, 0x5e, 0x54), "#0f5e54"),
    "tealDeep": ((0x0f, 0x8c, 0x7e), "#0f8c7e"),
    "teal":     ((0x16, 0xb8, 0xa3), "#16b8a3"),
    "greyMid":  ((0x80, 0x8b, 0x88), "#808b88"),
    "grey":     ((0xbc, 0xc1, 0xbe), "#bcc1be"),
    "white":    ((0xec, 0xee, 0xec), "#eceeec"),
}

img = Image.open(SRC).convert("RGB")
IW, IH = img.size
px = img.load()


def sample(cx, cy):
    ix = min(max(cx / VB * IW, 0), IW - 1)
    iy = min(max(cy / VB * IH, 0), IH - 1)
    r = g = b = n = 0
    for dx in (-6, -3, 0, 3, 6):
        for dy in (-6, -3, 0, 3, 6):
            x = int(min(max(ix + dx, 0), IW - 1))
            y = int(min(max(iy + dy, 0), IH - 1))
            pr, pg, pb = px[x, y]
            r += pr; g += pg; b += pb; n += 1
    return (r / n, g / n, b / n)


def nearest(rgb):
    best, bd = None, 1e18
    for role, (anchor, _hex) in PALETTE.items():
        d = sum((a - b) ** 2 for a, b in zip(rgb, anchor))
        if d < bd:
            bd, best = d, role
    return best


tris = []
rows = math.ceil(VB / H) + 1
cols = math.ceil(VB / S) + 2
for r in range(rows):
    off_r = (r % 2) * (S / 2)
    off_r1 = ((r + 1) % 2) * (S / 2)
    for i in range(-1, cols):
        ax = i * S + off_r
        up = [(ax, r * H), (ax - S / 2, (r + 1) * H), (ax + S / 2, (r + 1) * H)]
        dx = i * S + off_r1
        down = [(dx, (r + 1) * H), (dx - S / 2, r * H), (dx + S / 2, r * H)]
        for verts in (up, down):
            cx = sum(p[0] for p in verts) / 3
            cy = sum(p[1] for p in verts) / 3
            if cx < -S or cx > VB + S or cy < -S or cy > VB + S:
                continue
            role = nearest(sample(cx, cy))
            pts = " ".join(f"{round(p[0], 1)},{round(p[1], 1)}" for p in verts)
            tris.append({"p": pts, "r": role})

# --- standalone SVG (portable, hex inlined) ---
svg = [
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {VB} {VB}" '
    f'width="{VB}" height="{VB}" shape-rendering="crispEdges" role="img" '
    f'aria-label="Low-poly geometric composition recreated from spires4.jpg">',
    "  <title>Spires (low-poly recreation of inspo/spires4.jpg)</title>",
    f'  <rect width="{VB}" height="{VB}" fill="{PALETTE["slate"][1]}"/>',
]
svg += [f'  <polygon points="{t["p"]}" fill="{PALETTE[t["r"]][1]}"/>' for t in tris]
svg.append("</svg>")
SVG_OUT.write_text("\n".join(svg) + "\n")

# --- TS data for the React component ---
roles = sorted({t["r"] for t in tris})
ts = [
    "// Generated from inspo/spires4.jpg by playground/gen_spires.py — do not hand-edit.",
    "// Equilateral-triangle lattice sampled + quantized to the SPIRE_PALETTE roles.",
    "",
    "export type FacetRole =",
    "  | " + "\n  | ".join(f'"{r}"' for r in roles) + ";",
    "",
    "export type SpireFacet = { points: string; role: FacetRole };",
    "",
    f"export const SPIRES_VIEWBOX = {VB};",
    "",
    "export const SPIRES_FACETS: SpireFacet[] = [",
]
ts += [f'  {{ points: "{t["p"]}", role: "{t["r"]}" }},' for t in tris]
ts.append("];")
TS_OUT.write_text("\n".join(ts) + "\n")

print(f"wrote {SVG_OUT.relative_to(ROOT)} and {TS_OUT.relative_to(ROOT)} — {len(tris)} facets")
