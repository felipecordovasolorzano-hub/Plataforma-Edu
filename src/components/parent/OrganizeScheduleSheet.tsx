import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import { X, Clock, AlertTriangle, Check, Sparkles } from 'lucide-react';

interface OrganizeScheduleSheetProps {
  task: Task;
  onClose: () => void;
}

export const OrganizeScheduleSheet: React.FC<OrganizeScheduleSheetProps> = ({ task, onClose }) => {
  const { scheduleFamilyTime, showToast } = useApp();

  const [selectedDay, setSelectedDay] = useState<'hoy' | 'manana' | 'fin_de_semana'>('hoy');
  const [selectedTime, setSelectedTime] = useState<string>('17:00');
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(task.hasReminder ?? true);
  const [reminderMinutes, setReminderMinutes] = useState<number>(task.reminderMinutesBefore || 30);

  // Check if family schedule is later than school due date
  // e.g., if task is due tomorrow 8:00 a.m. and family schedule is tomorrow 19:00, warn!
  const isAfterDeadline = selectedDay === 'fin_de_semana' && task.schoolDueDate.includes('Mañana');

  const handleConfirm = () => {
    let dayLabel = 'Hoy';
    if (selectedDay === 'manana') dayLabel = 'Mañana';
    if (selectedDay === 'fin_de_semana') dayLabel = 'Sábado';

    // Format time
    const [hourStr, minStr] = selectedTime.split(':');
    const hour = parseInt(hourStr, 10);
    const period = hour >= 12 ? 'p. m.' : 'a. m.';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const formattedTime = `${displayHour}:${minStr} ${period}`;

    const fullSchedule = `${dayLabel}, ${formattedTime}`;

    scheduleFamilyTime(task.id, fullSchedule, reminderEnabled, reminderMinutes);
    onClose();
  };

  const handleSuggestWithAI = () => {
    // Propose an optimal slot based on child's typical routine (e.g. 5:00 p.m. after afternoon snack)
    setSelectedDay('hoy');
    setSelectedTime('17:00');
    setReminderEnabled(true);
    setReminderMinutes(30);
    showToast('Horario sugerido por IA: Hoy 5:00 p. m. (30 min antes de la cena)', 'neutral');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-xl border border-[#DFE1E6] p-5 shadow-lg max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DFE1E6]">
          <div>
            <h3 className="text-base font-semibold text-[#1F2937]">Organizar horario en casa</h3>
            <p className="text-xs text-[#6B7280]">
              Define cuándo realizarán la tarea en familia sin modificar la entrega del colegio.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6B7280] hover:text-[#1F2937] rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task summary */}
        <div className="mt-4 p-3 bg-[#F4F5F7] rounded-lg border border-[#DFE1E6]">
          <span className="text-xs text-[#6B7280]">{task.course}</span>
          <h4 className="text-sm font-medium text-[#1F2937] mt-0.5">{task.title}</h4>
          
          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#475569]">
            <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>Entrega escolar fija: <strong>{task.schoolDueDate}</strong> (Solo lectura)</span>
          </div>
        </div>

        {/* AI suggestion button */}
        <div className="mt-4">
          <button
            onClick={handleSuggestWithAI}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg hover:bg-[#DBEAFE] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sugerir mejor momento con IA</span>
          </button>
        </div>

        {/* Day selection */}
        <div className="mt-4">
          <label className="block text-xs font-medium text-[#374151] mb-1.5">
            ¿Qué día la harán?
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSelectedDay('hoy')}
              className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors ${
                selectedDay === 'hoy'
                  ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]'
                  : 'border-[#DFE1E6] bg-white text-[#4B5563] hover:bg-[#F4F5F7]'
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => setSelectedDay('manana')}
              className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors ${
                selectedDay === 'manana'
                  ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]'
                  : 'border-[#DFE1E6] bg-white text-[#4B5563] hover:bg-[#F4F5F7]'
              }`}
            >
              Mañana
            </button>
            <button
              onClick={() => setSelectedDay('fin_de_semana')}
              className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors ${
                selectedDay === 'fin_de_semana'
                  ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]'
                  : 'border-[#DFE1E6] bg-white text-[#4B5563] hover:bg-[#F4F5F7]'
              }`}
            >
              Fin de semana
            </button>
          </div>
        </div>

        {/* Time selection */}
        <div className="mt-4">
          <label className="block text-xs font-medium text-[#374151] mb-1.5">
            Hora aproximada
          </label>
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-[#DFE1E6] rounded-lg focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        {/* Warning if scheduled after deadline */}
        {isAfterDeadline && (
          <div className="mt-3 p-2.5 bg-[#FEF3C7] border border-[#FCD34D] rounded-lg flex items-start gap-2 text-xs text-[#92400E]">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Atención: El horario elegido es posterior a la fecha de entrega escolar ({task.schoolDueDate}).
            </span>
          </div>
        )}

        {/* Reminder Settings */}
        <div className="mt-4 p-3 border border-[#DFE1E6] rounded-lg">
          <div className="flex items-center justify-between">
            <label htmlFor="reminder-toggle" className="text-xs font-medium text-[#1F2937]">
              Activar recordatorio familiar
            </label>
            <input
              id="reminder-toggle"
              type="checkbox"
              checked={reminderEnabled}
              onChange={(e) => setReminderEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#2563EB] rounded cursor-pointer"
            />
          </div>

          {reminderEnabled && (
            <div className="mt-2.5 pt-2.5 border-t border-[#DFE1E6] flex items-center justify-between text-xs">
              <span className="text-[#6B7280]">Avisar con anticipación:</span>
              <select
                value={reminderMinutes}
                onChange={(e) => setReminderMinutes(parseInt(e.target.value, 10))}
                className="px-2 py-1 border border-[#DFE1E6] rounded bg-white text-[#1F2937] text-xs focus:outline-none focus:border-[#2563EB]"
              >
                <option value={15}>15 minutos antes</option>
                <option value={30}>30 minutos antes</option>
                <option value={60}>1 hora antes</option>
                <option value={120}>2 horas antes</option>
              </select>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 text-xs font-medium text-[#4B5563] bg-[#F4F5F7] hover:bg-[#E5E7EB] rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-4 text-xs font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Guardar horario</span>
          </button>
        </div>
      </div>
    </div>
  );
};
