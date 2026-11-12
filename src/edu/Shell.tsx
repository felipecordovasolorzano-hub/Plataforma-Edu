import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, Bell, CalendarDays, ChevronDown, Ellipsis, Gamepad2, House, X } from 'lucide-react';
import { useEdu, type Tab } from './store';
import { Avatar, EduDevice, EduFace, RING_COLOR, RING_LABEL } from './ui';
import { CHILDREN, fmtClock } from './data';
import { Today } from './screens/Today';
import { Agenda } from './screens/Agenda';
import { AskEdu } from './screens/AskEdu';
import { Reports } from './screens/Reports';
import { More, ConnectionsSheet, DeviceSheet, WorkshopsSheet } from './screens/More';
import { LiveSheet, NotifsSheet, TaskSheet } from './screens/Sheets';
import { Onboarding } from './screens/Onboarding';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'hoy', label: 'Hoy', icon: House },
  { id: 'agenda', label: 'Agenda', icon: CalendarDays },
  { id: 'edu', label: 'EDU', icon: House },
  { id: 'reportes', label: 'Reportes', icon: BarChart3 },
  { id: 'mas', label: 'Más', icon: Ellipsis },
];

const Push: React.FC = () => {
  const { toast, setToast, setOverlay } = useEdu();
  return (
    <AnimatePresence>
      {toast && (
        <motion.button key={toast.id} initial={{ y: -90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -90, opacity: 0 }} transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          onClick={() => { setToast(null); setOverlay(toast.taskId ? { kind: 'task', id: toast.taskId } : { kind: 'notifs' }); }}
          className="absolute left-3 right-3 top-2 z-50 flex items-start gap-3 rounded-[22px] border border-white/60 bg-white/95 p-3 text-left shadow-xl backdrop-blur">
          <span className="shrink-0 rounded-xl bg-slate-950 p-0.5"><EduFace expr="feliz" size={34} /></span>
          <div className="min-w-0 flex-1"><div className="flex justify-between"><p className="text-[12px] font-extrabold text-edu">EDU</p><p className="text-[11px] text-slate-400">{toast.time}</p></div><p className="text-[14px] font-extrabold leading-tight text-slate-900">{toast.title}</p><p className="line-clamp-2 text-[13px] text-slate-600">{toast.body}</p></div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const PhoneApp: React.FC = () => {
  const { onboarded, tab, setTab, childId, setChildId, notifs, setOverlay } = useEdu();
  const [pick, setPick] = useState(false);
  const child = CHILDREN.find(c => c.id === childId)!;
  const unread = notifs.filter(n => !n.read).length;
  if (!onboarded) return <Onboarding />;
  return (
    <div className="relative flex h-full flex-col bg-slate-50">
      {/* Cabecera */}
      <header className="relative z-20 flex items-center justify-between px-4 pb-2 pt-2">
        <button onClick={() => setPick(p => !p)} className="flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3 shadow-sm border border-slate-200/70">
          <Avatar name={child.name} color={child.color} size={32} />
          <span className="text-left leading-tight"><span className="block text-[14px] font-extrabold text-slate-900">{child.name}</span><span className="block text-[11px] text-slate-500">{child.grade}</span></span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
        <button onClick={() => setOverlay({ kind: 'notifs' })} aria-label="Avisos" className="relative grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm border border-slate-200/70">
          <Bell className="h-5 w-5 text-slate-700" />
          {unread > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[11px] font-black text-white">{unread}</span>}
        </button>
        {pick && (
          <div className="absolute left-4 top-14 w-64 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
            {CHILDREN.map(c => (
              <button key={c.id} onClick={() => { setChildId(c.id); setPick(false); }} className={`flex w-full items-center gap-3 rounded-2xl p-2.5 text-left ${c.id === childId ? 'bg-edu-soft' : ''}`}>
                <Avatar name={c.name} color={c.color} /><span><span className="block text-[14px] font-extrabold">{c.name}</span><span className="block text-[12px] text-slate-500">{c.grade}{c.hasDevice ? ' · con lámpara EDU' : ''}</span></span>
              </button>
            ))}
          </div>
        )}
      </header>

      <main className={`flex-1 overflow-y-auto px-4 ${tab === 'edu' ? 'flex flex-col pb-3' : ''}`} onClick={() => pick && setPick(false)}>
        {tab === 'hoy' && <Today />}
        {tab === 'agenda' && <Agenda />}
        {tab === 'edu' && <AskEdu />}
        {tab === 'reportes' && <Reports />}
        {tab === 'mas' && <More />}
      </main>

      {/* Navegación */}
      <nav className="relative z-10 grid grid-cols-5 border-t border-slate-200 bg-white/95 px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur">
        {TABS.map(t => t.id === 'edu' ? (
          <button key={t.id} onClick={() => setTab('edu')} className="flex flex-col items-center" aria-label="Pregúntale a EDU">
            <span className={`-mt-6 rounded-[20px] p-1 shadow-lg ${tab === 'edu' ? 'bg-edu shadow-edu/40' : 'bg-slate-950'}`}><EduFace expr="feliz" size={50} /></span>
            <span className={`mt-0.5 text-[11px] font-extrabold ${tab === 'edu' ? 'text-edu' : 'text-slate-500'}`}>Pregúntale</span>
          </button>
        ) : (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex flex-col items-center gap-0.5 py-1 ${tab === t.id ? 'text-edu' : 'text-slate-400'}`}>
            <t.icon className="h-6 w-6" strokeWidth={tab === t.id ? 2.4 : 2} />
            <span className="text-[11px] font-extrabold">{t.label}</span>
          </button>
        ))}
      </nav>

      <TaskSheet /><NotifsSheet /><LiveSheet /><ConnectionsSheet /><DeviceSheet /><WorkshopsSheet />
      <Push />
    </div>
  );
};

// ---------- Simulador del dispositivo (para pruebas tipo Mago de Oz) ----------
const SimBtn: React.FC<{ onClick: () => void; disabled?: boolean; children: React.ReactNode; tone?: string }> = ({ onClick, disabled, children, tone = 'bg-white' }) => (
  <button onClick={onClick} disabled={disabled} className={`rounded-2xl border border-slate-200 ${tone} px-3 py-2.5 text-left text-[13px] font-bold text-slate-800 shadow-sm transition hover:border-edu disabled:cursor-not-allowed disabled:opacity-40`}>{children}</button>
);

export const Simulator: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { session, sim, clock, resetDemo, onboarded, tasks } = useEdu();
  const live = session.state === 'live';
  const current = tasks.find(t => t.id === session.taskId);
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-wider text-edu">Simulador · solo para pruebas</p>
          <h2 className="text-[20px] font-black text-slate-900">Lámpara EDU de Mateo</h2>
          <p className="text-[13px] text-slate-500">Lo que pase aquí llega al celular de Carolina.</p>
        </div>
        {onClose && <button onClick={onClose} aria-label="Cerrar simulador" className="grid h-9 w-9 place-items-center rounded-full bg-white border border-slate-200"><X className="h-4 w-4" /></button>}
      </div>
      <div className="mt-3 flex items-center gap-4 rounded-3xl bg-gradient-to-b from-white to-slate-100 p-3 border border-slate-200/70">
        <EduDevice expr={session.expr} ring={session.ring} lampOn={session.lampOn} size={150} />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-slate-400">{fmtClock(clock)} · jueves</p>
          <p className="mt-1 rounded-2xl rounded-tl-md bg-white p-3 text-[13px] text-slate-800 shadow-sm">🔊 {session.speech}</p>
          <p className="mt-2 flex items-center gap-1.5 text-[12px] font-bold text-slate-600"><span className="h-2.5 w-2.5 rounded-full" style={{ background: RING_COLOR[session.ring] }} />{RING_LABEL[session.ring]}{current ? ` · ${current.course}` : ''}{session.watching ? ' · 👁 mamá está mirando' : ''}</p>
        </div>
      </div>
      {!onboarded && <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-[12px] text-amber-800">Primero termina la bienvenida en el celular.</p>}
      <p className="mb-1.5 mt-4 text-[12px] font-extrabold uppercase tracking-wide text-slate-500">Mateo</p>
      <div className="grid grid-cols-2 gap-2">
        <SimBtn onClick={sim.lampOn} disabled={!onboarded || session.lampOn} tone="bg-amber-50">💡 Enciende la lámpara</SimBtn>
        <SimBtn onClick={sim.progress} disabled={!live}>✏️ Avanza (la cámara lo ve)</SimBtn>
        <SimBtn onClick={sim.askHelp} disabled={!live}>🙋 «No entiendo»</SimBtn>
        <SimBtn onClick={sim.askAnswer} disabled={!live}>🤫 «¿Me dices la respuesta?»</SimBtn>
        <SimBtn onClick={sim.finishTask} disabled={!live} tone="bg-emerald-50">✅ «EDU, terminé»</SimBtn>
        <SimBtn onClick={sim.lampOff} disabled={!session.lampOn}>🌙 Apaga la lámpara</SimBtn>
      </div>
      <p className="mb-1.5 mt-4 text-[12px] font-extrabold uppercase tracking-wide text-slate-500">Colegio y talleres</p>
      <div className="grid grid-cols-2 gap-2">
        <SimBtn onClick={sim.teacherChange} disabled={!onboarded || tasks.find(t => t.id === 'com-lect')?.change !== undefined}>📝 La docente cambia una tarea</SimBtn>
        <SimBtn onClick={sim.workshopReminder} disabled={!onboarded}>⚽ Faltan 30 min para fútbol</SimBtn>
      </div>
      <div className="mt-auto pt-4"><button onClick={resetDemo} className="w-full rounded-2xl border border-dashed border-slate-300 py-2.5 text-[13px] font-bold text-slate-500">Reiniciar la demo (3:55 p. m.)</button></div>
    </div>
  );
};

const StatusBar: React.FC = () => {
  const { clock } = useEdu();
  return <div className="flex h-11 items-center justify-between px-8 pt-1 text-[14px] font-extrabold text-slate-900"><span>{fmtClock(clock).replace(/ [ap]\. m\./, '')}</span><span className="absolute left-1/2 top-2.5 h-7 w-28 -translate-x-1/2 rounded-full bg-slate-900" /><span className="text-[12px] tracking-tight">5G ▮▮▮</span></div>;
};

function useWide() {
  const q = '(min-width: 1024px)';
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => { const m = window.matchMedia(q); const f = () => setWide(m.matches); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  return wide;
}

export const Shell: React.FC = () => {
  const showSim = new URLSearchParams(location.search).get('sim') !== '0';
  const [simOpen, setSimOpen] = useState(false);
  const wide = useWide();
  return (
    <div className="min-h-full w-full bg-[radial-gradient(1200px_600px_at_20%_0%,#eaf1fb,transparent),radial-gradient(900px_500px_at_100%_100%,#fdf2e9,transparent)]">
      {/* Escritorio: teléfono + simulador */}
      {wide ? (
      <div className="mx-auto flex min-h-screen max-w-[1180px] items-center justify-center gap-10 px-6 py-8">
        <div className="max-w-[300px] self-center">
          <div className="flex items-center gap-3"><div className="rounded-2xl bg-slate-950 p-1"><EduFace expr="feliz" size={56} /></div><div><p className="text-[26px] font-black text-slate-900">EDU</p><p className="text-[13px] font-bold text-slate-500">App para padres · prototipo TB3</p></div></div>
          <p className="mt-5 text-[15px] text-slate-600">EDU se conecta a la plataforma que ya usa el colegio y a los talleres de tu hijo, ordena todo y te dice solo lo que necesitas saber.</p>
          <p className="mt-3 text-[15px] text-slate-600">La lámpara EDU acompaña al niño en la hora de tareas: lo guía paso a paso, <b>nunca le hace la tarea</b>, y te cuenta cómo le fue.</p>
          <p className="mt-5 rounded-2xl bg-white/70 p-3 text-[13px] text-slate-500 border border-slate-200">Prueba el flujo: <b>Digital → Físico → Digital</b>. Usa el simulador de la derecha como si fueras Mateo y mira cómo responde el celular.</p>
        </div>
        <div className="relative h-[844px] w-[400px] shrink-0 rounded-[56px] bg-slate-900 p-[11px] shadow-[0_30px_80px_-20px_rgba(15,23,42,0.45)]">
          <div className="relative h-full w-full overflow-hidden rounded-[46px] bg-slate-50">
            <StatusBar />
            <div className="h-[calc(100%-44px)]"><PhoneApp /></div>
          </div>
        </div>
        {showSim && <div className="h-[844px] w-[360px] shrink-0 rounded-[32px] border border-slate-200/80 bg-slate-50/90 p-5 shadow-sm backdrop-blur"><Simulator /></div>}
      </div>
      ) : (
      <div className="flex h-[100dvh] flex-col">
        <div className="relative flex-1 overflow-hidden"><PhoneApp /></div>
        {showSim && (<>
          <button onClick={() => setSimOpen(true)} className="fixed bottom-24 right-3 z-30 flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-2 text-[12px] font-extrabold text-white shadow-lg" aria-label="Abrir simulador de la lámpara"><Gamepad2 className="h-4 w-4" />Simular EDU</button>
          {simOpen && <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-50 p-5"><Simulator onClose={() => setSimOpen(false)} /></div>}
        </>)}
      </div>
      )}
    </div>
  );
};
