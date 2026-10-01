import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import { THEME_CONFIGS } from '../../utils/theme';
import {
  Check,
  Calendar,
  Sparkles,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

interface ParentTasksViewProps {
  onSelectTask: (task: Task) => void;
  onOrganizeTask: (task: Task) => void;
}

export const ParentTasksView: React.FC<ParentTasksViewProps> = ({
  onSelectTask,
  onOrganizeTask,
}) => {
  const { activeChildTasks, toggleTaskComplete, activeChild, themeColor, showToast } = useApp();
  const theme = THEME_CONFIGS[themeColor];

  const [timeFilter, setTimeFilter] = useState<'hoy' | 'semana'>('hoy');
  const [viewMode, setViewMode] = useState<'lista' | 'agenda'>('lista');
  const [showCompleted, setShowCompleted] = useState<boolean>(false);

  // Compact AI search / organizer state
  const [aiQuery, setAiQuery] = useState<string>('');
  const [isAiFocused, setIsAiFocused] = useState<boolean>(false);
  const [aiFilteredNotice, setAiFilteredNotice] = useState<string | null>(null);

  // Filter tasks
  const pendingTasks = activeChildTasks.filter((t) => t.status !== 'completed');
  const completedTasks = activeChildTasks.filter((t) => t.status === 'completed');

  // Time filter logic
  const filteredPending = pendingTasks.filter((task) => {
    if (aiFilteredNotice) {
      if (aiFilteredNotice.includes('mañana')) {
        return task.schoolDueDate.includes('Mañana');
      }
      if (aiFilteredNotice.includes('Matemática')) {
        return task.course.includes('Matemática');
      }
      if (aiFilteredNotice.includes('Materiales')) {
        return task.type === 'material' || (task.materials && task.materials.length > 0);
      }
    }

    if (timeFilter === 'hoy') {
      return (
        task.schoolDueDate.includes('Hoy') ||
        task.schoolDueDate.includes('Mañana, 8:00 a. m.') ||
        task.schoolDueDate.includes('Mañana, 6:00 p. m.') ||
        task.familyScheduleDate?.includes('Hoy')
      );
    }
    return true; // Semana: show all
  });

  const handleAiSuggestion = (suggestionText: string) => {
    setAiQuery(suggestionText);
    setIsAiFocused(false);
    if (suggestionText.includes('mañana')) {
      setTimeFilter('semana');
      setAiFilteredNotice('Filtrado por: Entregas y materiales de mañana');
      showToast('Mostrando entregas y materiales para mañana', 'neutral');
    } else if (suggestionText.includes('Matemática')) {
      setTimeFilter('semana');
      setAiFilteredNotice('Filtrado por: Actividades de Matemática');
      showToast('Mostrando actividades de Matemática', 'neutral');
    } else if (suggestionText.includes('Materiales')) {
      setTimeFilter('semana');
      setAiFilteredNotice('Filtrado por: Materiales requeridos');
      showToast('Mostrando materiales requeridos en la semana', 'neutral');
    }
  };

  const handleClearAiFilter = () => {
    setAiQuery('');
    setAiFilteredNotice(null);
  };

  return (
    <div className="space-y-5">
      {/* Top Header Row & Counters */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <span>{activeChild.name}</span>
            <span>·</span>
            <span>{activeChild.grade} ({activeChild.section})</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5 tracking-tight">
            Tareas y Agenda Unificada
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Sincroniza la fecha oficial fijada por la docente con el momento exacto en el que planifican estudiar en casa.
          </p>
        </div>

        {/* Temporal & View Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Temporal Segmented Control: Hoy | Semana */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200/80 shadow-2xs">
            <button
              onClick={() => {
                setTimeFilter('hoy');
                setAiFilteredNotice(null);
              }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                timeFilter === 'hoy' && !aiFilteredNotice
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => {
                setTimeFilter('semana');
                setAiFilteredNotice(null);
              }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                timeFilter === 'semana' && !aiFilteredNotice
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semana
            </button>
          </div>

          {/* View Segmented Control: Lista | Agenda */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200/80 shadow-2xs">
            <button
              onClick={() => setViewMode('lista')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                viewMode === 'lista'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                viewMode === 'agenda'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Agenda
            </button>
          </div>
        </div>
      </div>

      {/* Compact AI Smart Filter Input */}
      <div className="relative">
        <div className="flex items-center gap-3 p-3 bg-white border border-slate-200/90 rounded-2xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs">
          <Sparkles className={`w-4 h-4 ${theme.primaryText} shrink-0 ml-1`} />
          <input
            type="text"
            placeholder="¿Qué necesitas consultar u organizar? (ej. qué hay para mañana, tareas de Matemática...)"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onFocus={() => setIsAiFocused(true)}
            className="w-full text-xs text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none font-medium"
          />
          {aiFilteredNotice && (
            <button
              onClick={handleClearAiFilter}
              className={`text-xs font-bold ${theme.primaryText} hover:underline shrink-0 mr-1`}
            >
              Restablecer
            </button>
          )}
        </div>

        {/* Suggested AI Prompts Dropdown */}
        {isAiFocused && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl p-2.5 z-30 animate-in fade-in zoom-in-95">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 block">
              Consultas inteligentes para {activeChild.name.split(' ')[0]}:
            </span>
            <div className="space-y-1 mt-1">
              <button
                onMouseDown={() => handleAiSuggestion('¿Qué hay para mañana?')}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-between"
              >
                <span>¿Qué entregas hay para mañana?</span>
                <span className="text-[11px] text-slate-400 font-normal">Ciencia y Matemática</span>
              </button>
              <button
                onMouseDown={() => handleAiSuggestion('Explícame la de Matemática')}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-between"
              >
                <span>Actividades de Matemática</span>
                <span className="text-[11px] text-slate-400 font-normal">Fracciones equivalentes</span>
              </button>
              <button
                onMouseDown={() => handleAiSuggestion('Materiales que faltan comprar')}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-between"
              >
                <span>Materiales requeridos en la semana</span>
                <span className="text-[11px] text-slate-400 font-normal">Cartulina, témpera, pincel</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Filter Notice if present */}
      {aiFilteredNotice && (
        <div className="flex items-center justify-between px-4 py-2 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 font-medium">
          <span>{aiFilteredNotice}</span>
          <button
            onClick={handleClearAiFilter}
            className="font-bold underline hover:text-blue-800"
          >
            Ver todo
          </button>
        </div>
      )}

      {/* CONTENT: VIEW LISTA */}
      {viewMode === 'lista' && (
        <div className="space-y-3">
          {filteredPending.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-2">
              <CheckCircle2 className={`w-8 h-8 ${theme.primaryText} mx-auto`} />
              <h3 className="text-sm font-bold text-slate-800">
                ¡Todo al día en esta vista!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No hay actividades pendientes en el periodo seleccionado.
              </p>
              {timeFilter === 'hoy' && (
                <button
                  onClick={() => setTimeFilter('semana')}
                  className={`mt-2 text-xs font-bold ${theme.primaryText} hover:underline`}
                >
                  Ver tareas de toda la semana →
                </button>
              )}
            </div>
          ) : (
            filteredPending.map((task) => (
              <div
                key={task.id}
                className="group relative flex items-start gap-4 p-4 bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl transition-all cursor-pointer shadow-xs"
                onClick={() => onSelectTask(task)}
              >
                {/* Fast Checkbox to mark complete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTaskComplete(task.id);
                  }}
                  className="mt-0.5 w-5 h-5 rounded-lg border border-slate-300 hover:border-blue-600 bg-white flex items-center justify-center shrink-0 transition-colors"
                  aria-label="Marcar como completada"
                >
                  {task.status === 'completed' && <Check className={`w-3.5 h-3.5 ${theme.primaryText}`} />}
                </button>

                {/* Card Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {task.title}
                    </h3>

                    {/* Status Indicators */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {task.hasChanged && (
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Modificado
                        </span>
                      )}
                      {task.isNew && !task.hasChanged && (
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                          Nueva
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metadata with dot separator */}
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                    <span className="font-semibold text-slate-700">{task.course}</span>
                    <span>·</span>
                    <span>Docente: {task.teacherName}</span>
                    <span>·</span>
                    <span className="text-slate-800">Límite oficial: <strong>{task.schoolDueDate}</strong></span>
                  </div>

                  {/* If organized for family time, show quiet indicator */}
                  {task.familyScheduleDate && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200/60 w-fit">
                      <Calendar className={`w-3.5 h-3.5 ${theme.primaryText}`} />
                      <span>Estudiar en casa: <strong>{task.familyScheduleDate}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* CONTENT: VIEW AGENDA */}
      {viewMode === 'agenda' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 leading-relaxed font-medium">
            💡 <strong>Gestión de los 3 Relojes:</strong> Las fechas de entrega escolar son fijas de la institución. En EduSense puedes planificar el horario familiar específico para realizar la tarea en casa sin modificar el límite escolar.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Hoy */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900">Hoy (Jueves)</span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  En casa
                </span>
              </div>
              <div className="space-y-2.5">
                {filteredPending
                  .filter((t) => t.familyScheduleDate?.includes('Hoy') || t.schoolDueDate.includes('Hoy'))
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onSelectTask(task)}
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200/70 cursor-pointer transition-colors space-y-1.5"
                    >
                      <span className="font-bold text-xs text-slate-900 block truncate">{task.title}</span>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{task.course}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOrganizeTask(task);
                          }}
                          className={`font-bold ${theme.primaryText} hover:underline`}
                        >
                          Ajustar hora
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 2: Mañana */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900">Mañana (Viernes)</span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Entregas
                </span>
              </div>
              <div className="space-y-2.5">
                {filteredPending
                  .filter((t) => t.schoolDueDate.includes('Mañana'))
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onSelectTask(task)}
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200/70 cursor-pointer transition-colors space-y-1.5"
                    >
                      <span className="font-bold text-xs text-slate-900 block truncate">{task.title}</span>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{task.course}</span>
                        <span className="font-semibold text-slate-800">{task.schoolDueDate}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 3: Próxima semana */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900">Próxima semana</span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Evaluaciones
                </span>
              </div>
              <div className="space-y-2.5">
                {filteredPending
                  .filter((t) => !t.schoolDueDate.includes('Hoy') && !t.schoolDueDate.includes('Mañana'))
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onSelectTask(task)}
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200/70 cursor-pointer transition-colors space-y-1.5"
                    >
                      <span className="font-bold text-xs text-slate-900 block truncate">{task.title}</span>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{task.course}</span>
                        <span className="font-semibold text-slate-800">{task.schoolDueDate}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completed Items Drawer / Accordion */}
      {completedTasks.length > 0 && (
        <div className="pt-2 border-t border-slate-200">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center justify-between w-full py-2.5 px-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <span>Tareas concluidas ({completedTasks.length})</span>
            {showCompleted ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showCompleted && (
            <div className="mt-2 space-y-2 animate-in fade-in">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-2xl opacity-80 hover:opacity-100 transition-all cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-3 truncate pr-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskComplete(task.id);
                      }}
                      className={`w-5 h-5 rounded-lg ${theme.primaryBg} text-white flex items-center justify-center shrink-0 shadow-xs`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                    <span className="line-through text-slate-500 font-medium truncate">{task.title}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 shrink-0">{task.course}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
