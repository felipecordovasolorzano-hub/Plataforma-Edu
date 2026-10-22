"""Genera la voz en off frase por frase, arma la línea de tiempo (cortes en compases
de 2,5 s = 1 compás a 96 BPM) y escribe public/audio/voice.wav + src/edu/timeline.ts."""
import hashlib, json, math, os, subprocess, sys, urllib.request
from xml.sax.saxutils import escape
import numpy as np
from scipy.signal import resample_poly
from scipy.io import wavfile
from script import SCENES

# Uso:
#   python3 voice.py elevenlabs                 (lee ELEVENLABS_API_KEY y ELEVENLABS_VOICE_ID; ver voices_elevenlabs.py)
#   python3 voice.py azure                      (voz es-PE-CamilaNeural; lee AZURE_SPEECH_KEY y AZURE_SPEECH_REGION)
#   python3 voice.py kokoro /ruta/a/kokoro-multi-lang-v1_0
ENGINE = sys.argv[1] if len(sys.argv) > 1 else "azure"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 44100
BAR = 2.5          # 96 BPM, 4/4
PART_GAP = 0.22    # silencio entre fragmentos de una enumeración
GAP = 0.75          # silencio entre frases
LEAD = {"S01": 0.4, "S09": 3.8, "S11": 0.8, "S17": 1.6}
TAIL = {"S06": 3.0, "S08": 4.5, "S09": 2.6, "S16": 3.0, "S17": 6.5}
DEFAULT_LEAD, DEFAULT_TAIL = 0.6, 1.9

if ENGINE == "elevenlabs":
    EL_KEY = os.environ["ELEVENLABS_API_KEY"]
    EL_VOICE = os.environ["ELEVENLABS_VOICE_ID"]
    EL_MODEL = os.environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2")
    SAY = {"EDU": "Edu"}
    CACHE = f"{ROOT}/audio-src/.cache/elevenlabs-{EL_VOICE}"
    os.makedirs(CACHE, exist_ok=True)

    # Tomas fijadas para frases que salieron mal la primera vez (verificadas con Whisper).
    RETAKES = {
        "y en circulares de papel.": {"seed": 2, "stability": 0.6, "style": 0.15},
        "Una hora después, recién pueden empezar.": {"seed": 2, "stability": 0.6, "style": 0.15},
    }

    def raw(text):
        fix = RETAKES.get(text, {})
        payload = {
            "text": text,
            "model_id": EL_MODEL,
            "language_code": "es",
            "voice_settings": {"stability": fix.get("stability", 0.45), "similarity_boost": 0.8, "style": fix.get("style", 0.25), "use_speaker_boost": True, "speed": 0.95},
        }
        if "seed" in fix:
            payload["seed"] = fix["seed"]
        body = json.dumps(payload).encode()
        path = f"{CACHE}/{hashlib.sha1(body).hexdigest()[:16]}.mp3"
        if not os.path.exists(path):
            req = urllib.request.Request(
                f"https://api.elevenlabs.io/v1/text-to-speech/{EL_VOICE}?output_format=mp3_44100_128",
                data=body, headers={"xi-api-key": EL_KEY, "Content-Type": "application/json", "Accept": "audio/mpeg"})
            with urllib.request.urlopen(req, timeout=120) as r, open(path, "wb") as f:
                f.write(r.read())
        wav = path[:-4] + ".wav"
        if not os.path.exists(wav):
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", path, "-ac", "1", "-ar", "44100", wav], check=True)
        sr, x = wavfile.read(wav)
        return x.astype(np.float32) / 32768, sr
elif ENGINE == "azure":
    AZ_KEY = os.environ["AZURE_SPEECH_KEY"]
    AZ_REGION = os.environ.get("AZURE_SPEECH_REGION", "eastus")
    AZ_VOICE = os.environ.get("AZURE_SPEECH_VOICE", "es-PE-CamilaNeural")
    AZ_RATE = "-6%"
    SAY = {"EDU": "Edu"}
    CACHE = f"{ROOT}/audio-src/.cache/{AZ_VOICE}"
    os.makedirs(CACHE, exist_ok=True)

    def raw(text):
        ssml = (f"<speak version='1.0' xml:lang='es-PE'><voice name='{AZ_VOICE}'>"
                f"<prosody rate='{AZ_RATE}'>{escape(text)}</prosody></voice></speak>")
        path = f"{CACHE}/{hashlib.sha1(ssml.encode()).hexdigest()[:16]}.wav"
        if not os.path.exists(path):
            req = urllib.request.Request(
                f"https://{AZ_REGION}.tts.speech.microsoft.com/cognitiveservices/v1",
                data=ssml.encode("utf-8"),
                headers={"Ocp-Apim-Subscription-Key": AZ_KEY, "Content-Type": "application/ssml+xml",
                         "X-Microsoft-OutputFormat": "riff-48khz-16bit-mono-pcm", "User-Agent": "edu-video"})
            with urllib.request.urlopen(req, timeout=60) as r, open(path, "wb") as f:
                f.write(r.read())
        sr, x = wavfile.read(path)
        return x.astype(np.float32) / 32768, sr
