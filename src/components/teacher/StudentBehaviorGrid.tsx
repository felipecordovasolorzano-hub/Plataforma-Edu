import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { THEME_CONFIGS } from '../../utils/theme';
import {
  CheckSquare,
  Square,
  Sparkles,
  Award,
  Users,
  X,
  Check,
  BookOpen,
  Heart,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

export const StudentBehaviorGrid: React.FC = () => {
  const { students, addBehaviorFeedback, activeTeacherSection, themeColor } = useApp();
  const theme = THEME_CONFIGS[themeColor];

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<'academic' | 'community' | 'participation' | 'improvement'>('academic');

  const allSelected = selectedStudentIds.length === students.length && students.length > 0;

  const toggleSelectStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(students.map((s) => s.id));
    }
  };

  const handleApplyFeedback = (label: string) => {
    if (selectedStudentIds.length === 0) return;
    addBehaviorFeedback(selectedStudentIds, activeCategory, label);
    setSelectedStudentIds([]);
    setIsFeedbackModalOpen(false);
  };

  const FEEDBACK_OPTIONS = {
    academic: [
      'Excelente razonamiento lógico',
      'Resolución creativa de problemas',
      'Comprensión lectora sobresaliente',
      'Cuaderno impecable y ordenado',
    ],
    community: [
      'Trabajo colaborativo y apoyo mutuo',
      'Empatía y respeto de turnos de palabra',
      'Cuidado y devolución de materiales del aula',
      'Puntualidad en el retorno del recreo',
    ],
    participation: [
      'Participación activa y voluntaria',
      'Preguntas reflexivas y de indagación',
      'Exposición clara ante los compañeros',
    ],
    improvement: [
      'Recordatorio: traer materiales de trabajo solicitados',
      'Atención en clase (evitar dispersión)',
      'Revisar ficha de tarea incompleta',
    ],
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-slate-200/80 rounded-3xl shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2 py-2 px-3.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-2xs"
          >
            {allSelected ? <CheckSquare className={`w-4 h-4 ${theme.primaryText}`} /> : <Square className="w-4 h-4 text-slate-400" />}
            <span>{allSelected ? 'Deseleccionar todos' : `Seleccionar aula completa (${students.length})`}</span>
          </button>

          <span className="text-xs font-semibold text-slate-500">
            {selectedStudentIds.length} estudiante(s) seleccionado(s)
          </span>
        </div>

        {selectedStudentIds.length > 0 && (
          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            className={`flex items-center gap-2 py-2 px-4 text-xs font-bold text-white rounded-xl transition-all shadow-xs animate-in fade-in ${theme.primaryBg} ${theme.primaryHover}`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Asignar retroalimentación ({selectedStudentIds.length})</span>
          </button>
        )}
      </div>

      {/* Grid of Students with Real High-Quality Photos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        {students.map((student) => {
          const isSelected = selectedStudentIds.includes(student.id);

          return (
            <div
              key={student.id}
              onClick={() => toggleSelectStudent(student.id)}
              className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer relative group ${
                isSelected
                  ? `${theme.lightBg} border-blue-600 shadow-xs ring-2 ring-blue-500/20`
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {/* Checkmark Indicator */}
              <div
                className={`absolute top-2.5 right-2.5 w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                  isSelected
                    ? `${theme.primaryBg} border-transparent text-white`
                    : 'border-slate-300 bg-white group-hover:border-slate-400'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>

              {/* Real Student Avatar */}
              <div className="relative w-12 h-12 mx-auto">
                <img
                  src={student.avatarImg}
                  alt={student.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    student.attendanceStatus === 'present'
                      ? 'bg-emerald-500'
                      : student.attendanceStatus === 'late'
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                  title={`Estado: ${student.attendanceStatus}`}
                />
              </div>

              {/* Student Name */}
              <h3 className="mt-2 text-xs font-bold text-slate-900 truncate">
                {student.name}
              </h3>

              {/* Recent Badge or Feedback */}
              <div className="mt-1 min-h-[24px]">
                {student.recentBehaviorBadges.length > 0 ? (
                  <span
                    className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md block truncate"
                    title={student.recentBehaviorBadges[0].label}
                  >
                    ★ {student.recentBehaviorBadges[0].label}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">Sin incidencias</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* High-Fidelity Feedback Assignment Modal */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Retroalimentación Grupal Inmediata
                </h3>
                <p className="text-xs text-slate-500">
                  Asignar a {selectedStudentIds.length} estudiante(s) de {activeTeacherSection.grade} {activeTeacherSection.section}
                </p>
              </div>
              <button
                onClick={() => setIsFeedbackModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
              <button
                onClick={() => setActiveCategory('academic')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold rounded-xl transition-all ${
                  activeCategory === 'academic'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>Académico</span>
              </button>

              <button
                onClick={() => setActiveCategory('community')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold rounded-xl transition-all ${
                  activeCategory === 'community'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-emerald-600" />
                <span>Convivencia</span>
              </button>

              <button
                onClick={() => setActiveCategory('participation')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold rounded-xl transition-all ${
                  activeCategory === 'participation'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Participación</span>
              </button>

              <button
                onClick={() => setActiveCategory('improvement')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold rounded-xl transition-all ${
                  activeCategory === 'improvement'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-purple-600" />
                <span>Ajuste</span>
              </button>
            </div>

            {/* List of Feedback Options */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Seleccionar insignia o registro rápido:
              </span>
              {FEEDBACK_OPTIONS[activeCategory].map((label, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyFeedback(label)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200/90 bg-slate-50 hover:bg-white hover:border-slate-300 text-left transition-all text-xs font-semibold text-slate-800 group"
                >
                  <span>{label}</span>
                  <Award className={`w-4 h-4 text-slate-400 group-hover:${theme.primaryText} transition-colors`} />
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsFeedbackModalOpen(false)}
                className="py-2 px-4 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
