import React, { useState } from 'react';
import { Ban, CheckCircle2, Flag, HandHelping, Lamp, MessageCircleHeart, Power, Share2, Sparkles, TrendingUp, TriangleAlert } from 'lucide-react';
import { useEdu } from '../store';
import { Card, SectionTitle, courseColor } from '../ui';
import { WEEK, fmtClock } from '../data';
import type { LogKind } from '../types';

const ICON: Record<LogKind, [React.ElementType, string]> = {
  inicio: [Lamp, 'bg-blue-100 text-edu'], explica: [Sparkles, 'bg-blue-50 text-edu'], avance: [TrendingUp, 'bg-slate-100 text-slate-600'],
  ayuda: [HandHelping, 'bg-amber-100 text-amber-700'], negativa: [Ban, 'bg-rose-100 text-rose-600'], termina: [CheckCircle2, 'bg-emerald-100 text-emerald-700'],
  meta: [Flag, 'bg-emerald-100 text-emerald-700'], mensaje: [MessageCircleHeart, 'bg-pink-100 text-pink-600'], taller: [Sparkles, 'bg-amber-100 text-amber-700'],
  cambio: [TriangleAlert, 'bg-red-100 text-red-600'], fin: [Power, 'bg-slate-100 text-slate-600'],
};

export const Reports: React.FC = () => {
  const { childId, tasks, session, clock, notify } = useEdu();
  const [seg, setSeg] = useState<'hoy' | 'semana'>('hoy');
  if (childId !== 'mateo') {
    return (
      <div><h1 className="px-1 text-[24px] font-black text-slate-900">Reportes</h1>
        <Card className="mt-4 border-dashed p-5 text-[14px] text-slate-600">Los reportes de avance vienen de la lámpara EDU. Lucía no tiene una vinculada, así que solo ves lo que publican sus docentes en Hoy y Agenda.</Card></div>
    );
  }
  const hw = tasks.filter(t => t.childId === 'mateo' && t.steps.length > 0 && t.dueKey === '2026-11-13');
  const done = hw.filter(t => t.status === 'completada');
  const total = session.startedAt ? (session.endedAt ?? clock) - session.startedAt : 0;
  const estTotal = hw.reduce((a, t) => a + t.estimateMin, 0);
  const todayRow = { day: 'Jue', done: done.length, total: hw.length, min: total, est: estTotal, help: session.helpCount, refused: session.refusedCount, start: session.startedAt ? fmtClock(session.startedAt) : '—' };
  const week = [...WEEK, todayRow];
  const maxMin = Math.max(60, ...week.map(w => Math.max(w.min, w.est)));
  const wDone = week.reduce((a, w) => a + w.done, 0), wTotal = week.reduce((a, w) => a + w.total, 0), wHelp = week.reduce((a, w) => a + w.help, 0), wRef = week.reduce((a, w) => a + w.refused, 0);
  const visibleLog = session.log.filter(l => l.kind !== 'explica' || l === session.log.find(x => x.kind === 'explica'));

  return (
    <div className="pb-6">
      <div className="flex items-end justify-between px-1">
        <div><h1 className="text-[24px] font-black text-slate-900">Reportes</h1><p className="text-[13px] text-slate-500">Lo que EDU vio en el escritorio de Mateo.</p></div>
        <button onClick={() => notify({ kind: 'logro', title: 'Resumen enviado', body: 'Se envió el resumen de hoy por WhatsApp a Jorge (papá de Mateo).' })} className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-bold text-slate-600"><Share2 className="h-3.5 w-3.5" />Compartir</button>
      </div>
      <div className="mt-4 grid grid-cols-2 rounded-full bg-slate-200/70 p-1">
        {(['hoy', 'semana'] as const).map(s => <button key={s} onClick={() => setSeg(s)} className={`rounded-full py-2 text-[14px] font-extrabold ${seg === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{s === 'hoy' ? 'Hoy' : 'Esta semana'}</button>)}
      </div>

      {seg === 'hoy' ? (session.state === 'idle' && session.log.length === 0 ? (
        <Card className="mt-4 p-5 text-center"><Lamp className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-2 text-[15px] font-extrabold text-slate-800">Aún no empieza la hora de tareas</p><p className="text-[13px] text-slate-500">Cuando Mateo encienda la lámpara verás aquí su avance, el tiempo y cada ayuda de EDU.</p></Card>
      ) : (<>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <Card className="p-3.5"><p className="text-[12px] font-bold text-slate-500">Tareas listas</p><p className="text-[26px] font-black text-emerald-600">{done.length}<span className="text-[16px] text-slate-400">/{hw.length}</span></p></Card>
          <Card className="p-3.5"><p className="text-[12px] font-bold text-slate-500">Tiempo total</p><p className="text-[26px] font-black text-slate-900">{total}<span className="text-[14px] text-slate-400"> min</span></p><p className="text-[11px] text-slate-500">empezó {todayRow.start}</p></Card>
          <Card className="p-3.5"><p className="text-[12px] font-bold text-slate-500">Pistas de EDU</p><p className="text-[26px] font-black text-amber-600">{session.helpCount}</p><p className="text-[11px] text-slate-500">cuando se trabó</p></Card>
          <Card className="p-3.5"><p className="text-[12px] font-bold text-slate-500">Respuestas dadas</p><p className="text-[26px] font-black text-slate-900">0</p><p className="text-[11px] text-slate-500">pidió {session.refusedCount} {session.refusedCount === 1 ? 'vez' : 'veces'}</p></Card>
        </div>

        <SectionTitle>Tiempo por tarea</SectionTitle>
        <Card className="space-y-3 p-4">
          {hw.map(t => {
            const spent = t.status === 'completada' ? t.spentMin ?? 0 : t.status === 'en_curso' ? Math.max(0, clock - (session.log.filter(l => l.taskId === t.id)[0]?.clock ?? clock)) : 0;
            const pct = Math.min(100, (spent / Math.max(t.estimateMin * 1.6, 1)) * 100), estPct = (t.estimateMin / (t.estimateMin * 1.6)) * 100;
            return (
              <div key={t.id}>
                <div className="flex justify-between text-[13px]"><b style={{ color: courseColor(t.course) }}>{t.course}</b><span className="text-slate-500">{t.status === 'pendiente' ? 'pendiente' : `${spent} min · est. ${t.estimateMin}`}</span></div>
                <div className="relative mt-1.5 h-3 rounded-full bg-slate-100">
                  <div className="h-3 rounded-full" style={{ width: `${pct}%`, background: t.status === 'completada' ? courseColor(t.course) : '#93c5fd' }} />
                  <div className="absolute top-[-3px] h-[18px] w-0.5 bg-slate-500" style={{ left: `${estPct}%` }} title="Tiempo estimado" />
                </div>
              </div>
            );
          })}
          <p className="text-[11px] text-slate-400">La línea marca el tiempo estimado. EDU marca una tarea como lista cuando la cámara verifica el cuaderno.</p>
        </Card>

        <SectionTitle>Línea de tiempo</SectionTitle>
        <Card className="p-4">
          <ol className="relative space-y-3 border-l-2 border-slate-100 pl-4">
            {visibleLog.map(l => { const [I, cls] = ICON[l.kind]; return (
              <li key={l.id} className="relative">
                <span className={`absolute -left-[27px] grid h-5 w-5 place-items-center rounded-full ${cls}`}><I className="h-3 w-3" /></span>
                <p className="text-[11px] font-bold text-slate-400">{fmtClock(l.clock)} · {{ edu: 'EDU', nino: 'Mateo', padre: 'Tú', sistema: 'Lámpara' }[l.who]}</p>
                <p className={`text-[13px] ${l.who === 'nino' ? 'italic text-slate-700' : 'text-slate-800'}`}>{l.who === 'nino' ? `«${l.text}»` : l.text}</p>
              </li>
            ); })}
          </ol>
        </Card>
      </>)) : (<>
        <Card className="mt-4 p-4">
          <div className="flex items-end justify-between gap-2" style={{ height: 150 }}>
            {week.map(w => (
              <div key={w.day} className="flex flex-1 flex-col items-center justify-end gap-1" style={{ height: '100%' }}>
                <span className="text-[11px] font-bold text-slate-500">{w.min ? `${w.min}′` : ''}</span>
                <div className="relative flex w-full justify-center" style={{ height: `${(Math.max(w.min, 2) / maxMin) * 110}px` }}>
                  <div className="w-7 rounded-t-lg" style={{ height: '100%', background: w.done === w.total && w.total ? '#22c55e' : w.min ? '#f59e0b' : '#e2e8f0' }} />
                </div>
                <span className="text-[12px] font-extrabold text-slate-700">{w.day}</span>
                <span className="text-[10px] text-slate-400">{w.done}/{w.total}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-3 text-[11px] text-slate-500"><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />Todo listo</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" />Quedó algo pendiente</span></div>
        </Card>
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          <Card className="p-3 text-center"><p className="text-[22px] font-black text-emerald-600">{wDone}/{wTotal}</p><p className="text-[11px] font-bold text-slate-500">tareas</p></Card>
          <Card className="p-3 text-center"><p className="text-[22px] font-black text-amber-600">{wHelp}</p><p className="text-[11px] font-bold text-slate-500">pistas</p></Card>
          <Card className="p-3 text-center"><p className="text-[22px] font-black text-slate-900">0</p><p className="text-[11px] font-bold text-slate-500">respuestas dadas</p></Card>
        </div>
        <SectionTitle>Lo que EDU notó</SectionTitle>
        <Card className="divide-y divide-slate-100">
          <div className="p-4"><p className="text-[14px] font-extrabold text-slate-900">Matemática le toma más tiempo</p><p className="text-[13px] text-slate-600">Usó en promedio 6 min más de lo estimado y pidió pistas sobre todo al multiplicar por partes. La evaluación es el miércoles 18.</p></div>
          <div className="p-4"><p className="text-[14px] font-extrabold text-slate-900">El martes quedó una tarea pendiente</p><p className="text-[13px] text-slate-600">Empezó a las 6:40 p. m., después de fútbol. Los días de taller rinde mejor si empieza antes.</p></div>
          <div className="p-4"><p className="text-[14px] font-extrabold text-slate-900">Pide la respuesta cada vez menos</p><p className="text-[13px] text-slate-600">{wRef} {wRef === 1 ? 'vez' : 'veces'} esta semana. En cada caso EDU le respondió con una pregunta para que llegara solo.</p></div>
        </Card>
      </>)}
    </div>
  );
};
