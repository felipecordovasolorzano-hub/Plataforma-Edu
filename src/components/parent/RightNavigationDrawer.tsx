import React from 'react';
import { useApp } from '../../context/AppContext';
import { THEME_CONFIGS } from '../../utils/theme';
import { ParentMeetingsView } from './ParentMeetingsView';
import { ParentMaterialsView } from './ParentMaterialsView';
import { ParentNotificationsView } from './ParentNotificationsView';
import { ParentHomeView } from './ParentHomeView';
import { Task } from '../../types';
import {
  X,
  Calendar,
  Package,
  Bell,
  Home,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export type RightDrawerTab = 'meetings' | 'materials' | 'alerts' | 'overview';

interface RightNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: RightDrawerTab;
  onSelectTab: (tab: RightDrawerTab) => void;
  onSelectTask: (task: Task) => void;
}

export const RightNavigationDrawer: React.FC<RightNavigationDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onSelectTask,
}) => {
  const {
    activeChild,
    activeChildTasks,
    unreadNotificationsCount,
    meetingRequests,
    themeColor,
  } = useApp();

  const theme = THEME_CONFIGS[themeColor];

  if (!isOpen) return null;

  // Compute counts
  const childMeetingsCount = meetingRequests.filter((m) => m.childId === activeChild.id).length;
  
  // Pending materials
  let pendingMaterialsCount = 0;
  activeChildTasks.forEach((t) => {
    t.materials?.forEach((m) => {
      if (!m.acquired) pendingMaterialsCount++;
    });
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-slate-50 border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Menú Escolar Lateral
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-semibold text-slate-700">{activeChild.name}</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 mt-0.5 tracking-tight">
                Módulos Secundarios de EduSense
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Cerrar panel lateral"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Module Navigation Bar */}
          <div className="bg-white px-6 py-2.5 border-b border-slate-200/90 flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => onSelectTab('meetings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'meetings'
                  ? `${theme.primaryBg} text-white shadow-xs`
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Citas con Docentes</span>
              {childMeetingsCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === 'meetings' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {childMeetingsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('materials')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'materials'
                  ? `${theme.primaryBg} text-white shadow-xs`
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Materiales y Útiles</span>
              {pendingMaterialsCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === 'materials' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
                }`}>
                  {pendingMaterialsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('alerts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'alerts'
                  ? `${theme.primaryBg} text-white shadow-xs`
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Alertas y Asistencia</span>
              {unreadNotificationsCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === 'alerts' ? 'bg-white/20 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('overview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'overview'
                  ? `${theme.primaryBg} text-white shadow-xs`
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Rutinas y Resumen</span>
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'meetings' && <ParentMeetingsView />}
            {activeTab === 'materials' && (
              <ParentMaterialsView onSelectTask={onSelectTask} />
            )}
            {activeTab === 'alerts' && (
              <ParentNotificationsView onSelectTask={onSelectTask} />
            )}
            {activeTab === 'overview' && (
              <ParentHomeView
                onNavigateToTasks={onClose}
                onSelectTask={onSelectTask}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
