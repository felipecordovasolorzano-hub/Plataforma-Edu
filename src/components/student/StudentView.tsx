import React from 'react';
import { useApp } from '../../context/AppContext';
import { EvidenceSubmissionModal } from './EvidenceSubmissionModal';
import { THEME_CONFIGS } from '../../utils/theme';
import {
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  Camera,
  Check,
  MessageCircle,
} from 'lucide-react';

export const StudentView: React.FC = () => {
  const {
    tasks,
    badges,
    submittingEvidenceTask,
    setSubmittingEvidenceTask,
    whatsAppSettings,
    setIsWhatsAppDrawerOpen,
    themeColor,
  } = useApp();

  const theme = THEME_CONFIGS[themeColor];

  // Mateo's tasks
  const mateoTasks = tasks.filter((t) => t.childId === 'mateo');
  const pendingMissions = mateoTasks.filter((t) => t.status !== 'completed');
  const completedMissions = mateoTasks.filter((t) => t.status === 'completed');

  const mainBadge = badges[0]; // Explorador Matemático

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner (High-Fidelity) */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=240&q=80"
              alt="Mateo Córdova"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200/80 shadow-xs"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold">
              3.° de Primaria · Sección B · Colegio San Agustín
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">¡Hola, Mateo!</h1>
            <p className="text-xs text-slate-500">
              Tutora: <span className="font-semibold text-slate-700">Prof. Patricia Solano</span>
            </p>
          </div>
        </div>

        {/* WhatsApp Notice for Student */}
        <div className="flex items-center gap-2.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-2xl">
          <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">
            Cada vez que entregues una tarea, le enviaremos un WhatsApp de confirmación a tu mamá <strong>{whatsAppSettings.recipientName}</strong>.
          </span>
          <button
            onClick={() => setIsWhatsAppDrawerOpen(true)}
            className="font-bold underline ml-1 hover:text-emerald-950 text-emerald-800 shrink-0"
          >
            Ver chat
          </button>
        </div>
      </div>

      {/* Main 2-Column Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Missions (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Mis misiones escolares pendientes ({pendingMissions.length})
            </h2>
            <span className="text-xs text-slate-500 font-medium">Entrega a tiempo en el aula</span>
          </div>

          {pendingMissions.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-2">
              <CheckCircle2 className={`w-10 h-10 ${theme.primaryText} mx-auto mb-2`} />
              <h3 className="text-base font-bold text-slate-900">¡Excelente trabajo, Mateo!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Has completado todas tus tareas escolares de esta semana. ¡Sigue así!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingMissions.map((task) => (
                <div
                  key={task.id}
                  className="p-5 bg-white border border-slate-200/80 hover:border-slate-300 rounded-3xl shadow-xs space-y-3 flex flex-col justify-between transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-bold ${theme.primaryText}`}>{task.course}</span>
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {task.schoolDueDate}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{task.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {task.instructions}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500 font-medium">
                      Prof. {task.teacherName}
                    </span>

                    <button
                      onClick={() => setSubmittingEvidenceTask(task)}
                      className={`flex items-center gap-1.5 py-2 px-3.5 text-xs font-bold text-white rounded-xl transition-all shadow-xs ${theme.primaryBg} ${theme.primaryHover}`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Subir evidencia</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Completed Missions History */}
          {completedMissions.length > 0 && (
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Misiones ya entregadas ({completedMissions.length})
              </span>
              <div className="space-y-2">
                {completedMissions.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-slate-900">{task.title}</span>
                      <span className="text-slate-500 font-medium">({task.course})</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Entregado a la profesora
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Badges & Gamification (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Main Badge Progress Card */}
          <div className="p-5 bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Award className={`w-4 h-4 ${theme.primaryText}`} />
                <span>Meta: {mainBadge.title}</span>
              </div>
              <span className="text-slate-500 font-bold">
                {mainBadge.currentSteps}/{mainBadge.totalSteps}
              </span>
            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
              <div
                className={`h-full ${theme.primaryBg} transition-all duration-500 rounded-full`}
                style={{ width: `${mainBadge.progress}%` }}
              />
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Entrega tu tarea de Matemática para desbloquear la insignia dorada de este periodo.
            </p>
          </div>

          {/* Badges Collection Grid */}
          <div className="p-5 bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Mi colección de insignias
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    b.unlocked
                      ? 'bg-white border-blue-200 shadow-2xs'
                      : 'bg-slate-50 border-slate-200/70 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">🏆</span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {b.unlocked ? 'Logrado' : `${b.currentSteps}/${b.totalSteps}`}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-2 leading-snug">{b.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{b.category}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Evidence Submission */}
      {submittingEvidenceTask && (
        <EvidenceSubmissionModal
          task={submittingEvidenceTask}
          onClose={() => setSubmittingEvidenceTask(null)}
        />
      )}
    </div>
  );
};