else:
    import sherpa_onnx
    K = sys.argv[2]  # carpeta kokoro-multi-lang-v1_0
    SAY = {"EDU": "Edu", "WhatsApp": "guatsap"}
    tts = sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(
        model=sherpa_onnx.OfflineTtsModelConfig(
            kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(
                model=f"{K}/model.onnx", voices=f"{K}/voices.bin", tokens=f"{K}/tokens.txt",
                data_dir=f"{K}/espeak-ng-data", dict_dir=f"{K}/dict", lexicon=f"{K}/lexicon-us-en.txt",
                lang="es-419"),  # español latinoamericano (seseo)
            num_threads=4),
    ))

    def raw(text):
        a = tts.generate(text, sid=28, speed=0.86)  # 28 = ef_dora (voz femenina)
        return np.array(a.samples, dtype=np.float32), a.sample_rate


def synth(text):
    for k, v in SAY.items():  # solo pronunciación; el texto en pantalla no cambia
        text = text.replace(k, v)
    x, sr = raw(text)
    x = resample_poly(x, SR, sr).astype(np.float32)
    # recorta silencios de los extremos
    idx = np.where(np.abs(x) > 0.01)[0]
    x = x[max(0, idx[0] - 200): idx[-1] + 2000]
    return x

timeline, chunks, t0 = [], [], 0.0
for sid, label, sentences in SCENES:
    t = LEAD.get(sid, DEFAULT_LEAD)
    cues = []
    for s in sentences:
        frags = s if isinstance(s, list) else [s]
        parts, t_s = [], t
        for k, fr in enumerate(frags):
            x = synth(fr)
            d = len(x) / SR
            parts.append({"start": round(t, 3), "end": round(t + d, 3)})
            chunks.append((t0 + t, x))
            t += d + (PART_GAP if k < len(frags) - 1 else 0)
        cues.append({"text": " ".join(frags), "start": round(t_s, 3), "end": round(t, 3), "parts": parts})
        t += GAP
    t = t - GAP + TAIL.get(sid, DEFAULT_TAIL)
    dur = math.ceil(t / BAR - 1e-6) * BAR
    timeline.append({"id": f"{sid}-{label}", "start": round(t0, 3), "seconds": dur, "cues": cues})
    print(f"{sid} {dur:5.1f}s  voz {sum(c['end']-c['start'] for c in cues):5.1f}s")
    t0 += dur

total = t0
voice = np.zeros(int(total * SR) + SR, dtype=np.float32)
for start, x in chunks:
    i = int(round(start * SR))
    voice[i:i + len(x)] += x
peak = np.max(np.abs(voice))
voice = voice / peak * 0.89
os.makedirs(f"{ROOT}/public/audio", exist_ok=True)
os.makedirs(f"{ROOT}/audio-src/.cache", exist_ok=True)
wav = f"{ROOT}/audio-src/.cache/voice.wav"  # music.py lo usa para el ducking
wavfile.write(wav, SR, (voice * 32767).astype(np.int16))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, f"{ROOT}/public/audio/voice.flac"], check=True)
json.dump({"bar": BAR, "total": total, "scenes": timeline}, open(f"{ROOT}/audio-src/timeline.json", "w"), ensure_ascii=False, indent=1)
with open(f"{ROOT}/src/edu/timeline.ts", "w") as f:
    f.write("// Generado por audio-src/voice.py — no editar a mano.\n")
    f.write("export type Part = {start: number; end: number};\n")
    f.write("export type Cue = {text: string; start: number; end: number; parts: Part[]};\n")
    f.write("export type SceneTiming = {id: string; start: number; seconds: number; cues: Cue[]};\n")
    f.write(f"export const BAR = {BAR};\n")
    f.write(f"export const TIMELINE: SceneTiming[] = {json.dumps(timeline, ensure_ascii=False, indent=1)};\n")
print(f"TOTAL {total:.1f}s = {int(total//60)}:{int(total%60):02d}")
