# EDU — Video de storytelling

Video de 5:20 (16:9, 1920×1080, 30 fps) con voz en off, música y efectos, hecho con [Remotion](https://www.remotion.dev). Cuenta la historia de Carolina en 7 etapas y 17 escenas.

## Cómo está armado

Todo se sincroniza a partir de la voz:

1. `audio-src/script.py`: guion de la voz en off por escena. Las enumeraciones van como listas para que cada elemento tenga su propio tiempo.
2. `audio-src/voice.py`: genera la voz (Kokoro, voz femenina, español latinoamericano), mide cada frase y arma la línea de tiempo. Cada escena dura un número entero de compases (2,5 s = 1 compás a 96 BPM), así que los cortes caen en el pulso de la música. Escribe `public/audio/voice.flac`, `audio-src/timeline.json` y `src/edu/timeline.ts`.
3. `audio-src/music.py`: compone la música sobre esa línea de tiempo (menor y tensa en el problema, corte en seco al final de S8, entrada en mayor cuando aparece EDU, cálida en el cierre) y la atenúa cuando habla la voz. Escribe `public/audio/music.flac`.
4. `audio-src/sfx.py`: genera los efectos de sonido en `public/audio/sfx/`.
5. Las escenas (`src/edu/scenes*.tsx`) leen los tiempos de cada frase con `useCues()`, así que cada animación y cada efecto se dispara cuando la voz lo dice.

## Comandos

```console
npm i
npm run dev                                   # Remotion Studio
npx remotion render EDU out/EDU.mp4           # video completo
npx remotion render S06-HoraDeOrganizar out/S06.mp4   # una escena (sin audio)
```

Regenerar el audio después de cambiar el guion (requiere `pip install sherpa-onnx numpy scipy` y el modelo `kokoro-multi-lang-v1_0` de las releases de sherpa-onnx):

```console
cd audio-src
python3 voice.py azure        # voz es-PE-CamilaNeural (requiere AZURE_SPEECH_KEY y AZURE_SPEECH_REGION)
# o, sin conexión: python3 voice.py kokoro /ruta/a/kokoro-multi-lang-v1_0
python3 music.py
python3 sfx.py
```

## Estructura

- `src/edu/EduVideo.tsx`: escenas en orden, transiciones, voz y música.
- `src/edu/scenesProblem.tsx`: S1 a S8 (contexto, problema y consecuencia; fondo azul noche).
- `src/edu/scenesSolution.tsx`: S9, S10 y S15 a S17 (solución, beneficio y cierre; fondo crema).
- `src/edu/scenesDemo.tsx`: S11 a S14, con capturas reales del prototipo.
- `src/edu/characters.tsx`: Carolina, Mateo y EDU (respiran, parpadean, caminan).
- `src/edu/theme.tsx`: colores, tipografía, textos animados, fondos y utilidades.
- `public/capturas/`: capturas del prototipo (vista móvil, perfil Padres, hijo Mateo).
