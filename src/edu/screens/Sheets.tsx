import React, { useEffect, useState } from 'react';
import { Bell, CalendarDays, Check, CheckCircle2, Circle, Clock, Eye, FileText, Lock, MessageCircleHeart, ShieldCheck, Sparkles, TriangleAlert } from 'lucide-react';
import { useEdu } from '../store';
import { Card, EduFace, SectionTitle, Sheet, SourceChip, StatusPill, courseColor } from '../ui';
import { dayLabel, fmtClock } from '../data';
import type { NotifKind } from '../types';

export const TaskSheet: React.FC = () => {
  const { overlay, setOverlay, tasks, setTasks, session, notify } = useEdu();
  const [orig, setOrig] = useState(false);
  const t = overlay?.kind === 'task' ? tasks.find(x => x.id === overlay.id) : undefined;
  useEffect(() => setOrig(false), [overlay]);
  const live = t && session.taskId === t.id && session.state === 'live';
  return (
    <Sheet open={!!t} onClose={() => { if (t?.isNew) setTasks(ts => ts.map(x => x.id === t.id ? { ...x, isNew: false } : x)); setOverlay(null); }} full
      title={t && <span className="text-[13px] font-extrabold uppercase tracking-wide" style={{ color: courseColor(t.course) }}>{t.course}</span>}>
      {t && (<>
        <h2 className="text-[21px] font-black leading-snug text-slate-900">{t.title}</h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[12px] font-bold text-slate-700 border border-slate-200"><CalendarDays className="h-3.5 w-3.5" />{t.type === 'material' ? 'Llevar' : t.type === 'evaluacion' ? 'Evaluación' : 'Entrega'}: {dayLabel(t.dueKey)}</span>
          {t.estimateMin > 0 && <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[12px] font-bold text-slate-700 border border-slate-200"><Clock className="h-3.5 w-3.5" />~{t.estimateMin} min</span>}
          {t.type !== 'evaluacion' && t.type !== 'material' && <StatusPill status={t.status} />}
        </div>

        {t.change && (
          <Card className="mt-4 border-amber-200 bg-amber-50 p-3.5">
            <p className="flex items-center gap-1.5 text-[13px] font-extrabold text-amber-800"><TriangleAlert className="h-4 w-4" />El docente cambió esta publicación · {t.change.when}</p>
            <p className="mt-1 text-[13px] text-amber-900">{t.change.what}: <span className="line-through">{t.change.before}</span> → <b>{t.change.after}</b></p>
          </Card>
        )}

        <SectionTitle>En resumen</SectionTitle>
        <Card className="p-4">
          <p className="flex gap-2 text-[14px] text-slate-800"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-edu" />{t.summary}</p>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <div className="flex items-center gap-2"><SourceChip source={t.source} /><span className="text-[12px] text-slate-500">{t.teacher} · {t.postedAt}</span></div>
          </div>
          <button onClick={() => setOrig(o => !o)} className="mt-2 flex items-center gap-1 text-[13px] font-bold text-edu"><FileText className="h-4 w-4" />{orig ? 'Ocultar publicación original' : 'Ver publicación original'}</button>
          {orig && <p className="mt-2 rounded-2xl bg-slate-50 p-3 text-[13px] italic text-slate-600">«{t.original}»</p>}
        </Card>

        {t.materials.length > 0 && (<>
          <SectionTitle>Materiales</SectionTitle>
          <Card className="divide-y divide-slate-100">
            {t.materials.map(m => (
              <button key={m.id} onClick={() => setTasks(ts => ts.map(x => x.id === t.id ? { ...x, materials: x.materials.map(y => y.id === m.id ? { ...y, ready: !y.ready } : y) } : x))} className="flex w-full items-center gap-3 px-4 py-3 text-left">
                {m.ready ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Circle className="h-6 w-6 text-slate-300" />}
                <div className="flex-1"><p className={`text-[14px] font-bold ${m.ready ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{m.name}</p><p className="text-[12px] text-slate-500">Para {dayLabel(m.forKey).toLowerCase()}</p></div>
              </button>
            ))}
          </Card>
        </>)}

        {t.steps.length > 0 && (<>
          <SectionTitle>Cómo lo guiará EDU</SectionTitle>
          <Card className="p-4">
            <ol className="space-y-2.5">
              {t.steps.map((s, i) => {
                const done = t.status === 'completada' || (live && i < session.step); const now = live && i === session.step;
                return (
                  <li key={s} className="flex items-start gap-2.5">
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12px] font-black ${done ? 'bg-emerald-500 text-white' : now ? 'bg-edu text-white' : 'bg-slate-100 text-slate-500'}`}>{done ? <Check className="h-3.5 w-3.5" /> : i + 1}</span>
                    <p className={`text-[14px] ${now ? 'font-extrabold text-slate-900' : 'text-slate-700'}`}>{s}{now && <span className="ml-1.5 text-[11px] font-bold text-edu">· ahora</span>}</p>
                  </li>
                );
              })}
            </ol>
            <p className="mt-3 flex items-start gap-2 rounded-2xl bg-emerald-50 p-3 text-[12px] text-emerald-900"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />EDU explica, pregunta y da pistas. Nunca resuelve los ejercicios ni dicta respuestas.</p>
          </Card>
          {t.status === 'completada' && <Card className="mt-3 flex items-center gap-3 border-emerald-200 bg-emerald-50 p-3.5"><CheckCircle2 className="h-6 w-6 text-emerald-600" /><p className="text-[13px] text-emerald-900"><b>Lista en {t.spentMin} min.</b> La cámara de EDU verificó el cuaderno.</p></Card>}
          {live && <button onClick={() => setOverlay({ kind: 'live' })} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-[15px] font-extrabold text-white"><span className="live-dot h-2 w-2 rounded-full bg-red-500" />Verla en vivo</button>}
          {t.status === 'pendiente' && !live && <button onClick={() => notify({ kind: 'sesion', title: 'Recordatorio programado', body: `EDU le recordará «${t.course}» a Mateo en la hora de tareas.` })} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-edu py-3.5 text-[15px] font-extrabold text-white"><Bell className="h-4 w-4" />Que EDU se lo recuerde</button>}
        </>)}
      </>)}
    </Sheet>
  );
};

const NOTIF_STYLE: Record<NotifKind, string> = { sesion: 'bg-blue-100 text-edu', ayuda: 'bg-amber-100 text-amber-700', logro: 'bg-emerald-100 text-emerald-700', cambio: 'bg-red-100 text-red-600', taller: 'bg-amber-100 text-amber-700', nuevo: 'bg-violet-100 text-violet-700', cita: 'bg-sky-100 text-sky-700' };
export const NotifsSheet: React.FC = () => {
  const { overlay, setOverlay, notifs, setNotifs } = useEdu();
  const open = overlay?.kind === 'notifs';
  useEffect(() => { if (open) { const t = window.setTimeout(() => setNotifs(ns => ns.map(n => ({ ...n, read: true }))), 1200); return () => window.clearTimeout(t); } }, [open, setNotifs]);
  return (
    <Sheet open={open} onClose={() => setOverlay(null)} title="Avisos">
      <div className="space-y-2">
        {notifs.map(n => (
          <Card key={n.id} className={`flex items-start gap-3 p-3.5 ${n.read ? '' : 'border-edu/30 bg-edu-soft/50'}`} onClick={n.taskId ? () => setOverlay({ kind: 'task', id: n.taskId! }) : undefined}>
            <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full ${NOTIF_STYLE[n.kind]}`}><Bell className="h-4 w-4" /></span>
            <div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><p className="text-[14px] font-extrabold text-slate-900">{n.title}</p><span className="shrink-0 text-[11px] text-slate-400">{n.time}</span></div><p className="text-[13px] text-slate-600">{n.body}</p></div>
          </Card>
        ))}
      </div>
    </Sheet>
  );
};

// ---------- Transmisión en vivo (cámara de EDU apuntando al cuaderno) ----------
const Notebook: React.FC<{ taskId?: string; step: number; done: boolean }> = ({ taskId, step, done }) => {
  const isMath = taskId === 'mat-48';
  const lines = isMath ? ['1) 24 × 3 =', '2) 15 × 6 =', '3) 32 × 4 =', '4) 18 × 5 ='] : ['El zorro y las uvas', '1) ¿Qué quería el zorro?', '2) ¿Por qué dijo…?', '3) ¿Qué enseñanza…?'];
  const written = done ? 4 : Math.min(4, step + 1);
  return (
    <svg viewBox="0 0 360 240" className="h-full w-full">
      <defs><filter id="grain"><feTurbulence baseFrequency="0.9" numOctaves="2" /><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0" /><feComposite in2="SourceGraphic" operator="in" /></filter></defs>
      <rect width="360" height="240" fill="#a07a4f" />
      <g transform="rotate(-4 180 120)">
        <rect x="40" y="18" width="280" height="206" rx="6" fill="#fbfaf4" />
        {Array.from({ length: 9 }, (_, i) => <line key={i} x1="44" x2="316" y1={52 + i * 20} y2={52 + i * 20} stroke="#c9d8ef" strokeWidth="1" />)}
        <line x1="72" x2="72" y1="22" y2="220" stroke="#e8a5a5" strokeWidth="1.2" />
        <text x="80" y="40" fontSize="12" fontFamily="'Comic Sans MS', cursive" fill="#334155" fontWeight="700">{isMath ? 'Matemática · pág. 48' : 'Comunicación · lectura'}</text>
        {lines.map((l, i) => (
          <g key={l}>
            <text x="80" y={68 + i * 40} fontSize="12" fontFamily="'Comic Sans MS', cursive" fill="#475569">{l}</text>
            {i < written && <path d={`M${isMath ? 160 : 92} ${84 + i * 40} q8 -7 16 0 t16 0 t16 0 t16 0 t16 0${i < written - 1 || done ? ' t16 0 t16 0' : ''}`} fill="none" stroke="#1e3a8a" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="200" strokeDashoffset={i === written - 1 && !done ? 200 : 0} style={i === written - 1 && !done ? { animation: 'write 4s ease-out forwards' } : undefined} />}
          </g>
        ))}
        {!done && <g transform={`translate(${isMath ? 250 : 210} ${74 + (written - 1) * 40}) rotate(35)`}><rect x="-3" y="-34" width="6" height="34" rx="1.5" fill="#facc15" /><polygon points="-3,0 3,0 0,7" fill="#1f2937" /></g>}
      </g>
      <rect width="360" height="240" filter="url(#grain)" />
    </svg>
  );
};

export const LiveSheet: React.FC = () => {
  const { overlay, setOverlay, session, tasks, sim, clock, settings } = useEdu();
  const open = overlay?.kind === 'live';
  useEffect(() => { sim.setWatching(open); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const t = tasks.find(x => x.id === session.taskId);
  const lastDone = [...tasks].reverse().find(x => x.status === 'completada' && x.childId === 'mateo');
  const recent = session.log.slice(-4).reverse();
  const [sent, setSent] = useState<string | null>(null);
  const send = (m: string) => { sim.parentMessage(m); setSent(m); window.setTimeout(() => setSent(null), 2500); };

  return (
    <Sheet open={open} onClose={() => setOverlay(null)} full dark title={<span className="flex items-center gap-2">{session.state === 'live' && <span className="live-dot h-2.5 w-2.5 rounded-full bg-red-500" />}Mateo en vivo</span>}>
      {!settings.liveStream ? (
        <div className="mt-10 text-center"><Lock className="mx-auto h-8 w-8 text-slate-500" /><p className="mt-2 text-[15px] font-bold">Desactivaste la transmisión en vivo</p><p className="text-[13px] text-slate-400">Puedes activarla en Más › Lámpara EDU.</p></div>
      ) : session.state !== 'live' ? (
        <div className="mt-8 flex flex-col items-center text-center">
          <div className="rounded-[26px] bg-black p-1.5"><EduFace expr={session.state === 'done' ? 'meta' : 'reposo'} size={110} dim={session.state !== 'done'} /></div>
          <p className="mt-4 text-[17px] font-extrabold">{session.state === 'done' ? 'Mateo ya terminó por hoy' : 'Mateo aún no empieza'}</p>
          <p className="mt-1 max-w-[260px] text-[13px] text-slate-400">La cámara solo transmite durante la hora de tareas, cuando Mateo enciende la lámpara.</p>
        </div>
      ) : (<>
        <div className="relative aspect-[3/2] overflow-hidden rounded-3xl bg-black">
          <Notebook taskId={t?.id} step={session.step} done={false} />
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-black"><span className="live-dot h-1.5 w-1.5 rounded-full bg-white" />EN VIVO</div>
          <div className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-bold">{fmtClock(clock)}</div>
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-bold"><Eye className="h-3 w-3" />Cámara de EDU · solo el cuaderno</div>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400"><ShieldCheck className="h-3.5 w-3.5" />No se graba. Mateo ve una luz en EDU mientras miras.</p>

        {t && (
          <div className="mt-4 rounded-3xl bg-white/5 p-4">
            <div className="flex items-center justify-between"><p className="text-[12px] font-extrabold uppercase tracking-wide" style={{ color: '#9cc0ff' }}>{t.course}</p><p className="text-[12px] text-slate-400">Paso {session.step + 1} de {t.steps.length}</p></div>
            <div className="mt-2 flex gap-1">{t.steps.map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i < session.step ? 'bg-emerald-400' : i === session.step ? 'bg-sky-edu' : 'bg-white/15'}`} />)}</div>
            <p className="mt-2 text-[15px] font-bold">{t.steps[session.step]}</p>
          </div>
        )}
        <div className="mt-3 flex items-start gap-2.5">
          <span className="shrink-0 rounded-xl bg-black p-0.5"><EduFace expr={session.expr} size={40} /></span>
          <p className="rounded-3xl rounded-tl-lg bg-white/10 px-4 py-2.5 text-[14px]">{session.speech}</p>
        </div>

        <SectionTitle><span className="text-slate-400">Lo último</span></SectionTitle>
        <div className="space-y-2">
          {recent.map(l => <p key={l.id} className="text-[13px] text-slate-300"><span className="mr-1.5 text-[11px] font-bold text-slate-500">{fmtClock(l.clock)}</span>{l.who === 'nino' ? <i>Mateo: «{l.text}»</i> : l.who === 'edu' ? <>EDU: {l.text}</> : l.who === 'padre' ? <>Tú: «{l.text}»</> : l.text}</p>)}
        </div>

        <SectionTitle><span className="text-slate-400">Envíale ánimo (EDU lo dice en voz alta)</span></SectionTitle>
        <div className="flex flex-wrap gap-2">
          {['¡Vas muy bien, campeón!', 'Estoy orgullosa de ti', 'Cuando termines, jugamos'].map(m => (
            <button key={m} onClick={() => send(m)} className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 text-[13px] font-bold"><MessageCircleHeart className="h-4 w-4 text-pink-300" />{m}</button>
          ))}
        </div>
        {sent && <p className="mt-2 text-[12px] font-bold text-emerald-300">Enviado. EDU se lo dijo a Mateo.</p>}
        {lastDone && <p className="mt-4 text-[12px] text-slate-500">Última tarea lista: {lastDone.course} en {lastDone.spentMin} min.</p>}
      </>)}
    </Sheet>
  );
};
