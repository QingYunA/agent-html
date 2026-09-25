#!/usr/bin/env python3
"""Synthesise the promo soundtrack: an original 30s, 120 BPM electronic cue.

Everything is generated from oscillators and seeded noise, so the track is
royalty-free, deterministic and re-renders identically. Sound effects are
placed from the storyboard's window.CUES (the generator dumps them to JSON),
which keeps every hit locked to the picture.

Arrangement in story time (1 bar = 2s). The video opens at 4s, so the
generator trims the first bar pair off this render:
  0-4s   (lead-in) dark filtered pad + sub pulse                Am  F
  4-8s   brand     pad opens up, plucked arpeggio, half-time kick,  C  G
                   keyboard clicks while the install command types
  8-20s  templates full groove: kick, clap, hats, pumping bass     Am F C G Am F
                   + a soft tick on every template change
  20-24s features  groove continues, whoosh on the light/dark wipe,  C  G
                   pops for the feature cards, snare roll into the cut
  24-30s CTA       impact, big C chord, groove thins out, fade        C  F  C

Usage: python3 scripts/promo/soundtrack.py cues.json out.wav [--sfx-only]
Needs: numpy, scipy
"""
import json
import sys

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

SR = 44100
DUR = 30.0
BEAT = 0.5
BAR = 2.0
N = int(SR * DUR)
rng = np.random.default_rng(7)

cues = json.load(open(sys.argv[1]))
out_path = sys.argv[2]
# --sfx-only: a licensed track supplies the music; keep only the light UI sounds on top of it
SFX_ONLY = '--sfx-only' in sys.argv[3:]


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def filt(x, kind, freq, order=2):
    sos = butter(order, freq, btype=kind, fs=SR, output='sos')
    return sosfilt(sos, x, axis=0)


def buf():
    return np.zeros((N, 2))


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


def env_adsr(n, a=0.01, d=0.1, s=0.7, r=0.2):
    t = np.arange(n) / SR
    length = n / SR
    e = np.where(t < a, t / max(a, 1e-4), s + (1 - s) * np.exp(-(t - a) / max(d, 1e-4)))
    rel = np.clip((length - t) / max(r, 1e-4), 0, 1)
    return e * rel


def saw(freq, seconds, harmonics=14, detune=0.0):
    t = tt(seconds)
    f = freq * (1 + detune)
    out = np.zeros_like(t)
    for k in range(1, harmonics + 1):
        if f * k > SR / 2.2:
            break
        out += np.sin(2 * np.pi * f * k * t) / k
    return out * 0.55


# ---------------------------------------------------------------- harmony
CHORDS = {  # voiced close together so the pad glides between chords
    'Am': ([57, 60, 64, 69], 45), 'F': ([57, 60, 65, 69], 41),
    'C': ([55, 60, 64, 67], 48), 'G': ([55, 59, 62, 67], 43),
}
PROG = ['Am', 'F', 'C', 'G', 'Am', 'F', 'C', 'G', 'Am', 'F', 'C', 'G', 'C', 'F', 'C']
section = lambda t: 'problem' if t < 4 else 'brand' if t < 8 else 'templates' if t < 20 else 'features' if t < 24 else 'cta'

pad, arp, bass, drums, fx = buf(), buf(), buf(), buf(), buf()

# ---------------------------------------------------------------- pad
for b, name in enumerate(PROG):
    notes, _ = CHORDS[name]
    start = b * BAR
    length = BAR + 0.35 if b < len(PROG) - 1 else DUR - start
    for j, n in enumerate(notes):
        for det, pan in ((-0.004, -0.6), (0.004, 0.6)):
            v = saw(midi(n), length, detune=det) * env_adsr(int(length * SR), a=0.25, d=0.8, s=0.8, r=0.35)
            place(pad, v, start, 0.05, pan)
