import type { Child, Connection, Task, Workshop, Notif, Settings } from './types';

// Fecha de la demo: jueves 12 de noviembre de 2026
export const TODAY = '2026-11-12';
export const TOMORROW = '2026-11-13';
export const START_CLOCK = 15 * 60 + 55; // 3:55 p. m.

export const PARENT_NAME = 'Carolina';

export const CHILDREN: Child[] = [
  { id: 'mateo', name: 'Mateo', fullName: 'Mateo Córdova', grade: '3.° de primaria B', school: 'Colegio Los Álamos', color: '#2f5fae', hasDevice: true },
  { id: 'lucia', name: 'Lucía', fullName: 'Lucía Córdova', grade: '4.° de secundaria A', school: 'Colegio Los Álamos', color: '#c2417a', hasDevice: false },
];

export const CONNECTIONS: Connection[] = [
  { id: 'sieweb', name: 'SieWeb', kind: 'Intranet del colegio', connected: true, lastSync: 'hace 4 min', itemsRead: 31, color: '#0f6db3', initials: 'SW' },
  { id: 'classroom', name: 'Google Classroom', kind: 'Aula virtual', connected: true, lastSync: 'hace 9 min', itemsRead: 12, color: '#1e8e3e', initials: 'GC' },
  { id: 'talleres', name: 'Talleres y academias', kind: 'Horarios que registraste', connected: true, lastSync: 'manual', itemsRead: 3, color: '#d97706', initials: 'TA' },
  { id: 'correo', name: 'Correo del colegio', kind: 'Comunicados por email', connected: false, color: '#c5221f', initials: 'CO' },
  { id: 'whatsapp', name: 'Mensajes reenviados', kind: 'Reenvía a EDU lo que llega por WhatsApp', connected: false, color: '#128c7e', initials: 'WA' },
];

export const SCHOOL_PLATFORMS = [
  { id: 'sieweb', name: 'SieWeb', color: '#0f6db3', initials: 'SW' },
  { id: 'classroom', name: 'Google Classroom', color: '#1e8e3e', initials: 'GC' },
  { id: 'idukay', name: 'Idukay', color: '#6d28d9', initials: 'ID' },
  { id: 'cubicol', name: 'Cubicol', color: '#0e7490', initials: 'CU' },
  { id: 'otra', name: 'Otra plataforma', color: '#64748b', initials: '+' },
];

export const SOURCE_LABEL: Record<string, string> = {
  sieweb: 'SieWeb', classroom: 'Classroom', correo: 'Correo', whatsapp: 'WhatsApp', talleres: 'Talleres',
};

