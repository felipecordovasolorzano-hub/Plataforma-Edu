"""Compone la banda sonora sobre audio-src/timeline.json (96 BPM, compás = 2,5 s).

La música sigue la historia: menor y tensa en el problema (S1–S8), se corta en seco
cuando la rueda de S8 se detiene, florece en mayor cuando aparece EDU (S9) y cierra
cálida. Se atenúa automáticamente (ducking) cuando habla la voz en off.
Salida: public/audio/music.flac
"""
import json, os, subprocess
import numpy as np
from scipy.io import wavfile
from scipy.signal import fftconvolve, butter, sosfilt

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 44100
TL = json.load(open(f"{ROOT}/audio-src/timeline.json"))
BAR = TL["bar"]
BEAT = BAR / 4
TOTAL = TL["total"]
N = int(TOTAL * SR) + SR * 3
rng = np.random.default_rng(7)

# Buses estéreo: "wet" pasa por reverb, "dry" no.
wet = np.zeros((N, 2), np.float32)
dry = np.zeros((N, 2), np.float32)


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def add(bus, t, sig, pan=0.0, gain=1.0):
    i = int(t * SR)
    if i >= N or i < 0:
        return
    sig = sig[: N - i] * gain
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    bus[i: i + len(sig), 0] += sig * l * 1.414
    bus[i: i + len(sig), 1] += sig * r * 1.414


def env_adsr(n, a, d, s, r, total):
    """Envolvente de `total` segundos (incluye release)."""
    t = np.arange(n) / SR
    e = np.ones(n, np.float32) * s
    e[t < a] = t[t < a] / max(a, 1e-4)
    m = (t >= a) & (t < a + d)
    e[m] = 1 - (1 - s) * (t[m] - a) / max(d, 1e-4)
    rel = t > total - r
    e[rel] *= np.clip((total - t[rel]) / max(r, 1e-4), 0, 1)
    return e


# ───────────── instrumentos ─────────────
def pad_note(m, dur, bright=0.35):
    n = int((dur + 1.5) * SR)
    t = np.arange(n) / SR
    out = np.zeros(n, np.float32)
    for det in (-0.07, 0.0, 0.07):  # semitonos de desafinación (coro)
        f = hz(m + det)
        for h in range(1, 10):
            if f * h > 9000:
                break
            out += np.sin(2 * np.pi * f * h * t + rng.random() * 6.28) * (1 / h) * np.exp(-h / (2 + 8 * bright))
    out *= env_adsr(n, 0.9, 0.5, 0.8, 1.5, dur + 1.5)
    return out / 6


def piano_note(m, vel=1.0, length=3.0):
    n = int(length * SR)
    t = np.arange(n) / SR
    f = hz(m)
    out = np.zeros(n, np.float32)
    for h in range(1, 9):
        fh = f * h * (1 + 0.0004 * h * h)
        if fh > 12000:
            break
        out += np.sin(2 * np.pi * fh * t) * (0.7 ** (h - 1)) * np.exp(-t * (1.1 + 0.9 * h))
    out *= np.minimum(1, t / 0.004)
    out[-int(0.05 * SR):] *= np.linspace(1, 0, int(0.05 * SR))
    return out * vel * 0.35


def pluck_note(m, vel=1.0):
    n = int(0.7 * SR)
    t = np.arange(n) / SR
    f = hz(m)
    out = np.zeros(n, np.float32)
    for h in range(1, 7):
        out += np.sin(2 * np.pi * f * h * t) * (0.6 ** (h - 1)) * np.exp(-t * (7 + 5 * h))
    out *= np.minimum(1, t / 0.002)
    return out * vel * 0.3


def bass_note(m, dur, vel=1.0):
    n = int((dur + 0.08) * SR)
    t = np.arange(n) / SR
    f = hz(m)
    out = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)
    out = np.tanh(out * 1.3)
    out *= env_adsr(n, 0.01, 0.15, 0.7, 0.08, dur + 0.08)
    return out.astype(np.float32) * vel * 0.32


