import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import type { ChatCard, ChatMsg, ChildId, Connection, LogItem, Notif, Session, Settings, Task, Workshop } from './types';
import { CONNECTIONS, INITIAL_NOTIFS, INITIAL_SETTINGS, START_CLOCK, TASKS, TEACHERS, TOMORROW, TODAY, WORKSHOPS, fmtClock, weekdayIndex } from './data';

// Pistas que EDU da cuando el niño pide ayuda (guía, nunca la respuesta)
const HINTS: Record<string, string[]> = {
  'mat-48': [
    '¿Qué datos te da el problema? Subraya los números y lo que te preguntan.',
    'Si cada caja tiene la misma cantidad, ¿sumarías muchas veces o usarías otra operación más rápida?',
    'Separa 24 en 20 y 4. Multiplica cada parte por separado y luego suma los dos resultados.',
    'Lee tu respuesta en voz alta: ¿responde exactamente lo que pregunta el problema?',
  ],
  'com-lect': [
    'Lee el primer párrafo otra vez. ¿Qué mira el zorro desde abajo?',
    '¿En qué parte del texto aparece esa idea? Pon tu dedo ahí.',
    'Imagina que se lo explicas a tu amigo. ¿Cómo lo dirías con tus palabras?',
    'Revisa: ¿cada respuesta empieza con mayúscula y termina con punto?',
  ],
};
const REFUSALS: Record<string, string> = {
  'mat-48': 'No puedo darte la respuesta, Mateo: la tarea es tuya y tú puedes. Hagámoslo juntos: ¿cuánto es 20 × 3? Empieza por ahí.',
  'com-lect': 'No puedo decirte la respuesta, pero sí ayudarte a encontrarla: vuelve al final de la fábula. ¿Qué dice el zorro cuando se va?',
};

export type Tab = 'hoy' | 'agenda' | 'edu' | 'reportes' | 'mas';
export type Overlay = null | { kind: 'task'; id: string } | { kind: 'live' } | { kind: 'notifs' } | { kind: 'connections' } | { kind: 'device' } | { kind: 'workshops' };

const uid = (() => { let i = 0; return (p = 'id') => `${p}-${Date.now().toString(36)}-${(i++).toString(36)}`; })();

const freshSession = (): Session => ({ state: 'idle', lampOn: false, ring: 'off', expr: 'reposo', speech: 'Zzz… Te espero a las 4:00 p. m. para hacer las tareas.', step: 0, log: [], helpCount: 0, refusedCount: 0, watching: false });

