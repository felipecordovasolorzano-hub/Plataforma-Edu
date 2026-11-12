import React, { useEffect, useRef, useState } from 'react';
import { CalendarCheck, CheckCircle2, Circle, SendHorizonal, ShieldCheck } from 'lucide-react';
import { useEdu } from '../store';
import type { ChatCard, ChatMsg } from '../types';
import { EduFace, SourceChip, courseColor } from '../ui';
import { dayLabel, fmtTime24 } from '../data';

const SUGGEST = ['¿Qué tiene para mañana?', '¿Qué tiene esta semana?', '¿Qué debe llevar mañana?', '¿Qué cambió desde ayer?', '¿Cómo le fue hoy?', '¿Cuándo es fútbol?', 'Quiero una cita con la profesora de Matemática', 'Hazle la tarea de Matemática'];

const CardView: React.FC<{ msg: ChatMsg; card: ChatCard }> = ({ msg, card }) => {
  const { tasks, setOverlay, session, chooseSlot, workshops, childId, clock } = useEdu();
  const box = 'mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white';
  if (card.type === 'tasks' || card.type === 'changes') {
    const list = card.taskIds.map(id => tasks.find(t => t.id === id)!).filter(Boolean);
    return (
      <div className={box}>
        {list.map(t => (
          <button key={t.id} onClick={() => setOverlay({ kind: 'task', id: t.id })} className="flex w-full items-start gap-2.5 border-b border-slate-100 px-3 py-2.5 text-left last:border-0">
            <span className="mt-1 h-8 w-1 shrink-0 rounded-full" style={{ background: courseColor(t.course) }} />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-extrabold uppercase" style={{ color: courseColor(t.course) }}>{t.course} · {dayLabel(t.dueKey)}{t.type === 'evaluacion' ? ' · evaluación' : ''}</p>
              <p className="text-[13px] font-bold leading-snug text-slate-900">{t.title}</p>
              {card.type === 'changes' && t.change && <p className="text-[12px] text-amber-700">{t.change.what}: {t.change.before} → <b>{t.change.after}</b></p>}
              <div className="mt-1 flex items-center gap-1.5"><SourceChip source={t.source} small /><span className="truncate text-[10px] text-slate-400">{t.teacher} · {t.postedAt}</span></div>
            </div>
          </button>
        ))}
      </div>
    );
  }
  if (card.type === 'materials') {
    const list = card.taskIds.map(id => tasks.find(t => t.id === id)!).filter(Boolean);
    return (
      <div className={box}>
        {list.flatMap(t => t.materials.map(m => (
          <div key={m.id} className="flex items-center gap-2.5 border-b border-slate-100 px-3 py-2.5 last:border-0">
            {m.ready ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-slate-300" />}
            <div className="flex-1"><p className="text-[13px] font-bold text-slate-900">{m.name}</p><p className="text-[11px] text-slate-500">{t.course} · para {dayLabel(m.forKey).toLowerCase()}</p></div>
            <SourceChip source={t.source} small />
          </div>
        )))}
      </div>
    );
  }
  if (card.type === 'report') {
    const hw = tasks.filter(t => t.childId === 'mateo' && t.steps.length && t.status !== undefined && t.dueKey === '2026-11-13');
    const done = hw.filter(t => t.status === 'completada');
    const total = session.startedAt ? (session.endedAt ?? clock) - session.startedAt : 0;
    return (
      <div className={`${box} p-3`}>
        {session.state === 'idle' ? <p className="text-[13px] text-slate-600">Mateo todavía no empieza. La hora de tareas es a las 4:00 p. m.; te aviso cuando encienda la lámpara.</p> : (<>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-emerald-50 p-2"><p className="text-[18px] font-black text-emerald-700">{done.length}/{hw.length}</p><p className="text-[10px] font-bold text-emerald-800">tareas listas</p></div>
            <div className="rounded-xl bg-blue-50 p-2"><p className="text-[18px] font-black text-edu">{total}</p><p className="text-[10px] font-bold text-edu">minutos</p></div>
            <div className="rounded-xl bg-amber-50 p-2"><p className="text-[18px] font-black text-amber-700">{session.helpCount}</p><p className="text-[10px] font-bold text-amber-800">pistas de EDU</p></div>
          </div>
          {hw.map(t => <p key={t.id} className="mt-2 text-[12px] text-slate-600"><b className="text-slate-800">{t.course}:</b> {t.status === 'completada' ? `lista en ${t.spentMin} min (estimado ${t.estimateMin})` : t.status === 'en_curso' ? 'la está haciendo ahora' : 'pendiente'}</p>)}
          {session.refusedCount > 0 && <p className="mt-2 rounded-lg bg-slate-50 p-2 text-[12px] text-slate-600">Pidió la respuesta {session.refusedCount} {session.refusedCount === 1 ? 'vez' : 'veces'}; EDU le dio una pista en su lugar.</p>}
        </>)}
      </div>
    );
  }
  if (card.type === 'slots') {
    return (
      <div className={`${box} p-2`}>
        {card.slots.map(s => (
          <button key={s} disabled={!!card.chosen} onClick={() => chooseSlot(msg.id, s)} className={`mb-1.5 flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-[13px] font-bold last:mb-0 ${card.chosen === s ? 'border-edu bg-edu text-white' : 'border-slate-200 text-slate-800'} ${card.chosen && card.chosen !== s ? 'opacity-40' : ''}`}>
            <CalendarCheck className="h-4 w-4" />{s}{card.chosen === s && <span className="ml-auto text-[11px]">Solicitada</span>}
          </button>
        ))}
      </div>
    );
  }
  if (card.type === 'workshops') {
    return (
      <div className={box}>
        {workshops.filter(w => w.childId === childId).map(w => (
          <div key={w.id} className="flex items-center gap-2.5 border-b border-slate-100 px-3 py-2.5 last:border-0">
            <span className="text-xl">{w.emoji}</span>
            <div className="flex-1"><p className="text-[13px] font-bold text-slate-900">{w.name} · {fmtTime24(w.time)}</p><p className="text-[11px] text-slate-500">{w.days.map(d => ['', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][d]).join(' y ')} · {w.place}</p></div>
          </div>
        ))}
      </div>
    );
  }
  if (card.type === 'rule') {
    return (
      <div className="mt-2 flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <p className="text-[12px] text-emerald-900"><b>Regla de EDU:</b> guía con preguntas y pistas, revisa lo que el niño hizo y lo motiva. Nunca resuelve la tarea ni dicta respuestas. Esta regla no se puede desactivar.</p>
      </div>
    );
  }
  return null;
};

export const AskEdu: React.FC = () => {
  const { chat, ask, typing, childId } = useEdu();
  const [text, setText] = useState('');
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat.length, typing]);
  const send = (t: string) => { if (!t.trim()) return; ask(t.trim()); setText(''); };
  const name = childId === 'mateo' ? 'Mateo' : 'Lucía';

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto pb-3">
        <div className="flex flex-col items-center px-4 pt-2 text-center">
          <div className="rounded-[26px] bg-slate-950 p-1.5 shadow-lg"><EduFace expr={typing ? 'escucha' : 'feliz'} size={92} /></div>
          <h1 className="mt-3 text-[22px] font-black text-slate-900">Pregúntale a EDU</h1>
          <p className="mt-1 text-[13px] text-slate-500">Leo SieWeb, Classroom y los talleres de {name} para responderte en una frase. Siempre te digo de dónde saqué cada dato.</p>
        </div>

        <div className="mt-4 space-y-3">
          {chat.map(m => m.from === 'padre' ? (
            <div key={m.id} className="flex justify-end"><p className="max-w-[80%] rounded-3xl rounded-br-lg bg-edu px-4 py-2.5 text-[14px] font-semibold text-white">{m.text}</p></div>
          ) : (
            <div key={m.id} className="flex items-start gap-2">
              <span className="mt-1 shrink-0 rounded-xl bg-slate-950 p-0.5"><EduFace expr="feliz" size={30} /></span>
              <div className="max-w-[86%]"><p className="rounded-3xl rounded-tl-lg border border-slate-200 bg-white px-4 py-2.5 text-[14px] text-slate-800">{m.text}</p>{m.card && <CardView msg={m} card={m.card} />}</div>
            </div>
          ))}
          {typing && (
            <div className="flex items-center gap-2"><span className="rounded-xl bg-slate-950 p-0.5"><EduFace expr="escucha" size={30} /></span><span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px] text-slate-500">EDU está revisando…</span></div>
          )}
          <div ref={end} />
        </div>

        {chat.length === 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {SUGGEST.map(s => <button key={s} onClick={() => send(s)} className="rounded-full border border-edu/20 bg-white px-3.5 py-2 text-[13px] font-bold text-edu">{s}</button>)}
          </div>
        )}
      </div>

      {chat.length > 0 && (
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
          {SUGGEST.slice(0, 7).map(s => <button key={s} onClick={() => send(s)} className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-bold text-slate-600">{s}</button>)}
        </div>
      )}
      <form onSubmit={e => { e.preventDefault(); send(text); }} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 pl-4 shadow-sm">
        <input value={text} onChange={e => setText(e.target.value)} placeholder={`Pregunta algo sobre ${name}…`} className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-slate-400" />
        <button type="submit" aria-label="Enviar" className="grid h-10 w-10 place-items-center rounded-full bg-edu text-white"><SendHorizonal className="h-4 w-4" /></button>
      </form>
    </div>
  );
};