def kick(vel=1.0):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 45 + 90 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * np.exp(-t * 9) * vel * 0.8).astype(np.float32)


def noise_hit(length, hp, decay, vel):
    n = int(length * SR)
    x = rng.standard_normal(n).astype(np.float32)
    x = sosfilt(butter(2, hp, "highpass", fs=SR, output="sos"), x)
    t = np.arange(n) / SR
    return (x * np.exp(-t * decay) * vel).astype(np.float32)


def clap(vel=1.0):
    x = noise_hit(0.25, 900, 18, vel * 0.35)
    for k in (0.011, 0.022):  # micro-repeticiones típicas de un aplauso
        i = int(k * SR)
        x[i:] += x[: len(x) - i] * 0.6
    return x


def hat(vel=1.0, open_=False):
    return noise_hit(0.25 if open_ else 0.06, 7000, 14 if open_ else 60, vel * 0.18)


def tick(vel=1.0):
    n = int(0.06 * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 2300 * t) * np.exp(-t * 90) + 0.5 * np.sin(2 * np.pi * 3700 * t) * np.exp(-t * 140)
    return (x * vel * 0.22).astype(np.float32)


def chime(m, vel=1.0):
    n = int(4 * SR)
    t = np.arange(n) / SR
    f = hz(m)
    x = np.zeros(n, np.float32)
    for ratio, amp, dec in ((1, 1, 1.0), (2.76, 0.45, 2.2), (5.4, 0.25, 3.5), (8.93, 0.12, 5)):
        x += np.sin(2 * np.pi * f * ratio * t) * amp * np.exp(-t * dec)
    x *= np.minimum(1, t / 0.002)
    return x * vel * 0.18


def riser(length, vel=1.0):
    n = int(length * SR)
    x = rng.standard_normal(n).astype(np.float32)
    out = np.zeros(n, np.float32)
    blk = 2048
    for i in range(0, n, blk):
        p = i / n
        fc = 300 + 6000 * p ** 2
        sos = butter(2, [fc * 0.7, fc * 1.3], "bandpass", fs=SR, output="sos")
        out[i: i + blk] = sosfilt(sos, x[i: i + blk])
    t = np.arange(n) / SR
    out *= (t / length) ** 2
    sweep = np.sin(2 * np.pi * np.cumsum(200 + 600 * (t / length) ** 2) / SR) * (t / length) ** 3 * 0.15
    return (out * 1.2 + sweep) * vel


# ───────────── armonía ─────────────
CH = {
    "Am": (57, [57, 60, 64, 69]), "F": (53, [57, 60, 65, 69]), "C": (48, [55, 60, 64, 67]),
    "G": (55, [55, 59, 62, 67]), "Dm": (50, [57, 62, 65, 69]), "E": (52, [56, 59, 64, 68]),
    "Em": (52, [55, 59, 64, 67]), "Cadd9": (48, [55, 60, 62, 64, 67]),
}

# estilo por escena: (progresión, capas)
STYLE = {
    "S01": ("intro", ["Am", "Am", "F", "F", "Am", "Am"]),
    "S02": ("life", ["Am", "F", "C", "G"]),
    "S03": ("life", ["Am", "F", "C", "G"]),
    "S04": ("tension", ["Am", "F", "Dm", "E"]),
    "S05": ("tension2", ["Am", "F", "Dm", "E"]),
    "S06": ("clock", ["Dm", "Am", "E", "Am"]),
    "S07": ("sad", ["Am", "Dm", "Am", "E"]),
    "S08": ("loop", ["Am", "F", "Dm", "E"]),
    "S09": ("reveal", ["C", "G", "Am", "F"]),
    "S10": ("bright", ["C", "G", "Am", "F"]),
    "S11": ("demo", ["F", "G", "C", "Am"]),
    "S12": ("demo", ["F", "G", "C", "Am"]),
    "S13": ("demo", ["F", "G", "C", "Am"]),
    "S14": ("bright", ["C", "G", "Am", "F"]),
    "S15": ("warm", ["F", "C", "G", "Am"]),
    "S16": ("emotional", ["F", "G", "Em", "Am"]),
    "S17": ("finale", ["F", "G", "C", "C", "C", "C", "C"]),
}

