#!/usr/bin/env python3
"""Encode a directory of PNG frames into an animated WebP for the README.

Every frame is written as a keyframe (kmin=0, kmax=1). ffmpeg's libwebp_anim
encoder always emits partial "diff" frames, and lossy error in those
sub-rectangles piles up: in Chrome, blocks from earlier scenes linger on screen
(e.g. the install pill ghosting over the template showcase). Full keyframes
cost ~2x the bytes but decode identically everywhere.

Usage: python3 scripts/promo/to-webp.py <frames_dir> <out.webp> [fps]
Needs Pillow built with WebP support (pip install pillow).
"""
import sys
from pathlib import Path

from PIL import Image

frames_dir, out = Path(sys.argv[1]), Path(sys.argv[2])
fps = int(sys.argv[3]) if len(sys.argv) > 3 else 15
paths = sorted(frames_dir.glob('*.png'))
if not paths:
    sys.exit(f'no PNG frames in {frames_dir}')

frames = [Image.open(p).convert('RGB') for p in paths]
# Integer-ms durations that still sum to the real length (15 fps -> 67, 67, 66, ...)
durations = [round((i + 1) * 1000 / fps) - round(i * 1000 / fps) for i in range(len(frames))]
frames[0].save(out, save_all=True, append_images=frames[1:], duration=durations, loop=0,
               quality=78, method=4, kmin=0, kmax=1, allow_mixed=False, minimize_size=False)
print(f'{out} · {len(frames)} frames · {out.stat().st_size // 1024} KB')