export const TASKS: Task[] = [
  {
    id: 'mat-48', childId: 'mateo', course: 'Matemática', type: 'tarea', dueKey: TOMORROW,
    title: 'Problemas de multiplicación (pág. 48, ejercicios 1 al 4)', teacher: 'Prof. Patricia Solano', source: 'sieweb',
    postedAt: 'Mié 11, 7:42 p. m.',
    original: 'Estimados padres: para el viernes los alumnos deben resolver en su cuaderno los problemas 1 al 4 de la página 48 del libro de Matemática (multiplicación de dos cifras). Deben escribir la operación y la respuesta completa. Gracias.',
    summary: 'Resolver en el cuaderno los problemas 1 al 4 de la pág. 48. Debe escribir la operación y la respuesta completa.',
    estimateMin: 25,
    materials: [],
    steps: ['Leer el problema y subrayar los datos', 'Decidir qué operación usar', 'Resolver la multiplicación por partes', 'Revisar y escribir la respuesta completa'],
    status: 'pendiente',
  },
  {
    id: 'com-lect', childId: 'mateo', course: 'Comunicación', type: 'lectura', dueKey: TOMORROW,
    title: 'Lectura «El zorro y las uvas» + 3 preguntas', teacher: 'Prof. Rosa Díaz', source: 'classroom',
    postedAt: 'Mié 11, 3:10 p. m.',
    original: 'Leer la fábula «El zorro y las uvas» (adjunta) y responder en el cuaderno: 1) ¿Qué quería el zorro? 2) ¿Por qué dijo que las uvas estaban verdes? 3) ¿Qué enseñanza nos deja?',
    summary: 'Leer la fábula adjunta y responder 3 preguntas en el cuaderno.',
    estimateMin: 20,
    materials: [],
    steps: ['Leer la fábula en voz alta', 'Buscar en el texto la parte que responde cada pregunta', 'Escribir la respuesta con sus propias palabras', 'Leer de nuevo sus respuestas'],
    status: 'pendiente',
  },
  {
    id: 'art-mat', childId: 'mateo', course: 'Arte', type: 'material', dueKey: TOMORROW,
    title: 'Traer cartulina blanca y témperas', teacher: 'Prof. Luis Pardo', source: 'sieweb',
    postedAt: 'Mar 10, 6:05 p. m.',
    original: 'Para la clase del viernes traer: 1 cartulina blanca tamaño A3 y témperas (rojo, azul, amarillo).',
    summary: 'Mañana lleva 1 cartulina blanca A3 y témperas roja, azul y amarilla.',
    estimateMin: 0,
    materials: [
      { id: 'm1', name: 'Cartulina blanca A3', forKey: TOMORROW, ready: false },
      { id: 'm2', name: 'Témperas: rojo, azul y amarillo', forKey: TOMORROW, ready: true },
    ],
    steps: [],
    status: 'pendiente',
  },
  {
    id: 'cie-planta', childId: 'mateo', course: 'Ciencia y Tecnología', type: 'material', dueKey: '2026-11-16',
    title: 'Traer una planta pequeña en maceta', teacher: 'Prof. Andrés Vega', source: 'sieweb',
    postedAt: 'Jue 12, 1:15 p. m.',
    original: 'Corrección: la planta en maceta para el proyecto «Cuidamos la vida» se traerá el lunes 16 y no el viernes 13.',
    summary: 'La planta en maceta ahora es para el lunes 16 (antes era para mañana).',
    estimateMin: 0,
    materials: [{ id: 'm3', name: 'Planta pequeña en maceta', forKey: '2026-11-16', ready: false }],
    steps: [],
    status: 'pendiente',
    change: { what: 'Fecha de entrega', before: 'Vie 13 nov', after: 'Lun 16 nov', when: 'hoy, 1:15 p. m.' },
  },
  {
    id: 'ing-voc', childId: 'mateo', course: 'Inglés', type: 'tarea', dueKey: '2026-11-17',
    title: 'Vocabulary: animals worksheet', teacher: 'Teacher Ana Ríos', source: 'classroom',
    postedAt: 'Jue 12, 11:30 a. m.',
    original: 'Complete the worksheet «Farm animals» (attached). Match the word with the picture and write a sentence for 3 animals.',
    summary: 'Unir palabras con dibujos de animales y escribir 3 oraciones en inglés. Es para el martes.',
    estimateMin: 15,
    materials: [],
    steps: ['Nombrar en voz alta cada dibujo', 'Unir palabra y dibujo', 'Escribir una oración corta por animal'],
    status: 'pendiente', isNew: true,
  },
  {
    id: 'mat-eval', childId: 'mateo', course: 'Matemática', type: 'evaluacion', dueKey: '2026-11-18',
    title: 'Evaluación: multiplicación de dos cifras', teacher: 'Prof. Patricia Solano', source: 'sieweb',
    postedAt: 'Lun 9, 5:20 p. m.',
    original: 'El miércoles 18 se tomará la evaluación de la unidad 4: multiplicación de dos cifras y problemas.',
    summary: 'Evaluación de multiplicación de dos cifras el miércoles 18.',
    estimateMin: 0, materials: [], steps: [], status: 'pendiente',
  },
  {
    id: 'his-ens', childId: 'lucia', course: 'Historia', type: 'tarea', dueKey: '2026-11-16',
    title: 'Ensayo: la independencia del Perú (2 páginas)', teacher: 'Prof. Jorge Medina', source: 'classroom',
    postedAt: 'Mar 10, 8:00 p. m.',
    original: 'Ensayo de 2 páginas sobre las causas de la independencia del Perú. Citar al menos 2 fuentes.',
    summary: 'Ensayo de 2 páginas con al menos 2 fuentes. Es para el lunes.',
    estimateMin: 90, materials: [], steps: ['Elegir tres causas', 'Buscar dos fuentes', 'Escribir un borrador', 'Revisar y citar'], status: 'en_curso',
  },
  {
    id: 'qui-lab', childId: 'lucia', course: 'Química', type: 'evaluacion', dueKey: TOMORROW,
    title: 'Práctica calificada: tabla periódica', teacher: 'Prof. Elena Ruiz', source: 'sieweb',
    postedAt: 'Lun 9, 4:40 p. m.',
    original: 'El viernes 13 práctica calificada de tabla periódica (grupos y periodos).',
    summary: 'Mañana tiene práctica calificada de tabla periódica.',
    estimateMin: 0, materials: [{ id: 'm4', name: 'Calculadora científica', forKey: TOMORROW, ready: true }], steps: [], status: 'pendiente',
  },
];