scenes = TL["scenes"]
sc_by_id = {s["id"][:3]: s for s in scenes}
s8 = sc_by_id["S08"]
STOP = s8["start"] + s8["cues"][1]["end"] + 0.35        # la rueda se detiene: silencio
s9 = sc_by_id["S09"]
REVEAL = s9["start"] + s9["cues"][0]["start"]             # "Hasta que aparece EDU"
s17 = sc_by_id["S17"]
LOGO = s17["start"] + s17["cues"][0]["start"]


def scene_at(t):
    for s in scenes:
        if s["start"] <= t < s["start"] + s["seconds"]:
            return s
    return scenes[-1]


nbars = int(round(TOTAL / BAR))
for b in range(nbars):
    t = b * BAR
    sc = scene_at(t + 0.01)
    sid = sc["id"][:3]
    style, prog = STYLE[sid]
    k = int(round((t - sc["start"]) / BAR))
    nb = int(round(sc["seconds"] / BAR))
    ramp = (k + 1) / nb
    root, voicing = CH[prog[k % len(prog)]]

    if style == "loop" and t >= STOP:
        continue
    if style == "reveal" and t + BAR <= REVEAL - BAR:
        continue  # silencio inicial de S9; el brillo previo se agrega aparte

    dark = style in ("intro", "tension", "tension2", "clock", "sad", "loop")
    bright = 0.15 if dark else 0.55
    pad_gain = {"intro": 0.9, "sad": 0.8, "tension2": 0.75, "reveal": 1.0, "finale": 1.0, "emotional": 0.9}.get(style, 0.7)
    for i, m in enumerate(voicing):
        add(wet, t, pad_note(m - (12 if dark and i == 0 else 0), BAR, bright), pan=(i - 1.5) * 0.3, gain=pad_gain * 0.55)

    if style == "intro":
        for q in range(4):
            add(dry, t + q * BEAT, tick(0.9 if q == 0 else 0.6), pan=0.3)
        motif = [76, 72, 69] if k % 2 == 0 else [77, 72, 69]
        for j, m in enumerate(motif):
            add(wet, t + j * BEAT * 1.5, piano_note(m, 0.55), pan=0.2)
        add(dry, t, bass_note(root - 12, BAR * 0.95, 0.6))
    if style == "life":
        arp = voicing + voicing[::-1][1:-1]
        for e in range(8):
            add(wet, t + e * BEAT / 2, piano_note(arp[e % len(arp)] + 12, 0.38, 1.6), pan=-0.25 + 0.5 * (e % 2))
        add(dry, t, bass_note(root - 12, BEAT * 1.8, 0.8))
        add(dry, t + BEAT * 2, bass_note(root - 12, BEAT * 1.8, 0.7))
        for e in range(8):
            add(dry, t + e * BEAT / 2, hat(0.5 if e % 2 else 0.25), pan=0.4)
    if style in ("tension", "tension2"):
        heavy = style == "tension"
        for e in range(8):
            add(dry, t + e * BEAT / 2, bass_note(root - 12, BEAT / 2 * 0.8, 0.75 if e % 2 == 0 else 0.55))
            add(wet, t + e * BEAT / 2, pluck_note(voicing[[0, 2, 1, 2][e % 4]] + 12, 0.5), pan=0.35 * (1 if e % 2 else -1))
        if heavy:
            add(dry, t, kick(0.7))
            add(dry, t + BEAT * 2, kick(0.6))
            for e in range(16):
                add(dry, t + e * BEAT / 4, hat(0.35 if e % 4 == 2 else 0.18), pan=0.5)
        else:
            for e in range(4):
                add(dry, t + e * BEAT, tick(0.5), pan=-0.3)
    if style == "clock":
        for q in range(4):
            add(dry, t + q * BEAT, tick(0.9 if q % 2 == 0 else 0.6), pan=0.25)
        for e in range(8):
            add(dry, t + e * BEAT / 2, hat(0.15 + 0.25 * ramp), pan=0.5)
        add(dry, t, bass_note(root - 12, BAR * 0.95, 0.7))
        add(wet, t, piano_note(voicing[-1] + 12, 0.5))
        add(wet, t + BEAT * 2.5, piano_note(voicing[1] + 12, 0.4))
        if k >= nb - 2:
            add(dry, t, kick(0.5))
            add(dry, t + BEAT * 2, kick(0.5))
    if style == "sad":
        for j, m in enumerate(voicing):
            add(wet, t + j * 0.04, piano_note(m, 0.4, 3.0), pan=(j - 1.5) * 0.2)
        add(wet, t + BEAT * 2, piano_note(voicing[-1] + 12, 0.35))
        add(wet, t + BEAT * 3, piano_note(voicing[-2] + 12, 0.3))
        add(dry, t, bass_note(root - 12, BAR * 0.9, 0.5))
    if style == "loop":
        sub = 2 if k < 2 else 4
        for e in range(4 * sub):
            tt = t + e * BEAT / sub
            if tt < STOP:
                add(dry, tt, hat(0.3 + 0.2 * (e % sub == 0)), pan=0.5)
                add(dry, tt, tick(0.35), pan=-0.4)
        for e in range(8):
            tt = t + e * BEAT / 2
            if tt < STOP:
                add(dry, tt, bass_note(root - 12, BEAT / 2 * 0.8, 0.8))
                add(wet, tt, pluck_note(voicing[e % 4] + 12, 0.55), pan=0.3 * (1 if e % 2 else -1))
        for q in (0, 2):
            if t + q * BEAT < STOP:
                add(dry, t + q * BEAT, kick(0.75))
    if style in ("reveal", "bright", "demo"):
        groove = style != "reveal" or t >= REVEAL + BAR * 2
        arp = [voicing[0] + 12, voicing[2] + 12, voicing[1] + 24, voicing[2] + 12]
        for e in range(16):
            tt = t + e * BEAT / 4
            if style != "reveal" or tt >= REVEAL:
                add(wet, tt, pluck_note(arp[e % 4], 0.42 if e % 4 == 0 else 0.3), pan=0.4 * np.sin(e))
        if groove:
            kv = 0.55 if style == "demo" else 0.7
            for q in range(4):
                add(dry, t + q * BEAT, kick(kv))
                add(dry, t + q * BEAT + BEAT / 2, hat(0.35), pan=0.45)
            if style == "bright":
                add(dry, t + BEAT, clap(0.6), pan=-0.1)
                add(dry, t + BEAT * 3, clap(0.6), pan=-0.1)
            for e in range(8):
                add(dry, t + e * BEAT / 2, bass_note(root - 12, BEAT / 2 * 0.7, 0.7 if e % 2 == 0 else 0.5))
    if style == "warm":
        arp = voicing + [voicing[-1] + 5]
        for e in range(8):
            add(wet, t + e * BEAT / 2, piano_note(arp[e % len(arp)] + 12, 0.35, 2.0), pan=-0.2 + 0.4 * (e % 2))
        add(dry, t, kick(0.45))
        add(dry, t, bass_note(root - 12, BAR * 0.95, 0.65))
    if style == "emotional":
        melody = {0: [72, 74, 76], 1: [74, 71, 67], 2: [71, 72, 74], 3: [76, 72, 69]}[k % 4]
        for j, m in enumerate(melody):
            add(wet, t + j * BEAT * 1.25, piano_note(m, 0.5, 3.0), pan=0.15)
        for j, m in enumerate(voicing[:3]):
            add(wet, t, piano_note(m, 0.25, 3.0), pan=-0.2)
        add(dry, t, bass_note(root - 12, BAR * 0.95, 0.6))
    if style == "finale":
        if k < 2:
            for j, m in enumerate(voicing):
                add(wet, t + j * 0.05, piano_note(m, 0.4, 3.0))
            add(dry, t, bass_note(root - 12, BAR * 0.95, 0.6))

