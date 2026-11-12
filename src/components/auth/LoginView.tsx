import React, { useState } from 'react';
import { Role } from '../../types';
import { useApp } from '../../context/AppContext';
import { THEME_CONFIGS } from '../../utils/theme';
import {
  School,
  Users,
  GraduationCap,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  Calendar,
  BookOpen,
  Backpack,
  Award,
  HelpCircle,
} from 'lucide-react';

interface LoginViewProps {
  onLogin: (role: Role) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const { themeColor, showToast } = useApp();
  const theme = THEME_CONFIGS[themeColor];

  // Selected role tab for login: 'parent' or 'teacher' (USER REQUIREMENT)
  const [selectedRole, setSelectedRole] = useState<'parent' | 'teacher'>('parent');
  
  // Credentials
  const [email, setEmail] = useState<string>('apoderado@familia.edu.pe');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Switch role and update hints
  const handleSelectRole = (role: 'parent' | 'teacher') => {
    setSelectedRole(role);
    if (role === 'parent') {
      setEmail('apoderado@familia.edu.pe');
    } else {
      setEmail('docente@agustin.edu.pe');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onLogin(selectedRole);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/50 flex flex-col justify-between p-4 sm:p-6 md:p-8 font-sans">
      {/* Top School Brand Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${theme.gradient} text-white flex items-center justify-center font-black text-xl shadow-md ring-4 ring-white`}>
            <School className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                Colegio San Agustín
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 uppercase">
                Intranet Oficial
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Plataforma Escolar EduSense
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Acceso seguro cifrado SSL 256-bit</span>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="max-w-5xl w-full mx-auto my-auto py-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left / Top Form Area (7 cols on Desktop) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              {/* Header Title depending on role */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {selectedRole === 'parent' ? 'Portal de Familias y Apoderados' : 'Portal Docente y Personal Académico'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {selectedRole === 'parent' ? 'Ingreso para Padres de Familia' : 'Ingreso para Profesores y Docentes'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  {selectedRole === 'parent'
                    ? 'Inicia sesión con tu correo o DNI para ver notas, calendario de entregas y útiles de tus hijos.'
                    : 'Inicia sesión con tu cuenta institucional para gestionar asistencia, publicar tareas y calificar.'}
                </p>
              </div>

              {/* Role Selection Tabs (USER REQUIREMENT: Define en el logueo si entra como padre o profesor) */}
              <div className="mt-6 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSelectRole('parent')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    selectedRole === 'parent'
                      ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Users className={`w-4 h-4 ${selectedRole === 'parent' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>Soy Padre / Tutor</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRole('teacher')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    selectedRole === 'teacher'
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <GraduationCap className={`w-4 h-4 ${selectedRole === 'teacher' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>Soy Profesor / Docente</span>
                </button>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Email or Identifier Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {selectedRole === 'parent' ? 'Correo electrónico o DNI del Apoderado:' : 'Correo Institucional del Docente:'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={selectedRole === 'parent' ? 'apoderado@familia.edu.pe o DNI' : 'docente@agustin.edu.pe'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm font-medium text-slate-900 transition-all outline-hidden"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 block">
                      Contraseña:
                    </label>
                    <button
                      type="button"
                      onClick={() => showToast('Contraseña de acceso ya verificada para ingresar.', 'neutral')}
                      className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm font-medium text-slate-900 transition-all outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded-md text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>Recordar sesión en este equipo</span>
                  </label>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 px-5 rounded-2xl ${
                    selectedRole === 'parent' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700'
                  } text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99]`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Iniciando sesión...</span>
                    </div>
                  ) : (
                    <>
                      <span>
                        {selectedRole === 'parent'
                          ? 'Ingresar al Portal de Padre'
                          : 'Ingresar al Portal de Profesor'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Institutional Information Badge */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Colegio San Agustín · Intranet Escolar
              </span>
              <span className="text-[11px] text-slate-400">Versión 2.4 Oficial</span>
            </div>
          </div>

          {/* Right Preview Side (5 cols on Desktop) with dynamic features by selected role */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-6 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header info */}
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white/90 border border-white/15 text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {selectedRole === 'parent' ? 'Módulos para Padres' : 'Módulos para Profesores'}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                {selectedRole === 'parent'
                  ? 'Portal de Padres y Apoderados'
                  : 'Portal de Profesores y Docentes'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedRole === 'parent'
                  ? 'Accede al calendario escolar de entregas organizadas por día, calificaciones bimestrales con rúbrica conductual, citas con docentes y útiles con mochila.'
                  : 'Gestiona la asistencia en aula con sensor RFID, publica tareas y proyectos escolares, califica evaluaciones bimestrales y atiende citas de tutoría.'}
              </p>

              {/* Specific features preview list */}
              <div className="space-y-3 pt-3">
                {selectedRole === 'parent' ? (
                  <>
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Calendario Escolar sin Horas Forzadas</h4>
                        <p className="text-[11px] text-slate-300">Entregas organizadas por día y filtro clásico por curso.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Boletín de Notas y Comportamiento</h4>
                        <p className="text-[11px] text-slate-300">Desglose bimestral de todas las evaluaciones y rúbrica formativa.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Backpack className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Materiales y Útiles Escolares</h4>
                        <p className="text-[11px] text-slate-300">Icono de mochila con contador y lista de compras para el año.</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Control de Asistencia RFID y Aula</h4>
                        <p className="text-[11px] text-slate-300">Registro de alumnos presentes, tardanzas y justificaciones en tiempo real.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Publicación de Tareas y Materiales</h4>
                        <p className="text-[11px] text-slate-300">Crea asignaciones y define los útiles requeridos por fecha.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Gestión y Aprobación de Citas</h4>
                        <p className="text-[11px] text-slate-300">Atiende solicitudes de reuniones enviadas por los padres de familia.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Security Note */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Colegio San Agustín · Lima, Perú
              </span>
              <span>Año Escolar 2026</span>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto py-3 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-200/60">
        <span>© 2026 Colegio San Agustín · Todos los derechos reservados.</span>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <button
            onClick={() => showToast('Mesa de ayuda: soporte@agustin.edu.pe', 'neutral')}
            className="hover:text-blue-600 cursor-pointer flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Mesa de Ayuda</span>
          </button>
          <span>·</span>
          <span>Reglamento Interno</span>
          <span>·</span>
          <span>Privacidad</span>
        </div>
      </footer>
    </div>
  );
};
