import React from 'react';
import { ArrowRight, Bell, CheckCircle2, ChevronRight, Circle, Clock, Radio, Sparkles, TriangleAlert } from 'lucide-react';
import { useEdu } from '../store';
import { Card, EduFace, SectionTitle, SourceChip, StatusPill, courseColor, RING_COLOR } from '../ui';
import { CHILDREN, PARENT_NAME, dayLabel, fmtClock, fmtTime24 } from '../data';

export const Today: React.FC = () => {
  const { childId, tasks, setTasks, workshops, session, setOverlay, setTab, ask, clock, settings, weekdayToday, tomorrow } = useEdu();
  const child = CHILDREN.find(c => c.id === childId)!;
  const mine = tasks.filter(t => t.childId === childId);
  const changes = mine.filter(t => t.change || t.isNew);
  const dueTomorrow = mine.filter(t => t.dueKey === tomorrow && t.type !== 'material');
  const bring = mine.flatMap(t => t.materials.filter(m => m.forKey === tomorrow).map(m => ({ ...m, taskId: t.id, course: t.course })));
  const todayWs = workshops.filter(w => w.childId === childId && w.days.includes(weekdayToday));
  const nextWs = workshops.filter(w => w.childId === childId).map(w => ({ ...w, next: w.days.find(d => d > weekdayToday) ?? w.days[0] }));
  const pendingTomorrow = dueTomorrow.filter(t => t.status !== 'completada');
  const doneCount = dueTomorrow.filter(t => t.status === 'completada').length;
  const current = mine.find(t => t.id === session.taskId);

  const toggleMat = (taskId: string, mid: string) => setTasks(ts => ts.map(t => t.id === taskId ? { ...t, materials: t.materials.map(m => m.id === mid ? { ...m, ready: !m.ready } : m) } : t));

  return (
    <div className="pb-6">
      <div className="px-1 pt-1">
        <p className="text-[13px] font-semibold text-slate-500">Jueves 12 de noviembre · {fmtClock(clock)}</p>
        <h1 className="text-[26px] font-black leading-tight text-slate-900">Hola, {PARENT_NAME} 👋</h1>
        <p className="mt-0.5 text-[14px] text-slate-600">
          {pendingTomorrow.length ? <>Para mañana, {child.name} tiene <b>{pendingTomorrow.length} {pendingTomorrow.length === 1 ? 'pendiente' : 'pendientes'}</b>{bring.length ? <> y debe llevar <b>{bring.length} {bring.length === 1 ? 'cosa' : 'cosas'}</b></> : null}.</> : <>{child.name} ya terminó lo de mañana{bring.length ? <> y debe llevar <b>{bring.length} {bring.length === 1 ? 'cosa' : 'cosas'}</b></> : null}.</>}
        </p>
      </div>

      {/* Estado del dispositivo EDU */}
      {child.hasDevice ? (
        session.state === 'live' ? (
          <Card className="mt-4 overflow-hidden border-0 bg-gradient-to-br from-edu to-edu-dark text-white" onClick={() => setOverlay({ kind: 'live' })}>
            <div className="flex items-center gap-3 p-4">
              <div className="rounded-2xl bg-black/30 p-1"><EduFace expr={session.expr} size={64} /></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-red-200"><span className="live-dot h-2 w-2 rounded-full bg-red-400" />En vivo · hora de tareas</div>
                <p className="mt-0.5 text-[16px] font-extrabold leading-snug">{child.name} está haciendo {current?.course ?? 'sus tareas'}</p>
                <p className="text-[13px] text-blue-100">{current ? `Paso ${session.step + 1} de ${current.steps.length} · ${clock - (session.startedAt ?? clock)} min` : ''}</p>
              </div>
              <ChevronRight className="h-5 w-5 opacity-80" />
            </div>
            <div className="flex items-center justify-between bg-black/15 px-4 py-2.5 text-[13px] font-bold">
              <span className="flex items-center gap-1.5"><Radio className="h-4 w-4" /> Ver en vivo</span>
              <span className="text-blue-100">{doneCount}/{dueTomorrow.filter(t => t.steps.length).length} tareas listas</span>
            </div>
          </Card>
        ) : session.state === 'done' ? (
          <Card className="mt-4 border-emerald-200 bg-emerald-50 p-4" onClick={() => setTab('reportes')}>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-950 p-1"><EduFace expr="meta" size={60} /></div>
              <div className="flex-1">
                <p className="text-[16px] font-extrabold text-emerald-900">¡{child.name} terminó sus tareas!</p>
                <p className="text-[13px] text-emerald-800">{doneCount} listas en {(session.endedAt ?? clock) - (session.startedAt ?? clock)} min · EDU lo guió {session.helpCount} {session.helpCount === 1 ? 'vez' : 'veces'}</p>
              </div>
              <span className="flex items-center gap-1 text-[13px] font-bold text-emerald-700">Reporte <ArrowRight className="h-4 w-4" /></span>
            </div>
          </Card>
        ) : (
          <Card className="mt-4 p-4" onClick={() => setOverlay({ kind: 'device' })}>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-950 p-1"><EduFace expr="reposo" size={60} /></div>
              <div className="flex-1">
                <p className="text-[15px] font-extrabold text-slate-900">Hora de tareas: {fmtTime24(settings.homeworkTime)}</p>
                <p className="text-[13px] text-slate-600">EDU llamará a {child.name} y te avisará cuando empiece y cuando termine.</p>
              </div>
              <span className="h-3 w-3 rounded-full" style={{ background: RING_COLOR[session.ring] }} />
            </div>
          </Card>
        )
      ) : (
        <Card className="mt-4 border-dashed p-4">
          <p className="text-[14px] font-bold text-slate-800">{child.name} no tiene lámpara EDU</p>
          <p className="text-[13px] text-slate-600">Igual ordeno todo lo que publican sus docentes. Con la lámpara, también verías cómo avanza con sus tareas.</p>
        </Card>
      )}

      {/* Cambios desde la última revisión */}
      {changes.length > 0 && (<>
        <SectionTitle>Desde tu última revisión</SectionTitle>
        <Card className="divide-y divide-slate-100">
          {changes.map(t => (
            <button key={t.id} onClick={() => setOverlay({ kind: 'task', id: t.id })} className="flex w-full items-start gap-3 p-4 text-left">
              <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${t.change ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{t.change ? <TriangleAlert className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-extrabold text-slate-900">{t.change ? `Cambió: ${t.course}` : `Nueva: ${t.course}`}</p>
                {t.change ? <p className="text-[13px] text-slate-600">{t.change.what}: <span className="line-through">{t.change.before}</span> → <b className="text-slate-900">{t.change.after}</b></p>
                  : <p className="text-[13px] text-slate-600">{t.title} · {dayLabel(t.dueKey)}</p>}
                <div className="mt-1.5 flex items-center gap-2"><SourceChip source={t.source} small /><span className="text-[11px] text-slate-400">{t.teacher}</span></div>
              </div>
            </button>
          ))}
        </Card>
      </>)}

      {/* Para mañana */}
      <SectionTitle right={<button onClick={() => setTab('agenda')} className="text-[13px] font-bold text-edu">Ver semana</button>}>Para mañana</SectionTitle>
      <Card className="divide-y divide-slate-100">
        {dueTomorrow.length === 0 && <p className="p-4 text-[14px] text-slate-500">Nada para mañana. 🎉</p>}
        {dueTomorrow.map(t => (
          <button key={t.id} onClick={() => setOverlay({ kind: 'task', id: t.id })} className="flex w-full items-center gap-3 p-4 text-left">
            <span className="h-10 w-1.5 shrink-0 rounded-full" style={{ background: courseColor(t.course) }} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2"><p className="text-[12px] font-extrabold uppercase tracking-wide" style={{ color: courseColor(t.course) }}>{t.course}</p>{t.type === 'evaluacion' && <span className="rounded bg-red-50 px-1.5 text-[10px] font-extrabold text-red-600">EVALUACIÓN</span>}</div>
              <p className="truncate text-[14px] font-bold text-slate-900">{t.title}</p>
              <div className="mt-1 flex items-center gap-2"><SourceChip source={t.source} small />{t.estimateMin > 0 && <span className="flex items-center gap-1 text-[11px] text-slate-500"><Clock className="h-3 w-3" />{t.spentMin ? `${t.spentMin} min` : `~${t.estimateMin} min`}</span>}</div>
            </div>
            {t.type !== 'evaluacion' && <StatusPill status={t.status} />}
          </button>
        ))}
      </Card>

      {/* Materiales */}
      {bring.length > 0 && (<>
        <SectionTitle>Mañana lleva</SectionTitle>
        <Card className="divide-y divide-slate-100">
          {bring.map(m => (
            <button key={m.id} onClick={() => toggleMat(m.taskId, m.id)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
              {m.ready ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Circle className="h-6 w-6 text-slate-300" />}
              <div className="flex-1"><p className={`text-[14px] font-bold ${m.ready ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{m.name}</p><p className="text-[12px] text-slate-500">{m.course}</p></div>
            </button>
          ))}
        </Card>
      </>)}

      {/* Talleres */}
      <SectionTitle right={<button onClick={() => setOverlay({ kind: 'workshops' })} className="text-[13px] font-bold text-edu">Editar</button>}>Fuera del colegio</SectionTitle>
      <Card className="divide-y divide-slate-100">
        {todayWs.map(w => (
          <div key={w.id} className="flex items-center gap-3 px-4 py-3">
            <span className="text-2xl">{w.emoji}</span>
            <div className="flex-1"><p className="text-[14px] font-extrabold text-slate-900">{w.name} · hoy {fmtTime24(w.time)}</p><p className="text-[12px] text-slate-500">{w.place}</p></div>
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-700"><Bell className="h-3 w-3" />Aviso {w.remindMin} min antes</span>
          </div>
        ))}
        {todayWs.length === 0 && nextWs.slice(0, 2).map(w => (
          <div key={w.id} className="flex items-center gap-3 px-4 py-3">
            <span className="text-2xl">{w.emoji}</span>
            <div className="flex-1"><p className="text-[14px] font-bold text-slate-900">{w.name}</p><p className="text-[12px] text-slate-500">{['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][w.next]} · {fmtTime24(w.time)} · {w.place}</p></div>
          </div>
        ))}
      </Card>

      {/* Pregunta rápida */}
      <SectionTitle>Pregúntale a EDU</SectionTitle>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {['¿Qué tiene esta semana?', '¿Qué debe llevar mañana?', '¿Cómo le fue hoy?', 'Quiero una cita con su tutora'].map(s => (
          <button key={s} onClick={() => { setTab('edu'); ask(s); }} className="shrink-0 rounded-full border border-edu/20 bg-white px-3.5 py-2 text-[13px] font-bold text-edu">{s}</button>
        ))}
      </div>
    </div>
  );
};
