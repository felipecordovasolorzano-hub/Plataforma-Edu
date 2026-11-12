import React, { useState, useMemo } from 'react';
import { Task, MeetingRequest } from '../../types';
import { THEME_CONFIGS } from '../../utils/theme';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Filter,
  Info,
  X,
  Check,
  BookOpen,
} from 'lucide-react';

interface SchoolCalendarViewProps {
  tasks: Task[];
  meetings: MeetingRequest[];
  selectedDateKey: string | null;
  onSelectDateKey: (dateKey: string | null) => void;
  themeColor: 'blue' | 'emerald' | 'warm' | 'indigo';
}

interface CalendarDay {
  date: Date;
  dateKey: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
  meetings: MeetingRequest[];
}

export const SchoolCalendarView: React.FC<SchoolCalendarViewProps> = ({
  tasks,
  meetings,
  selectedDateKey,
  onSelectDateKey,
  themeColor,
}) => {
  const theme = THEME_CONFIGS[themeColor];

  // Base reference date is September 2026 (matching prototype mock data)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // 8 is September (0-indexed)

  // Course Filter state (USER REQUIREMENT: Filtro de curso con el clásico embudo)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isCourseFilterOpen, setIsCourseFilterOpen] = useState<boolean>(false);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Extract unique courses from tasks
  const availableCourses = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.course) set.add(t.course);
    });
    return Array.from(set).sort();
  }, [tasks]);

  // Tasks filtered by course if one is selected
  const displayedTasks = useMemo(() => {
    if (!selectedCourse) return tasks;
    return tasks.filter((t) => t.course.toLowerCase() === selectedCourse.toLowerCase());
  }, [tasks, selectedCourse]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleGoToToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(8); // September 2026
    onSelectDateKey('2026-09-25');
  };

  // Build grid days (42 cells: 6 weeks x 7 days, starting on Monday)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; 
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const days: CalendarDay[] = [];

  // Previous month trailing days
  const prevMonthLastDate = new Date(currentYear, currentMonth, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthLastDate - i;
    const dateObj = new Date(currentYear, currentMonth - 1, d);
    const dateKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({
      date: dateObj,
      dateKey,
      dayNumber: d,
      isCurrentMonth: false,
      isToday: dateKey === '2026-09-25',
      tasks: displayedTasks.filter((t) => t.dueDayKey === dateKey),
      meetings: meetings.filter((m) => m.date.includes(`${d} `)),
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(currentYear, currentMonth, d);
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({
      date: dateObj,
      dateKey,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: dateKey === '2026-09-25', // Prototype fixed simulated "Today" is 25 Sep 2026
      tasks: displayedTasks.filter((t) => t.dueDayKey === dateKey),
      meetings: meetings.filter((m) => {
        const dayStr = String(d);
        return m.date.includes(`${dayStr} `) || m.date.endsWith(` ${dayStr}`);
      }),
    });
  }

  // Next month leading days to complete the 35 or 42 grid
  const remainingCells = 35 - days.length > 0 ? 35 - days.length : 42 - days.length;
  for (let d = 1; d <= remainingCells; d++) {
    const dateObj = new Date(currentYear, currentMonth + 1, d);
    const dateKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({
      date: dateObj,
      dateKey,
      dayNumber: d,
      isCurrentMonth: false,
      isToday: dateKey === '2026-09-25',
      tasks: displayedTasks.filter((t) => t.dueDayKey === dateKey),
      meetings: meetings.filter((m) => m.date.includes(`${d} `)),
    });
  }

  const selectedDayObject = days.find((d) => d.dateKey === selectedDateKey);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-xs flex flex-col h-auto sm:h-[740px] sm:max-h-[780px] overflow-hidden">
      {/* Calendar Header Controls */}
      <div className="shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pb-2.5 sm:pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl ${theme.lightBg} border ${theme.lightBorder} flex items-center justify-center shrink-0`}>
              <CalendarIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${theme.primaryText}`} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5 sm:gap-2">
                <span>{monthNames[currentMonth]} {currentYear}</span>
                {currentMonth === 8 && currentYear === 2026 && (
                  <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    Mes en curso
                  </span>
                )}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 self-end sm:self-auto flex-wrap">
            {/* Filtro de Curso con el clásico embudo (USER REQUIREMENT) */}
            <div className="relative">
              <button
                onClick={() => setIsCourseFilterOpen(!isCourseFilterOpen)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer shadow-2xs ${
                  selectedCourse
                    ? `${theme.primaryBg} text-white border-transparent shadow-xs`
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title="Filtrar actividades del calendario por curso"
                aria-label="Filtrar por curso"
              >
                <Filter className={`w-3.5 h-3.5 stroke-[2.2] shrink-0 ${selectedCourse ? 'text-white' : 'text-slate-600'}`} />
                <span className="max-w-[110px] sm:max-w-[130px] truncate">
                  {selectedCourse || 'Curso'}
                </span>
                <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform shrink-0 ${isCourseFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Menú Desplegable de Cursos con icono de embudo clásico */}
              {isCourseFilterOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsCourseFilterOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95 space-y-0.5">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Filter className="w-3 h-3 text-slate-500" />
                        Filtrar por curso
                      </span>
                      {selectedCourse && (
                        <button
                          onClick={() => {
                            setSelectedCourse(null);
                            setIsCourseFilterOpen(false);
                          }}
                          className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline font-bold cursor-pointer"
                        >
                          Limpiar
                        </button>
                      )}
                    </div>

                    {/* Opción Todos los Cursos */}
                    <button
                      onClick={() => {
                        setSelectedCourse(null);
                        setIsCourseFilterOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                        selectedCourse === null
                          ? 'bg-blue-50 text-blue-800 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                        <span>Todos los cursos</span>
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full">
                        {tasks.length}
                      </span>
                    </button>

                    {/* Lista de cursos dinámicos */}
                    <div className="max-h-52 overflow-y-auto space-y-0.5 pt-0.5">
                      {availableCourses.map((course) => {
                        const count = tasks.filter((t) => t.course.toLowerCase() === course.toLowerCase()).length;
                        const isCurrent = selectedCourse?.toLowerCase() === course.toLowerCase();

                        return (
                          <button
                            key={course}
                            onClick={() => {
                              setSelectedCourse(course);
                              setIsCourseFilterOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                              isCurrent
                                ? 'bg-blue-50 text-blue-800 font-bold'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span className="truncate pr-2">{course}</span>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full shrink-0">
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleGoToToday}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                selectedDateKey === '2026-09-25'
                  ? `${theme.primaryBg} text-white border-transparent shadow-xs`
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Hoy (25)
            </button>

            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200/80">
              <button
                onClick={handlePrevMonth}
                className="p-1 sm:p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
                title="Mes anterior"
                aria-label="Mes anterior"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 sm:p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
                title="Mes siguiente"
                aria-label="Mes siguiente"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Selected Date or Course Filter Banner if active (with classic funnel icon) */}
        {(selectedDateKey || selectedCourse) && (
          <div className="mt-3 flex items-center justify-between px-3.5 py-2 rounded-xl bg-blue-50/90 border border-blue-200/90 text-xs text-blue-950 font-medium animate-in fade-in flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-3.5 h-3.5 text-blue-600 shrink-0 stroke-[2.2]" />
              <span className="font-semibold text-slate-600">Filtro:</span>
              {selectedCourse && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-blue-600 text-white font-bold text-[11px] shadow-2xs">
                  <span>Curso: {selectedCourse}</span>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="hover:text-blue-100 cursor-pointer"
                    title="Quitar filtro de curso"
                  >
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </span>
              )}
              {selectedDateKey && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white text-blue-900 font-bold border border-blue-200 text-[11px] shadow-2xs">
                  <span>Día: {selectedDayObject?.dayNumber} de {monthNames[currentMonth]}</span>
                  <button
                    onClick={() => onSelectDateKey(null)}
                    className="hover:text-blue-600 cursor-pointer"
                    title="Quitar filtro de día"
                  >
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </span>
              )}
              <span className="text-[11px] text-slate-500">
                ({displayedTasks.length} {displayedTasks.length === 1 ? 'actividad' : 'actividades'})
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedCourse(null);
                onSelectDateKey(null);
              }}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer ml-auto"
            >
              Restablecer todo
            </button>
          </div>
        )}

        {/* Leyenda Encima del Calendario (Horizontal Bar - USER REQUIREMENT) */}
        <div className="mt-2.5 sm:mt-3.5 pt-2 sm:pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2.5">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[10px] sm:text-xs">
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-0.5 sm:mr-1">
              <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Leyenda:</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-600 shrink-0 shadow-2xs" />
              <span className="font-semibold text-slate-700">
                Tarea
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-500 shrink-0 shadow-2xs" />
              <span className="font-semibold text-slate-700">
                Útil
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-rose-500 shrink-0 shadow-2xs" />
              <span className="font-semibold text-slate-700">
                Evaluación
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 shrink-0 shadow-2xs" />
              <span className="font-semibold text-slate-700">
                Cita
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid: Days of Week + 7-column Calendar Cells (Compact on mobile phones) */}
        <div className="mt-2 sm:mt-3 w-full flex-1 flex flex-col min-h-0">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 text-center shrink-0">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dName, i) => (
              <div
                key={dName}
                className={`py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${
                  i >= 5 ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {dName}
              </div>
            ))}
          </div>

          {/* Calendar Grid: Day Cells (Smaller on phones, standard on desktop) */}
          <div className="flex-1 grid grid-cols-7 gap-1 sm:gap-1.5 mt-1 overflow-y-auto content-stretch pr-0.5">
            {days.map((dayItem) => {
              const isSelected = selectedDateKey === dayItem.dateKey;

              return (
                <button
                  key={dayItem.dateKey}
                  onClick={() => {
                    if (isSelected) {
                      onSelectDateKey(null); // toggle off
                    } else {
                      onSelectDateKey(dayItem.dateKey);
                    }
                  }}
                  className={`h-full min-h-[38px] sm:min-h-[74px] p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border text-left flex flex-col justify-between transition-all relative group cursor-pointer ${
                    !dayItem.isCurrentMonth
                      ? 'opacity-35 bg-slate-50/50 border-slate-100 hover:opacity-75'
                      : isSelected
                      ? 'ring-2 ring-blue-600 bg-blue-50/50 border-blue-300 shadow-sm'
                      : dayItem.isToday
                      ? 'bg-amber-50/40 border-amber-200/90 shadow-2xs hover:border-amber-300'
                      : 'bg-white border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  {/* Header of cell: Number and 'Hoy' pill */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                        isSelected
                          ? `${theme.primaryBg} text-white`
                          : dayItem.isToday
                          ? 'bg-amber-500 text-white font-extrabold shadow-2xs'
                          : dayItem.isCurrentMonth
                          ? 'text-slate-800 group-hover:text-blue-600'
                          : 'text-slate-400'
                      }`}
                    >
                      {dayItem.dayNumber}
                    </span>

                    {dayItem.isToday && (
                      <span className="hidden sm:inline-block text-[8px] font-bold text-amber-700 bg-amber-100/80 px-1 py-0.2 rounded-md uppercase">
                        Hoy
                      </span>
                    )}
                  </div>

                  {/* Mobile Compact Dots Indicator (< sm) */}
                  <div className="flex sm:hidden items-center justify-center gap-0.5 mt-0.5 flex-wrap h-2">
                    {dayItem.tasks.slice(0, 3).map((task) => {
                      const isMaterial = task.type === 'material';
                      const isEval = task.type === 'evaluacion';
                      return (
                        <span
                          key={task.id}
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isEval ? 'bg-rose-500' : isMaterial ? 'bg-amber-500' : 'bg-blue-600'
                          }`}
                        />
                      );
                    })}
                    {!selectedCourse && dayItem.meetings.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    )}
                    {dayItem.tasks.length > 3 && (
                      <span className="text-[7px] font-black text-slate-500 leading-none">
                        +
                      </span>
                    )}
                  </div>

                  {/* Desktop Full Pills (sm and up) */}
                  <div className="hidden sm:block space-y-1 mt-1 w-full">
                    {dayItem.tasks.map((task) => {
                      const isMaterial = task.type === 'material';
                      const isEval = task.type === 'evaluacion';
                      return (
                        <div
                          key={task.id}
                          className={`text-[9px] font-semibold px-1 py-0.2 rounded-md truncate transition-all flex items-center gap-1 ${
                            isEval
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : isMaterial
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                          title={`${task.course}: ${task.title}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isEval ? 'bg-rose-500' : isMaterial ? 'bg-amber-500' : 'bg-blue-600'
                            }`}
                          />
                          <span className="truncate">{task.course}</span>
                        </div>
                      );
                    })}

                    {!selectedCourse && dayItem.meetings.map((m) => (
                      <div
                        key={m.id}
                        className="text-[9px] font-semibold px-1 py-0.2 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 truncate flex items-center gap-1"
                        title={`Cita: ${m.teacherName}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                        <span className="truncate">Cita: {m.teacherName.split(' ')[1]}</span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
