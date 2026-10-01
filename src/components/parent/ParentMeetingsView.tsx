import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TeacherProfile, MeetingTopic, MeetingModality } from '../../types';
import { THEME_CONFIGS } from '../../utils/theme';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  UserCheck,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react';

export const ParentMeetingsView: React.FC = () => {
  const {
    teachers,
    meetingRequests,
    requestMeeting,
    activeChild,
    themeColor,
    setIsWhatsAppDrawerOpen,
    showToast,
  } = useApp();

  const theme = THEME_CONFIGS[themeColor];

  // Request form state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0].id);
  const [selectedTopic, setSelectedTopic] = useState<MeetingTopic>('seguimiento_academico');
  const [selectedModality, setSelectedModality] = useState<MeetingModality>('presencial');
  const [selectedSlotId, setSelectedSlotId] = useState<string>(teachers[0].availableSlots[0]?.id || '');
  const [parentNotes, setParentNotes] = useState<string>('');

  const selectedTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  const TOPIC_OPTIONS: { id: MeetingTopic; label: string; desc: string }[] = [
    {
      id: 'seguimiento_academico',
      label: 'Seguimiento Académico y Rendimiento',
      desc: 'Revisar progreso en cursos, evaluaciones bimestrales y comprensión de tareas.',
    },
    {
      id: 'dificultad_evaluacion',
      label: 'Dificultad o Refuerzo en Evaluaciones',
      desc: 'Analizar temas específicos que requieran tutoría o apoyo pedagógico adicional.',
    },
    {
      id: 'convivencia_adaptacion',
      label: 'Convivencia Escolar y Adaptación',
      desc: 'Conversar sobre integración grupal, participación en aula y disciplina positiva.',
    },
    {
      id: 'coordinacion_familiar',
      label: 'Coordinación Familiar o Situación Especial',
      desc: 'Informar sobre viajes, licencias médicas o acuerdos de rutina en casa.',
    },
  ];

  // When teacher changes, select their first slot
  const handleTeacherChange = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    const teacher = teachers.find((t) => t.id === teacherId);
    if (teacher && teacher.availableSlots.length > 0) {
      setSelectedSlotId(teacher.availableSlots[0].id);
    }
  };

  const handleConfirmRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenSlot = selectedTeacher.availableSlots.find((s) => s.id === selectedSlotId);
    const chosenTopicObj = TOPIC_OPTIONS.find((t) => t.id === selectedTopic);

    if (!chosenSlot) {
      showToast('Por favor selecciona un horario disponible', 'warning');
      return;
    }

    requestMeeting({
      parentName: 'Carolina Córdova',
      parentPhone: '+51 987 654 321',
      childId: activeChild.id,
      childName: activeChild.name,
      teacherId: selectedTeacher.id,
      teacherName: selectedTeacher.name,
      topic: selectedTopic,
      topicLabel: chosenTopicObj ? chosenTopicObj.label : 'Tutoría Escolar',
      modality: selectedModality,
      date: chosenSlot.dayLabel,
      timeSlot: chosenSlot.timeSlot,
      notes: parentNotes.trim() || undefined,
      location: selectedModality === 'presencial' ? 'Sala de Atención a Padres (Pabellón A)' : undefined,
      meetLink: selectedModality === 'virtual' ? 'https://meet.google.com/edusense-tutoria-3b' : undefined,
    });

    setIsBookingModalOpen(false);
    setParentNotes('');
  };

  // Filter meetings for active child
  const childMeetings = meetingRequests.filter((m) => m.childId === activeChild.id);

  return (
    <div className="space-y-6">
      {/* Top Hero Section */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Atención a Padres y Tutoría</span>
            <span>·</span>
            <span>{activeChild.name} ({activeChild.grade})</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            Citas y Reuniones con Docentes
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Agenda sesiones presenciales o virtuales con los profesores de tu hijo de forma directa, sin intermediarios ni demoras.
          </p>
        </div>

        <button
          onClick={() => setIsBookingModalOpen(true)}
          className={`flex items-center gap-2 py-3 px-5 text-sm font-semibold rounded-2xl transition-all shadow-xs ${theme.primaryBg} ${theme.primaryHover} text-white hover:scale-[1.01]`}
        >
          <Plus className="w-4 h-4" />
          <span>Solicitar nueva cita</span>
        </button>
      </div>

      {/* Existing Appointments List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className={`w-4 h-4 ${theme.primaryText}`} />
            <span>Mis citas y solicitudes registradas ({childMeetings.length})</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Sincronizado con WhatsApp institucional</span>
        </div>

        {childMeetings.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-semibold text-slate-800">No tienes citas programadas</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Si deseas consultar sobre el avance académico o adaptación de tu hijo, puedes solicitar una reunión en el horario disponible de los docentes.
            </p>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className={`mt-2 py-2 px-4 text-xs font-semibold rounded-xl text-white ${theme.primaryBg} ${theme.primaryHover}`}
            >
              Agendar primera cita
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {childMeetings.map((meeting) => {
              const isConfirmed = meeting.status === 'confirmed';
              const isPending = meeting.status === 'pending';
              const isRescheduled = meeting.status === 'rescheduled';

              const teacher = teachers.find((t) => t.id === meeting.teacherId);

              return (
                <div
                  key={meeting.id}
                  className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-3xl p-5 shadow-xs transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header with teacher avatar and status badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={teacher?.avatarImg || activeChild.teacherAvatar}
                          alt={meeting.teacherName}
                          className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                        />
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 leading-tight">
                            {meeting.teacherName}
                          </h3>
                          <span className="text-xs text-slate-500 block">
                            {teacher?.role.split('·')[0] || 'Docente'}
                          </span>
                        </div>
                      </div>

                      {/* Clean state indicator */}
                      <div>
                        {isConfirmed && (
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirmada
                          </span>
                        )}
                        {isPending && (
                          <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Pendiente
                          </span>
                        )}
                        {isRescheduled && (
                          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Reprogramada
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Topic and date */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="font-semibold text-slate-900">{meeting.topicLabel}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600 pt-1 border-t border-slate-200/50">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{meeting.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium text-slate-800">{meeting.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {meeting.modality === 'presencial' ? (
                            <>
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>Presencial</span>
                            </>
                          ) : (
                            <>
                              <Video className="w-3.5 h-3.5 text-blue-500" />
                              <span className="text-blue-600 font-medium">Google Meet</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Notes if provided */}
                    {meeting.notes && (
                      <p className="text-xs text-slate-600 italic px-1">
                        &ldquo;{meeting.notes}&rdquo;
                      </p>
                    )}

                    {/* Teacher response note */}
                    {meeting.teacherResponseNote && (
                      <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/70 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Nota de la docente:</strong> {meeting.teacherResponseNote}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions / Links */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">
                      Registrada: {meeting.createdAt}
                    </span>

                    {meeting.modality === 'virtual' && meeting.meetLink && (
                      <a
                        href={meeting.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Enlace de videollamada</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    )}

                    {meeting.modality === 'presencial' && (
                      <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{meeting.location || 'Pabellón Primaria - Sala A'}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Teachers Directory Cards */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Docentes asignados a {activeChild.name} (Horarios de atención)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl flex flex-col justify-between space-y-3 hover:bg-slate-100/70 transition-colors"
            >
              <div className="space-y-2">
                <img
                  src={teacher.avatarImg}
                  alt={teacher.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                />
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{teacher.name}</h3>
                  <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                    {teacher.courses.join(', ')}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Próximos bloques:
                </span>
                <span className="text-xs text-slate-700 font-medium block truncate">
                  {teacher.availableSlots[0]
                    ? `${teacher.availableSlots[0].dayLabel} (${teacher.availableSlots[0].timeSlot})`
                    : 'Horario coordinable'}
                </span>
                <button
                  onClick={() => {
                    handleTeacherChange(teacher.id);
                    setIsBookingModalOpen(true);
                  }}
                  className={`mt-2 text-xs font-semibold ${theme.primaryText} hover:underline flex items-center gap-1`}
                >
                  <span>Pedir cita</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High-Fidelity Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 p-6 shadow-2xl max-h-[92vh] overflow-y-auto animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl ${theme.lightBg} border ${theme.lightBorder} flex items-center justify-center ${theme.primaryText}`}>
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Solicitar Cita con Docente
                  </h3>
                  <p className="text-xs text-slate-500">
                    Atención personalizada para {activeChild.name} ({activeChild.grade})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmRequest} className="mt-5 space-y-5">
              {/* Step 1: Teacher Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  1. Seleccionar docente
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {teachers.map((teacher) => (
                    <button
                      type="button"
                      key={teacher.id}
                      onClick={() => handleTeacherChange(teacher.id)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                        selectedTeacherId === teacher.id
                          ? `border-blue-600 bg-blue-50/60 shadow-xs ring-2 ring-blue-500/20`
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                      }`}
                    >
                      <img
                        src={teacher.avatarImg}
                        alt={teacher.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div className="truncate">
                        <span className="text-xs font-bold text-slate-900 block truncate">
                          {teacher.name}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate block">
                          {teacher.courses.join(', ')}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Topic Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  2. Motivo principal de la reunión
                </label>
                <div className="space-y-2">
                  {TOPIC_OPTIONS.map((topic) => (
                    <label
                      key={topic.id}
                      className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                        selectedTopic === topic.id
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500/20'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="topic"
                        checked={selectedTopic === topic.id}
                        onChange={() => setSelectedTopic(topic.id)}
                        className="w-4 h-4 accent-blue-600 mt-0.5"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {topic.label}
                        </span>
                        <span className="text-[11px] text-slate-500 block leading-relaxed mt-0.5">
                          {topic.desc}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Step 3: Modality Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  3. Modalidad preferida
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedModality('presencial')}
                    className={`py-2.5 px-3.5 rounded-2xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                      selectedModality === 'presencial'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Presencial en colegio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedModality('virtual')}
                    className={`py-2.5 px-3.5 rounded-2xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                      selectedModality === 'virtual'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Videollamada Google Meet</span>
                  </button>
                </div>
              </div>

              {/* Step 4: Available Slots Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  4. Horarios disponibles de {selectedTeacher.name}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedTeacher.availableSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot.id}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        selectedSlotId === slot.id
                          ? 'border-blue-600 bg-blue-50/80 font-bold text-blue-900 shadow-xs ring-1 ring-blue-500/20'
                          : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{slot.dayLabel}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {slot.timeSlot}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 5: Optional Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  5. Notas o consultas previas (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={parentNotes}
                  onChange={(e) => setParentNotes(e.target.value)}
                  placeholder="Detalla brevemente algún aspecto que desees que el docente tenga preparado para la sesión..."
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl p-3 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors resize-none"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="py-2.5 px-4 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`py-2.5 px-5 text-xs font-bold text-white rounded-xl transition-all shadow-xs flex items-center gap-2 ${theme.primaryBg} ${theme.primaryHover}`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirmar y agendar cita</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
