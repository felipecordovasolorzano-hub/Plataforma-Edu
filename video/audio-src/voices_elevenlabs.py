"""Lista voces de ElevenLabs aptas para español y genera una muestra de cada una.

Uso: python3 voices_elevenlabs.py [máx]   → audio-src/.cache/muestras/<nombre>.mp3
Luego se elige una con ELEVENLABS_VOICE_ID=<voice_id> python3 voice.py elevenlabs
"""
import json, os, sys, urllib.request

KEY = os.environ["ELEVENLABS_API_KEY"]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".cache", "muestras")
os.makedirs(OUT, exist_ok=True)
MAX = int(sys.argv[1]) if len(sys.argv) > 1 else 6
TEXT = "Son las cinco de la mañana, y Carolina ya está despierta. No le falta compromiso. Le falta un sistema. Hasta que aparece Edu."


def get(url):
    req = urllib.request.Request(url, headers={"xi-api-key": KEY})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


voices = get("https://api.elevenlabs.io/v1/voices")["voices"]
spanish = [v for v in voices if "es" in json.dumps(v.get("labels", {})).lower() or "spanish" in json.dumps(v).lower()]
pick = (spanish or voices)[:MAX]
for v in pick:
    body = json.dumps({"text": TEXT, "model_id": "eleven_multilingual_v2", "language_code": "es"}).encode()
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{v['voice_id']}?output_format=mp3_44100_128",
        data=body, headers={"xi-api-key": KEY, "Content-Type": "application/json"})
    name = v["name"].split(" ")[0].lower()
    with urllib.request.urlopen(req, timeout=120) as r, open(f"{OUT}/{name}.mp3", "wb") as f:
        f.write(r.read())
    print(f"{v['voice_id']}  {v['name']}  {json.dumps(v.get('labels', {}), ensure_ascii=False)}")
