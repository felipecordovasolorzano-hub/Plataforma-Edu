import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentBehaviorGrid } from './StudentBehaviorGrid';
import { AttendanceDiscrepancyPanel } from './AttendanceDiscrepancyPanel';
import { TaskCreatorModal } from './TaskCreatorModal';
import { TeacherMeetingsPanel } from './TeacherMeetingsPanel';
import { THEME_CONFIGS } from '../../utils/theme';
import {
  Users,
  Radio,
  Plus,
  BookOpen,
  Calendar,
  Sparkles,
  ChevronDown,
  Layers,
  GraduationCap,
  DoorOpen,
  CheckCircle2,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const {
    tasks,
    students,
    teacherSections,
    activeTeacherSectionId,
    setActiveTeacherSectionId,
    activeTeacherSection,
    meetingRequests,
    themeColor,
    showToast,
  } = useApp();

  const theme = THEME_CONFIGS[themeColor];

  const [activeTab, setActiveTab] = useState<'attendance' | 'behavior' | 'assignments' | 'meetings'>('attendance');
  const [isCreatorOpen, setIsCreatorOpen] = useState<boolean>(false);
  const [isSectionDropdownOpen, setIsSectionDropdownOpen] = useState<boolean>(false);

  const pendingMeetingsCount = meetingRequests.filter((m) => m.status === 'pending').length;

  const handleSelectSection = (sectionId: string) => {
    setActiveTeacherSectionId(sectionId);
    setIsSectionDropdownOpen(false);
    const sec = teacherSections.find((s) => s.id === sectionId);
    showToast(`Cambiando a: ${sec?.grade} ${sec?.section} (${sec?.course})`, 'neutral');
  };

  const filteredTasks = tasks.filter(
    (t) =>
      t.childId === 'mateo' ||
      t.course.toLowerCase().includes(activeTeacherSection.course.toLowerCase().slice(0, 4))
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Teacher Top Navigation & Course/Section Switcher */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80"
            alt="Prof. Patricia Solano"
            className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200/80 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
              <span>Colegio San Agustín</span>
              <span>·</span>
              <span>Docente Titular</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5 tracking-tight">
              Prof. Patricia Solano
            </h1>
            <p className="text-xs text-slate-500">
              Coordinadora de Matemática y Ciencias Primaria · {teacherSections.length} secciones a cargo
            </p>
          </div>
        </div>

        {/* Course & Section Switcher (CRITICAL USER REQUIREMENT) */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsSectionDropdownOpen(!isSectionDropdownOpen)}
              className="flex items-center gap-3 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition-all shadow-2xs text-left"
              aria-label="Cambiar sección o curso"
            >
              <div className={`w-8 h-8 rounded-xl ${theme.lightBg} ${theme.primaryText} flex items-center justify-center font-bold text-xs`}>
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Curso / Sección activa:
                </span>
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {activeTeacherSection.grade} — {activeTeacherSection.section}
                </span>
                <span className={`text-[11px] font-semibold ${theme.primaryText}`}>
                  {activeTeacherSection.course} ({activeTeacherSection.studentCount} alumnos)
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
            </button>

            {/* Dropdown Menu for Sections */}
            {isSectionDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-40 animate-in fade-in zoom-in-95">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5 block">
                  Alternar cursos y aulas asignadas:
                </span>
                <div className="space-y-1">
                  {teacherSections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => handleSelectSection(sec.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                        sec.id === activeTeacherSectionId
                          ? `${theme.lightBg} border ${theme.lightBorder} ${theme.primaryText} font-semibold`
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block text-slate-900">
                          {sec.grade} — {sec.section}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {sec.course} · {sec.room}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold bg-white border border-slate-200/80 px-2 py-0.5 rounded-md text-slate-600">
                        {sec.studentCount} est.
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCreatorOpen(true)}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold text-white rounded-2xl transition-all shadow-xs ${theme.primaryBg} ${theme.primaryHover}`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Publicar tarea con IA</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center p-1 bg-white border border-slate-200/80 rounded-2xl shadow-xs w-full sm:w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'attendance'
              ? theme.activeTab
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Asistencia y Sensores</span>
        </button>

        <button
          onClick={() => setActiveTab('behavior')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'behavior'
              ? theme.activeTab
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registro de Aula ({activeTeacherSection.studentCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'assignments'
              ? theme.activeTab
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Tareas Asignadas</span>
        </button>

        <button
          onClick={() => setActiveTab('meetings')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap relative ${
            activeTab === 'meetings'
              ? theme.activeTab
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Citas y Tutoría de Padres</span>
          {pendingMeetingsCount > 0 && (
            <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
              activeTab === 'meetings' ? 'bg-white text-blue-700' : 'bg-amber-500 text-white'
            }`}>
              {pendingMeetingsCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <div className="animate-in fade-in duration-150">
        {activeTab === 'attendance' && <AttendanceDiscrepancyPanel />}
        {activeTab === 'behavior' && <StudentBehaviorGrid />}
        {activeTab === 'meetings' && <TeacherMeetingsPanel />}
        {activeTab === 'assignments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Tareas y Actividades en {activeTeacherSection.grade} {activeTeacherSection.section} ({activeTeacherSection.course})
                </h2>
                <p className="text-xs text-slate-500">
                  Todas las asignaciones se publican con notificación automática a los padres vía WhatsApp.
                </p>
              </div>
              <button
                onClick={() => setIsCreatorOpen(true)}
                className={`text-xs font-semibold ${theme.primaryText} hover:underline`}
              >
                + Crear nueva tarea con IA
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{task.title}</span>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                      {task.course}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {task.instructions}
                  </p>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Entrega fijada: <strong>{task.schoolDueDate}</strong></span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Publicado
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Task Creator Modal */}
      {isCreatorOpen && <TaskCreatorModal onClose={() => setIsCreatorOpen(false)} />}
    </div>
  );
};