# ─── acentos fuera de la rejilla ───
# riser de S8 hacia el corte seco
add(wet, STOP - 4.0, riser(4.0, 0.25))
# brillo previo a la revelación de EDU y floración al nombrarla
add(wet, s9["start"] + 0.6, riser(REVEAL - s9["start"] - 0.6, 0.12))
for j, m in enumerate([72, 76, 79, 84]):
    add(wet, REVEAL + j * 0.09, chime(m, 0.9), pan=-0.3 + 0.2 * j)
for m in CH["Cadd9"][1]:
    add(wet, REVEAL, pad_note(m + 12, BAR * 2, 0.6), gain=0.25)
# logo final
for j, m in enumerate([72, 79, 84, 88]):
    add(wet, LOGO + j * 0.08, chime(m, 0.8), pan=-0.3 + 0.2 * j)
fin = s17["start"] + s17["cues"][-1]["start"]
for m in [48, 55, 60, 64, 67, 72]:
    add(wet, fin, piano_note(m, 0.45, 6.0))
    add(wet, fin, pad_note(m, 5.0, 0.4), gain=0.35)

# ───────────── reverb + mezcla ─────────────
ir_len = int(2.6 * SR)
tt = np.arange(ir_len) / SR
ir = rng.standard_normal((ir_len, 2)).astype(np.float32) * np.exp(-tt * 2.6)[:, None]
ir = sosfilt(butter(1, 300, "highpass", fs=SR, output="sos"), ir, axis=0)
ir /= np.sqrt((ir ** 2).sum(axis=0))
rev = np.stack([fftconvolve(wet[:, c], ir[:, c])[:N] for c in range(2)], axis=1)
mix = dry + wet * 0.75 + rev * 0.5