# the pad opens up as the story brightens: a different low-pass per section
pad_out = np.zeros_like(pad)
for a, b, cut in ((0, 4, 700), (4, 8, 1500), (8, 24, 2600), (24, DUR, 3200)):
    seg = filt(pad, 'lowpass', cut)
    i, j = int(a * SR), int(b * SR)
    pad_out[i:j] = seg[i:j]
pad = pad_out

# ---------------------------------------------------------------- arpeggio (16ths)
for b, name in enumerate(PROG):
    if b * BAR < 4:
        continue
    notes, _ = CHORDS[name]
    pattern = [notes[0] + 12, notes[1] + 12, notes[2] + 12, notes[3] + 12, notes[2] + 12, notes[1] + 12, notes[3], notes[1] + 12]
    for s16 in range(16):
        t0 = b * BAR + s16 * BEAT / 4
        if t0 >= 29.2:
            break
        n = pattern[s16 % len(pattern)]
        x = tt(0.35)
        tone = np.sin(2 * np.pi * midi(n) * x) + 0.35 * np.sin(2 * np.pi * 2 * midi(n) * x)
        v = tone * np.exp(-x / 0.09)
        gain = 0.05 if t0 < 8 else 0.07
        if t0 >= 26:
            gain *= max(0.0, 1 - (t0 - 26) / 3.2)
        place(arp, v, t0, gain, -0.35 if s16 % 2 else 0.35)
arp = filt(arp, 'lowpass', 5200)
# dotted-eighth echo
d = int(0.375 * SR)
echo = np.zeros_like(arp)
echo[d:] = arp[:-d] * 0.35
arp = arp + echo[:, ::-1]

# ---------------------------------------------------------------- bass
for b, name in enumerate(PROG):
    _, root = CHORDS[name]
    t0 = b * BAR
    if t0 < 4:  # sub pulse on the beat, tense
        for k in range(4):
            x = tt(0.45)
            place(bass, np.sin(2 * np.pi * midi(root - 12) * x) * np.exp(-x / 0.25), t0 + k * BEAT, 0.16)
    elif t0 < 8:  # sustained root
        x = tt(BAR)
        v = (np.sin(2 * np.pi * midi(root - 12) * x) + 0.3 * saw(midi(root), BAR, 6)) * env_adsr(len(x), 0.02, 0.4, 0.8, 0.1)
        place(bass, v, t0, 0.16)
    elif t0 < 28:  # driving eighths
        for k in range(8):
            x = tt(0.24)
            v = (np.sin(2 * np.pi * midi(root - 12) * x) + 0.45 * saw(midi(root), 0.24, 8)) * env_adsr(len(x), 0.005, 0.12, 0.6, 0.04)
            place(bass, v, t0 + k * BEAT / 2, 0.12 if t0 < 26 else 0.08)
    else:  # final root rings out
        x = tt(DUR - t0)
        place(bass, np.sin(2 * np.pi * midi(root - 12) * x) * np.exp(-x / 0.9), t0, 0.2)
bass = filt(bass, 'lowpass', 900)

