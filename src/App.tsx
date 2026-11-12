import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderToolbar } from './components/common/HeaderToolbar';
import { ToastContainer } from './components/common/Toast';
import { WhatsAppDrawer } from './components/whatsapp/WhatsAppDrawer';
import { ParentView } from './components/parent/ParentView';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { StudentView } from './components/student/StudentView';
import { LoginView } from './components/auth/LoginView';
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
  const { role, themeColor, isAuthenticated, login } = useApp();
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const theme = THEME_CONFIGS[themeColor];

  // If not logged in, display the Login Screen (USER REQUIREMENT)
  if (!isAuthenticated) {
    return (
      <>
        <LoginView onLogin={(targetRole) => login(targetRole)} />
        <ToastContainer />
      </>
    );
  }

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
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Calendario & Entregas por Día</span>
                </div>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>Calendario interactivo central:</strong> Con leyenda sencilla y filtro dinámico por día clickeado.</li>
                  <li>• <strong>Sin horas límite forzadas:</strong> Tareas organizadas estrictamente por día escolar y prioridad (Alta, Media, Normal).</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Sparkles className={`w-4 h-4 ${theme.primaryText}`} />
                  <span>Personaje Flotante (EDU)</span>
                </div>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>Flotante en la esquina inferior:</strong> Siempre accesible sin estorbar la vista principal.</li>
                  <li>• <strong>Preguntas contextuales por ventana:</strong> Sugiere dudas según la pantalla activa (calendario, tareas, citas o útiles).</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span>Menú Lateral Derecho</span>
                </div>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>Espacio liberado:</strong> Se eliminó la barra horizontal saturada; módulos secundarios en panel lateral derecho.</li>
                  <li>• <strong>Acceso rápido:</strong> Citas con docentes, materiales/útiles, alertas RFID y rutinas sin perder el foco central.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Citas y Alertas WhatsApp</span>
                </div>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>Gestión docente y familiar:</strong> Solicitud de citas en 3 clics y panel de aprobación del profesor.</li>
                  <li>• <strong>Simulación en vivo:</strong> Canal WhatsApp oficial con registro de cambios y asistencias.</li>
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
