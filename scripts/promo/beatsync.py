#!/usr/bin/env python3
"""Find the beat grid of a music track so the promo can cut on the beat.

Usage: python3 scripts/promo/beatsync.py track.mp3 out.json [--start SECONDS] [--duration 30]

Writes {"bpm", "start", "beats": [...], "bars": [...]} with times relative to
`start` (the offset into the track where the video begins). `bars` are the
downbeats: the beat phase whose hits carry the most low-end onset energy,
picked from where kicks land and where the harmony changes.

Without --start the script picks the first downbeat after any leading silence,
so the video opens exactly on "one".
Needs: pip install librosa soundfile
"""
import argparse
import json

import librosa
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument('track')
ap.add_argument('out')
ap.add_argument('--start', type=float, default=None)
ap.add_argument('--duration', type=float, default=30.0)
args = ap.parse_args()

SR = 22050
y, _ = librosa.load(args.track, sr=SR, mono=True)
hop = 512

# Low-band onset strength: kicks and bass hits define the downbeat far better than hats.
S = np.abs(librosa.stft(y, hop_length=hop))
freqs = librosa.fft_frequencies(sr=SR)
low = librosa.onset.onset_strength(S=librosa.amplitude_to_db(S[freqs < 200]), sr=SR, hop_length=hop)
full = librosa.onset.onset_strength(y=y, sr=SR, hop_length=hop)

tempo, beat_frames = librosa.beat.beat_track(onset_envelope=full, sr=SR, hop_length=hop, units='frames')
bpm = float(np.atleast_1d(tempo)[0])
beats = librosa.frames_to_time(beat_frames, sr=SR, hop_length=hop)
# The tracker reports onset-strength peaks, which trail the audible attack by ~40 ms. Measure
# that lag against backtracked onsets (the start of each hit) and shift the whole grid by the
# median, so the grid stays evenly spaced instead of jumping to nearby hats.
onsets = librosa.onset.onset_detect(onset_envelope=full, sr=SR, hop_length=hop, backtrack=True, units='time')
deltas = [onsets[np.argmin(np.abs(onsets - b))] - b for b in beats if len(onsets)]
deltas = [d for d in deltas if abs(d) <= 0.08]
lag = float(np.median(deltas)) if deltas else 0.0
beats = beats + lag

# Downbeat phase. Two cues, each normalised: low-end onsets (kicks land on "one" in most
# genres) and harmonic change (chords usually move on the bar line). The harmonic cue is what
# resolves four-on-the-floor tracks, where every beat has a kick.
chroma = librosa.feature.chroma_cqt(y=y, sr=SR, hop_length=hop)
beat_chroma = librosa.util.sync(chroma, beat_frames, aggregate=np.median)
# sync() column k spans [beat k-1, beat k), so the change between columns k and k+1 happens at beat k
change = np.linalg.norm(np.diff(beat_chroma, axis=1), axis=0)[: len(beat_frames)]
kick = low[beat_frames]
norm = lambda v: (v - v.mean()) / (v.std() + 1e-9)
score = 0.6 * norm(change) + 0.4 * norm(kick)
scores = [score[p::4].mean() for p in range(4)]
phase = int(np.argmax(scores))
bars = beats[phase::4]

if args.start is None:
    # first downbeat after leading silence (RMS below -40 dB of the track peak)
    rms = librosa.feature.rms(y=y, hop_length=hop)[0]
    audible = np.nonzero(rms > rms.max() * 0.01)[0]
    first_sound = librosa.frames_to_time(audible[0], sr=SR, hop_length=hop) if len(audible) else 0.0
    start = float(bars[bars >= first_sound - 0.05][0]) if np.any(bars >= first_sound - 0.05) else 0.0
else:
    start = args.start

window = lambda ts: [round(float(t - start), 4) for t in ts if start - 1e-3 <= t <= start + args.duration + 2]
out = {'bpm': round(bpm, 2), 'start': round(start, 4), 'beats': window(beats), 'bars': window(bars)}
json.dump(out, open(args.out, 'w'), indent=1)
print(f'{args.out}: {bpm:.1f} BPM, grid shifted {lag * 1000:+.0f} ms, start {start:.2f}s, {len(out["beats"])} beats, {len(out["bars"])} bars in the window')
