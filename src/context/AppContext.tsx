import React, { createContext, useContext, useState } from 'react';
import {
  Role,
  DeviceFrame,
  ThemeColor,
  ChildId,
  Child,
  Task,
  Student,
  NotificationItem,
  Badge,
  WhatsAppMessage,
  WhatsAppSettings,
  WhatsAppAlertTrigger,
  TeacherProfile,
  MeetingRequest,
  TeacherCourseSection,
} from '../types';
import {
  INITIAL_CHILDREN,
  INITIAL_TASKS,
  INITIAL_STUDENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_BADGES,
  INITIAL_WHATSAPP_MESSAGES,
  INITIAL_WHATSAPP_SETTINGS,
  INITIAL_TEACHERS,
  INITIAL_TEACHER_SECTIONS,
  INITIAL_MEETING_REQUESTS,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'neutral' | 'success' | 'warning' | 'whatsapp';
}

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  deviceFrame: DeviceFrame;
  setDeviceFrame: (frame: DeviceFrame) => void;
  
  // High-Fidelity Color Theme Customization
  themeColor: ThemeColor;
  setThemeColor: (theme: ThemeColor) => void;

  // Children & active selection
  childrenList: Child[];
  activeChildId: ChildId;
  setActiveChildId: (id: ChildId) => void;
  activeChild: Child;
  
  // Tasks
  tasks: Task[];
  activeChildTasks: Task[];
  toggleTaskComplete: (taskId: string) => void;
  scheduleFamilyTime: (
    taskId: string,
    familyScheduleDate: string,
    hasReminder: boolean,
    reminderMinutesBefore?: number
  ) => void;
  toggleMaterialAcquired: (taskId: string, materialId: string) => void;
  addTask: (newTask: Omit<Task, 'id'>) => void;
  submitStudentEvidence: (taskId: string, evidenceType: 'photo' | 'audio' | 'file', note?: string) => void;
  
  // Teacher Classroom Management
  students: Student[];
  updateStudentAttendance: (studentId: string, status: Student['attendanceStatus']) => void;
  addBehaviorFeedback: (studentIds: string[], type: 'academic' | 'community' | 'participation' | 'improvement', label: string) => void;
  sendArrivalAlertToParents: (studentId: string) => void;
  
  // Teacher Course & Section Switcher
  teacherSections: TeacherCourseSection[];
  activeTeacherSectionId: string;
  setActiveTeacherSectionId: (id: string) => void;
  activeTeacherSection: TeacherCourseSection;

  // Parent - Teacher Meetings & Tutoring Appointments
  teachers: TeacherProfile[];
  meetingRequests: MeetingRequest[];
  requestMeeting: (request: Omit<MeetingRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateMeetingStatus: (
    meetingId: string,
    status: MeetingRequest['status'],
    teacherNote?: string,
    rescheduledSlot?: string
  ) => void;

  // Badges & Student Hub
  badges: Badge[];
  
  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;

  // WhatsApp Alert System
  whatsAppMessages: WhatsAppMessage[];
  whatsAppSettings: WhatsAppSettings;
  updateWhatsAppSettings: (settings: Partial<WhatsAppSettings>) => void;
  sendWhatsAppAlert: (
    trigger: WhatsAppAlertTrigger,
    message: string,
    relatedTaskId?: string,
    relatedMeetingId?: string
  ) => void;
  isWhatsAppDrawerOpen: boolean;
  setIsWhatsAppDrawerOpen: (open: boolean) => void;
  
  // Modals & Active Views
  selectedTaskForDetail: Task | null;
  setSelectedTaskForDetail: (task: Task | null) => void;
  organizingTask: Task | null;
  setOrganizingTask: (task: Task | null) => void;
  submittingEvidenceTask: Task | null;
  setSubmittingEvidenceTask: (task: Task | null) => void;
  
  // Simulation triggers
  simulateTeacherMaterialChange: () => void;
  simulateSchoolSensorAttendance: () => void;
  resetAllData: () => void;
  
  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'neutral' | 'success' | 'warning' | 'whatsapp') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('parent');
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrame>('responsive');
  const [themeColor, setThemeColor] = useState<ThemeColor>('blue');

  const [childrenList] = useState<Child[]>(INITIAL_CHILDREN);
  const [activeChildId, setActiveChildId] = useState<ChildId>('mateo');
  
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  
  // Teacher Sections
  const [teacherSections] = useState<TeacherCourseSection[]>(INITIAL_TEACHER_SECTIONS);
  const [activeTeacherSectionId, setActiveTeacherSectionId] = useState<string>('sec-3b-mat');

  // Meetings
  const [teachers] = useState<TeacherProfile[]>(INITIAL_TEACHERS);
  const [meetingRequests, setMeetingRequests] = useState<MeetingRequest[]>(INITIAL_MEETING_REQUESTS);

  // WhatsApp System
  const [whatsAppMessages, setWhatsAppMessages] = useState<WhatsAppMessage[]>(INITIAL_WHATSAPP_MESSAGES);
  const [whatsAppSettings, setWhatsAppSettings] = useState<WhatsAppSettings>(INITIAL_WHATSAPP_SETTINGS);
  const [isWhatsAppDrawerOpen, setIsWhatsAppDrawerOpen] = useState<boolean>(false);

  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Task | null>(null);
  const [organizingTask, setOrganizingTask] = useState<Task | null>(null);
  const [submittingEvidenceTask, setSubmittingEvidenceTask] = useState<Task | null>(null);
  
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Unique ID generator
  const nextId = (prefix = 'id'): string => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}-${Math.floor(Math.random() * 10000)}`;
  };

  const showToast = (message: string, type: 'neutral' | 'success' | 'warning' | 'whatsapp' = 'neutral') => {
    const id = nextId('toast');
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const activeChild = childrenList.find((c) => c.id === activeChildId) || childrenList[0];
  const activeChildTasks = tasks.filter((t) => t.childId === activeChildId);
  const activeTeacherSection =
    teacherSections.find((s) => s.id === activeTeacherSectionId) || teacherSections[0];

  // Send WhatsApp alert
  const sendWhatsAppAlert = (
    trigger: WhatsAppAlertTrigger,
    message: string,
    relatedTaskId?: string,
    relatedMeetingId?: string
  ) => {
    if (!whatsAppSettings.enabledTriggers[trigger]) {
      return;
    }

    const timeStr = 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newWaMessage: WhatsAppMessage = {
      id: nextId('wa'),
      to: whatsAppSettings.phoneNumber,
      recipientName: whatsAppSettings.recipientName,
      timestamp: timeStr,
      trigger,
      delivered: true,
      message,
      relatedTaskId,
      relatedMeetingId,
    };

    setWhatsAppMessages((prev) => [newWaMessage, ...prev]);
    showToast(
      `Alerta enviada a WhatsApp de ${whatsAppSettings.recipientName} (${whatsAppSettings.phoneNumber})`,
      'whatsapp'
    );
  };

  const updateWhatsAppSettings = (newSettings: Partial<WhatsAppSettings>) => {
    setWhatsAppSettings((prev) => ({
      ...prev,
      ...newSettings,
      enabledTriggers: {
        ...prev.enabledTriggers,
        ...(newSettings.enabledTriggers || {}),
      },
    }));
    showToast('Configuración de alertas de WhatsApp actualizada', 'success');
  };

  // Toggle complete
  const toggleTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
    const target = tasks.find((t) => t.id === taskId);
    if (target) {
      const isNowCompleted = target.status !== 'completed';
      showToast(
        isNowCompleted ? `Completada: ${target.title}` : `Devuelta a pendientes: ${target.title}`,
        'success'
      );
      if (selectedTaskForDetail && selectedTaskForDetail.id === taskId) {
        setSelectedTaskForDetail((prev) => (prev ? { ...prev, status: isNowCompleted ? 'completed' : 'pending' } : null));
      }

      if (isNowCompleted) {
        sendWhatsAppAlert(
          'assignment_completed',
          `🏫 *EduSense — Colegio San Agustín*\n\n✅ *Tarea Completada en Casa*\n${activeChild.name} ha marcado lista la actividad de *${target.course}*:\n\n• *Título:* ${target.title}\n• *Entrega del colegio:* ${target.schoolDueDate}\n• *Estado:* Lista para revisión docente.`,
          taskId
        );
      }
    }
  };

  // Schedule family time
  const scheduleFamilyTime = (
    taskId: string,
    familyScheduleDate: string,
    hasReminder: boolean,
    reminderMinutesBefore: number = 30
  ) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            familyScheduleDate,
            hasReminder,
            reminderMinutesBefore,
            status: t.status === 'completed' ? 'completed' : 'organized',
          };
        }
        return t;
      })
    );
    setOrganizingTask(null);
    showToast(`Horario en casa programado: ${familyScheduleDate}`, 'success');
  };

  // Toggle material acquired
  const toggleMaterialAcquired = (taskId: string, materialId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedMaterials = t.materials.map((m) =>
            m.id === materialId ? { ...m, acquired: !m.acquired } : m
          );
          return { ...t, materials: updatedMaterials };
        }
        return t;
      })
    );
    if (selectedTaskForDetail && selectedTaskForDetail.id === taskId) {
      setSelectedTaskForDetail((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          materials: prev.materials.map((m) =>
            m.id === materialId ? { ...m, acquired: !m.acquired } : m
          ),
        };
      });
    }
  };

  // Teacher adds task -> Triggers WhatsApp alert
  const addTask = (newTaskData: Omit<Task, 'id'>) => {
    const newId = nextId('task-gen');
    const task: Task = {
      ...newTaskData,
      id: newId,
    };
    setTasks((prev) => [task, ...prev]);

    // Create in-app notification
    const newNotification: NotificationItem = {
      id: nextId('notif'),
      title: `Nueva tarea de ${task.course} asignada`,
      description: `${task.teacherName} publicó "${task.title}". Entrega escolar: ${task.schoolDueDate}.`,
      timestamp: 'Ahora mismo',
      type: 'assignment',
      read: false,
      relatedTaskId: newId,
      childId: task.childId,
    };
    setNotifications((prev) => [newNotification, ...prev]);
    showToast(`Tarea "${task.title}" publicada con éxito para ${activeTeacherSection.grade} ${activeTeacherSection.section}`, 'success');

    // Trigger WhatsApp Alert to Carolina
    sendWhatsAppAlert(
      'assignment_new',
      `🏫 *EduSense — Colegio San Agustín*\n\n📢 *Nueva Tarea Asignada*\nLa *${task.teacherName}* ha publicado una nueva actividad para ${activeTeacherSection.grade} - ${activeTeacherSection.section}:\n\n• *Curso:* ${task.course}\n• *Título:* ${task.title}\n• *Entrega escolar:* ${task.schoolDueDate}\n• *Instrucciones:* ${task.instructions.slice(0, 100)}...\n${task.materials.length > 0 ? `• *Materiales:* ${task.materials.map((m) => m.name).join(', ')}\n` : ''}\n👉 Consulta los detalles en EduSense.`,
      newId
    );
  };

  // Student submits evidence -> Triggers WhatsApp alert
  const submitStudentEvidence = (taskId: string, evidenceType: 'photo' | 'audio' | 'file', note?: string) => {
    const task = tasks.find((t) => t.id === taskId);
    const taskTitle = task ? task.title : 'Actividad escolar';
    const taskCourse = task ? task.course : 'Curso';

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'completed',
            studentSubmission: {
              submittedAt: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              evidenceType,
              note: note || 'Evidencia de trabajo adjunta por el estudiante',
              status: 'received',
            },
          };
        }
        return t;
      })
    );

    // Update badges
    setBadges((prev) =>
      prev.map((b) => {
        if (b.id === 'badge-1' && b.currentSteps < b.totalSteps) {
          const next = b.currentSteps + 1;
          return {
            ...b,
            currentSteps: next,
            progress: Math.round((next / b.totalSteps) * 100),
            unlocked: next >= b.totalSteps,
          };
        }
        return b;
      })
    );

    setSubmittingEvidenceTask(null);
    showToast('¡Evidencia entregada a la profesora Patricia con éxito!', 'success');

    // Send WhatsApp notification to parent
    sendWhatsAppAlert(
      'assignment_completed',
      `🏫 *EduSense — Colegio San Agustín*\n\n📸 *Evidencia Escolar Entregada*\n*Mateo Córdova* ha subido su entregable para *${taskCourse}*:\n\n• *Tarea:* ${taskTitle}\n• *Tipo de entrega:* ${evidenceType === 'photo' ? 'Fotografía de cuaderno' : evidenceType === 'audio' ? 'Nota de voz' : 'Archivo digital'}\n• *Estado:* Recibido por la Prof. Patricia Solano.`,
      taskId
    );
  };

  // Parent requests meeting with a teacher
  const requestMeeting = (requestData: Omit<MeetingRequest, 'id' | 'createdAt' | 'status'>) => {
    const newId = nextId('meet');
    const newMeeting: MeetingRequest = {
      ...requestData,
      id: newId,
      status: 'pending',
      createdAt: 'Ahora mismo',
    };
    setMeetingRequests((prev) => [newMeeting, ...prev]);

    // Create notification
    const newNotif: NotificationItem = {
      id: nextId('notif-meet'),
      title: `Cita solicitada con ${requestData.teacherName}`,
      description: `Reunión para el ${requestData.date} (${requestData.timeSlot}). Estado: Pendiente de confirmación.`,
      timestamp: 'Ahora mismo',
      type: 'meeting',
      read: false,
      relatedMeetingId: newId,
      childId: requestData.childId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Solicitud de cita enviada a ${requestData.teacherName}`, 'success');

    // Send WhatsApp alert
    sendWhatsAppAlert(
      'meeting_scheduled',
      `🏫 *EduSense — Cita con Docente*\n\n📅 *Solicitud de Reunión Registrada*\nEstimada ${requestData.parentName}, tu solicitud de cita con *${requestData.teacherName}* ha sido registrada:\n\n• *Estudiante:* ${requestData.childName}\n• *Motivo:* ${requestData.topicLabel}\n• *Fecha y Hora:* ${requestData.date} (${requestData.timeSlot})\n• *Modalidad:* ${requestData.modality === 'presencial' ? 'Presencial en colegio' : 'Videollamada Google Meet'}\n\nLa docente revisará la solicitud y te confirmará por este medio.`,
      undefined,
      newId
    );
  };

  // Teacher manages meeting request (Accept, Reschedule)
  const updateMeetingStatus = (
    meetingId: string,
    status: MeetingRequest['status'],
    teacherNote?: string,
    rescheduledSlot?: string
  ) => {
    setMeetingRequests((prev) =>
      prev.map((m) => {
        if (m.id === meetingId) {
          return {
            ...m,
            status,
            teacherResponseNote: teacherNote || m.teacherResponseNote,
            timeSlot: rescheduledSlot || m.timeSlot,
            meetLink: m.modality === 'virtual' && !m.meetLink ? 'https://meet.google.com/edusense-tutoria-3b' : m.meetLink,
            location: m.modality === 'presencial' && !m.location ? 'Sala de Atención a Padres (Pabellón A)' : m.location,
          };
        }
        return m;
      })
    );

    const targetMeeting = meetingRequests.find((m) => m.id === meetingId);
    if (!targetMeeting) return;

    if (status === 'confirmed') {
      showToast(`Cita con ${targetMeeting.parentName} confirmada con éxito`, 'success');
      sendWhatsAppAlert(
        'meeting_confirmed',
        `🏫 *EduSense — Cita Confirmada*\n\n✅ *Reunión Aceptada por el Docente*\nLa *${targetMeeting.teacherName}* ha confirmado la cita con ${targetMeeting.parentName}:\n\n• *Estudiante:* ${targetMeeting.childName}\n• *Fecha y Hora:* ${targetMeeting.date} (${rescheduledSlot || targetMeeting.timeSlot})\n• *Modalidad:* ${targetMeeting.modality === 'presencial' ? 'Presencial: Sala de Atención a Padres (Pabellón A)' : 'Google Meet: https://meet.google.com/edusense-tutoria-3b'}\n${teacherNote ? `• *Mensaje del docente:* ${teacherNote}\n` : ''}\n¡Te esperamos puntualmente!`
      );
    } else if (status === 'rescheduled') {
      showToast(`Propuesta de reprogramación enviada a la familia`, 'neutral');
      sendWhatsAppAlert(
        'meeting_confirmed',
        `🏫 *EduSense — Reprogramación de Cita*\n\n⚠️ *Horario Actualizado*\nLa *${targetMeeting.teacherName}* propone un nuevo bloque para la reunión de ${targetMeeting.childName}:\n\n• *Nuevo Horario:* ${targetMeeting.date} (${rescheduledSlot || targetMeeting.timeSlot})\n• *Motivo de ajuste:* ${teacherNote || 'Cruce con sesión de claustro docente'}.\n\nPor favor ingresa a EduSense para validar la nueva fecha.`
      );
    }
  };

  // Teacher attendance update
  const updateStudentAttendance = (studentId: string, status: Student['attendanceStatus']) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, attendanceStatus: status } : s))
    );
    showToast('Estado de asistencia actualizado', 'neutral');
  };

  // Teacher group behavior feedback
  const addBehaviorFeedback = (
    studentIds: string[],
    type: 'academic' | 'community' | 'participation' | 'improvement',
    label: string
  ) => {
    const timestamp = 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setStudents((prev) =>
      prev.map((s) => {
        if (studentIds.includes(s.id)) {
          return {
            ...s,
            recentBehaviorBadges: [{ type, label, timestamp }, ...s.recentBehaviorBadges],
          };
        }
        return s;
      })
    );
    showToast(`Retroalimentación "${label}" registrada para ${studentIds.length} estudiante(s)`, 'success');
  };

  // Send arrival alert -> Triggers WhatsApp alert
  const sendArrivalAlertToParents = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const notif: NotificationItem = {
      id: nextId('notif-arr'),
      title: `Confirmación de presencia escolar: ${student.name}`,
      description: `${student.name} fue registrado por el docente en aula a las ${timeStr}.`,
      timestamp: 'Ahora mismo',
      type: 'attendance',
      read: false,
      childId: student.id === 'std-1' ? 'mateo' : undefined,
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast(`Notificación de ingreso enviada a la familia de ${student.name}`, 'neutral');

    // Trigger WhatsApp
    sendWhatsAppAlert(
      'attendance_checkin',
      `🏫 *EduSense — Control de Presencia*\n\n✅ *Confirmación de Ingreso en Aula*\nEl docente ha registrado la asistencia de *${student.name}* a las *${timeStr}* en ${activeTeacherSection.grade} - ${activeTeacherSection.section}.`
    );
  };

  // Notifications helpers
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };
  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Todas las notificaciones marcadas como leídas', 'neutral');
  };

  // Simulation: Teacher modifies materials -> Triggers WhatsApp alert
  const simulateTeacherMaterialChange = () => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === 'task-cie-1') {
          return {
            ...t,
            hasChanged: true,
            changeDetails: {
              field: 'Materiales requeridos',
              before: '1 pliego de cartulina blanca',
              after: '1 pliego de cartulina blanca + témpera azul y pincel N.° 6 (URGENTE)',
              timestamp: 'Hoy, 7:40 p. m.',
            },
            materials: [
              { id: 'm3', name: '1 pliego de cartulina blanca', acquired: true, requiredForDate: 'Mañana' },
              { id: 'm4', name: 'Témpera azul y pincel N.° 6 (Agregado recientemente)', acquired: false, requiredForDate: 'Mañana' },
            ],
          };
        }
        return t;
      })
    );

    const newNotif: NotificationItem = {
      id: nextId('notif-change'),
      title: 'Cambió el material de Ciencia para mañana',
      description: 'Prof. Patricia Solano agregó témpera azul y pincel N.° 6 para la sesión de mañana.',
      timestamp: 'Ahora mismo',
      type: 'change',
      read: false,
      relatedTaskId: 'task-cie-1',
      childId: 'mateo',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast('Simulado: La docente modificó los materiales de Ciencia y Tecnología', 'warning');

    // Trigger WhatsApp Alert to Carolina
    sendWhatsAppAlert(
      'assignment_changed',
      '🏫 *EduSense — Alerta Prioritaria*\n\n⚠️ *Actualización de Materiales Escolares*\nEstimada Carolina, la *Prof. Patricia Solano* ha actualizado los materiales de *Ciencia y Tecnología* para 3.° B:\n\n• *Tarea:* Ecosistemas y germinación\n• *Cambio:* Se agregó *témpera azul y pincel N.° 6*\n• *Para cuándo:* Mañana viernes, 8:00 a. m.\n\nPor favor verificar en la mochila de Mateo.',
      'task-cie-1'
    );
  };

  // Simulation: RFID Sensor attendance -> Triggers WhatsApp alert
  const simulateSchoolSensorAttendance = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === 'std-1') {
          return {
            ...s,
            attendanceStatus: 'present',
            checkInTime: timeStr,
            sensorRegistered: true,
          };
        }
        return s;
      })
    );
    const newNotif: NotificationItem = {
      id: nextId('notif-sensor'),
      title: 'Ingreso registrado en torniquete escolar',
      description: `Mateo Córdova validó ingreso en la entrada principal a las ${timeStr}.`,
      timestamp: 'Ahora mismo',
      type: 'attendance',
      read: false,
      childId: 'mateo',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast('Simulado: Sensor RFID detectó ingreso escolar de Mateo', 'neutral');

    // Trigger WhatsApp Alert to Carolina
    sendWhatsAppAlert(
      'attendance_checkin',
      `🏫 *EduSense — Confirmación de Ingreso Escolar*\n\n✅ *Registro en Puerta Principal*\nMateo Córdova registró ingreso en la entrada a las *${timeStr}* (Sensor torniquete A-1). ¡Que tenga un excelente día!`
    );
  };

  const resetAllData = () => {
    setTasks(INITIAL_TASKS);
    setStudents(INITIAL_STUDENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setBadges(INITIAL_BADGES);
    setWhatsAppMessages(INITIAL_WHATSAPP_MESSAGES);
    setWhatsAppSettings(INITIAL_WHATSAPP_SETTINGS);
    setMeetingRequests(INITIAL_MEETING_REQUESTS);
    setActiveChildId('mateo');
    setActiveTeacherSectionId('sec-3b-mat');
    setSelectedTaskForDetail(null);
    setOrganizingTask(null);
    setSubmittingEvidenceTask(null);
    showToast('Datos restablecidos a la configuración inicial de EduSense', 'neutral');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        deviceFrame,
        setDeviceFrame,
        themeColor,
        setThemeColor,
        childrenList,
        activeChildId,
        setActiveChildId,
        activeChild,
        tasks,
        activeChildTasks,
        toggleTaskComplete,
        scheduleFamilyTime,
        toggleMaterialAcquired,
        addTask,
        submitStudentEvidence,
        students,
        updateStudentAttendance,
        addBehaviorFeedback,
        sendArrivalAlertToParents,
        teacherSections,
        activeTeacherSectionId,
        setActiveTeacherSectionId,
        activeTeacherSection,
        teachers,
        meetingRequests,
        requestMeeting,
        updateMeetingStatus,
        badges,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        whatsAppMessages,
        whatsAppSettings,
        updateWhatsAppSettings,
        sendWhatsAppAlert,
        isWhatsAppDrawerOpen,
        setIsWhatsAppDrawerOpen,
        selectedTaskForDetail,
        setSelectedTaskForDetail,
        organizingTask,
        setOrganizingTask,
        submittingEvidenceTask,
        setSubmittingEvidenceTask,
        simulateTeacherMaterialChange,
        simulateSchoolSensorAttendance,
        resetAllData,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
