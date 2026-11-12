import React, { useState } from 'react';
import { BookOpen, ClipboardCheck, Lamp, Package } from 'lucide-react';
import { useEdu } from '../store';
import { Card, SectionTitle, SourceChip, StatusPill, courseColor } from '../ui';
import { DAY_NAMES, WEEK_KEYS, dayLabel, fmtTime24, weekdayIndex } from '../data';

type Filter = 'todo' | 'colegio' | 'talleres';

export const Agenda: React.FC = () => {
  const { childId, tasks, workshops, setOverlay, today, settings } = useEdu();
  const [sel, setSel] = useState(today);
  const [filter, setFilter] = useState<Filter>('todo');
  const mine = tasks.filter(t => t.childId === childId);
  const keys = WEEK_KEYS.slice(0, 14);

  const itemsFor = (key: string) => {
    const wd = weekdayIndex(key);
    const school = filter === 'talleres' ? [] : mine.filter(t => t.dueKey === key || t.materials.some(m => m.forKey === key && t.dueKey !== key));
    const ws = filter === 'colegio' ? [] : workshops.filter(w => w.childId === childId && w.days.includes(wd));
    return { school, ws };
  };
  const { school, ws } = itemsFor(sel);
  const hasHomework = childId === 'mateo' && weekdayIndex(sel) <= 5 && filter !== 'talleres';

  return (
    <div className="pb-6">
      <h1 className="px-1 text-[24px] font-black text-slate-900">Agenda</h1>
      <p className="px-1 text-[13px] text-slate-500">Entregas, evaluaciones y talleres, todo junto.</p>

      <div className="no-scrollbar -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1">
        {keys.map(k => {
          const d = new Date(k + 'T12:00:00'); const { school: s, ws: w } = itemsFor(k);
          const on = k === sel;
          return (
            <button key={k} onClick={() => setSel(k)} className={`flex w-[52px] shrink-0 flex-col items-center rounded-2xl border py-2 ${on ? 'border-edu bg-edu text-white' : 'border-slate-200 bg-white text-slate-700'}`}>
              <span className={`text-[11px] font-bold ${on ? 'text-blue-100' : 'text-slate-400'}`}>{DAY_NAMES[weekdayIndex(k) - 1]}</span>
              <span className="text-[18px] font-black">{d.getDate()}</span>
              <span className="mt-0.5 flex h-1.5 gap-0.5">
                {s.some(t => t.type === 'evaluacion') && <span className={`h-1.5 w-1.5 rounded-full ${on ? 'bg-white' : 'bg-red-500'}`} />}
                {s.some(t => t.type !== 'evaluacion') && <span className={`h-1.5 w-1.5 rounded-full ${on ? 'bg-white' : 'bg-edu'}`} />}
                {w.length > 0 && <span className={`h-1.5 w-1.5 rounded-full ${on ? 'bg-white' : 'bg-amber-500'}`} />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2">
        {(['todo', 'colegio', 'talleres'] as Filter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-3.5 py-1.5 text-[13px] font-bold ${filter === f ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>{{ todo: 'Todo', colegio: 'Colegio', talleres: 'Talleres' }[f]}</button>
        ))}
      </div>

      <SectionTitle>{dayLabel(sel)} · {new Date(sel + 'T12:00:00').toLocaleDateString('es-PE', { day: 'numeric', month: 'long' })}</SectionTitle>
      <div className="space-y-2.5">
        {hasHomework && (
          <Card className="flex items-center gap-3 border-blue-100 bg-edu-soft p-3.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-edu"><Lamp className="h-5 w-5" /></span>
            <div className="flex-1"><p className="text-[14px] font-extrabold text-slate-900">Hora de tareas con EDU</p><p className="text-[12px] text-slate-600">{fmtTime24(settings.homeworkTime)} · la lámpara llama a Mateo</p></div>
          </Card>
        )}
        {school.map(t => {
          const isMat = t.dueKey !== sel || t.type === 'material';
          const Icon = t.type === 'evaluacion' ? ClipboardCheck : isMat ? Package : BookOpen;
          return (
            <Card key={t.id} className="flex items-start gap-3 p-3.5" onClick={() => setOverlay({ kind: 'task', id: t.id })}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-white" style={{ background: courseColor(t.course) }}><Icon className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-extrabold uppercase tracking-wide" style={{ color: courseColor(t.course) }}>{t.course} · {t.type === 'evaluacion' ? 'Evaluación' : isMat ? 'Llevar' : 'Entrega'}</p>
                <p className="text-[14px] font-bold leading-snug text-slate-900">{t.title}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2"><SourceChip source={t.source} small />{t.change && <span className="rounded-full bg-amber-50 px-2 text-[11px] font-bold text-amber-700">Cambió de fecha</span>}</div>
              </div>
              {t.type !== 'evaluacion' && !isMat && <StatusPill status={t.status} />}
            </Card>
          );
        })}
        {ws.map(w => (
          <Card key={w.id} className="flex items-center gap-3 p-3.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-50 text-xl">{w.emoji}</span>
            <div className="flex-1"><p className="text-[11px] font-extrabold uppercase tracking-wide text-amber-700">Taller</p><p className="text-[14px] font-bold text-slate-900">{w.name} · {fmtTime24(w.time)}</p><p className="text-[12px] text-slate-500">{w.place} · aviso {w.remindMin} min antes</p></div>
          </Card>
        ))}
        {school.length === 0 && ws.length === 0 && !hasHomework && <p className="rounded-3xl border border-dashed border-slate-300 p-6 text-center text-[14px] text-slate-500">Día libre. Nada publicado por los docentes.</p>}
      </div>
    </div>
  );
};
