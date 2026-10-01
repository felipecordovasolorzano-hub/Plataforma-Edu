import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import {
  Camera,
  Mic,
  Upload,
  CheckCircle2,
  X,
  Sparkles,
  FileCheck,
} from 'lucide-react';

interface EvidenceSubmissionModalProps {
  task: Task;
  onClose: () => void;
}

export const EvidenceSubmissionModal: React.FC<EvidenceSubmissionModalProps> = ({
  task,
  onClose,
}) => {
  const { submitStudentEvidence, showToast } = useApp();
  const [evidenceType, setEvidenceType] = useState<'photo' | 'audio' | 'file'>('photo');
  const [studentNote, setStudentNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDone(true);
      submitStudentEvidence(task.id, evidenceType, studentNote);
      setTimeout(() => {
        onClose();
      }, 1200);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-2xl border border-[#DFE1E6] p-5 shadow-xl animate-in zoom-in-95">
        {isDone ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937]">¡Excelente trabajo, Mateo!</h3>
            <p className="text-xs text-[#6B7280]">
              Tu evidencia de <strong>{task.title}</strong> fue enviada a la profesora Patricia.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#DFE1E6]">
              <div>
                <h3 className="text-base font-semibold text-[#1F2937]">
                  Cargar evidencia de tarea
                </h3>
                <p className="text-xs text-[#6B7280]">
                  {task.title} · {task.course}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-[#6B7280] hover:text-[#1F2937] rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Evidence type selection */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-[#374151] mb-2">
                ¿Cómo deseas entregar tu trabajo?
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setEvidenceType('photo')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-colors ${
                    evidenceType === 'photo'
                      ? 'bg-[#EFF6FF] border-[#2563EB] text-[#1D4ED8]'
                      : 'bg-white border-[#DFE1E6] text-[#4B5563] hover:bg-[#F4F5F7]'
                  }`}
                >
                  <Camera className="w-5 h-5" />
                  <span className="text-[11px] font-semibold">Foto</span>
                </button>

                <button
                  onClick={() => setEvidenceType('audio')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-colors ${
                    evidenceType === 'audio'
                      ? 'bg-[#EFF6FF] border-[#2563EB] text-[#1D4ED8]'
                      : 'bg-white border-[#DFE1E6] text-[#4B5563] hover:bg-[#F4F5F7]'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                  <span className="text-[11px] font-semibold">Audio</span>
                </button>

                <button
                  onClick={() => setEvidenceType('file')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-colors ${
                    evidenceType === 'file'
                      ? 'bg-[#EFF6FF] border-[#2563EB] text-[#1D4ED8]'
                      : 'bg-white border-[#DFE1E6] text-[#4B5563] hover:bg-[#F4F5F7]'
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-[11px] font-semibold">Archivo</span>
                </button>
              </div>
            </div>

            {/* Simulated evidence placeholder */}
            <div className="mt-4 p-4 bg-[#F4F5F7] border border-dashed border-[#9CA3AF] rounded-xl text-center space-y-2">
              {evidenceType === 'photo' && (
                <>
                  <Camera className="w-7 h-7 text-[#2563EB] mx-auto" />
                  <p className="text-xs text-[#1F2937] font-medium">Foto del cuaderno tomada</p>
                  <span className="text-[11px] text-[#6B7280] block">IMG_Fracciones_P24.jpg (1.4 MB)</span>
                </>
              )}
              {evidenceType === 'audio' && (
                <>
                  <Mic className="w-7 h-7 text-[#2563EB] mx-auto" />
                  <p className="text-xs text-[#1F2937] font-medium">Nota de voz grabada: 0:42 min</p>
                  <span className="text-[11px] text-[#6B7280] block">&ldquo;Explico cómo dividí la barra en 4 partes...&rdquo;</span>
                </>
              )}
              {evidenceType === 'file' && (
                <>
                  <FileCheck className="w-7 h-7 text-[#2563EB] mx-auto" />
                  <p className="text-xs text-[#1F2937] font-medium">Documento seleccionado</p>
                  <span className="text-[11px] text-[#6B7280] block">Ficha_Ejercicios_Resueltos.pdf</span>
                </>
              )}
            </div>

            {/* Note */}
            <div className="mt-3">
              <label className="block text-xs font-medium text-[#374151] mb-1">
                Mensaje para la profesora (opcional)
              </label>
              <input
                type="text"
                placeholder="Ejemplo: ¡Ya terminé todos los ejercicios!"
                value={studentNote}
                onChange={(e) => setStudentNote(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#DFE1E6] rounded-lg focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Submit buttons */}
            <div className="mt-5 pt-3 border-t border-[#DFE1E6] flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                className="py-2 px-3 text-xs font-medium text-[#4B5563] hover:text-[#1F2937] bg-[#F4F5F7] rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="py-2 px-4 text-xs font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? 'Subiendo evidencia...' : 'Enviar mi trabajo'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
