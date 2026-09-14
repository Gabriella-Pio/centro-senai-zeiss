#!/usr/bin/env python3
"""Remove o fundo branco de recortes de equipamento (mesmo tratamento dos PNG ZEISS).

  python3 scripts/cutout-equipment.py public/equipment/bambu-lab-a1.jpg
"""
from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter
import numpy as np

TOLERANCE = 18
FEATHER = 1.2


def near_white(r: int, g: int, b: int, tol: int = TOLERANCE) -> bool:
    return r >= 255 - tol and g >= 255 - tol and b >= 255 - tol


def cutout(src: Path, dest: Path) -> None:
    rgb = Image.open(src).convert("RGB")
    w, h = rgb.size
    px = rgb.load()
    bg = np.zeros((h, w), dtype=bool)
    seen = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()

    def seed(x: int, y: int) -> None:
        if seen[y, x]:
            return
        r, g, b = px[x, y]
        if near_white(r, g, b):
            seen[y, x] = True
            bg[y, x] = True
            q.append((x, y))

    for x in range(w):
        seed(x, 0)
        seed(x, h - 1)
    for y in range(h):
        seed(0, y)
        seed(w - 1, y)

    while q:
        x, y = q.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if nx < 0 or ny < 0 or nx >= w or ny >= h or seen[ny, nx]:
                continue
            r, g, b = px[nx, ny]
            if near_white(r, g, b):
                seen[ny, nx] = True
                bg[ny, nx] = True
                q.append((nx, ny))

    # Vãos internos (pórtico aberto da A1) — mesmo branco de estúdio, sem ligação com a borda.
    for y in range(h):
        for x in range(w):
            if bg[y, x]:
                continue
            r, g, b = px[x, y]
            if near_white(r, g, b, tol=12):
                bg[y, x] = True

    alpha = np.where(bg, 0, 255).astype(np.uint8)
    mask = Image.fromarray(alpha, mode="L").filter(ImageFilter.GaussianBlur(FEATHER))
    out = rgb.convert("RGBA")
    out.putalpha(mask)

    bbox = mask.point(lambda a: 255 if a > 12 else 0).getbbox()
    if bbox:
        pad = 8
        x0, y0, x1, y1 = bbox
        x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
        x1, y1 = min(w, x1 + pad), min(h, y1 + pad)
        out = out.crop((x0, y0, x1, y1))

    dest.parent.mkdir(parents=True, exist_ok=True)
    out.save(dest, "PNG", optimize=True)
    print(f"{src.name} -> {dest.name} {out.size[0]}x{out.size[1]}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("uso: cutout-equipment.py <arquivo.jpg> [saida.png]")
    source = Path(sys.argv[1])
    target = Path(sys.argv[2]) if len(sys.argv) > 2 else source.with_suffix(".png")
    cutout(source, target)
