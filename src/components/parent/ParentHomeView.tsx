import React from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import { THEME_CONFIGS } from '../../utils/theme';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  Radio,
  BookOpen,
  Calendar,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface ParentHomeViewProps {
  onNavigateToTasks: () => void;
  onSelectTask: (task: Task) => void;
}

export const ParentHomeView: React.FC<ParentHomeViewProps> = ({
  onNavigateToTasks,
  onSelectTask,
}) => {
  const { activeChild, activeChildTasks, students, themeColor } = useApp();
  const theme = THEME_CONFIGS[themeColor];

  // Find student record if active child is Mateo
  const studentData = students.find((s) => s.id === 'std-1');

  // Next urgent tasks
  const nextTasks = activeChildTasks
    .filter((t) => t.status !== 'completed')
    .slice(0, 2);

  const changedTask = activeChildTasks.find((t) => t.hasChanged && t.status !== 'completed');

  return (
    <div className="space-y-5">
      {/* Attendance & Sensor Status Card (Super High-Fidelity) */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block">
                Presencia y Registro Escolar en Tiempo Real
              </span>
              <span className="text-xs text-slate-500">
                Puerta Principal · Colegio San Agustín
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {studentData?.attendanceStatus === 'present' ? 'Ingreso Confirmado' : 'Pendiente de llegada'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={activeChild.avatarImg}
              alt={activeChild.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <p className="font-bold text-slate-900 text-sm">{activeChild.name}</p>
              <p className="text-slate-500">
                {activeChild.grade} ({activeChild.section}) · Tutora: {activeChild.teacherName}
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-sm font-black text-slate-900 block">
              {studentData?.checkInTime || '08:02 a. m.'}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Torniquete biométrico RFID</span>
          </div>
        </div>
      </div>

      {/* Change Alert banner if teacher updated anything */}
      {changedTask && (
        <div
          onClick={() => onSelectTask(changedTask)}
          className="p-5 bg-amber-50/80 border border-amber-200/80 rounded-3xl cursor-pointer hover:bg-amber-100/70 transition-all shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs font-bold text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Aviso de cambio en {changedTask.course}</span>
            </div>
            <span className="text-xs text-amber-900 font-bold hover:underline">
              Ver detalle →
            </span>
          </div>
          <p className="mt-2 text-xs text-amber-900 leading-relaxed font-medium">
            La Prof. Patricia Solano actualizó los materiales requeridos para la sesión práctica de mañana. Se notificó también a WhatsApp.
          </p>
        </div>
      )}

      {/* Quick Overview of Today's Focus */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Foco Prioritario de Hoy para {activeChild.name.split(' ')[0]}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tareas que requieren atención antes del horario de descanso.
            </p>
          </div>
          <button
            onClick={onNavigateToTasks}
            className={`text-xs font-bold ${theme.primaryText} hover:underline flex items-center gap-1.5`}
          >
            <span>Ver agenda completa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {nextTasks.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-slate-50 text-slate-500 text-xs font-medium">
            ¡Felicitaciones! No hay tareas pendientes inmediatas para hoy.
          </div>
        ) : (
          <div className="space-y-3">
            {nextTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="p-4 bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs group-hover:text-blue-600 transition-colors">
                      {task.title}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                      {task.course}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {task.instructions}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-800 block">
                      {task.schoolDueDate}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">Límite escolar</span>
                  </div>
                  <span className={`text-xs font-bold ${theme.primaryText} group-hover:translate-x-0.5 transition-transform`}>
                    Abrir →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Routine Window */}
      <div className="p-5 bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Recomendación de Organización en Casa
        </span>
        <div className="flex items-start gap-3 text-slate-700 text-xs">
          <div className={`w-8 h-8 rounded-xl ${theme.lightBg} ${theme.primaryText} flex items-center justify-center shrink-0`}>
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="leading-relaxed font-medium">
              Ventana de estudio familiar recomendada: <strong>5:00 p. m. a 6:30 p. m.</strong>
            </p>
            <p className="text-slate-500 mt-0.5 text-[11px]">
              Revisar la cartuchera y las témperas de Ciencia y Tecnología antes de la cena para evitar apuros matutinos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
