import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, ChildId } from '../../types';
import { SchoolCalendarView } from './SchoolCalendarView';
import { TaskListColumn } from './TaskListColumn';
import { EduFloatingAssistant, CurrentWindowContext } from './EduFloatingAssistant';
import { ParentMeetingsView } from './ParentMeetingsView';
import { ParentMaterialsView } from './ParentMaterialsView';
import { ParentNotificationsView } from './ParentNotificationsView';
import { ParentHomeView } from './ParentHomeView';
import { TaskDetailModal } from './TaskDetailModal';
import { OrganizeScheduleSheet } from './OrganizeScheduleSheet';
import { GradesModal } from './GradesModal';
import { THEME_CONFIGS } from '../../utils/theme';
import {
  ChevronDown,
  Bell,
  Menu,
  Calendar,
  Package,
  Sparkles,
  X,
  Check,
  Backpack,
  LogOut,
} from 'lucide-react';

interface ChildPerformanceData {
  childId: ChildId;
  gpa: string;
  performanceLabel: string;
  tasksOnTrack: string;
  attendanceRate: string;
  statusColor: string;
}

const CHILDREN_PERFORMANCE: Record<ChildId, ChildPerformanceData> = {
  mateo: {
    childId: 'mateo',
    gpa: '17.8',
    performanceLabel: 'Destacado',
    tasksOnTrack: '88% al día',
    attendanceRate: '98% puntual',
    statusColor: 'text-blue-700 bg-blue-50 border-blue-200',
  },
  lucia: {
    childId: 'lucia',
    gpa: '18.4',
    performanceLabel: 'Sobresaliente',
    tasksOnTrack: '96% al día',
    attendanceRate: '100% puntual',
    statusColor: 'text-purple-700 bg-purple-50 border-purple-200',
  },
};

type CenteredModalView = 'meetings' | 'materials' | 'alerts' | 'overview' | null;

