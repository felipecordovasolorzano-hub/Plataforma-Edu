import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import { THEME_CONFIGS } from '../../utils/theme';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Radio,
  Clock,
  Check,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface ParentNotificationsViewProps {
  onSelectTask: (task: Task) => void;
}

export const ParentNotificationsView: React.FC<ParentNotificationsViewProps> = ({
  onSelectTask,
}) => {
  const {
    notifications,
    tasks,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationsCount,
    themeColor,
  } = useApp();

  const theme = THEME_CONFIGS[themeColor];
  const [filterMode, setFilterMode] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (filterMode === 'unread') return !n.read;
    return true;
  });

  const handleNotificationClick = (notificationId: string, relatedTaskId?: string) => {
    markNotificationAsRead(notificationId);
    if (relatedTaskId) {
      const task = tasks.find((t) => t.id === relatedTaskId);
      if (task) {
        onSelectTask(task);
      }
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Alertas y Notificaciones Escolares
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro cronológico de novedades, cambios de material, asistencia y confirmaciones de citas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterMode === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas ({notifications.length})
            </button>
            <button
              onClick={() => setFilterMode('unread')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterMode === 'unread'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              No leídas ({unreadNotificationsCount})
            </button>
          </div>

          {unreadNotificationsCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className={`text-xs font-bold ${theme.primaryText} hover:underline whitespace-nowrap`}
            >
              Marcar todo como leído
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Sin notificaciones pendientes</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Estás al día con todas las comunicaciones escolares oficiales de tus hijos.
            </p>
          </div>
        ) : (
          filteredNotifications.map((n) => {
            const isChange = n.type === 'change';
            const isAttendance = n.type === 'attendance';
            const isUrgent = n.type === 'urgent';
            const isMeeting = n.type === 'meeting';

            return (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n.id, n.relatedTaskId)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                  !n.read
                    ? 'bg-white border-blue-200/90 shadow-xs hover:border-blue-300'
                    : 'bg-slate-50/70 border-slate-200/70 hover:bg-white text-slate-600'
                }`}
              >
                {/* Icon Badge */}
                <div className="mt-0.5 shrink-0">
                  {isChange && (
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  )}
                  {isAttendance && (
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                      <Radio className="w-4 h-4" />
                    </div>
                  )}
                  {isUrgent && (
                    <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center">
                      <Bell className="w-4 h-4" />
                    </div>
                  )}
                  {isMeeting && (
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                  )}
                  {!isChange && !isAttendance && !isUrgent && !isMeeting && (
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-xs font-bold ${!n.read ? 'text-slate-900' : 'text-slate-700'}`}>
                      {n.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium shrink-0">
                      {n.timestamp}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-600 leading-relaxed font-normal">
                    {n.description}
                  </p>

                  {n.relatedTaskId && (
                    <span className={`mt-2 inline-flex items-center gap-1 text-[11px] font-bold ${theme.primaryText} hover:underline`}>
                      <span>Ver tarea asociada</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {!n.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-2" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
