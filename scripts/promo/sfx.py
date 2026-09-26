#!/usr/bin/env python3
"""Light UI sound effects laid over the promo's music track.

Places a soft tick on every template change, keyboard clicks while the install
command types, a whoosh on the light/dark wipe and pops for the feature cards,
all at the times in the storyboard's window.CUES (the generator dumps them to
JSON), so every sound stays locked to the picture. Sounds come from
oscillators and seeded noise, so they re-render identically.

Usage: python3 scripts/promo/sfx.py cues.json out.wav DURATION_SECONDS
Needs: numpy, scipy
"""
import json
import sys

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

SR = 44100
cues = json.load(open(sys.argv[1]))
out_path = sys.argv[2]
DUR = float(sys.argv[3])
N = int(SR * DUR)
rng = np.random.default_rng(7)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def filt(x, kind, freq, order=2):
    sos = butter(order, freq, btype=kind, fs=SR, output='sos')
    return sosfilt(sos, x, axis=0)


def place(bus, sig, t, gain=1.0, pan=0.0):
    """Add a mono or stereo signal into a stereo bus at time t (equal-power pan)."""
    i = int(round(t * SR))
    if i >= N:
        return
    sig = sig[: N - i]
    if sig.ndim == 1:
        left, right = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        sig = np.stack([sig * left, sig * right], axis=1) * np.sqrt(2)
    bus[i : i + len(sig)] += sig * gain


def tt(seconds):
    return np.arange(int(seconds * SR)) / SR


fx = np.zeros((N, 2))

for k, t0 in enumerate(cues['ticks']):          # template change: a soft glassy tick
    x = tt(0.25)
    f = midi(88 + (k % 3) * 2)
    place(fx, (np.sin(2 * np.pi * f * x) + 0.4 * np.sin(2 * np.pi * 2.01 * f * x)) * np.exp(-x / 0.045), t0, 0.09, 0.4 if k % 2 else -0.4)

for k, t0 in enumerate(cues['typing']):         # keyboard clicks for the install command
    x = tt(0.03)
    click = filt(rng.standard_normal(len(x)), 'bandpass', [1800, 6000]) * np.exp(-x / 0.004)
    place(fx, click, t0 + rng.uniform(-0.008, 0.008), 0.11 * rng.uniform(0.7, 1.0), rng.uniform(-0.3, 0.3))

x = tt(1.1)                                      # light → dark wipe
bell = np.sin(np.pi * np.clip(x / 1.1, 0, 1)) ** 2
wh = filt(rng.standard_normal(len(x)), 'bandpass', [400, 2600]) * bell
place(fx, np.stack([wh * np.linspace(1.2, 0.3, len(x)), wh * np.linspace(0.3, 1.2, len(x))], axis=1), cues['whoosh'], 0.16)

for k, t0 in enumerate(cues['pops']):           # feature cards
    x = tt(0.12)
    f = 700 * 1.12 ** k + 400 * np.exp(-x / 0.02)
    place(fx, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x / 0.035), t0, 0.12, (-0.5, -0.5, 0.5, 0.5)[k % 4])

# ---------------------------------------------------------------- space + master
def reverb(x, seconds=1.8, mix=0.25):
    ir_t = tt(seconds)
    ir = rng.standard_normal((len(ir_t), 2)) * np.exp(-ir_t / (seconds / 5))[:, None]
    ir = filt(ir, 'lowpass', 6000)
    ir /= np.sqrt((ir ** 2).sum(axis=0))
    wet = np.stack([fftconvolve(x[:, c], ir[:, c])[:N] for c in range(2)], axis=1)
    return x + wet * mix


mix = filt(reverb(fx, 1.6, 0.3), 'highpass', 35)
mix *= 10 ** (-1.0 / 20) / np.max(np.abs(mix))     # peak at -1 dBFS
wavfile.write(out_path, SR, (mix * 32767).astype(np.int16))
print(f'{out_path} · {DUR:.1f}s · {SR} Hz stereo')
