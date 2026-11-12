# EDU · App para padres (prototipo TB3)

EDU ya no es una plataforma escolar más. Es una app que **se conecta a lo que el colegio ya usa** (SieWeb, Google Classroom, etc.) y a los talleres del niño, **lee y ordena** esa información y le dice al padre **solo lo que necesita saber**.

La app trabaja junto con la **lámpara EDU**, un dispositivo de escritorio que acompaña al niño durante la hora de tareas. EDU lo guía paso a paso con preguntas y pistas. **EDU nunca hace la tarea ni da las respuestas.**

## Qué se puede probar

| Pantalla | Qué hace |
|---|---|
| Bienvenida | Conectar la plataforma del colegio (solo lectura), ver cómo EDU ordena lo publicado, registrar talleres y vincular la lámpara |
| Hoy | Estado de la lámpara, cambios desde la última revisión con su fuente, pendientes de mañana, materiales y talleres |
| Agenda | Entregas, evaluaciones, talleres y hora de tareas por día |
| Pregúntale a EDU | Preguntas en lenguaje natural con respuestas guionadas. Cada dato indica de qué plataforma y docente salió. También permite pedir citas y se niega a hacer la tarea |
| En vivo | Cámara de EDU apuntando al cuaderno (sin grabar), paso actual, lo que dice EDU y mensajes de ánimo |
| Reportes | Tareas listas, tiempo por tarea frente al estimado, pistas dadas, respuestas negadas, línea de tiempo y resumen semanal |
| Más | Conexiones, talleres, lámpara, privacidad, notificaciones y la regla «EDU nunca hace la tarea» |

### Simulador de la lámpara (para las pruebas con usuarios)

En pantallas grandes, el panel derecho simula la lámpara de Mateo. Cada botón representa algo que hace el niño o el colegio: encender la lámpara, avanzar, pedir ayuda, pedir la respuesta, decir «terminé», un cambio del docente o el aviso de un taller. El celular responde en tiempo real con avisos, estados y reportes. Así se recorre el flujo **Digital → Físico → Digital** con la técnica del Mago de Oz.

En el celular, el simulador se abre con el botón «Simular EDU». Para ocultarlo, agrega `?sim=0` a la URL.

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

React 19 + Vite + Tailwind CSS 4 + Motion. Todos los datos son de demostración y viven en `src/edu/data.ts`. Las respuestas de EDU están en `src/edu/store.tsx`.
