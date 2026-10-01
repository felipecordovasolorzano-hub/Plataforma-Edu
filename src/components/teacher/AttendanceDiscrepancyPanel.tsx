import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { THEME_CONFIGS } from '../../utils/theme';
import {
  Radio,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Check,
  FileCheck,
  Users,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';

export const AttendanceDiscrepancyPanel: React.FC = () => {
  const {
    students,
    updateStudentAttendance,
    sendArrivalAlertToParents,
    activeTeacherSection,
    themeColor,
    showToast,
  } = useApp();

  const theme = THEME_CONFIGS[themeColor];
  const [filterMode, setFilterMode] = useState<'discrepancies' | 'all'>('discrepancies');

  // Counts
  const total = students.length;
  const present = students.filter((s) => s.attendanceStatus === 'present').length;
  const late = students.filter((s) => s.attendanceStatus === 'late').length;
  const absentUnjustified = students.filter((s) => s.attendanceStatus === 'absent_unjustified').length;
  const absentJustified = students.filter((s) => s.attendanceStatus === 'absent_justified').length;

  const discrepancies = students.filter(
    (s) => s.attendanceStatus === 'absent_unjustified' || s.attendanceStatus === 'late'
  );

  const displayedStudents = filterMode === 'discrepancies' ? discrepancies : students;

  const handleJustify = (studentId: string) => {
    updateStudentAttendance(studentId, 'absent_justified');
    showToast('Inasistencia justificada con certificado médico escolar', 'success');
  };

  const handleMarkPresent = (studentId: string) => {
    updateStudentAttendance(studentId, 'present');
    showToast('Estudiante marcado como presente en aula', 'success');
  };

  return (
    <div className="space-y-4">
      {/* Top Section Summary & Classroom Context */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="text-slate-700 font-bold">{activeTeacherSection.grade} — {activeTeacherSection.section}</span>
            <span>·</span>
            <span>{activeTeacherSection.course}</span>
            <span>·</span>
            <span>{activeTeacherSection.room}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5 tracking-tight">
            Monitoreo y Asistencia Automatizada por Sensores RFID
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Detección de torniquetes de entrada cruzada con presencia en aula en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl">
          <div className="relative flex items-center justify-center">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
          </div>
          <span className="font-semibold text-slate-700">Torniquete Principal:</span>
          <span className="text-slate-500">Operativo (07:45 - 08:30 a. m.)</span>
        </div>
      </div>

      {/* Top Metrics Row (High-Fidelity Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Presentes en Aula</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{present}</span>
            <span className="text-xs text-slate-400 font-medium">/ {total} ({Math.round((present / total) * 100)}%)</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-600 font-semibold">Tardanzas Registradas</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700">{late}</span>
            <span className="text-xs text-slate-400 font-medium">alumnos</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-red-600 font-semibold">Ausentes sin Justificar</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-700">{absentUnjustified}</span>
            <span className="text-xs text-red-600 font-bold">¡Atención prioritaria!</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Inasistencias Justificadas</span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-700">{absentJustified}</span>
            <span className="text-xs text-slate-400 font-medium">licencia médica</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setFilterMode('discrepancies')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterMode === 'discrepancies'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Solo anomalías ({discrepancies.length})
          </button>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterMode === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos los alumnos ({total})
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Sincronizado con base de datos del colegio</span>
        </div>
      </div>

      {/* Discrepancy Table / Cards */}
      <div className="space-y-3">
        {displayedStudents.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-2">
            <CheckCircle2 className={`w-8 h-8 ${theme.primaryText} mx-auto`} />
            <h3 className="text-sm font-bold text-slate-800">Sin discrepancias de asistencia</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Todos los alumnos de {activeTeacherSection.grade} {activeTeacherSection.section} están presentes o debidamente justificados.
            </p>
          </div>
        ) : (
          displayedStudents.map((student) => {
            const isUnjustified = student.attendanceStatus === 'absent_unjustified';
            const isLate = student.attendanceStatus === 'late';
            const isPresent = student.attendanceStatus === 'present';
            const isJustified = student.attendanceStatus === 'absent_justified';

            return (
              <div
                key={student.id}
                className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl shadow-xs transition-all"
              >
                {/* Student Info with Real Avatar */}
                <div className="flex items-center gap-3.5">
                  <img
                    src={student.avatarImg}
                    alt={student.name}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-2xs"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{student.name}</h3>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500">
                      {student.checkInTime ? (
                        <span className="flex items-center gap-1">
                          <Radio className="w-3 h-3 text-emerald-600" />
                          <span>Sensor torniquete: {student.checkInTime}</span>
                        </span>
                      ) : (
                        <span className="text-red-500 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Sin registro de torniquete</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div>
                  {isUnjustified && (
                    <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Ausente sin justificación
                    </span>
                  )}
                  {isLate && (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Tardanza ({student.checkInTime})
                    </span>
                  )}
                  {isPresent && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Presente ({student.checkInTime})
                    </span>
                  )}
                  {isJustified && (
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5" />
                      Inasistencia justificada
                    </span>
                  )}
                </div>

                {/* Action Buttons (< 3 Clicks Flow) */}
                <div className="flex items-center gap-2">
                  {isUnjustified && (
                    <>
                      <button
                        onClick={() => handleJustify(student.id)}
                        className="py-1.5 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                      >
                        Justificar
                      </button>
                      <button
                        onClick={() => handleMarkPresent(student.id)}
                        className={`py-1.5 px-3.5 text-xs font-bold text-white rounded-xl shadow-xs transition-all ${theme.primaryBg} ${theme.primaryHover}`}
                      >
                        Marcar presente
                      </button>
                    </>
                  )}

                  {isLate && (
                    <button
                      onClick={() => handleMarkPresent(student.id)}
                      className="py-1.5 px-3.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Validar ingreso a aula
                    </button>
                  )}

                  {/* Send Alert to Parents via WhatsApp */}
                  <button
                    onClick={() => sendArrivalAlertToParents(student.id)}
                    title="Enviar confirmación de presencia a WhatsApp de los padres"
                    className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Avisar a WhatsApp</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