# corte seco en S8 (incluida la cola de reverb) hasta que S9 empieza a brillar
a, b_ = int(STOP * SR), int((s9["start"] + 0.6) * SR)
fade = int(0.04 * SR)
mix[a: a + fade] *= np.linspace(1, 0, fade)[:, None]
mix[a + fade: b_] = 0

# fade-out final
end = int(TOTAL * SR)
mix[end - int(3 * SR): end] *= np.linspace(1, 0, int(3 * SR))[:, None] ** 1.5
mix[end:] = 0
mix = mix[:end]

# ducking con la envolvente de la voz
sr_v, voice = wavfile.read(f"{ROOT}/audio-src/.cache/voice.wav")
v = np.abs(voice.astype(np.float32) / 32768)[:end]
v = np.pad(v, (0, end - len(v)))
win = int(0.05 * SR)
envv = np.convolve(v, np.ones(win) / win, mode="same")
envv = np.clip(envv / 0.04, 0, 1)
# suavizado asimétrico: ataque rápido, release lento
g = np.zeros_like(envv)
att, rel = np.exp(-1 / (0.03 * SR)), np.exp(-1 / (0.45 * SR))
blk = 64  # por bloques para que el bucle en Python sea rápido
cur = 0.0
for i in range(0, end, blk):
    x = envv[i: i + blk].max()
    c = att ** blk if x > cur else rel ** blk
    cur = x + (cur - x) * c
    g[i: i + blk] = cur
duck = 1 - 0.68 * g
mix *= duck[:, None]

# nivel: la música queda unos 10 dB por debajo de la voz
mix *= 0.19 / (np.sqrt((mix ** 2).mean()) * 4 + 1e-9)
peak = np.abs(mix).max()
if peak > 0.95:
    mix *= 0.95 / peak
os.makedirs(f"{ROOT}/public/audio", exist_ok=True)
wav = f"{ROOT}/audio-src/.cache/music.wav"
wavfile.write(wav, SR, (mix * 32767).astype(np.int16))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, f"{ROOT}/public/audio/music.flac"], check=True)
print(f"music.wav {len(mix) / SR:.1f}s  rms={np.sqrt((mix ** 2).mean()):.3f} peak={np.abs(mix).max():.2f}  STOP={STOP:.2f} REVEAL={REVEAL:.2f}")
