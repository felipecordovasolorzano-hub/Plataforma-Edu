import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import {
  Sparkles,
  Send,
  Clock,
  Package,
  FileText,
  AlertCircle,
  Check,
  X,
  Calendar,
} from 'lucide-react';

interface TaskCreatorModalProps {
  onClose: () => void;
}

export const TaskCreatorModal: React.FC<TaskCreatorModalProps> = ({ onClose }) => {
  const { addTask, showToast } = useApp();

  const [promptInput, setPromptInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  // Notice: The preview state is NULL initially, satisfying the rule:
  // "Quitar el panel vacío permanente. Solo aparece cuando ya hay una tarea preparada."
  const [draftTask, setDraftTask] = useState<Omit<Task, 'id'> | null>(null);

  const handleGenerateDraft = () => {
    if (!promptInput.trim()) {
      showToast('Por favor escribe qué tarea deseas preparar', 'warning');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);

      if (promptInput.toLowerCase().includes('ciencia') || promptInput.toLowerCase().includes('planta') || promptInput.toLowerCase().includes('experimento')) {
        setDraftTask({
          childId: 'mateo',
          title: 'Experimento de fotosíntesis y luz',
          course: 'Ciencia y Tecnología',
          type: 'tarea',
          schoolDueDate: 'Martes, 6:00 p. m.',
          schoolDueTimestamp: '2026-09-30T18:00:00',
          status: 'pending',
          isNew: true,
          teacherName: 'Prof. Patricia Solano',
          instructions:
            'Colocar dos brotes de frijol: uno en la ventana con luz solar y otro dentro de una caja cerrada. Registrar en la tabla comparativa del cuaderno la diferencia de color y crecimiento tras 4 días.',
          materials: [
            { id: 'm-gen-1', name: '2 vasos descartables transparentes', acquired: false, requiredForDate: 'Lunes' },
            { id: 'm-gen-2', name: 'Algodón y 4 semillas de frijol', acquired: false, requiredForDate: 'Lunes' },
          ],
          attachments: [
            { id: 'att-gen-1', name: 'Ficha_Experimento_Fotosintesis_3B.pdf', size: '1.1 MB', type: 'pdf' },
          ],
        });
      } else {
        // Default: Mathematics exercise
        setDraftTask({
          childId: 'mateo',
          title: 'Multiplicación con patrones y grillas',
          course: 'Matemática',
          type: 'tarea',
          schoolDueDate: 'Viernes, 6:00 p. m.',
          schoolDueTimestamp: '2026-09-26T18:00:00',
          status: 'pending',
          isNew: true,
          teacherName: 'Prof. Patricia Solano',
          instructions:
            'Resolver los ejercicios de la página 45 del cuaderno de trabajo de Matemática. Graficar las matrices rectangulares para 3x4, 4x6 y 5x3.',
          materials: [
            { id: 'm-gen-3', name: 'Regla graduada de 20 cm', acquired: false, requiredForDate: 'Viernes' },
            { id: 'm-gen-4', name: 'Lápices de 3 colores distintos', acquired: false, requiredForDate: 'Viernes' },
          ],
          attachments: [
            { id: 'att-gen-2', name: 'Guia_Matrices_Multiplicacion_3B.pdf', size: '940 KB', type: 'pdf' },
          ],
        });
      }
      showToast('Borrador generado con éxito para revisión docente', 'neutral');
    }, 400);
  };

  const handleConfirmPublish = () => {
    if (!draftTask) return;
    addTask(draftTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#DFE1E6] p-5 shadow-xl max-h-[92vh] overflow-y-auto animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DFE1E6]">
          <div>
            <h2 className="text-base font-semibold text-[#1F2937]">
              Crear y publicar tarea con Asistente
            </h2>
            <p className="text-xs text-[#6B7280]">
              Escribe en lenguaje natural. Se generará un borrador para tu revisión antes de notificar a las familias.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6B7280] hover:text-[#1F2937] rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Natural Language Prompt Input */}
        <div className="mt-4 space-y-2">
          <label className="block text-xs font-medium text-[#374151]">
            ¿Qué necesitas preparar o publicar para el aula?
          </label>
          <div className="flex items-start gap-2 p-2.5 bg-[#F4F5F7] border border-[#DFE1E6] rounded-xl focus-within:border-[#2563EB] focus-within:bg-white transition-colors">
            <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0 mt-1" />
            <textarea
              rows={2}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Ejemplo: Tarea de repaso de multiplicación para el viernes a las 6 pm con ficha adjunta y regla de 20 cm..."
              className="w-full text-xs text-[#1F2937] placeholder-[#9CA3AF] bg-transparent focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-[#6B7280]">Sugerencias rápidas:</span>
            <button
              onClick={() => setPromptInput('Tarea de matemática: Multiplicación con patrones para entregar el viernes a las 6:00 pm con regla y lápices de colores')}
              className="text-[11px] text-[#2563EB] hover:underline bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]"
            >
              Matemática: Multiplicación
            </button>
            <button
              onClick={() => setPromptInput('Tarea de ciencia: Experimento de fotosíntesis para el martes 6 pm con 2 vasos y semillas')}
              className="text-[11px] text-[#2563EB] hover:underline bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]"
            >
              Ciencia: Experimento
            </button>
          </div>

          <button
            onClick={handleGenerateDraft}
            disabled={isGenerating || !promptInput.trim()}
            className="w-full mt-2 py-2 px-4 text-xs font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#9CA3AF] rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Generando borrador...' : 'Preparar borrador con IA'}</span>
          </button>
        </div>

        {/* Preview Container: ONLY appears when draftTask is ready (Anti-empty permanent panel rule) */}
        {draftTask && (
          <div className="mt-6 p-4 bg-[#F4F5F7] border border-[#BFDBFE] rounded-xl space-y-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#DFE1E6]">
              <span className="text-xs font-bold text-[#1F2937] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#2563EB]" />
                <span>Vista previa de publicación (3.° Primaria B · 24 alumnos)</span>
              </span>
              <span className="text-[11px] text-[#2563EB] font-medium bg-white px-2 py-0.5 rounded border border-[#DFE1E6]">
                Borrador listo
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-[#DFE1E6] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#1F2937] text-sm">{draftTask.title}</span>
                <span className="text-[#6B7280]">{draftTask.course}</span>
              </div>

              <div className="flex items-center gap-2 text-[#475569]">
                <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Entrega escolar fija: <strong>{draftTask.schoolDueDate}</strong></span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mt-2">
                  Instrucciones:
                </span>
                <p className="mt-1 text-[#374151] leading-relaxed">
                  {draftTask.instructions}
                </p>
              </div>

              {draftTask.materials.length > 0 && (
                <div className="mt-2 pt-2 border-t border-[#DFE1E6]">
                  <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block">
                    Materiales solicitados:
                  </span>
                  <ul className="mt-1 space-y-1 text-[#374151]">
                    {draftTask.materials.map((m) => (
                      <li key={m.id} className="flex items-center gap-1.5">
                        <Package className="w-3 h-3 text-[#2563EB]" />
                        <span>{m.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Notification summary */}
              <div className="mt-3 p-2 bg-[#EFF6FF] rounded border border-[#BFDBFE] text-[11px] text-[#1E40AF] flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                <span>
                  Al publicar, se disparará una notificación automática al feed móvil de los padres de 3.° B avisando la nueva asignación.
                </span>
              </div>
            </div>

            {/* Confirmation actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDraftTask(null)}
                className="py-2 px-3 text-xs font-medium text-[#4B5563] hover:text-[#1F2937] bg-white border border-[#DFE1E6] rounded-lg transition-colors"
              >
                Descartar borrador
              </button>
              <button
                onClick={handleConfirmPublish}
                className="py-2 px-4 text-xs font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirmar y publicar a las familias</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
