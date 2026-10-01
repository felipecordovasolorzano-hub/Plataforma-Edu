import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import {
  X,
  Clock,
  Calendar,
  Bell,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Download,
  Check,
  Package,
} from 'lucide-react';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onOpenSchedule: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  onClose,
  onOpenSchedule,
}) => {
  const { toggleTaskComplete, toggleMaterialAcquired, showToast } = useApp();
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const isCompleted = task.status === 'completed';

  const handleAskAI = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      if (task.course.includes('Matemática')) {
        setAiExplanation(
          '💡 Guía rápida para padres (3.° Primaria):\n1. Pide a tu hijo doblar una tira de papel en 2 partes (1/2) y otra igual en 4 partes (2/4).\n2. Ayúdale a notar que 1/2 ocupa exactamente el mismo espacio que 2/4.\n3. Eso es la equivalencia: distintas fracciones que valen lo mismo. Tiempo estimado: 20 min.'
        );
      } else if (task.course.includes('Ciencia')) {
        setAiExplanation(
          '💡 Resumen de materiales:\nRecuerda colocar la cartulina en la mochila hoy por la noche. La témpera azul y el pincel N.° 6 fueron agregados hoy para pintar el fondo marino en la maqueta.'
        );
      } else {
        setAiExplanation(
          `💡 Resumen de la actividad:\nObjetivo: Reforzar el tema visto en clase con la ${task.teacherName}. Asegúrate de que tu hijo lea primero las instrucciones en voz alta antes de comenzar.`
        );
      }
    }, 450);
  };

  const handleDownloadFile = (fileName: string) => {
    showToast(`Descargando archivo: ${fileName}`, 'neutral');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-[#DFE1E6] p-5 shadow-xl max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#DFE1E6]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
              <span className="font-medium text-[#1F2937]">{task.course}</span>
              <span>·</span>
              <span>{task.teacherName}</span>
            </div>
            <h2 className="text-lg font-semibold text-[#1F2937] mt-1 leading-snug">
              {task.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6B7280] hover:text-[#1F2937] rounded-md transition-colors"
            aria-label="Cerrar detalle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Change Callout if teacher edited the task */}
        {task.hasChanged && task.changeDetails && (
          <div className="mt-4 p-3.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#B45309]">
              <AlertCircle className="w-4 h-4" />
              <span>Cambio registrado por el docente ({task.changeDetails.timestamp})</span>
            </div>
            <div className="mt-2 text-xs text-[#78350F] space-y-1">
              <p>
                <strong className="font-medium text-[#92400E]">Antes:</strong>{' '}
                <span className="line-through">{task.changeDetails.before}</span>
              </p>
              <p>
                <strong className="font-medium text-[#92400E]">Ahora:</strong>{' '}
                <span className="font-semibold text-[#1F2937]">{task.changeDetails.after}</span>
              </p>
            </div>
          </div>
        )}

        {/* The 3 Clocks (CRITICAL UX SPECIFICATION) */}
        <div className="mt-4 p-3.5 bg-[#F4F5F7] rounded-xl border border-[#DFE1E6] space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] block">
            Planificación y Tiempos
          </span>

          {/* Clock 1: School Due Date */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#6B7280]" />
              <div>
                <span className="text-[#6B7280]">1. Entrega escolar:</span>
                <span className="ml-1 font-semibold text-[#1F2937]">
                  {task.schoolDueDate}
                </span>
              </div>
            </div>
            <span className="text-[11px] text-[#6B7280] bg-white px-2 py-0.5 rounded border border-[#DFE1E6]">
              Fijo (Colegio)
            </span>
          </div>

          {/* Clock 2: Family Schedule */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-[#DFE1E6]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2563EB]" />
              <div>
                <span className="text-[#6B7280]">2. Horario para hacerla:</span>
                <span className="ml-1 font-semibold text-[#1F2937]">
                  {task.familyScheduleDate || 'Sin programar aún'}
                </span>
              </div>
            </div>
            <button
              onClick={onOpenSchedule}
              className="text-xs font-medium text-[#2563EB] hover:underline"
            >
              {task.familyScheduleDate ? 'Modificar' : 'Programar'}
            </button>
          </div>

          {/* Clock 3: Family Reminder */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-[#DFE1E6]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#6B7280]" />
              <div>
                <span className="text-[#6B7280]">3. Recordatorio familiar:</span>
                <span className="ml-1 font-medium text-[#1F2937]">
                  {task.hasReminder
                    ? `Activo (${task.reminderMinutesBefore || 30} min antes)`
                    : 'Desactivado'}
                </span>
              </div>
            </div>
            <button
              onClick={onOpenSchedule}
              className="text-xs text-[#6B7280] hover:text-[#1F2937]"
            >
              Ajustar
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-[#1F2937] uppercase tracking-wider">
            Instrucciones del profesor
          </h4>
          <p className="mt-1.5 text-xs sm:text-sm text-[#374151] leading-relaxed whitespace-pre-line bg-white p-3 border border-[#DFE1E6] rounded-xl">
            {task.instructions}
          </p>
        </div>

        {/* Materials checklist */}
        {task.materials && task.materials.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-[#1F2937] uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Materiales a llevar en la mochila</span>
              </h4>
            </div>
            <div className="mt-2 space-y-1.5">
              {task.materials.map((m) => (
                <div
                  key={m.id}
                  onClick={() => toggleMaterialAcquired(task.id, m.id)}
                  className="flex items-center justify-between p-2.5 bg-white border border-[#DFE1E6] rounded-lg cursor-pointer hover:bg-[#F4F5F7] transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                        m.acquired
                          ? 'bg-[#2563EB] border-[#2563EB] text-white'
                          : 'border-[#9CA3AF] bg-white'
                      }`}
                    >
                      {m.acquired && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span
                      className={`${
                        m.acquired ? 'text-[#6B7280] line-through' : 'text-[#1F2937] font-medium'
                      }`}
                    >
                      {m.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#6B7280]">
                    {m.acquired ? 'En la mochila' : 'Por conseguir'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        {task.attachments && task.attachments.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-[#1F2937] uppercase tracking-wider">
              Archivos y Enlaces
            </h4>
            <div className="mt-2 space-y-2">
              {task.attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-2.5 bg-[#F4F5F7] border border-[#DFE1E6] rounded-lg text-xs"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <FileText className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span className="font-medium text-[#1F2937] truncate">{att.name}</span>
                    <span className="text-[#6B7280] shrink-0">({att.size})</span>
                  </div>
                  <button
                    onClick={() => handleDownloadFile(att.name)}
                    className="flex items-center gap-1 text-xs font-medium text-[#2563EB] hover:underline shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Abrir</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Helper button & response */}
        <div className="mt-4 pt-3 border-t border-[#DFE1E6]">
          {!aiExplanation && (
            <button
              onClick={handleAskAI}
              disabled={isAiLoading}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-[#1F2937] bg-[#F4F5F7] border border-[#DFE1E6] rounded-lg hover:bg-[#E5E7EB] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{isAiLoading ? 'Analizando tarea...' : 'Explicar cómo ayudar a mi hijo (IA)'}</span>
            </button>
          )}

          {aiExplanation && (
            <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl text-xs text-[#1E3A8A] leading-relaxed whitespace-pre-line animate-in fade-in">
              {aiExplanation}
            </div>
          )}
        </div>

        {/* Action Buttons footer */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2 pt-3 border-t border-[#DFE1E6]">
          <button
            onClick={() => toggleTaskComplete(task.id)}
            className={`w-full py-2.5 px-4 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
              isCompleted
                ? 'bg-[#F4F5F7] text-[#4B5563] border border-[#DFE1E6] hover:bg-[#E5E7EB]'
                : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Desmarcar como lista' : 'Marcar como lista en casa'}</span>
          </button>
          
          <button
            onClick={onOpenSchedule}
            className="w-full sm:w-auto py-2.5 px-4 text-xs font-medium text-[#1F2937] bg-[#F4F5F7] hover:bg-[#E5E7EB] border border-[#DFE1E6] rounded-lg transition-colors"
          >
            Organizar horario
          </button>
        </div>
      </div>
    </div>
  );
};
