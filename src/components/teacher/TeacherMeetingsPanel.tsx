import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MeetingRequest } from '../../types';
import { THEME_CONFIGS } from '../../utils/theme';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Check,
  RefreshCw,
  MessageSquare,
  ExternalLink,
  X,
  Phone,
  User,
  Filter,
} from 'lucide-react';

export const TeacherMeetingsPanel: React.FC = () => {
  const {
    meetingRequests,
    updateMeetingStatus,
    themeColor,
    showToast,
  } = useApp();

  const theme = THEME_CONFIGS[themeColor];

  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'confirmed'>('pending');
  const [reschedulingMeeting, setReschedulingMeeting] = useState<MeetingRequest | null>(null);
  const [rescheduleSlot, setRescheduleSlot] = useState<string>('Lunes 29 Sep (17:00 - 17:30)');
  const [teacherJustification, setTeacherJustification] = useState<string>('Reunión de departamento pedagógico a esa misma hora.');

  const filteredMeetings = meetingRequests.filter((m) => {
    if (filterMode === 'pending') return m.status === 'pending';
    if (filterMode === 'confirmed') return m.status === 'confirmed';
    return true;
  });

  const pendingCount = meetingRequests.filter((m) => m.status === 'pending').length;

  const handleAccept = (meeting: MeetingRequest) => {
    updateMeetingStatus(meeting.id, 'confirmed', 'Confirmada la sesión. Compartiremos el informe del estudiante.');
  };

  const handleConfirmReschedule = () => {
    if (!reschedulingMeeting) return;
    updateMeetingStatus(
      reschedulingMeeting.id,
      'rescheduled',
      teacherJustification.trim(),
      rescheduleSlot
    );
    setReschedulingMeeting(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Gestión Pedagógica y Tutoría
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5 tracking-tight">
            Panel de Citas y Reuniones con Familias
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gestiona, confirma o reprograma las solicitudes de entrevista pedagógica enviadas por los padres.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 w-fit">
          <button
            onClick={() => setFilterMode('pending')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              filterMode === 'pending'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pendientes de confirmación ({pendingCount})
          </button>
          <button
            onClick={() => setFilterMode('confirmed')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              filterMode === 'confirmed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Confirmadas ({meetingRequests.filter((m) => m.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              filterMode === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas ({meetingRequests.length})
          </button>
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-2">
            <CheckCircle2 className="w-9 h-9 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">
              {filterMode === 'pending'
                ? 'No tienes solicitudes pendientes de revisión'
                : 'Sin citas en esta categoría'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Todas las solicitudes de los padres han sido respondidas oportunamente.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredMeetings.map((meeting) => {
              const isPending = meeting.status === 'pending';
              const isConfirmed = meeting.status === 'confirmed';
              const isRescheduled = meeting.status === 'rescheduled';

              return (
                <div
                  key={meeting.id}
                  className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-3xl p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: Parent and Student Details */}
                  <div className="space-y-2 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {meeting.parentName}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                        Alumno: {meeting.childName}
                      </span>
                      <span className="text-xs text-slate-500">
                        Tel: {meeting.parentPhone}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 space-y-1">
                      <p className="font-semibold text-slate-800">
                        Motivo: <span className="font-normal text-slate-600">{meeting.topicLabel}</span>
                      </p>
                      {meeting.notes && (
                        <p className="text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                          &ldquo;{meeting.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Schedule & Modality Tag */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-800">{meeting.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-900">{meeting.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {meeting.modality === 'presencial' ? (
                          <>
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>Presencial: Sala A</span>
                          </>
                        ) : (
                          <>
                            <Video className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-blue-600 font-semibold">Google Meet</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                    {isPending && (
                      <>
                        <button
                          onClick={() => setReschedulingMeeting(meeting)}
                          className="py-2 px-3.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                          Reprogramar
                        </button>
                        <button
                          onClick={() => handleAccept(meeting)}
                          className={`py-2 px-4 text-xs font-bold text-white rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 ${theme.primaryBg} ${theme.primaryHover}`}
                        >
                          <Check className="w-4 h-4" />
                          <span>Aceptar cita</span>
                        </button>
                      </>
                    )}

                    {isConfirmed && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirmada</span>
                        </span>
                        {meeting.modality === 'virtual' && meeting.meetLink && (
                          <a
                            href={meeting.meetLink}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-xl transition-colors"
                            title="Abrir Google Meet"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}

                    {isRescheduled && (
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>Propuesta enviada</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {reschedulingMeeting && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Reprogramar Cita con {reschedulingMeeting.parentName}
              </h3>
              <button
                onClick={() => setReschedulingMeeting(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1">
              <span className="text-slate-500 font-medium">Horario solicitado por el padre:</span>
              <p className="font-bold text-slate-800">
                {reschedulingMeeting.date} ({reschedulingMeeting.timeSlot})
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Proponer nuevo bloque disponible:
              </label>
              <select
                value={rescheduleSlot}
                onChange={(e) => setRescheduleSlot(e.target.value)}
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl p-3 focus:outline-none focus:border-blue-600"
              >
                <option value="Viernes 26 Sep (17:15 - 17:45)">Viernes 26 Sep (17:15 - 17:45)</option>
                <option value="Lunes 29 Sep (16:00 - 16:30)">Lunes 29 Sep (16:00 - 16:30)</option>
                <option value="Lunes 29 Sep (17:00 - 17:30)">Lunes 29 Sep (17:00 - 17:30)</option>
                <option value="Martes 30 Sep (17:00 - 17:30)">Martes 30 Sep (17:00 - 17:30)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Mensaje o justificación para la familia:
              </label>
              <textarea
                rows={2}
                value={teacherJustification}
                onChange={(e) => setTeacherJustification(e.target.value)}
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl p-3 focus:outline-none focus:border-blue-600 resize-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setReschedulingMeeting(null)}
                className="py-2.5 px-4 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReschedule}
                className={`py-2.5 px-5 text-xs font-bold text-white rounded-xl ${theme.primaryBg} ${theme.primaryHover}`}
              >
                Enviar reprogramación a WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