function useEduState() {
  const [onboarded, setOnboarded] = useState<boolean>(() => { try { return localStorage.getItem('edu-onboarded') === '1'; } catch { return false; } });
  const [childId, setChildId] = useState<ChildId>('mateo');
  const [tab, setTab] = useState<Tab>('hoy');
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [connections, setConnections] = useState<Connection[]>(CONNECTIONS);
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [workshops, setWorkshops] = useState<Workshop[]>(WORKSHOPS);
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL_NOTIFS);
  const [toast, setToast] = useState<Notif | null>(null);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
  const [clock, setClock] = useState<number>(START_CLOCK);
  const [session, setSession] = useState<Session>(freshSession);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [typing, setTyping] = useState(false);
  const [reminders, setReminders] = useState<Record<string, string>>({});
  const [calendarSync, setCalendarSync] = useState(false);
  const taskStart = useRef<number>(0);
  const toastTimer = useRef<number | undefined>(undefined);

  const notify = (n: Omit<Notif, 'id' | 'read' | 'time'> & { time?: string }) => {
    const item: Notif = { id: uid('n'), read: false, time: n.time ?? 'ahora', ...n };
    setNotifs(prev => [item, ...prev]);
    setToast(item);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4200);
  };

  const log = (s: Session, at: number, items: Omit<LogItem, 'id' | 'clock'>[]): LogItem[] =>
    [...s.log, ...items.map(i => ({ ...i, id: uid('l'), clock: at }))];

  const homework = (list = tasks) => list.filter(t => t.childId === 'mateo' && t.steps.length > 0 && t.dueKey === TOMORROW);
  const nextPending = (list = tasks) => homework(list).find(t => t.status !== 'completada');

  // ---------------- simulación del dispositivo ----------------
  const sim = {
    lampOn() {
      if (session.lampOn) return;
      const at = Math.max(clock, 16 * 60 + 2); setClock(at);
      const next = nextPending();
      const pend = homework().filter(t => t.status !== 'completada');
      if (!next) {
        setSession(s => ({ ...s, lampOn: true, ring: 'listo', expr: 'meta', speech: '¡Hola, Mateo! Hoy ya terminaste todo. ¿Quieres leer un cuento?', log: log(s, at, [{ kind: 'inicio', who: 'sistema', text: 'Mateo encendió la lámpara' }]) }));
        return;
      }
      const names = pend.map(t => t.course).join(' y ');
      const speech = `¡Hola, Mateo! Hoy tienes ${pend.length} ${pend.length === 1 ? 'tarea' : 'tareas'}: ${names}. Empecemos con ${next.course}. ${next.steps[0]}.`;
      taskStart.current = at;
      setTasks(ts => ts.map(t => t.id === next.id ? { ...t, status: 'en_curso' } : t));
      setSession(s => ({
        ...s, state: 'live', lampOn: true, ring: 'pendiente', expr: 'feliz', speech, taskId: next.id, step: 0, startedAt: s.startedAt ?? at,
        log: log(s, at, [
          { kind: 'inicio', who: 'sistema', text: 'Mateo encendió la lámpara y empezó la hora de tareas' },
          { kind: 'explica', who: 'edu', text: speech, taskId: next.id },
        ]),
      }));
      notify({ kind: 'sesion', title: 'Mateo empezó sus tareas', body: `Encendió a EDU a las ${fmtClock(at)}; empezó con ${next.course}.`, time: fmtClock(at), taskId: next.id });
    },
    progress() {
      if (session.state !== 'live' || !session.taskId) return;
      const t = tasks.find(x => x.id === session.taskId)!; const at = clock + 6; setClock(at);
      const step = Math.min(session.step + 1, t.steps.length - 1);
      const speech = `¡Sigue así! Ahora: ${t.steps[step].toLowerCase()}.`;
      setSession(s => ({ ...s, step, expr: 'guino', ring: 'pendiente', speech, log: log(s, at, [{ kind: 'avance', who: 'sistema', text: `La cámara detecta avance en ${t.course}: paso ${step + 1} de ${t.steps.length} — ${t.steps[step]}`, taskId: t.id }]) }));
    },
    askHelp() {
      if (session.state !== 'live' || !session.taskId) return;
      const t = tasks.find(x => x.id === session.taskId)!; const at = clock + 2; setClock(at);
      const hint = (HINTS[t.id] ?? ['Vamos paso a paso. ¿Qué te piden exactamente?'])[Math.min(session.step, 3)];
      setSession(s => ({ ...s, expr: 'ayuda', ring: 'escucha', speech: hint, helpCount: s.helpCount + 1, log: log(s, at, [
        { kind: 'ayuda', who: 'nino', text: 'EDU, no entiendo esta parte.', taskId: t.id },
        { kind: 'ayuda', who: 'edu', text: hint, taskId: t.id },
      ]) }));
      if (settings.notifyHelp) notify({ kind: 'ayuda', title: `Mateo pidió ayuda en ${t.course}`, body: `EDU le dio una pista para el paso ${session.step + 1}. No le dio la respuesta.`, time: fmtClock(at), taskId: t.id });
    },
    askAnswer() {
      if (session.state !== 'live' || !session.taskId) return;
      const t = tasks.find(x => x.id === session.taskId)!; const at = clock + 1; setClock(at);
      const txt = REFUSALS[t.id] ?? 'No puedo darte la respuesta, pero te ayudo a encontrarla paso a paso.';
      setSession(s => ({ ...s, expr: 'ayuda', ring: 'escucha', speech: txt, refusedCount: s.refusedCount + 1, log: log(s, at, [
        { kind: 'negativa', who: 'nino', text: '¿Me dices la respuesta?', taskId: t.id },
        { kind: 'negativa', who: 'edu', text: txt, taskId: t.id },
      ]) }));
    },
    finishTask() {
      if (session.state !== 'live' || !session.taskId) return;
      const t = tasks.find(x => x.id === session.taskId)!; const at = clock + 4; setClock(at);
      const spent = Math.max(at - taskStart.current, 8);
      const updated = tasks.map(x => x.id === t.id ? { ...x, status: 'completada' as const, spentMin: spent } : x);
      setTasks(updated);
      const next = nextPending(updated);
      const checked = `¡Bien hecho! Revisé tu cuaderno: ${t.course} está completa.`;
      if (next) {
        taskStart.current = at;
        setTasks(ts => ts.map(x => x.id === next.id ? { ...x, status: 'en_curso' } : x));
        const speech = `${checked} Ahora sigue ${next.course}. ${next.steps[0]}.`;
        setSession(s => ({ ...s, taskId: next.id, step: 0, expr: 'feliz', ring: 'pendiente', speech, log: log(s, at, [
          { kind: 'termina', who: 'nino', text: 'EDU, terminé.', taskId: t.id },
          { kind: 'termina', who: 'edu', text: `${checked} (${spent} min)`, taskId: t.id },
          { kind: 'explica', who: 'edu', text: `Ahora sigue ${next.course}: ${next.steps[0]}.`, taskId: next.id },
        ]) }));
        notify({ kind: 'logro', title: `Mateo terminó ${t.course}`, body: `En ${spent} min (estimado: ${t.estimateMin} min). La cámara verificó el cuaderno. Sigue con ${next.course}.`, time: fmtClock(at), taskId: t.id });
      } else {
        setSession(s => ({ ...s, taskId: undefined, expr: 'meta', ring: 'listo', speech: '¡Meta cumplida! Terminaste todas tus tareas de hoy. ¡Choca esos cinco!', state: 'done', endedAt: at, log: log(s, at, [
          { kind: 'termina', who: 'nino', text: 'EDU, terminé.', taskId: t.id },
          { kind: 'termina', who: 'edu', text: `${checked} (${spent} min)`, taskId: t.id },
          { kind: 'meta', who: 'edu', text: '¡Meta cumplida! Todas las tareas de hoy están listas.' },
        ]) }));
        const total = at - (session.startedAt ?? at);
        notify({ kind: 'logro', title: '¡Mateo terminó todas sus tareas!', body: `${homework(updated).length} de ${homework(updated).length} listas en ${total} min. Mira el reporte de hoy.`, time: fmtClock(at) });
      }
    },
    teacherChange() {
      const at = clock + 1; setClock(at);
      setTasks(ts => ts.map(t => t.id === 'com-lect' ? { ...t, title: 'Lectura «El zorro y las uvas» + 4 preguntas', summary: 'Leer la fábula y responder 4 preguntas. La docente agregó: dibujar la escena final.', change: { what: 'Instrucciones', before: '3 preguntas', after: '3 preguntas + dibujar la escena final', when: `hoy, ${fmtClock(at)}` }, original: t.original + ' ACTUALIZACIÓN: además, dibujar la escena final de la fábula.' } : t));
      if (session.lampOn) setSession(s => ({ ...s, ring: 'alerta', expr: 'escucha', speech: 'Mateo, la profesora Rosa agregó algo a Comunicación: al final, dibuja la escena del zorro.', log: log(s, at, [{ kind: 'cambio', who: 'edu', text: 'Aviso al niño: la Prof. Rosa Díaz agregó «dibujar la escena final» a Comunicación.', taskId: 'com-lect' }]) }));
      notify({ kind: 'cambio', title: 'Cambio en Comunicación', body: 'La Prof. Rosa Díaz agregó: dibujar la escena final de la fábula. EDU ya se lo dijo a Mateo.', time: fmtClock(at), taskId: 'com-lect' });
    },
    workshopReminder() {
      const at = Math.max(clock, 16 * 60 + 30); setClock(at);
      const speech = 'Mateo, en 30 minutos es fútbol. Alista tu uniforme, tus chimpunes y tu botella de agua.';
      setSession(s => ({ ...s, lampOn: s.lampOn, expr: 'feliz', ring: s.lampOn ? s.ring : 'escucha', speech, log: log(s, at, [{ kind: 'taller', who: 'edu', text: speech }]) }));
      notify({ kind: 'taller', title: 'Aviso de fútbol entregado', body: `EDU le recordó a Mateo a las ${fmtClock(at)}: fútbol a las 5:00 p. m. en Academia Gol Kids.`, time: fmtClock(at) });
    },
    parentMessage(text: string) {
      const at = clock; const speech = `Mensaje de mamá: «${text}»`;
      setSession(s => ({ ...s, expr: 'feliz', speech, log: log(s, at, [{ kind: 'mensaje', who: 'padre', text }]) }));
    },
    lampOff() {
      const at = clock + 1; setClock(at);
      setSession(s => ({ ...s, lampOn: false, ring: 'off', expr: 'reposo', state: s.state === 'live' ? (tasks.some(t => t.status === 'completada') ? 'done' : 'idle') : s.state, endedAt: s.state === 'live' ? at : s.endedAt, speech: '¡Hasta mañana, Mateo!', log: log(s, at, [{ kind: 'fin', who: 'sistema', text: 'Mateo apagó la lámpara' }]) }));
    },
    setWatching(w: boolean) { setSession(s => ({ ...s, watching: w })); },
  };

  // ---------------- asistente para el padre (respuestas guionadas) ----------------
  const child = childId;
  const ask = (text: string) => {
    const q = text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    setChat(c => [...c, { id: uid('c'), from: 'padre', text }]);
    setTyping(true);
    const mine = tasks.filter(t => t.childId === child);
    const name = child === 'mateo' ? 'Mateo' : 'Lucía';
    let reply: { text: string; card?: ChatCard };
    const upcoming = mine.filter(t => t.status !== 'completada' && t.type !== 'material').sort((a, b) => a.dueKey.localeCompare(b.dueKey));
    if (/(hazle|hacerle|hacer la tarea|hacersela|haz la|hagas|resuelve|resolver|dame las respuestas|dame la respuesta|las respuestas|por el|por mi hijo)/.test(q)) {
      reply = { text: `No puedo hacer la tarea de ${name} ni darle las respuestas. Mi trabajo es guiarlo paso a paso con preguntas y pistas para que aprenda a resolverla solo. Lo que sí puedo hacer: recordarle la tarea, explicarle lo que pide el docente y avisarte cómo le va.`, card: { type: 'rule' } };
    } else if (/(cita|reunion|hablar con|entrevista)/.test(q)) {
      const tch = /comunic|lectura|rosa/.test(q) ? TEACHERS[1] : TEACHERS[0];
      reply = { text: `${tch.name} (${tch.course}) tiene estos horarios libres según SieWeb. Elige uno y envío la solicitud por ti.`, card: { type: 'slots', teacher: tch.name, slots: tch.slots } };
    } else if (/(llevar|lleva|material|utiles|traer|comprar)/.test(q)) {
      const mats = mine.filter(t => t.materials.some(m => !m.ready || m.forKey === TOMORROW));
      reply = { text: `Esto es lo que ${name} necesita llevar. Lo saqué de los comunicados de SieWeb y Classroom:`, card: { type: 'materials', taskIds: mats.map(t => t.id) } };
    } else if (/(cambi|nuevo|novedad|actualiz|que paso)/.test(q)) {
      const ch = mine.filter(t => t.change || t.isNew);
      reply = { text: ch.length ? `Desde tu última revisión hubo ${ch.length} ${ch.length === 1 ? 'novedad' : 'novedades'}:` : 'No hubo cambios desde tu última revisión.', card: ch.length ? { type: 'changes', taskIds: ch.map(t => t.id) } : undefined };
    } else if (/(como le fue|como le va|como esta|como va|reporte|resumen|termino|hizo la tarea|avance|cuanto se demoro|tiempo)/.test(q)) {
      reply = child === 'mateo' ? { text: 'Este es el resumen de hoy de Mateo, según lo que vio EDU en su escritorio:', card: { type: 'report' } }
        : { text: 'Lucía no tiene un dispositivo EDU, así que solo puedo decirte lo que publicaron sus docentes. Tiene una práctica calificada de Química mañana.' };
    } else if (/(taller|futbol|pintura|teatro|academia|extra)/.test(q)) {
      reply = { text: `Estos son los talleres de ${name}. Le aviso 30 minutos antes de cada uno:`, card: { type: 'workshops' } };
    } else if (/(semana|tarea|tareas|pendiente|que tiene|deberes|evaluacion|examen)/.test(q)) {
      const list = /semana|evaluacion|examen/.test(q) ? upcoming : upcoming.filter(t => t.dueKey <= TOMORROW);
      reply = { text: list.length ? `${name} tiene ${list.length} ${list.length === 1 ? 'pendiente' : 'pendientes'}${/semana/.test(q) ? ' esta semana' : ' para mañana'}. Te digo de dónde lo saqué:` : `${name} no tiene pendientes para mañana.`, card: list.length ? { type: 'tasks', taskIds: list.map(t => t.id) } : undefined };
    } else {
      reply = { text: 'Puedo ayudarte con las tareas y evaluaciones, lo que debe llevar, los cambios de los docentes, los talleres, el reporte de hoy o pedir una cita con un docente. ¿Qué quieres saber?' };
    }
    window.setTimeout(() => { setTyping(false); setChat(c => [...c, { id: uid('c'), from: 'edu', ...reply }]); }, 900);
  };
  const chooseSlot = (msgId: string, slot: string) => {
    setChat(c => c.map(m => m.id === msgId && m.card?.type === 'slots' ? { ...m, card: { ...m.card, chosen: slot } } : m));
    const msg = chat.find(m => m.id === msgId); const teacher = msg?.card?.type === 'slots' ? msg.card.teacher : 'la docente';
    window.setTimeout(() => {
      setChat(c => [...c, { id: uid('c'), from: 'edu', text: `Listo. Envié la solicitud de cita a ${teacher} para el ${slot} por SieWeb. Te aviso cuando la confirme.` }]);
      notify({ kind: 'cita', title: 'Solicitud de cita enviada', body: `Con ${teacher} para el ${slot}; te avisaremos cuando la confirme.` });
    }, 600);
  };

  const resetDemo = () => {
    setReminders({}); setCalendarSync(false);
    setTasks(TASKS); setNotifs(INITIAL_NOTIFS); setSession(freshSession()); setClock(START_CLOCK); setChat([]);
    setWorkshops(WORKSHOPS); setConnections(CONNECTIONS); setSettings(INITIAL_SETTINGS); setTab('hoy'); setOverlay(null); setChildId('mateo');
  };
  const finishOnboarding = () => { setOnboarded(true); try { localStorage.setItem('edu-onboarded', '1'); } catch { /* sin almacenamiento */ } };
  const restartOnboarding = () => { resetDemo(); setOnboarded(false); try { localStorage.removeItem('edu-onboarded'); } catch { /* sin almacenamiento */ } };

  return {
    onboarded, finishOnboarding, restartOnboarding, childId, setChildId, tab, setTab, overlay, setOverlay,
    connections, setConnections, tasks, setTasks, workshops, setWorkshops, notifs, setNotifs, toast, setToast,
    settings, setSettings, clock, session, sim, chat, typing, ask, chooseSlot, resetDemo, notify,
    reminders, setReminders, calendarSync, setCalendarSync,
    today: TODAY, tomorrow: TOMORROW, weekdayToday: weekdayIndex(TODAY),
  };
}

type Store = ReturnType<typeof useEduState>;
const Ctx = createContext<Store | null>(null);
export const EduProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const s = useEduState();
  return <Ctx.Provider value={s}>{children}</Ctx.Provider>;
};
export const useEdu = () => { const c = useContext(Ctx); if (!c) throw new Error('EduProvider'); return c; };
export const useChild = () => { const { childId } = useEdu(); return useMemo(() => childId, [childId]); };
