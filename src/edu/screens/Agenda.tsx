import React, { useState } from 'react';
import { Bell, BellRing, BookOpen, CalendarDays, CalendarSync, ClipboardCheck, Lamp, Package } from 'lucide-react';
import { useEdu } from '../store';
import { Card, SectionTitle, SourceChip, StatusPill, Toggle, courseColor } from '../ui';
import { DAY_NAMES, dayLabel, fmtTime24, weekdayIndex } from '../data';

type Filter = 'todo' | 'colegio' | 'talleres';
type View = 'semana' | 'mes';

const REMIND_OPTS = ['El día anterior, 7:00 p. m.', 'El mismo día, 7:00 a. m.', '2 horas antes'];
const keyOf = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

export const Agenda: React.FC = () => {
  const { childId, tasks, workshops, setOverlay, today, settings, reminders, setReminders, calendarSync, setCalendarSync, notify } = useEdu();
  const [sel, setSel] = useState(today);
  const [filter, setFilter] = useState<Filter>('todo');
  const [view, setView] = useState<View>('semana');
  const [picking, setPicking] = useState<string | null>(null);
  const mine = tasks.filter(t => t.childId === childId);

  const itemsFor = (key: string) => {
    const wd = weekdayIndex(key);
    const school = filter === 'talleres' ? [] : mine.filter(t => t.dueKey === key || t.materials.some(m => m.forKey === key && t.dueKey !== key));
    const ws = filter === 'colegio' ? [] : workshops.filter(w => w.childId === childId && w.days.includes(wd));
    return { school, ws };
  };
  const { school, ws } = itemsFor(sel);
  const hasHomework = childId === 'mateo' && weekdayIndex(sel) <= 5 && filter !== 'talleres';

  const weekKeys = Array.from({ length: 14 }, (_, i) => keyOf(2026, 10, 9 + i));
  const monthCells: (string | null)[] = [...Array(6).fill(null), ...Array.from({ length: 30 }, (_, i) => keyOf(2026, 10, i + 1))]; // 1 nov 2026 = domingo

  const setRem = (id: string, label: string, title: string) => {
    setReminders(r => ({ ...r, [id]: label })); setPicking(null);
    notify({ kind: 'sesion', title: 'Recordatorio creado', body: `${title} · ${label.toLowerCase()}${calendarSync ? ' · también en el calendario de tu celular' : ''}` });
  };
  const clearRem = (id: string) => { setReminders(r => { const n = { ...r }; delete n[id]; return n; }); setPicking(null); };

  const Dots: React.FC<{ k: string; on: boolean }> = ({ k, on }) => {
    const { school: s, ws: w } = itemsFor(k);
    return (
      <span className="mt-0.5 flex h-1.5 gap-0.5">
        {s.some(t => t.type === 'evaluacion') && <span className={`h-1.5 w-1.5 rounded-full ${on ? 'bg-white' : 'bg-red-500'}`} />}
        {s.some(t => t.type !== 'evaluacion') && <span className={`h-1.5 w-1.5 rounded-full ${on ? 'bg-white' : 'bg-edu'}`} />}
        {w.length > 0 && <span className={`h-1.5 w-1.5 rounded-full ${on ? 'bg-white' : 'bg-amber-500'}`} />}
      </span>
    );
  };

  const RemindRow: React.FC<{ id: string; title: string }> = ({ id, title }) => (
    <div className="mt-2 border-t border-slate-100 pt-2" onClick={e => e.stopPropagation()}>
      {picking === id ? (
        <div className="flex flex-wrap gap-1.5">
          {REMIND_OPTS.map(o => <button key={o} onClick={() => setRem(id, o, title)} className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${reminders[id] === o ? 'border-edu bg-edu text-white' : 'border-slate-200 text-slate-600'}`}>{o}</button>)}
          {reminders[id] && <button onClick={() => clearRem(id)} className="rounded-full px-2.5 py-1 text-[11px] font-bold text-red-500">Quitar</button>}
        </div>
      ) : (
        <button onClick={() => setPicking(id)} className={`flex items-center gap-1.5 text-[12px] font-bold ${reminders[id] ? 'text-edu' : 'text-slate-500'}`}>
          {reminders[id] ? <BellRing className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}{reminders[id] ? `Alarma: ${reminders[id]}` : 'Poner alarma'}
        </button>
      )}
    </div>
  );

  return (
    <div className="pb-6">
      <div className="flex items-end justify-between px-1">
        <div><h1 className="text-[24px] font-black text-slate-900">Agenda</h1><p className="text-[13px] text-slate-500">Entregas, evaluaciones y talleres, todo junto.</p></div>
        <div className="grid shrink-0 grid-cols-2 rounded-full bg-slate-200/70 p-1">
          {(['semana', 'mes'] as View[]).map(v => <button key={v} onClick={() => setView(v)} className={`rounded-full px-3 py-1.5 text-[12px] font-extrabold ${view === v ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{v === 'semana' ? 'Semana' : 'Mes'}</button>)}
        </div>
      </div>

      {view === 'semana' ? (
        <div className="no-scrollbar -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1">
          {weekKeys.map(k => {
            const d = new Date(k + 'T12:00:00'); const on = k === sel;
            return (
              <button key={k} onClick={() => setSel(k)} className={`flex w-[52px] shrink-0 flex-col items-center rounded-2xl border py-2 ${on ? 'border-edu bg-edu text-white' : 'border-slate-200 bg-white text-slate-700'}`}>
                <span className={`text-[11px] font-bold ${on ? 'text-blue-100' : 'text-slate-400'}`}>{DAY_NAMES[weekdayIndex(k) - 1]}</span>
                <span className="text-[18px] font-black">{d.getDate()}</span>
                <Dots k={k} on={on} />
              </button>
            );
          })}
        </div>
      ) : (
        <Card className="mt-4 p-3">
          <p className="mb-2 px-1 text-[14px] font-extrabold capitalize text-slate-900">Noviembre 2026</p>
          <div className="grid grid-cols-7 gap-1 text-center">
            {DAY_NAMES.map(d => <span key={d} className="text-[11px] font-bold text-slate-400">{d.slice(0, 2)}</span>)}
            {monthCells.map((k, i) => k ? (
              <button key={k} onClick={() => setSel(k)} className={`flex flex-col items-center rounded-xl py-1.5 ${k === sel ? 'bg-edu text-white' : k === today ? 'bg-edu-soft text-edu' : 'text-slate-700'}`}>
                <span className="text-[14px] font-extrabold">{Number(k.slice(-2))}</span>
                <Dots k={k} on={k === sel} />
              </button>
            ) : <span key={`e${i}`} />)}
          </div>
        </Card>
      )}

      <div className="mt-3 flex gap-2">
        {(['todo', 'colegio', 'talleres'] as Filter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-3.5 py-1.5 text-[13px] font-bold ${filter === f ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>{{ todo: 'Todo', colegio: 'Colegio', talleres: 'Talleres' }[f]}</button>
        ))}
      </div>

      <Card className="mt-3 flex items-center gap-3 p-3.5">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-edu-soft text-edu"><CalendarSync className="h-5 w-5" /></span>
        <div className="flex-1"><p className="text-[14px] font-extrabold text-slate-900">Copiar a mi calendario</p><p className="text-[12px] text-slate-500">{calendarSync ? 'Entregas, evaluaciones y talleres se agregan al calendario de tu celular.' : 'Google Calendar o Calendario de iPhone'}</p></div>
        <Toggle on={calendarSync} onChange={v => { setCalendarSync(v); if (v) notify({ kind: 'sesion', title: 'Calendario conectado', body: 'Las entregas, evaluaciones y talleres de Mateo ya aparecen en el calendario de tu celular.' }); }} label="Copiar a mi calendario" />
      </Card>

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
            <Card key={t.id} className="p-3.5" onClick={() => setOverlay({ kind: 'task', id: t.id })}>
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-white" style={{ background: courseColor(t.course) }}><Icon className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-extrabold uppercase tracking-wide" style={{ color: courseColor(t.course) }}>{t.course} · {t.type === 'evaluacion' ? 'Evaluación' : isMat ? 'Llevar' : 'Entrega'}</p>
                  <p className="text-[14px] font-bold leading-snug text-slate-900">{t.title}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2"><SourceChip source={t.source} small />{t.change && <span className="rounded-full bg-amber-50 px-2 text-[11px] font-bold text-amber-700">Cambió de fecha</span>}</div>
                </div>
                {t.type !== 'evaluacion' && !isMat && <StatusPill status={t.status} />}
              </div>
              <RemindRow id={`${t.id}@${sel}`} title={`${t.course}`} />
            </Card>
          );
        })}
        {ws.map(w => (
          <Card key={w.id} className="p-3.5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-50 text-xl">{w.emoji}</span>
              <div className="flex-1"><p className="text-[11px] font-extrabold uppercase tracking-wide text-amber-700">Taller</p><p className="text-[14px] font-bold text-slate-900">{w.name} · {fmtTime24(w.time)}</p><p className="text-[12px] text-slate-500">{w.place} · EDU avisa a Mateo {w.remindMin} min antes</p></div>
            </div>
            <RemindRow id={`${w.id}@${sel}`} title={w.name} />
          </Card>
        ))}
        {school.length === 0 && ws.length === 0 && !hasHomework && <p className="rounded-3xl border border-dashed border-slate-300 p-6 text-center text-[14px] text-slate-500"><CalendarDays className="mx-auto mb-1 h-6 w-6 text-slate-300" />Día libre. Nada publicado por los docentes.</p>}
      </div>
    </div>
  );
};
