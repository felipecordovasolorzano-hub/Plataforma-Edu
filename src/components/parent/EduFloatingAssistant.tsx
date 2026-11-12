import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { EduAvatar } from './EduAvatar';
import { THEME_CONFIGS } from '../../utils/theme';
import { Task, MeetingRequest } from '../../types';
import {
  Send,
  X,
  Sparkles,
  ChevronDown,
  MessageCircle,
  HelpCircle,
  Calendar,
  Package,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Check,
  Clock,
  ArrowRight,
} from 'lucide-react';

export type CurrentWindowContext =
  | 'calendar_tasks'
  | 'meetings'
  | 'materials'
  | 'alerts'
  | 'overview';

interface ChatMessage {
  id: string;
  sender: 'edu' | 'user';
  text: string;
  timestamp: string;
  type?: 'general' | 'tasks_summary' | 'materials_list' | 'alerts_summary' | 'meeting_info';
  data?: any;
}

interface EduFloatingAssistantProps {
  currentWindow: CurrentWindowContext;
  selectedDateKey: string | null;
  onOpenMeetings: () => void;
  onOpenMaterials: () => void;
  onOpenAlerts: () => void;
  onSelectTask: (task: Task) => void;
}

export const EduFloatingAssistant: React.FC<EduFloatingAssistantProps> = ({
  currentWindow,
  selectedDateKey,
  onOpenMeetings,
  onOpenMaterials,
  onOpenAlerts,
  onSelectTask,
}) => {
  const {
    activeChild,
    activeChildTasks,
    toggleMaterialAcquired,
    notifications,
    meetingRequests,
    themeColor,
    showToast,
  } = useApp();

  const theme = THEME_CONFIGS[themeColor];

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [showGreetingBubble, setShowGreetingBubble] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Periodic greeting bubble: aparece de rato en rato, no de forma permanente (USER REQUIREMENT)
  useEffect(() => {
    if (isOpen) {
      setShowGreetingBubble(false);
      return;
    }

    let hideTimeout: NodeJS.Timeout;

    // Initial appearance after 3 seconds, remains for 6 seconds
    const initialTimer = setTimeout(() => {
      setShowGreetingBubble(true);
      hideTimeout = setTimeout(() => {
        setShowGreetingBubble(false);
      }, 6000);
    }, 3000);

    // Periodic reappearance: every 32 seconds, show for 6 seconds
    const intervalTimer = setInterval(() => {
      setShowGreetingBubble(true);
      hideTimeout = setTimeout(() => {
        setShowGreetingBubble(false);
      }, 6000);
    }, 32000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(hideTimeout);
      clearInterval(intervalTimer);
    };
  }, [isOpen]);

  // Friendly contextual badge text
  const windowContextLabels: Record<CurrentWindowContext, { label: string; icon: any }> = {
    calendar_tasks: { label: 'Calendario & Tareas', icon: Calendar },
    meetings: { label: 'Citas con Docentes', icon: Calendar },
    materials: { label: 'Materiales & Útiles', icon: Package },
    alerts: { label: 'Alertas & Asistencia RFID', icon: Bell },
    overview: { label: 'Rutinas & Resumen', icon: Sparkles },
  };

  // Generate contextual questions depending on the active window / screen
  const getContextualQuestions = (): { text: string; actionQuery: string }[] => {
    if (currentWindow === 'calendar_tasks') {
      if (selectedDateKey) {
        return [
          {
            text: `¿Qué se debe entregar en la fecha seleccionada?`,
            actionQuery: `¿Qué entregas hay para la fecha seleccionada?`,
          },
          {
            text: `¿Hay materiales o exámenes para este día?`,
            actionQuery: `¿Hay materiales o evaluaciones para este día?`,
          },
          {
            text: `¿Cuál es la tarea más urgente de esta fecha?`,
            actionQuery: `¿Cuál es la tarea más urgente de esta fecha?`,
          },
        ];
      }
      return [
        {
          text: `¿Cuáles son las tareas de alta prioridad de ${activeChild.name.split(' ')[0]}?`,
          actionQuery: `¿Cuáles son las tareas de alta prioridad?`,
        },
        {
          text: `¿Qué entregas corresponden a mañana viernes?`,
          actionQuery: `¿Qué debe entregar mañana viernes?`,
        },
        {
          text: `¿Cuándo es el próximo examen bimestral?`,
          actionQuery: `¿Cuándo es el próximo examen bimestral?`,
        },
        {
          text: `¿Qué materiales faltan comprar para las tareas?`,
          actionQuery: `¿Qué materiales debo comprar?`,
        },
      ];
    }

    if (currentWindow === 'meetings') {
      return [
        {
          text: `¿Cómo solicito una cita con la Prof. Patricia Solano?`,
          actionQuery: `¿Cómo solicito una cita con la Prof. Patricia Solano?`,
        },
        {
          text: `¿Qué horarios están disponibles esta semana?`,
          actionQuery: `¿Qué horarios están disponibles para citas con docentes?`,
        },
        {
          text: `¿Cuál es el estado de mis reuniones solicitadas?`,
          actionQuery: `¿Cuál es el estado de mis citas solicitadas?`,
        },
        {
          text: `¿Las reuniones pueden ser virtuales por Google Meet?`,
          actionQuery: `¿Las reuniones pueden ser virtuales por Google Meet?`,
        },
      ];
    }

    if (currentWindow === 'materials') {
      return [
        {
          text: `¿Qué materiales faltan comprar con urgencia para mañana?`,
          actionQuery: `¿Qué materiales debo comprar con urgencia para mañana?`,
        },
        {
          text: `¿Qué material agregó la profesora en Ciencia y Tecnología?`,
          actionQuery: `¿Qué material agregó la profesora en Ciencia y Tecnología?`,
        },
        {
          text: `¿Para qué clases de la semana se piden útiles?`,
          actionQuery: `¿Para qué clases se requieren materiales esta semana?`,
        },
      ];
    }

    if (currentWindow === 'alerts') {
      return [
        {
          text: `¿A qué hora registró ingreso ${activeChild.name.split(' ')[0]} hoy?`,
          actionQuery: `¿A qué hora registró ingreso escolar hoy?`,
        },
        {
          text: `¿Qué cambios recientes publicaron los profesores?`,
          actionQuery: `¿Hay alguna alerta o cambio de la profesora?`,
        },
        {
          text: `¿Qué alertas se han sincronizado con mi WhatsApp?`,
          actionQuery: `¿Qué alertas se han sincronizado con mi WhatsApp?`,
        },
      ];
    }

    // overview / default
    return [
      {
        text: `¿Cómo va el récord de asistencia este bimestre?`,
        actionQuery: `¿Cómo va el récord de asistencia escolar?`,
      },
      {
        text: `¿Qué insignias y hábitos ha desbloqueado ${activeChild.name.split(' ')[0]}?`,
        actionQuery: `¿Qué insignias y hábitos escolares tiene?`,
      },
      {
        text: `¿Qué horario en casa recomiendas para hacer los deberes?`,
        actionQuery: `¿Qué horario en casa recomiendas para las tareas?`,
      },
    ];
  };

  const contextualQuestions = getContextualQuestions();

  // Initial greeting
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-edu',
      sender: 'edu',
      text: `¡Hola Carolina! 👋 Soy EDU, tu asistente escolar inteligente para ${activeChild.name.split(' ')[0]}. Estoy listo para resolver cualquier duda sobre la pantalla donde te encuentras. Haz clic en las preguntas rápidas o escribe con tus palabras.`,
      timestamp: 'Ahora',
      type: 'general',
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // When active child changes
  useEffect(() => {
    setMessages([
      {
        id: `welcome-edu-${activeChild.id}-${Date.now()}`,
        sender: 'edu',
        text: `Cambiaste a la información de ${activeChild.name}. Estoy sincronizado con sus cursos (${activeChild.grade}) para responder tus consultas al instante.`,
        timestamp: 'Ahora',
        type: 'general',
      },
    ]);
  }, [activeChild.id]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Ahora',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsThinking(true);

    setTimeout(() => {
      const lower = query.toLowerCase();
      let response: ChatMessage;

      // 1. Materials inquiry
      if (
        lower.includes('material') ||
        lower.includes('comprar') ||
        lower.includes('útil') ||
        lower.includes('util') ||
        lower.includes('témpera') ||
        lower.includes('tempera') ||
        lower.includes('cartulina')
      ) {
        const allMaterials: { taskTitle: string; materialId: string; taskId: string; name: string; acquired: boolean; date: string }[] = [];
        activeChildTasks.forEach((t) => {
          t.materials?.forEach((m) => {
            allMaterials.push({
              taskTitle: t.title,
              taskId: t.id,
              materialId: m.id,
              name: m.name,
              acquired: m.acquired,
              date: m.requiredForDate,
            });
          });
        });

        const pending = allMaterials.filter((m) => !m.acquired);

        if (pending.length === 0) {
          response = {
            id: `edu-${Date.now()}`,
            sender: 'edu',
            text: `¡Todo listo! No tienes materiales pendientes de compra para ${activeChild.name.split(' ')[0]}. Todos los útiles requeridos ya están adquiridos.`,
            timestamp: 'Ahora',
            type: 'general',
          };
        } else {
          response = {
            id: `edu-${Date.now()}`,
            sender: 'edu',
            text: `Tienes ${pending.length} material(es) pendiente(s) por conseguir para sus clases de esta semana:`,
            timestamp: 'Ahora',
            type: 'materials_list',
            data: { materials: pending },
          };
        }
      }
      // 2. Tomorrow / Friday deliveries
      else if (lower.includes('mañana') || lower.includes('viernes')) {
        const tomorrowTasks = activeChildTasks.filter(
          (t) =>
            t.dueDayLabel?.toLowerCase().includes('mañana') ||
            t.dueDayLabel?.toLowerCase().includes('viernes') ||
            t.schoolDueDate.toLowerCase().includes('mañana') ||
            t.schoolDueDate.toLowerCase().includes('viernes')
        );

        response = {
          id: `edu-${Date.now()}`,
          sender: 'edu',
          text: `Para mañana viernes 26 de septiembre, ${activeChild.name.split(' ')[0]} tiene ${tomorrowTasks.length} actividad(es) registradas:`,
          timestamp: 'Ahora',
          type: 'tasks_summary',
          data: { tasks: tomorrowTasks },
        };
      }
      // 3. Exam / Bimestral
      else if (lower.includes('examen') || lower.includes('evaluacion') || lower.includes('evaluación')) {
        const exams = activeChildTasks.filter((t) => t.type === 'evaluacion');
        response = {
          id: `edu-${Date.now()}`,
          sender: 'edu',
          text: `La evaluación bimestral más cercana es: **${exams[0]?.title || 'Examen bimestral de Matemática'}** programada para el **${exams[0]?.dueDayLabel || 'Lunes 29 Sep'}**. Incluye multiplicación, división y fracciones.`,
          timestamp: 'Ahora',
          type: 'general',
        };
      }
      // 4. Meetings / Appointments
      else if (
        lower.includes('cita') ||
        lower.includes('reunión') ||
        lower.includes('reunion') ||
        lower.includes('tutora') ||
        lower.includes('horario')
      ) {
        const childMeetings = meetingRequests.filter((m) => m.childId === activeChild.id);
        response = {
          id: `edu-${Date.now()}`,
          sender: 'edu',
          text: childMeetings.length > 0
            ? `Tienes ${childMeetings.length} cita registrada con la ${activeChild.teacherName}. Las reuniones se pueden coordinar tanto presenciales como virtuales por Google Meet.`
            : `Puedes agendar una cita directamente con la ${activeChild.teacherName} para revisar el seguimiento académico o convivencia. ¿Deseas abrir el formulario de agendamiento?`,
          timestamp: 'Ahora',
          type: 'meeting_info',
          data: { meetings: childMeetings },
        };
      }
      // 5. Attendance & sensor
      else if (lower.includes('ingreso') || lower.includes('asistencia') || lower.includes('sensor') || lower.includes('torniquete')) {
        response = {
          id: `edu-${Date.now()}`,
          sender: 'edu',
          text: `Hoy ${activeChild.name.split(' ')[0]} registró ingreso a las **08:02 a. m.** mediante el sensor de torniquete RFID del Colegio San Agustín (Estado: Presente a tiempo). La confirmación se envió a tu canal oficial de WhatsApp.`,
          timestamp: 'Ahora',
          type: 'general',
        };
      }
      // 6. Alerts & Teacher changes
      else if (lower.includes('alerta') || lower.includes('cambio') || lower.includes('profesora') || lower.includes('miss')) {
        const changedTasks = activeChildTasks.filter((t) => t.hasChanged);
        response = {
          id: `edu-${Date.now()}`,
          sender: 'edu',
          text: `La docente de Ciencia y Tecnología (Prof. Patricia Solano) actualizó recientemente la lista de útiles: agregó **1 témpera azul y pincel N.° 6** para el taller de germinación de mañana viernes.`,
          timestamp: 'Ahora',
          type: 'alerts_summary',
          data: { changedTasks },
        };
      }
      // 7. General summary
      else {
        const pending = activeChildTasks.filter((t) => t.status !== 'completed');
        const highPriority = pending.filter((t) => t.priority === 'alta');
        response = {
          id: `edu-${Date.now()}`,
          sender: 'edu',
          text: `Actualmente hay ${pending.length} actividades escolares pendientes para ${activeChild.name.split(' ')[0]}, de las cuales ${highPriority.length} tienen prioridad alta. Recuerda que no hay horas límite de cierre forzadas: se organizan por el día escolar de entrega.`,
          timestamp: 'Ahora',
          type: 'tasks_summary',
          data: { tasks: pending.slice(0, 3) },
        };
      }

      setMessages((prev) => [...prev, response]);
      setIsThinking(false);
    }, 550);
  };

  const ContextIcon = windowContextLabels[currentWindow].icon;

  return (
    <>
      {/* Floating Character Avatar Button (Fixed Bottom-Right) */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-auto">
        {/* Animated Speech Bubble invitation when collapsed (USER REQUIREMENT: aparece de rato en rato) */}
        {!isOpen && showGreetingBubble && (
          <div
            onClick={() => setIsOpen(true)}
            className="mb-2.5 bg-white/95 backdrop-blur-md border border-slate-200/90 py-2 px-3.5 rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer hover:border-blue-400 hover:scale-105 transition-all text-xs font-semibold text-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300 group"
          >
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span>
              ¡Hola! <strong className="text-blue-600">Estoy aquí para ayudarte</strong>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowGreetingBubble(false);
              }}
              className="ml-1 p-0.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Ocultar mensaje"
              aria-label="Cerrar aviso"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Floating Avatar Trigger Button (Larger character avatar - USER REQUIREMENT) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-2 rounded-3xl transition-all duration-300 cursor-pointer shadow-2xl flex items-center justify-center ${
            isOpen
              ? 'bg-slate-900 ring-4 ring-blue-500/20 scale-95'
              : 'hover:scale-105 hover:-translate-y-1 active:scale-95 ring-4 ring-blue-500/30'
          }`}
          aria-label={isOpen ? 'Cerrar asistente EDU' : 'Abrir asistente EDU'}
          title="Abrir asistente de IA EDU"
        >
          {isOpen ? (
            <div className="w-16 h-16 flex items-center justify-center text-white bg-slate-900 rounded-2xl">
              <X className="w-7 h-7" />
            </div>
          ) : (
            <div className="relative">
              <EduAvatar size="xl" isThinking={false} />
              {/* Badge name */}
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm border-2 border-white">
                EDU
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Expanded Floating Popover Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 z-50 w-[92vw] sm:w-[420px] max-h-[600px] h-[580px] bg-white border border-slate-200/95 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header of Floating Panel */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <EduAvatar size="sm" />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight">EDU · Asistente IA</h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-400 text-slate-950">
                    En vivo
                  </span>
                </div>
                {/* Dynamic context badge according to current window */}
                <div className="flex items-center gap-1 text-[11px] text-blue-100 font-medium mt-0.5">
                  <ContextIcon className="w-3 h-3" />
                  <span>Ventana: <strong>{windowContextLabels[currentWindow].label}</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-blue-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              title="Minimizar asistente"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic Questions Accordion Bar based on the active window */}
          <div className="bg-slate-50 px-3.5 py-2.5 border-b border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Preguntas para esta pantalla:</span>
              </span>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded-md">
                1 clic
              </span>
            </div>

            <div className="space-y-1">
              {contextualQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.actionQuery)}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl bg-white hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 text-xs text-slate-700 font-medium transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate pr-2">{q.text}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Messages Flow Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in duration-150`}
              >
                <div
                  className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? `${theme.primaryBg} text-white rounded-br-xs shadow-xs font-medium`
                      : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Materials list rich card */}
                  {msg.type === 'materials_list' && msg.data?.materials && (
                    <div className="mt-2.5 space-y-2 pt-2 border-t border-slate-200">
                      {msg.data.materials.map((mat: any) => (
                        <div
                          key={mat.materialId}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 gap-2"
                        >
                          <div className="truncate">
                            <p className="font-bold text-[11px] truncate">{mat.name}</p>
                            <p className="text-[10px] text-slate-400">{mat.taskTitle} · {mat.date}</p>
                          </div>
                          <button
                            onClick={() => {
                              toggleMaterialAcquired(mat.taskId, mat.materialId);
                              showToast(`¡Material marcado como comprado!`, 'success');
                            }}
                            className="px-2 py-1 text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>Comprado</span>
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          onOpenMaterials();
                        }}
                        className={`w-full text-center text-[11px] font-bold ${theme.primaryText} hover:underline pt-1 block cursor-pointer`}
                      >
                        Abrir lista completa de materiales →
                      </button>
                    </div>
                  )}

                  {/* Tasks summary rich card */}
                  {msg.type === 'tasks_summary' && msg.data?.tasks && (
                    <div className="mt-2.5 space-y-2 pt-2 border-t border-slate-200">
                      {msg.data.tasks.map((task: Task) => (
                        <div
                          key={task.id}
                          onClick={() => {
                            setIsOpen(false);
                            onSelectTask(task);
                          }}
                          className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 cursor-pointer transition-all space-y-0.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] text-slate-900 truncate">
                              {task.title}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-white border text-slate-600">
                              {task.course}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span>{task.dueDayLabel || task.schoolDueDate}</span>
                            <span className="font-bold text-blue-600 hover:underline">Ver detalle</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Meeting info rich card */}
                  {msg.type === 'meeting_info' && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          onOpenMeetings();
                        }}
                        className={`w-full py-2 px-3 rounded-xl ${theme.primaryBg} text-white font-bold text-[11px] shadow-xs flex items-center justify-center gap-2 hover:opacity-95 transition-opacity cursor-pointer`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Abrir Agendamiento de Citas</span>
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl w-fit text-slate-500 text-xs shadow-2xs">
                <EduAvatar size="sm" isThinking={true} />
                <span>EDU está consultando los datos escolares...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Field */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-2xl p-1.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-400/20 transition-all"
            >
              <input
                type="text"
                placeholder={`Pregúntale a EDU sobre ${activeChild.name.split(' ')[0]}...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-transparent px-2.5 py-1 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className={`p-2 rounded-xl transition-all ${
                  inputMessage.trim()
                    ? `${theme.primaryBg} text-white shadow-xs cursor-pointer hover:opacity-90`
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
                aria-label="Enviar pregunta a EDU"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
