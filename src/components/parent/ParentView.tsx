import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, ChildId } from '../../types';
import { ParentTasksView } from './ParentTasksView';
import { ParentHomeView } from './ParentHomeView';
import { ParentMaterialsView } from './ParentMaterialsView';
import { ParentNotificationsView } from './ParentNotificationsView';
import { ParentMeetingsView } from './ParentMeetingsView';
import { TaskDetailModal } from './TaskDetailModal';
import { OrganizeScheduleSheet } from './OrganizeScheduleSheet';
import { THEME_CONFIGS } from '../../utils/theme';
import {
  CheckSquare,
  Calendar,
  Package,
  Bell,
  Home,
  ChevronDown,
  MessageCircle,
  Radio,
  ExternalLink,
  ShieldCheck,
  Palette,
  Check,
} from 'lucide-react';

export const ParentView: React.FC = () => {
  const {
    childrenList,
    activeChildId,
    setActiveChildId,
    activeChild,
    activeChildTasks,
    unreadNotificationsCount,
    selectedTaskForDetail,
    setSelectedTaskForDetail,
    organizingTask,
    setOrganizingTask,
    meetingRequests,
    whatsAppMessages,
    setIsWhatsAppDrawerOpen,
    themeColor,
    setThemeColor,
    showToast,
  } = useApp();

  const theme = THEME_CONFIGS[themeColor];

  // Primary navigation tabs
  const [activeTab, setActiveTab] = useState<'tasks' | 'meetings' | 'materials' | 'alerts' | 'overview'>('tasks');
  const [isChildSelectorOpen, setIsChildSelectorOpen] = useState<boolean>(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState<boolean>(false);

  const handleSwitchChild = (childId: ChildId) => {
    setActiveChildId(childId);
    setIsChildSelectorOpen(false);
    const selected = childrenList.find((c) => c.id === childId);
    showToast(`Mostrando información escolar de ${selected?.name}`, 'neutral');
  };

  const pendingTasksCount = activeChildTasks.filter((t) => t.status !== 'completed').length;
  const childMeetingsCount = meetingRequests.filter((m) => m.childId === activeChild.id).length;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Profile & Global Navigation Header (High-Fidelity) */}
      <header className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              <span className="text-xs text-slate-500 font-medium">{activeChild.grade} ({activeChild.section})</span>
            </div>

            <div className="relative mt-0.5">
              <button
                onClick={() => setIsChildSelectorOpen(!isChildSelectorOpen)}
                className="flex items-center gap-2 text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors group"
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
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
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
                        <p className="text-[11px] text-slate-500">{child.grade} · {child.section}</p>
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

        {/* Action controls & Theme Customization */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Minimal Theme Customization Dropdown (USER REQUIREMENT) */}
          <div className="relative">
            <button
              onClick={() => setIsThemePickerOpen(!isThemePickerOpen)}
              className="flex items-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition-colors"
              title="Personalizar color de interfaz"
            >
              <Palette className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Tema:</span>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.hex }} />
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isThemePickerOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 block">
                  Paleta armónica EduSense:
                </span>
                {(Object.keys(THEME_CONFIGS) as Array<keyof typeof THEME_CONFIGS>).map((tKey) => {
                  const tObj = THEME_CONFIGS[tKey];
                  const isSelected = themeColor === tKey;
                  return (
                    <button
                      key={tKey}
                      onClick={() => {
                        setThemeColor(tKey);
                        setIsThemePickerOpen(false);
                        showToast(`Tema de color actualizado a: ${tObj.name}`, 'neutral');
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors ${
                        isSelected ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: tObj.hex }} />
                        <span>{tObj.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* WhatsApp Drawer Trigger */}
          <button
            onClick={() => setIsWhatsAppDrawerOpen(true)}
            className="flex items-center gap-2 py-2 px-3 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-2xs"
            title="Abrir historial de alertas WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Alertas WhatsApp</span>
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
              {whatsAppMessages.length}
            </span>
          </button>
        </div>
      </header>

      {/* Primary Logical Navigation Tabs (Reduces Cognitive Load) */}
      <nav className="flex items-center p-1.5 bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'tasks' ? theme.activeTab : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Tareas y Agenda</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            activeTab === 'tasks' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {pendingTasksCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('meetings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'meetings' ? theme.activeTab : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Citas con Docentes</span>
          {childMeetingsCount > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'meetings' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {childMeetingsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'materials' ? theme.activeTab : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Materiales y Útiles</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap relative ${
            activeTab === 'alerts' ? theme.activeTab : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Alertas y Asistencia</span>
          {unreadNotificationsCount > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'alerts' ? 'bg-white/20 text-white' : 'bg-blue-600 text-white'
            }`}>
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'overview' ? theme.activeTab : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Rutinas y Resumen</span>
        </button>
      </nav>

      {/* Main Spacious Viewport (High-Fidelity Tab Panels) */}
      <main className="animate-in fade-in duration-150">
        {activeTab === 'tasks' && (
          <ParentTasksView
            onSelectTask={(task) => setSelectedTaskForDetail(task)}
            onOrganizeTask={(task) => setOrganizingTask(task)}
          />
        )}
        {activeTab === 'meetings' && <ParentMeetingsView />}
        {activeTab === 'materials' && (
          <ParentMaterialsView onSelectTask={(task) => setSelectedTaskForDetail(task)} />
        )}
        {activeTab === 'alerts' && (
          <ParentNotificationsView onSelectTask={(task) => setSelectedTaskForDetail(task)} />
        )}
        {activeTab === 'overview' && (
          <ParentHomeView
            onNavigateToTasks={() => setActiveTab('tasks')}
            onSelectTask={(task) => setSelectedTaskForDetail(task)}
          />
        )}
      </main>

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
    </div>
  );
};
