import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageCircle,
  X,
  Send,
  CheckCheck,
  Phone,
  Settings,
  Copy,
  ExternalLink,
  Bell,
  Check,
} from 'lucide-react';

export const WhatsAppDrawer: React.FC = () => {
  const {
    whatsAppMessages,
    whatsAppSettings,
    updateWhatsAppSettings,
    isWhatsAppDrawerOpen,
    setIsWhatsAppDrawerOpen,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'chat' | 'settings'>('chat');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isWhatsAppDrawerOpen) return null;

  const handleCopyMessage = (msgId: string, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(msgId);
      setTimeout(() => setCopiedId(null), 2000);
      showToast('Mensaje de WhatsApp copiado al portapapeles', 'neutral');
    }
  };

  const handleOpenWebWhatsApp = (messageText: string) => {
    const encoded = encodeURIComponent(messageText);
    const url = `https://api.whatsapp.com/send?phone=${whatsAppSettings.phoneNumber.replace(/[^0-9]/g, '')}&text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Render WhatsApp markdown bold and italic
  const renderFormattedWhatsAppText = (text: string) => {
    return text.split('\n').map((line, lineIdx) => {
      // replace *word* with <strong>word</strong>
      const parts = line.split(/(\*[^*]+\*|_[^_]+_)/g);
      return (
        <span key={`line-${lineIdx}`} className="block min-h-[1.1em]">
          {parts.map((part, partIdx) => {
            const key = `part-${lineIdx}-${partIdx}`;
            if (part.startsWith('*') && part.endsWith('*')) {
              return (
                <strong key={key} className="font-semibold text-[#111827]">
                  {part.slice(1, -1)}
                </strong>
              );
            }
            if (part.startsWith('_') && part.endsWith('_')) {
              return (
                <em key={key} className="italic text-[#4B5563]">
                  {part.slice(1, -1)}
                </em>
              );
            }
            return <span key={key}>{part}</span>;
          })}
        </span>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md h-full flex flex-col border-l border-[#DFE1E6] shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="bg-[#128C7E] text-white p-4 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-sm leading-tight">Colegio San Agustín</h3>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-medium">Oficial</span>
              </div>
              <p className="text-[11px] text-white/80">Canal automatizado de alertas para familias</p>
            </div>
          </div>
          <button
            onClick={() => setIsWhatsAppDrawerOpen(false)}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Cerrar WhatsApp"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recipient bar and navigation tabs */}
        <div className="bg-[#F4F5F7] border-b border-[#DFE1E6] px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="font-medium text-[#1F2937]">{whatsAppSettings.recipientName}</span>
            <span className="text-[#6B7280]">({whatsAppSettings.phoneNumber})</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'chat'
                  ? 'bg-white text-[#1F2937] shadow-xs'
                  : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
            >
              Mensajes ({whatsAppMessages.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'settings'
                  ? 'bg-white text-[#1F2937] shadow-xs'
                  : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
            >
              <Settings className="w-3.5 h-3.5 inline mr-1" />
              Configurar
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#E5DDD5]/30 space-y-3">
          {activeTab === 'chat' && (
            <>
              <div className="text-center">
                <span className="text-[11px] bg-white/80 border border-[#DFE1E6] px-2.5 py-1 rounded-md text-[#6B7280] inline-block shadow-2xs">
                  Las alertas se generan en tiempo real al publicar tareas, registrar asistencia o entregar evidencias.
                </span>
              </div>

              {whatsAppMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white p-3.5 rounded-xl rounded-tl-none border border-[#DFE1E6] shadow-xs max-w-[92%] space-y-2 animate-in fade-in"
                >
                  <div className="text-xs text-[#374151] leading-relaxed">
                    {renderFormattedWhatsAppText(msg.message)}
                  </div>

                  <div className="pt-2 border-t border-[#F4F5F7] flex items-center justify-between text-[11px] text-[#6B7280]">
                    <div className="flex items-center gap-1 text-[#2563EB]">
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Entregado a WhatsApp</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.message)}
                        title="Copiar texto"
                        className="text-[#6B7280] hover:text-[#1F2937] transition-colors"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-[#2563EB]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleOpenWebWhatsApp(msg.message)}
                        title="Abrir en WhatsApp Web"
                        className="text-[#128C7E] hover:underline flex items-center gap-0.5"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-4 rounded-xl border border-[#DFE1E6] space-y-4 shadow-xs">
              <div>
                <h4 className="text-xs font-semibold text-[#1F2937] uppercase tracking-wider">
                  Destinatario principal de alertas
                </h4>
                <div className="mt-2 space-y-2 text-xs">
                  <div>
                    <label className="block text-[#6B7280] mb-1">Nombre o parentesco</label>
                    <input
                      type="text"
                      value={whatsAppSettings.recipientName}
                      onChange={(e) =>
                        updateWhatsAppSettings({ recipientName: e.target.value })
                      }
                      className="w-full px-3 py-1.5 border border-[#DFE1E6] rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[#6B7280] mb-1">Número de celular WhatsApp</label>
                    <input
                      type="text"
                      value={whatsAppSettings.phoneNumber}
                      onChange={(e) =>
                        updateWhatsAppSettings({ phoneNumber: e.target.value })
                      }
                      className="w-full px-3 py-1.5 border border-[#DFE1E6] rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#DFE1E6]">
                <h4 className="text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-2">
                  Disparadores activos por WhatsApp
                </h4>
                <div className="space-y-2.5 text-xs text-[#374151]">
                  <label className="flex items-start justify-between gap-2 cursor-pointer">
                    <div>
                      <span className="font-medium block">Nueva tarea asignada</span>
                      <span className="text-[11px] text-[#6B7280]">
                        Envía resumen cuando un docente publica una tarea en el aula.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={whatsAppSettings.enabledTriggers.assignment_new}
                      onChange={(e) =>
                        updateWhatsAppSettings({
                          enabledTriggers: {
                            ...whatsAppSettings.enabledTriggers,
                            assignment_new: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 accent-[#128C7E] rounded cursor-pointer mt-0.5"
                    />
                  </label>

                  <label className="flex items-start justify-between gap-2 cursor-pointer pt-2 border-t border-[#F4F5F7]">
                    <div>
                      <span className="font-medium block">Cambio de material o fecha urgente</span>
                      <span className="text-[11px] text-[#6B7280]">
                        Alerta prioritaria si un docente actualiza materiales (ej. témpera).
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={whatsAppSettings.enabledTriggers.assignment_changed}
                      onChange={(e) =>
                        updateWhatsAppSettings({
                          enabledTriggers: {
                            ...whatsAppSettings.enabledTriggers,
                            assignment_changed: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 accent-[#128C7E] rounded cursor-pointer mt-0.5"
                    />
                  </label>

                  <label className="flex items-start justify-between gap-2 cursor-pointer pt-2 border-t border-[#F4F5F7]">
                    <div>
                      <span className="font-medium block">Evidencia de estudiante entregada</span>
                      <span className="text-[11px] text-[#6B7280]">
                        Aviso a la familia cuando el hijo envía foto/audio de su tarea.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={whatsAppSettings.enabledTriggers.assignment_completed}
                      onChange={(e) =>
                        updateWhatsAppSettings({
                          enabledTriggers: {
                            ...whatsAppSettings.enabledTriggers,
                            assignment_completed: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 accent-[#128C7E] rounded cursor-pointer mt-0.5"
                    />
                  </label>

                  <label className="flex items-start justify-between gap-2 cursor-pointer pt-2 border-t border-[#F4F5F7]">
                    <div>
                      <span className="font-medium block">Sensor de torniquete / Asistencia</span>
                      <span className="text-[11px] text-[#6B7280]">
                        Confirmación de ingreso al ingresar al colegio por la mañana.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={whatsAppSettings.enabledTriggers.attendance_checkin}
                      onChange={(e) =>
                        updateWhatsAppSettings({
                          enabledTriggers: {
                            ...whatsAppSettings.enabledTriggers,
                            attendance_checkin: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 accent-[#128C7E] rounded cursor-pointer mt-0.5"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-white border-t border-[#DFE1E6] flex items-center justify-between text-xs text-[#6B7280]">
          <span>Canal de salida verificado</span>
          <button
            onClick={() => setIsWhatsAppDrawerOpen(false)}
            className="font-medium text-[#2563EB] hover:underline"
          >
            Cerrar panel
          </button>
        </div>
      </div>
    </div>
  );
};
