export type ChildId = 'mateo' | 'lucia';

export interface Child {
  id: ChildId;
  name: string;
  fullName: string;
  grade: string;
  school: string;
  color: string; // color de acento del niño
  hasDevice: boolean;
}

export type SourceId = 'sieweb' | 'classroom' | 'correo' | 'whatsapp' | 'talleres';

export interface Connection {
  id: SourceId;
  name: string;
  kind: string;
  connected: boolean;
  lastSync?: string;
  itemsRead?: number;
  color: string;
  initials: string;
}

export type TaskType = 'tarea' | 'evaluacion' | 'material' | 'lectura';
export type TaskStatus = 'pendiente' | 'en_curso' | 'completada';

export interface Task {
  id: string;
  childId: ChildId;
  course: string;
  title: string;
  type: TaskType;
  dueKey: string; // AAAA-MM-DD
  teacher: string;
  source: SourceId;
  postedAt: string;
  original: string; // texto tal como lo publicó el docente
  summary: string; // resumen de EDU
  estimateMin: number;
  materials: { id: string; name: string; forKey: string; ready: boolean }[];
  steps: string[]; // cómo la guiará EDU (sin dar respuestas)
  status: TaskStatus;
  spentMin?: number;
  change?: { what: string; before: string; after: string; when: string };
  isNew?: boolean;
}

export interface Workshop {
  id: string;
  childId: ChildId;
  name: string;
  place: string;
  days: number[]; // 1 = lunes … 7 = domingo
  time: string; // '17:00'
  remindMin: number;
  emoji: string;
}

export type NotifKind = 'sesion' | 'ayuda' | 'logro' | 'cambio' | 'taller' | 'nuevo' | 'cita';

export interface Notif {
  id: string;
  kind: NotifKind;
  title: string;
  body: string;
  time: string;
  read: boolean;
  taskId?: string;
}

export type Expression = 'feliz' | 'guino' | 'ayuda' | 'meta' | 'escucha' | 'reposo';
export type Ring = 'off' | 'pendiente' | 'listo' | 'escucha' | 'alerta';

export type LogKind = 'inicio' | 'explica' | 'avance' | 'ayuda' | 'negativa' | 'termina' | 'meta' | 'mensaje' | 'taller' | 'cambio' | 'fin';

export interface LogItem {
  id: string;
  clock: number; // minutos desde medianoche
  kind: LogKind;
  who: 'edu' | 'nino' | 'padre' | 'sistema';
  text: string;
  taskId?: string;
}

export interface Session {
  state: 'idle' | 'live' | 'done';
  lampOn: boolean;
  ring: Ring;
  expr: Expression;
  speech: string;
  taskId?: string;
  step: number;
  startedAt?: number;
  endedAt?: number;
  log: LogItem[];
  helpCount: number;
  refusedCount: number;
  watching: boolean;
}

export interface ChatMsg {
  id: string;
  from: 'padre' | 'edu';
  text: string;
  card?: ChatCard;
}

export type ChatCard =
  | { type: 'tasks'; taskIds: string[] }
  | { type: 'materials'; taskIds: string[] }
  | { type: 'changes'; taskIds: string[] }
  | { type: 'report' }
  | { type: 'slots'; teacher: string; slots: string[]; chosen?: string }
  | { type: 'workshops' }
  | { type: 'rule' };

export interface Settings {
  homeworkTime: string;
  liveStream: boolean;
  notifyHelp: boolean;
  whatsapp: boolean;
  dailyReport: boolean;
}
