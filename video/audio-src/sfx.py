"""Efectos de sonido sintéticos para los eventos visuales. Salida: public/audio/sfx/*.wav"""
import os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 44100
OUT = f"{ROOT}/public/audio/sfx"
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(3)


def t_(sec):
    return np.arange(int(sec * SR)) / SR


def save(name, x, level=0.5):
    x = x / (np.abs(x).max() + 1e-9) * level
    fade = int(0.005 * SR)
    x[-fade:] *= np.linspace(1, 0, fade)
    wavfile.write(f"{OUT}/{name}.wav", SR, (x * 32767).astype(np.int16))


def band_noise(sec, f0, f1, q=0.6):
    n = int(sec * SR)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    blk = 1024
    for i in range(0, n, blk):
        p = i / n
        fc = f0 * (f1 / f0) ** p
        sos = butter(2, [fc * (1 - q / 2), min(fc * (1 + q / 2), SR / 2 - 100)], "bandpass", fs=SR, output="sos")
        out[i:i + blk] = sosfilt(sos, x[i:i + blk])
    return out


t = t_(0.7)
save("whoosh", band_noise(0.7, 300, 3500) * np.sin(np.pi * t / 0.7) ** 2, 0.45)
t = t_(0.5)
save("swoosh_down", band_noise(0.5, 3000, 400) * np.sin(np.pi * t / 0.5) ** 1.5, 0.4)
t = t_(0.18)
save("pop", np.sin(2 * np.pi * np.cumsum(900 - 500 * t / 0.18) / SR) * np.exp(-t * 28), 0.5)
t = t_(0.9)
ping = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, d in ((1318.5, 5), (2637, 9)))
ping2 = np.zeros_like(ping); i = int(0.11 * SR)
ping2[i:] = (sum(np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, d in ((1760, 5), (3520, 9))))[:len(t) - i]
save("ping", ping + ping2, 0.45)
t = t_(0.08)
save("tap", np.sin(2 * np.pi * 1500 * t) * np.exp(-t * 120) + 0.4 * rng.standard_normal(len(t)) * np.exp(-t * 300), 0.45)
t = t_(0.9)
buzz = np.sign(np.sin(2 * np.pi * 170 * t)) * 0.6 + np.sin(2 * np.pi * 340 * t) * 0.4
gate = ((t < 0.3) | ((t > 0.45) & (t < 0.75))).astype(float)
buzz = sosfilt(butter(2, 900, "lowpass", fs=SR, output="sos"), buzz * gate)
save("buzz", buzz, 0.35)
t = t_(1.2)
save("success", sum(np.sin(2 * np.pi * f * t) * np.exp(-t * 4) * (t > dt) for f, dt in ((1046.5, 0), (1318.5, 0.08), (1568, 0.16))), 0.4)
t = t_(0.25)
save("bubble", np.sin(2 * np.pi * np.cumsum(400 + 900 * t / 0.25) / SR) * np.exp(-t * 18), 0.35)
t = t_(0.4)
save("paper", band_noise(0.4, 2500, 5000, 1.0) * np.exp(-t * 9) * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * t)), 0.3)
t = t_(1.2)
save("impact", np.sin(2 * np.pi * np.cumsum(70 - 35 * t / 1.2) / SR) * np.exp(-t * 3.5) + band_noise(1.2, 200, 80) * np.exp(-t * 6) * 0.5, 0.6)
t = t_(0.5)
save("sad", sum(np.sin(2 * np.pi * f * t) * np.exp(-t * 5) * (t > dt) for f, dt in ((392, 0), (311, 0.18))), 0.35)
t = t_(0.35)
save("blip", np.sin(2 * np.pi * 880 * t) * np.exp(-t * 18), 0.35)
print(sorted(os.listdir(OUT)))