export const ParentView: React.FC = () => {
  const {
    childrenList,
    activeChildId,
    setActiveChildId,
    activeChild,
    activeChildTasks,
    toggleTaskComplete,
    unreadNotificationsCount,
    selectedTaskForDetail,
    setSelectedTaskForDetail,
    organizingTask,
    setOrganizingTask,
    meetingRequests,
    themeColor,
    setThemeColor,
    showToast,
    logout,
  } = useApp();

  const theme = THEME_CONFIGS[themeColor];

  // Calendar filter state
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  // Simplified 3-bars dropdown menu state
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState<boolean>(false);

  // Centered Modal Window in the middle of the screen (USER REQUIREMENT)
  const [activeModalView, setActiveModalView] = useState<CenteredModalView>(null);

  // Grades modal by course state (USER REQUIREMENT)
  const [isGradesModalOpen, setIsGradesModalOpen] = useState<boolean>(false);

  // Child selector dropdown state
  const [isChildSelectorOpen, setIsChildSelectorOpen] = useState<boolean>(false);

  const handleSwitchChild = (childId: ChildId) => {
    setActiveChildId(childId);
    setIsChildSelectorOpen(false);
    setSelectedDateKey(null);
    const selected = childrenList.find((c) => c.id === childId);
    showToast(`Mostrando información escolar de ${selected?.name}`, 'neutral');
  };

  const childMeetingsCount = meetingRequests.filter((m) => m.childId === activeChild.id).length;

  // Active window context for EDU (Dynamic AI Assistant)
  const currentContext: CurrentWindowContext = activeModalView || 'calendar_tasks';

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 relative pb-16">
      {/* Top Header:
          - Left: Child Profile + Switcher
          - Right: Resumen Rápido del Rendimiento de Cada Hijo + Botón Notificaciones + Menú 3 Rayas */}
      <header className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Child Profile with Reactive Switcher */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={activeChild.avatarImg}
              alt={activeChild.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200/80 shadow-xs"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">{activeChild.schoolName}</span>
              <span className="text-xs text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">
                {activeChild.grade} ({activeChild.section})
              </span>
            </div>

            <div className="relative mt-0.5">
              <button
                onClick={() => setIsChildSelectorOpen(!isChildSelectorOpen)}
                className="flex items-center gap-2 text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors group cursor-pointer"
                aria-label="Cambiar perfil de estudiante"
              >
                <span>{activeChild.name}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform" />
              </button>

              {/* Reactive Switcher Dropdown */}
              {isChildSelectorOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5 block">
                    Alternar estudiante de la familia:
                  </span>
                  {childrenList.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => handleSwitchChild(child.id)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        child.id === activeChildId
                          ? `${theme.lightBg} border ${theme.lightBorder} ${theme.primaryText}`
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <img
                        src={child.avatarImg}
                        alt={child.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <p className="text-xs font-bold leading-tight text-slate-900">{child.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {child.grade} · {child.section}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-0.5">
              Tutora: <span className="font-semibold text-slate-700">{activeChild.teacherName}</span>
            </p>
          </div>
        </div>

        {/* Right Section: Rendimiento de cada hijo + Botón Notificaciones + Menú Desplegable 3 Rayas */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Indicadores Académicos del Hijo Activo (Exclusivo e independiente, sin la palabra rendimiento) */}
          {(() => {
            const activePerf = CHILDREN_PERFORMANCE[activeChildId] || CHILDREN_PERFORMANCE['mateo'];
            return (
              <div className="flex items-center gap-2.5 bg-slate-50/90 px-3 py-1.5 rounded-2xl border border-slate-200/80 text-xs">
                {/* Botón de Promedio para ver notas por curso en ventana centrada (USER REQUIREMENT) */}
                <button
                  onClick={() => setIsGradesModalOpen(true)}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all cursor-pointer group"
                  title="Hacer clic para ver las notas por curso en el centro"
                  aria-label="Ver calificaciones por curso"
                >
                  <span className="text-[11px] font-bold text-slate-500 group-hover:text-blue-700 transition-colors">
                    Promedio:
                  </span>
                  <span className="text-xs font-black text-blue-700 bg-blue-100 group-hover:bg-blue-200 border border-blue-200 group-hover:border-blue-300 px-2 py-0.5 rounded-lg transition-all shadow-2xs">
                    {activePerf.gpa} / 20
                  </span>
                </button>
                <span className="text-slate-300">·</span>
                <span className="font-semibold text-slate-700">{activePerf.tasksOnTrack}</span>
                <span className="text-slate-300">·</span>
                <span className="font-semibold text-emerald-700">{activePerf.attendanceRate}</span>
              </div>
            );
          })()}

          {/* Botón de Notificaciones: solo la campana (USER REQUIREMENT) */}
          <button
            onClick={() => setActiveModalView('alerts')}
            className="relative p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-blue-600 transition-all shadow-2xs cursor-pointer flex items-center justify-center group"
            title="Ver notificaciones y alertas escolares"
            aria-label="Ver alertas escolares"
          >
            <div className="relative flex items-center justify-center">
              <Bell className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white shadow-xs">
                  {unreadNotificationsCount}
                </span>
              )}
            </div>
          </button>

          {/* Menú Tres Rayas con Desplegable Simplificado (USER REQUIREMENT) */}
          <div className="relative">
            <button
              onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
              className={`p-2.5 rounded-xl ${theme.primaryBg} text-white hover:opacity-90 shadow-xs transition-all cursor-pointer flex items-center justify-center`}
              title="Menú simplificado"
              aria-label="Abrir menú simplificado"
            >
              <Menu className="w-5 h-5 stroke-[2.2]" />
            </button>

            {/* Menú Desplegable Simplificado al hacer clic en las 3 rayas */}
            {isMenuDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuDropdownOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-slate-200/90 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5 block">
                    Servicios Escolares:
                  </span>

                  {/* Botón Citas con Docentes */}
                  <button
                    onClick={() => {
                      setActiveModalView('meetings');
                      setIsMenuDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-800 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          Citas con Docentes
                        </p>
                        <p className="text-[10px] text-slate-400 font-normal">Agendar y consultar reuniones</p>
                      </div>
                    </div>
                    {childMeetingsCount > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {childMeetingsCount}
                      </span>
                    )}
                  </button>

                  {/* Botón Materiales y Útiles */}
                  <button
                    onClick={() => {
                      setActiveModalView('materials');
                      setIsMenuDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-800 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Backpack className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                          Materiales y Útiles
                        </p>
                        <p className="text-[10px] text-slate-400 font-normal">Checklist de compras semanal</p>
                      </div>
                    </div>
                  </button>

                  {/* Botón Alertas y Asistencia */}
                  <button
                    onClick={() => {
                      setActiveModalView('alerts');
                      setIsMenuDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-800 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                          Alertas y Asistencia
                        </p>
                        <p className="text-[10px] text-slate-400 font-normal">Sensor torniquete y cambios</p>
                      </div>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>

                  {/* Botón Rutinas y Resumen */}
                  <button
                    onClick={() => {
                      setActiveModalView('overview');
                      setIsMenuDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-800 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          Rutinas y Resumen
                        </p>
                        <p className="text-[10px] text-slate-400 font-normal">Hábitos de estudio e insignias</p>
                      </div>
                    </div>
                  </button>

                  {/* Selector de Paleta de Color (Para personalizar el color de la columna y la interfaz) */}
                  <div className="pt-2.5 mt-2 border-t border-slate-100 px-1 pb-1">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Paleta de Color:
                      </span>
                      <span className="text-[10px] font-bold text-slate-700 capitalize bg-slate-100 px-1.5 py-0.2 rounded-md">
                        {themeColor === 'blue' ? 'Azul' : themeColor === 'emerald' ? 'Verde' : themeColor === 'warm' ? 'Cálido' : 'Índigo'}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { key: 'blue', label: 'Azul', bg: 'bg-blue-600', ring: 'ring-blue-600' },
                        { key: 'emerald', label: 'Verde', bg: 'bg-emerald-600', ring: 'ring-emerald-600' },
                        { key: 'warm', label: 'Cálido', bg: 'bg-amber-600', ring: 'ring-amber-600' },
                        { key: 'indigo', label: 'Índigo', bg: 'bg-indigo-600', ring: 'ring-indigo-600' },
                      ].map((pal) => (
                        <button
                          key={pal.key}
                          onClick={() => {
                            setThemeColor(pal.key as any);
                            showToast(`Paleta cambiada a ${pal.label}`, 'neutral');
                          }}
                          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl border transition-all cursor-pointer ${
                            themeColor === pal.key
                              ? 'bg-slate-100 border-slate-300 font-bold shadow-2xs'
                              : 'hover:bg-slate-50 border-transparent text-slate-500'
                          }`}
                          title={`Cambiar a paleta ${pal.label}`}
                        >
                          <span className={`w-4 h-4 rounded-full ${pal.bg} shadow-xs ${themeColor === pal.key ? 'ring-2 ring-offset-1 ' + pal.ring : ''}`} />
                          <span className="text-[10px] leading-tight">{pal.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cerrar Sesión button in 3-bars menu */}
                  <div className="pt-2 mt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setIsMenuDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-rose-50 transition-colors text-xs font-semibold text-rose-700 group cursor-pointer"
                      title="Cerrar sesión y volver al portal de ingreso"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <LogOut className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-bold text-rose-900 leading-tight">Cerrar Sesión</p>
                          <p className="text-[10px] text-rose-500 font-normal">Volver a la pantalla de login</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Core Architecture:
          - Left: El calendario tal cual está (con la leyenda a la izquierda)
          - Right: La lista de tareas según prioridad y fechas (en tono complementario al blanco) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Calendario Interactivo Principal tal cual está con leyenda a la izquierda */}
        <div className="lg:col-span-7 xl:col-span-7">
          <SchoolCalendarView
            tasks={activeChildTasks}
            meetings={meetingRequests.filter((m) => m.childId === activeChild.id)}
            selectedDateKey={selectedDateKey}
            onSelectDateKey={setSelectedDateKey}
            themeColor={themeColor}
          />
        </div>

        {/* Right Column: Lista de tareas según fecha de entrega y prioridad (Tono complementario) */}
        <div className="lg:col-span-5 xl:col-span-5">
          <TaskListColumn
            tasks={activeChildTasks}
            selectedDateKey={selectedDateKey}
            onClearDateFilter={() => setSelectedDateKey(null)}
            onSelectTask={(task) => setSelectedTaskForDetail(task)}
            onToggleComplete={toggleTaskComplete}
            themeColor={themeColor}
            onOpenMaterials={() => setActiveModalView('materials')}
          />
        </div>
      </div>

      {/* Personaje IA Flotante EDU en la derecha inferior */}
      <EduFloatingAssistant
        currentWindow={currentContext}
        selectedDateKey={selectedDateKey}
        onOpenMeetings={() => setActiveModalView('meetings')}
        onOpenMaterials={() => setActiveModalView('materials')}
        onOpenAlerts={() => setActiveModalView('alerts')}
        onSelectTask={(task) => setSelectedTaskForDetail(task)}
      />

      {/* Ventana en Medio para Citas, Materiales, Alertas y Rutinas (USER REQUIREMENT) */}
      {activeModalView && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setActiveModalView(null)}
        >
          <div
            className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Encabezado de la Ventana en Medio */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${theme.lightBg} border ${theme.lightBorder} flex items-center justify-center`}>
                  {activeModalView === 'meetings' && <Calendar className={`w-5 h-5 ${theme.primaryText}`} />}
                  {activeModalView === 'materials' && <Package className="w-5 h-5 text-amber-600" />}
                  {activeModalView === 'alerts' && <Bell className="w-5 h-5 text-rose-600" />}
                  {activeModalView === 'overview' && <Sparkles className="w-5 h-5 text-emerald-600" />}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {activeModalView === 'meetings' && 'Citas y Reuniones con Docentes'}
                    {activeModalView === 'materials' && 'Materiales y Útiles Escolares'}
                    {activeModalView === 'alerts' && 'Alertas Escolares y Asistencia RFID'}
                    {activeModalView === 'overview' && 'Rutinas, Resumen y Desempeño'}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Estudiante: <span className="font-semibold text-slate-700">{activeChild.name}</span> ({activeChild.grade})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalView(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                title="Cerrar ventana"
                aria-label="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cuerpo de la Ventana en Medio */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/40">
              {activeModalView === 'meetings' && <ParentMeetingsView />}
              {activeModalView === 'materials' && (
                <ParentMaterialsView
                  onSelectTask={(task) => {
                    setActiveModalView(null);
                    setSelectedTaskForDetail(task);
                  }}
                />
              )}
              {activeModalView === 'alerts' && (
                <ParentNotificationsView
                  onSelectTask={(task) => {
                    setActiveModalView(null);
                    setSelectedTaskForDetail(task);
                  }}
                />
              )}
              {activeModalView === 'overview' && (
                <ParentHomeView
                  onNavigateToTasks={() => setActiveModalView(null)}
                  onSelectTask={(task) => {
                    setActiveModalView(null);
                    setSelectedTaskForDetail(task);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTaskForDetail && (
        <TaskDetailModal
          task={selectedTaskForDetail}
          onClose={() => setSelectedTaskForDetail(null)}
          onOpenSchedule={() => {
            setOrganizingTask(selectedTaskForDetail);
            setSelectedTaskForDetail(null);
          }}
        />
      )}

      {/* Organize Family Schedule Sheet */}
      {organizingTask && (
        <OrganizeScheduleSheet
          task={organizingTask}
          onClose={() => setOrganizingTask(null)}
        />
      )}

      {/* Grades by Course Centered Modal (USER REQUIREMENT) */}
      <GradesModal
        isOpen={isGradesModalOpen}
        onClose={() => setIsGradesModalOpen(false)}
        child={activeChild}
        themeColor={themeColor}
      />
    </div>
  );
};