export const WORKSHOPS: Workshop[] = [
  { id: 'futbol', childId: 'mateo', name: 'Fútbol', place: 'Academia Gol Kids', days: [2, 4], time: '17:00', remindMin: 30, emoji: '⚽' },
  { id: 'pintura', childId: 'mateo', name: 'Pintura', place: 'Taller Arte Vivo', days: [6], time: '10:00', remindMin: 30, emoji: '🎨' },
  { id: 'teatro', childId: 'lucia', name: 'Teatro', place: 'Casa de la Cultura', days: [3], time: '16:00', remindMin: 30, emoji: '🎭' },
];

export const TEACHERS = [
  { name: 'Prof. Patricia Solano', course: 'Matemática · tutora de 3.° B', slots: ['Lun 16 · 3:30 p. m.', 'Mar 17 · 7:30 a. m.', 'Mié 18 · 4:00 p. m.'] },
  { name: 'Prof. Rosa Díaz', course: 'Comunicación', slots: ['Mar 17 · 3:00 p. m.', 'Jue 19 · 7:40 a. m.'] },
];

export const INITIAL_NOTIFS: Notif[] = [
  { id: 'n1', kind: 'cambio', title: 'Cambio en Ciencia y Tecnología', body: 'La planta en maceta ahora es para el lunes 16 (antes, mañana).', time: '1:15 p. m.', read: false, taskId: 'cie-planta' },
  { id: 'n2', kind: 'nuevo', title: 'Nueva tarea de Inglés', body: 'Vocabulary: animals worksheet · para el martes 17.', time: '11:30 a. m.', read: false, taskId: 'ing-voc' },
  { id: 'n3', kind: 'logro', title: 'Resumen de ayer', body: 'Mateo terminó 2 de 2 tareas en 41 min. EDU lo guió 3 veces sin darle respuestas.', time: '7:00 p. m. (ayer)', read: true },
];

export const INITIAL_SETTINGS: Settings = {
  homeworkTime: '16:00', liveStream: true, notifyHelp: true, whatsapp: true, dailyReport: true,
};

// Reporte semanal (lunes a miércoles ya ocurridos; el jueves se llena con la sesión en vivo)
export const WEEK = [
  { day: 'Lun', key: '2026-11-09', done: 2, total: 2, min: 38, est: 35, help: 2, refused: 0, start: '4:05 p. m.' },
  { day: 'Mar', key: '2026-11-10', done: 1, total: 2, min: 22, est: 40, help: 1, refused: 1, start: '6:40 p. m.' },
  { day: 'Mié', key: '2026-11-11', done: 2, total: 2, min: 41, est: 35, help: 3, refused: 0, start: '4:02 p. m.' },
];

export const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
export const WEEK_KEYS = ['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15', '2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21', '2026-11-22'];

export function dayLabel(key: string): string {
  if (key === TODAY) return 'Hoy';
  if (key === TOMORROW) return 'Mañana';
  const d = new Date(key + 'T12:00:00');
  const wd = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][d.getDay()];
  return `${wd} ${d.getDate()}`;
}

export function weekdayIndex(key: string): number { // 1 = lunes … 7 = domingo
  const d = new Date(key + 'T12:00:00').getDay();
  return d === 0 ? 7 : d;
}

export function fmtClock(min: number): string {
  const h = Math.floor(min / 60), m = Math.round(min % 60);
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'p. m.' : 'a. m.'}`;
}

export function fmtTime24(t: string): string {
  const [h, m] = t.split(':').map(Number); return fmtClock(h * 60 + m);
}