# ---------------------------------------------------------------- drums
def kick():
    x = tt(0.45)
    f = 44 + 90 * np.exp(-x / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    click = rng.standard_normal(len(x)) * np.exp(-x / 0.002) * 0.3
    return np.sin(ph) * np.exp(-x / 0.22) + click


def clap():
    x = tt(0.3)
    n = filt(rng.standard_normal(len(x)), 'bandpass', [900, 3500])
    e = np.zeros_like(x)
    for off in (0, 0.011, 0.022):
        e += np.where(x >= off, np.exp(-(x - off) / 0.012), 0)
    e += np.exp(-x / 0.12) * 0.6
    return n * e * 0.8


def hat(open_=False):
    x = tt(0.2 if open_ else 0.06)
    return filt(rng.standard_normal(len(x)), 'highpass', 7500) * np.exp(-x / (0.07 if open_ else 0.02))


def snare():
    x = tt(0.2)
    body = np.sin(2 * np.pi * 190 * x) * np.exp(-x / 0.05)
    return (filt(rng.standard_normal(len(x)), 'bandpass', [1500, 6000]) * np.exp(-x / 0.07) + body * 0.6) * 0.7


beats = np.arange(0, DUR, BEAT)
for bt in beats:
    s = section(bt)
    beat_in_bar = int(round((bt % BAR) / BEAT))
    if s == 'brand' and beat_in_bar in (0, 2):
        place(drums, kick(), bt, 0.55)
    if s in ('templates', 'features') or (s == 'cta' and bt < 26):
        if not (20 <= bt < 21):              # drop the kick for the wipe, like a breath
            place(drums, kick(), bt, 0.6)
        if beat_in_bar in (1, 3):
            place(drums, clap(), bt, 0.32, 0.1)
        place(drums, hat(open_=True), bt + BEAT / 2, 0.06, 0.3)
        for q in (0.25, 0.75):
            place(drums, hat(), bt + BEAT * q, 0.035, 0.3)
# snare roll into the CTA cut (23 → 24s), accelerating and swelling
for k, t0 in enumerate(np.concatenate([np.arange(23.0, 23.5, 0.125), np.arange(23.5, 24.0, 0.0625)])):
    place(drums, snare(), t0, 0.12 + 0.28 * (t0 - 23.0))

# sidechain pump on pad + bass during the groove
pump = np.ones(N)
for bt in beats:
    if 8 <= bt < 26 and not (20 <= bt < 21):
        i = int(bt * SR)
        x = np.arange(min(int(0.3 * SR), N - i)) / SR
        pump[i : i + len(x)] = np.minimum(pump[i : i + len(x)], 1 - 0.45 * np.exp(-x / 0.09))
pad *= pump[:, None]
bass *= pump[:, None]

# ---------------------------------------------------------------- sound effects from the storyboard cues
def riser(seconds):
    x = tt(seconds)
    p = x / seconds
    n = rng.standard_normal(len(x))
    lo, hi = filt(n, 'bandpass', [300, 1200]), filt(n, 'bandpass', [2500, 9000])
    sweep = np.sin(2 * np.pi * np.cumsum(220 + 900 * p ** 2) / SR) * 0.15
    return (lo * (1 - p) + hi * p + sweep) * p ** 2.2


def impact():
    x = tt(2.2)
    f = 32 + 40 * np.exp(-x / 0.08)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x / 0.7)
    noise = filt(rng.standard_normal(len(x)), 'lowpass', 2500) * np.exp(-x / 0.35) * 0.5
    return sub + noise


for a, b in ([] if SFX_ONLY else cues['risers']):
    place(fx, riser(b - a), a, 0.22)
for t0 in ([] if SFX_ONLY else cues['impacts']):
    place(fx, impact(), t0, 0.42 if t0 != 24 else 0.6)

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


music = reverb(pad * 1.0 + arp * 1.0, 2.2, 0.35) + bass + reverb(drums, 0.8, 0.08)
mix = reverb(fx, 1.6, 0.3) if SFX_ONLY else music * 0.9 + reverb(fx, 1.6, 0.3)
mix = filt(mix, 'highpass', 35)
# tame the sub region a little so small speakers do not choke on it
mix = mix - 0.25 * filt(mix, 'lowpass', 90)

fade_in = np.clip(np.arange(N) / (0.05 * SR), 0, 1)
fade_out = np.clip((DUR - np.arange(N) / SR) / 2.0, 0, 1) ** 1.5
mix *= (fade_in * fade_out)[:, None]

mix = np.tanh(mix * 1.6) / np.tanh(1.6)           # gentle bus saturation
mix *= 10 ** (-1.0 / 20) / np.max(np.abs(mix))     # peak at -1 dBFS
wavfile.write(out_path, SR, (mix * 32767).astype(np.int16))
print(f'{out_path} · {DUR:.0f}s · {SR} Hz stereo')
