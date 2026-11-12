import React, { useState } from 'react';
import { Task, TaskPriority, ThemeColor } from '../../types';
import { THEME_CONFIGS } from '../../utils/theme';
import {
  Check,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Filter,
  CheckCircle2,
  Package,
  BookOpen,
  HelpCircle,
  ArrowRight,
  ShoppingBag,
  Backpack,
} from 'lucide-react';

export const EscuadraIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Outer right-angle drafting triangle */}
    <path d="M4 20h16L4 4v16z" />
    {/* Inner triangular cutout */}
    <path d="M7 17h6L7 11v6z" />
    {/* Ruler tick marks along bottom */}
    <line x1="9" y1="20" x2="9" y2="18" />
    <line x1="12" y1="20" x2="12" y2="18" />
    <line x1="15" y1="20" x2="15" y2="18" />
    {/* Ruler tick marks along vertical leg */}
    <line x1="4" y1="15" x2="6" y2="15" />
    <line x1="4" y1="12" x2="6" y2="12" />
    <line x1="4" y1="9" x2="6" y2="9" />
    <line x1="4" y1="6" x2="6" y2="6" />
  </svg>
);

interface TaskListColumnProps {
  tasks: Task[];
  selectedDateKey: string | null;
  onClearDateFilter: () => void;
  onSelectTask: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  themeColor: ThemeColor;
  onOpenMaterials?: () => void;
}

const PALETTE_COLUMN_STYLES: Record<
  ThemeColor,
  {
    container: string;
    headerBorder: string;
    stickyDay: string;
    filterBox: string;
    tagCourse: string;
  }
> = {
  blue: {
    container: 'bg-blue-100 border-blue-300 text-blue-950',
    headerBorder: 'border-blue-300/80',
    stickyDay: 'bg-blue-200/90 text-blue-950 border-blue-300',
    filterBox: 'bg-white border-blue-300',
    tagCourse: 'text-blue-900',
  },
  emerald: {
    container: 'bg-emerald-100 border-emerald-300 text-emerald-950',
    headerBorder: 'border-emerald-300/80',
    stickyDay: 'bg-emerald-200/90 text-emerald-950 border-emerald-300',
    filterBox: 'bg-white border-emerald-300',
    tagCourse: 'text-emerald-900',
  },
  warm: {
    container: 'bg-amber-100 border-amber-300 text-amber-950',
    headerBorder: 'border-amber-300/80',
    stickyDay: 'bg-amber-200/90 text-amber-950 border-amber-300',
    filterBox: 'bg-white border-amber-300',
    tagCourse: 'text-amber-900',
  },
  indigo: {
    container: 'bg-indigo-100 border-indigo-300 text-indigo-950',
    headerBorder: 'border-indigo-300/80',
    stickyDay: 'bg-indigo-200/90 text-indigo-950 border-indigo-300',
    filterBox: 'bg-white border-indigo-300',
    tagCourse: 'text-indigo-900',
  },
};

