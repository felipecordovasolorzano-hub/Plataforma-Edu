export type Role = 'parent' | 'teacher' | 'student';
export type DeviceFrame = 'mobile' | 'tablet' | 'responsive';

export type ThemeColor = 'blue' | 'emerald' | 'warm' | 'indigo';

export type ChildId = 'mateo' | 'lucia';

export interface Child {
  id: ChildId;
  name: string;
  grade: string;
  section: string;
  avatar: string;
  avatarImg: string;
  schoolName: string;
  teacherName: string;
  teacherAvatar: string;
}

export type TaskType = 'tarea' | 'evaluacion' | 'material' | 'trabajo';

export interface Task {
  id: string;
  childId: ChildId;
  title: string;
  course: string;
  type: TaskType;
  // School deadline set by teacher (read-only for family)
  schoolDueDate: string; // e.g., 'Mañana, 6:00 p. m.'
  schoolDueTimestamp: string; // ISO date string for sorting/logic
  // Family scheduling (custom time to do the homework at home)
  familyScheduleDate?: string; // e.g., 'Hoy, 5:00 p. m.'
  familyScheduleTimestamp?: string;
  hasReminder?: boolean;
  reminderMinutesBefore?: number;
  
  status: 'pending' | 'organized' | 'completed';
  isNew?: boolean;
  hasChanged?: boolean;
  changeDetails?: {
    field: string;
    before: string;
    after: string;
    timestamp: string;
  };
  
  teacherName: string;
  instructions: string;
  materials: {
    id: string;
    name: string;
    acquired: boolean;
    requiredForDate: string;
  }[];
  attachments?: {
    id: string;
    name: string;
    size: string;
    type: 'pdf' | 'doc' | 'link';
  }[];
  studentSubmission?: {
    submittedAt: string;
    evidenceType: 'photo' | 'audio' | 'file';
    previewUrl?: string;
    status: 'received' | 'graded';
    note?: string;
  };
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  avatarImg: string;
  attendanceStatus: 'present' | 'late' | 'absent_unjustified' | 'absent_justified';
  checkInTime?: string;
  sensorRegistered: boolean;
  recentBehaviorBadges: {
    type: 'academic' | 'community' | 'participation' | 'improvement';
    label: string;
    timestamp: string;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'urgent' | 'assignment' | 'attendance' | 'change' | 'meeting';
  read: boolean;
  relatedTaskId?: string;
  relatedMeetingId?: string;
  childId?: ChildId;
}

export interface Badge {
  id: string;
  title: string;
  category: string;
  progress: number; // 0 to 100
  totalSteps: number;
  currentSteps: number;
  unlocked: boolean;
  iconName: string;
}

export type WhatsAppAlertTrigger =
  | 'assignment_new'
  | 'assignment_changed'
  | 'assignment_completed'
  | 'attendance_checkin'
  | 'meeting_scheduled'
  | 'meeting_confirmed';

export interface WhatsAppMessage {
  id: string;
  to: string; // e.g., '+51 987 654 321'
  recipientName: string; // 'Carolina (Mamá de Mateo)'
  message: string;
  timestamp: string;
  trigger: WhatsAppAlertTrigger;
  delivered: boolean;
  relatedTaskId?: string;
  relatedMeetingId?: string;
}

export interface WhatsAppSettings {
  phoneNumber: string;
  recipientName: string;
  enabledTriggers: {
    assignment_new: boolean;
    assignment_changed: boolean;
    assignment_completed: boolean;
    attendance_checkin: boolean;
    meeting_scheduled: boolean;
    meeting_confirmed: boolean;
  };
}

export interface TeacherProfile {
  id: string;
  name: string;
  role: string;
  avatarImg: string;
  courses: string[];
  availableSlots: {
    id: string;
    dayLabel: string; // e.g. "Viernes 26 Sep"
    timeSlot: string; // e.g. "16:30 - 17:00"
  }[];
}

export type MeetingTopic =
  | 'seguimiento_academico'
  | 'dificultad_evaluacion'
  | 'convivencia_adaptacion'
  | 'coordinacion_familiar'
  | 'otro';

export type MeetingModality = 'presencial' | 'virtual';

export interface MeetingRequest {
  id: string;
  parentName: string;
  parentPhone: string;
  childId: ChildId;
  childName: string;
  teacherId: string;
  teacherName: string;
  topic: MeetingTopic;
  topicLabel: string;
  modality: MeetingModality;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'completed';
  teacherResponseNote?: string;
  createdAt: string;
  meetLink?: string;
  location?: string;
}

export interface TeacherCourseSection {
  id: string;
  grade: string;
  section: string;
  course: string;
  studentCount: number;
  room: string;
  isMainHomeroom?: boolean;
}
