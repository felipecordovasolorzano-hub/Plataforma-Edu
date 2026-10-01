import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderToolbar } from './components/common/HeaderToolbar';
import { ToastContainer } from './components/common/Toast';
import { WhatsAppDrawer } from './components/whatsapp/WhatsAppDrawer';
import { ParentView } from './components/parent/ParentView';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { StudentView } from './components/student/StudentView';
import { THEME_CONFIGS } from './utils/theme';
import {
  Info,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Users,
  GraduationCap,
  Sparkles,
  Calendar,
  Layers,
  Palette,
  ShieldCheck,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { role, themeColor } = useApp();
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const theme = THEME_CONFIGS[themeColor];

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col font-sans text-slate-800">
      {/* Top Prototype Controls Toolbar */}
      <HeaderToolbar />

      {/* Main Desktop Viewport Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto">
        {role === 'parent' && <ParentView />}
        {role === 'teacher' && <TeacherDashboard />}
        {role === 'student' && <StudentView />}
      </div>

      {/* Prototype Testing Checklist & Evaluation Guide */}
      <footer className="bg-white/90 backdrop-blur-md border-t border-slate-200/80 py-4 px-4 text-xs mt-10">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => setIsGuideOpen(!isGuideOpen)}
            className="w-full flex items-center justify-between text-slate-600 hover:text-slate-900 transition-colors"
          >
            <div className="flex items-center gap-2.5 font-bold">
              <ShieldCheck className={`w-4 h-4 ${theme.primaryText}`} />
              <span className="text-slate-800">EduSense · Arquitectura de Super Alta Fidelidad & Alertas en Tiempo Real</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <span>{isGuideOpen ? 'Ocultar resumen' : 'Ver especificaciones y módulos'}</span>
              {isGuideOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {isGuideOpen && (
            <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 text-slate-600 animate-in fade-in leading-relaxed">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Palette className={`w-4 h-4 ${theme.primaryText}`} />
                  <span>Personalización de Color</span>
                </div>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>Paletas armónicas:</strong> Azul Institucional, Verde Educación, Tonos Cálidos e Índigo.</li>
                  <li>• <strong>Consistencia:</strong> Aplica de forma sutil a botones, bordes, estados activos y focus rings.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Citas y Reuniones con Docentes</span>
                </div>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>Padres:</strong> Selector de profesor, motivo pedagógico, calendario visual de bloques y modalidad.</li>
                  <li>• <strong>Docente:</strong> Panel para confirmar, reprogramar y redactar notas para las familias.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span>Selector de Cursos / Secciones</span>
                </div>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>Docente multiturno:</strong> Alterna entre 3.° B, 3.° A, 4.° B y adapta el aula y asistencia.</li>
                  <li>• <strong>Métricas en vivo:</strong> Cómputo de asistencia RFID y registro de incidencias en &lt; 3 clics.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Canal Oficial WhatsApp</span>
                </div>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>Alertas estructuradas:</strong> Tareas publicadas, entrega de evidencias y citas confirmadas.</li>
                  <li>• <strong>Drawer lateral:</strong> Simulación de mensajes oficiales con números y destinatarios reales.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </footer>

      {/* WhatsApp Slide-Over Drawer */}
      <WhatsAppDrawer />

      {/* Global Toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