export const TaskListColumn: React.FC<TaskListColumnProps> = ({
  tasks,
  selectedDateKey,
  onClearDateFilter,
  onSelectTask,
  onToggleComplete,
  themeColor,
  onOpenMaterials,
}) => {
  const theme = THEME_CONFIGS[themeColor];
  const paletteStyle = PALETTE_COLUMN_STYLES[themeColor] || PALETTE_COLUMN_STYLES.blue;

  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
  const [showCompleted, setShowCompleted] = useState<boolean>(false);

  // Compute materials count
  let totalMaterials = 0;
  let acquiredMaterials = 0;
  tasks.forEach((t) => {
    t.materials?.forEach((m) => {
      totalMaterials++;
      if (m.acquired) acquiredMaterials++;
    });
  });

  // Filter tasks based on selected date and priority
  const dateFilteredTasks = selectedDateKey
    ? tasks.filter((t) => t.dueDayKey === selectedDateKey)
    : tasks;

  const priorityFilteredTasks = priorityFilter === 'all'
    ? dateFilteredTasks
    : dateFilteredTasks.filter((t) => (t.priority || 'normal') === priorityFilter);

  const pendingTasks = priorityFilteredTasks.filter((t) => t.status !== 'completed');
  const completedTasks = priorityFilteredTasks.filter((t) => t.status === 'completed');

  // Priority weight for ordering (alta -> media -> normal)
  const priorityWeight: Record<TaskPriority, number> = {
    alta: 3,
    media: 2,
    normal: 1,
  };

  // Group pending tasks by delivery day
  const groupedByDay: { [dayKey: string]: { label: string; tasks: Task[] } } = {};

  pendingTasks.forEach((task) => {
    const key = task.dueDayKey || task.schoolDueDate;
    if (!groupedByDay[key]) {
      groupedByDay[key] = {
        label: task.dueDayLabel || task.schoolDueDate,
        tasks: [],
      };
    }
    groupedByDay[key].tasks.push(task);
  });

  // Sort tasks within each day strictly by priority (alta first, then media, then normal)
  Object.values(groupedByDay).forEach((group) => {
    group.tasks.sort((a, b) => {
      const pA = priorityWeight[a.priority || 'normal'] || 1;
      const pB = priorityWeight[b.priority || 'normal'] || 1;
      return pB - pA;
    });
  });

  // Sort groups chronologically
  const sortedDayKeys = Object.keys(groupedByDay).sort();

  return (
    // Outer column container with selected palette color (NOT white) (USER REQUIREMENT)
    <div className={`${paletteStyle.container} border rounded-3xl p-5 md:p-6 shadow-xs flex flex-col h-[740px] max-h-[780px] overflow-hidden transition-colors duration-300`}>
      {/* Column Header: Title on Left ('Resumen') + Materials on Top-Right (USER REQUIREMENT) */}
      <div className={`pb-4 border-b ${paletteStyle.headerBorder} shrink-0`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Resumen
            </h2>
          </div>

          {/* Botón con Mochila y relación cuantitativa (USER REQUIREMENT) */}
          <button
            onClick={onOpenMaterials}
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white hover:bg-amber-50/70 border border-slate-300 hover:border-amber-400 shadow-2xs transition-all text-left group cursor-pointer"
            title="Ver útiles y materiales escolares"
            aria-label="Ver útiles y materiales escolares"
          >
            <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
              <Backpack className="w-4 h-4 text-amber-800 stroke-[2.2]" />
            </div>
            <span className="text-xs font-black text-amber-950 tracking-tight">
              {acquiredMaterials} / {totalMaterials}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-800 group-hover:translate-x-0.5 transition-all shrink-0 ml-0.5" />
          </button>
        </div>

        {/* Priority Filter Tabs */}
        <div className={`flex items-center justify-between mt-3 pt-3 border-t ${paletteStyle.headerBorder} flex-wrap gap-2`}>
          <div className="flex items-center bg-white/95 p-1 rounded-xl gap-1 text-xs border border-slate-200 shadow-2xs">
            <button
              onClick={() => setPriorityFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                priorityFilter === 'all'
                  ? `${theme.primaryBg} text-white shadow-2xs font-bold`
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setPriorityFilter('alta')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                priorityFilter === 'alta'
                  ? 'bg-rose-600 text-white shadow-2xs font-bold'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Alta</span>
            </button>
            <button
              onClick={() => setPriorityFilter('media')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                priorityFilter === 'media'
                  ? 'bg-amber-600 text-white shadow-2xs font-bold'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Media</span>
            </button>
            <button
              onClick={() => setPriorityFilter('normal')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                priorityFilter === 'normal'
                  ? 'bg-slate-700 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>Normal</span>
            </button>
          </div>

          {selectedDateKey && (
            <button
              onClick={onClearDateFilter}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
            >
              Quitar filtro día
            </button>
          )}
        </div>
      </div>

      {/* Task List Body with vertical scroll (USER REQUIREMENT) */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1.5">
        {pendingTasks.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200/90 rounded-2xl space-y-2 shadow-2xs">
            <CheckCircle2 className={`w-10 h-10 ${theme.primaryText} mx-auto`} />
            <h3 className="text-sm font-bold text-slate-800">
              ¡Sin actividades pendientes!
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {selectedDateKey
                ? 'No hay entregas programadas para la fecha seleccionada en el calendario.'
                : 'Todas las actividades escolares se encuentran concluidas o al día.'}
            </p>
            {selectedDateKey && (
              <button
                onClick={onClearDateFilter}
                className={`mt-2 text-xs font-bold ${theme.primaryText} hover:underline cursor-pointer`}
              >
                Ver todas las fechas →
              </button>
            )}
          </div>
        ) : (
          sortedDayKeys.map((dayKey) => {
            const group = groupedByDay[dayKey];
            const isToday = dayKey === '2026-09-25';
            const isTomorrow = dayKey === '2026-09-26';

            return (
              <div key={dayKey} className="space-y-2">
                {/* Specific Delivery Day Header matching chosen palette */}
                <div className={`sticky top-0 ${paletteStyle.stickyDay} backdrop-blur-xs py-1.5 px-2 rounded-xl z-10 flex items-center justify-between border shadow-2xs`}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-xs font-bold">
                      {group.label}
                    </span>
                    {isToday && (
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-200/90 border border-amber-300 px-2 py-0.2 rounded-full">
                        Hoy
                      </span>
                    )}
                    {isTomorrow && (
                      <span className="text-[10px] font-bold text-blue-900 bg-blue-200/90 border border-blue-300 px-2 py-0.2 rounded-full">
                        Mañana
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold opacity-75">
                    {group.tasks.length} {group.tasks.length === 1 ? 'entrega' : 'entregas'}
                  </span>
                </div>

                {/* Tasks inside this specific day (Elevated white cards against palette tone) */}
                <div className="space-y-2.5">
                  {group.tasks.map((task) => {
                    const isHigh = task.priority === 'alta';
                    const isMedia = task.priority === 'media';

                    return (
                      <div
                        key={task.id}
                        onClick={() => onSelectTask(task)}
                        className={`group relative p-3.5 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-md flex items-start gap-3 ${
                          isHigh
                            ? 'border-rose-300 hover:border-rose-400 ring-1 ring-rose-200/50'
                            : isMedia
                            ? 'border-slate-200 hover:border-blue-400'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Interactive Checkbox */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleComplete(task.id);
                          }}
                          className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                            task.status === 'completed'
                              ? `${theme.primaryBg} border-transparent text-white`
                              : 'border-slate-300 bg-white hover:border-blue-600'
                          }`}
                          aria-label="Marcar como completada"
                          title="Marcar tarea como entregada"
                        >
                          {task.status === 'completed' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5 flex-wrap">
                            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                              {task.course}
                            </span>

                            {/* Priority Badge */}
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                isHigh
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : isMedia
                                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isHigh ? 'bg-rose-500' : isMedia ? 'bg-amber-500' : 'bg-slate-400'
                                }`}
                              />
                              {isHigh ? 'Prioridad Alta' : isMedia ? 'Prioridad Media' : 'Normal'}
                            </span>
                          </div>

                          <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-0.5 leading-snug">
                            {task.title}
                          </h3>

                          {/* Quick description snippet */}
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {task.instructions}
                          </p>

                          {/* Materials requirement pill or teacher change alert */}
                          {task.hasChanged && (
                            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded-xl">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>Docente modificó materiales hace poco</span>
                            </div>
                          )}

                          {task.materials && task.materials.length > 0 && (
                            <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200/60 w-fit">
                              <Package className="w-3 h-3 text-amber-600" />
                              <span>{task.materials.length} materiales requeridos</span>
                            </div>
                          )}

                          {/* Family schedule note if configured */}
                          {task.familyScheduleDate && (
                            <div className="mt-1 text-[10px] text-blue-700 font-medium">
                              📅 Horario familiar: {task.familyScheduleDate}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Completed Tasks Accordion */}
      {completedTasks.length > 0 && (
        <div className={`pt-3 border-t ${paletteStyle.headerBorder} shrink-0`}>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center justify-between w-full text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors py-1 cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tareas concluidas ({completedTasks.length})</span>
            </div>
            {showCompleted ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showCompleted && (
            <div className="mt-2 space-y-1.5 max-h-36 overflow-y-auto animate-in fade-in">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 opacity-80 hover:opacity-100 transition-all cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleComplete(task.id);
                      }}
                      className={`w-4 h-4 rounded-md ${theme.primaryBg} text-white flex items-center justify-center shrink-0 shadow-xs cursor-pointer`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </button>
                    <span className="line-through text-slate-500 font-medium truncate">
                      {task.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                    {task.course}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
