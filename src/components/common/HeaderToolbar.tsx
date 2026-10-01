import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { THEME_CONFIGS } from '../../utils/theme';
import { ThemeColor } from '../../types';
import {
  Users,
  GraduationCap,
  Sparkles,
  MessageCircle,
  RefreshCw,
  BellRing,
  Radio,
  Palette,
  Check,
  ChevronDown,
  Layers,
  ShieldCheck,
  School,
} from 'lucide-react';

export const HeaderToolbar: React.FC = () => {
  const {
    role,
    setRole,
    themeColor,
    setThemeColor,
    simulateTeacherMaterialChange,
    simulateSchoolSensorAttendance,
    resetAllData,
    whatsAppMessages,
    setIsWhatsAppDrawerOpen,
    showToast,
  } = useApp();

  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState<boolean>(false);
  const [isSimMenuOpen, setIsSimMenuOpen] = useState<boolean>(false);

  const currentTheme = THEME_CONFIGS[themeColor];

  const handleSelectTheme = (tKey: ThemeColor) => {
    setThemeColor(tKey);
    setIsThemeMenuOpen(false);
    showToast(`Paleta de color actualizada: ${THEME_CONFIGS[tKey].name}`, 'neutral');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & High-Fidelity Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${currentTheme.gradient} text-white flex items-center justify-center font-black text-base shadow-sm ring-2 ring-white`}>
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  EduSense
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${currentTheme.lightBg} ${currentTheme.primaryText} border ${currentTheme.lightBorder}`}>
                  High-Fidelity
                </span>
              </div>
              <span className="hidden md:block text-[11px] text-slate-500 font-medium">
                Plataforma Escolar Inteligente · Colegio San Agustín
              </span>
            </div>
          </div>
        </div>

        {/* Role Switcher (High Fidelity Pills) */}
        <div className="flex items-center bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
          <button
            onClick={() => setRole('parent')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              role === 'parent'
                ? 'bg-white text-slate-900 shadow-xs scale-[1.01]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className={`w-3.5 h-3.5 ${role === 'parent' ? currentTheme.primaryText : 'text-slate-400'}`} />
            <span>Padre / Tutor</span>
          </button>

          <button
            onClick={() => setRole('teacher')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              role === 'teacher'
                ? 'bg-white text-slate-900 shadow-xs scale-[1.01]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className={`w-3.5 h-3.5 ${role === 'teacher' ? currentTheme.primaryText : 'text-slate-400'}`} />
            <span>Docente</span>
          </button>

          <button
            onClick={() => setRole('student')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              role === 'student'
                ? 'bg-white text-slate-900 shadow-xs scale-[1.01]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${role === 'student' ? currentTheme.primaryText : 'text-slate-400'}`} />
            <span>Estudiante</span>
          </button>
        </div>

        {/* Right Tools: Theme Customizer, WhatsApp Alert Center & Scenarios */}
        <div className="flex items-center gap-2">
          {/* Minimal Theme Customizer Dropdown (USER REQUIREMENT) */}
          <div className="relative">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-xl transition-all shadow-2xs"
              title="Personalizar color de interfaz"
            >
              <Palette className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Color:</span>
              <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: currentTheme.hex }} />
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isThemeMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 block">
                  Paleta armónica EduSense:
                </span>
                {(Object.keys(THEME_CONFIGS) as ThemeColor[]).map((tKey) => {
                  const tObj = THEME_CONFIGS[tKey];
                  const isSelected = themeColor === tKey;
                  return (
                    <button
                      key={tKey}
                      onClick={() => handleSelectTheme(tKey)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors ${
                        isSelected ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: tObj.hex }} />
                        <span>{tObj.name}</span>
                      </div>
                      {isSelected && <Check className={`w-3.5 h-3.5 ${currentTheme.primaryText}`} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* WhatsApp Alert Center */}
          <button
            onClick={() => setIsWhatsAppDrawerOpen(true)}
            className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-2xs group"
            title="Ver registro de alertas enviadas a WhatsApp"
          >
            <div className="relative">
              <MessageCircle className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <span className="hidden sm:inline">WhatsApp</span>
            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
              {whatsAppMessages.length}
            </span>
          </button>

          {/* Scenario Simulators Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSimMenuOpen(!isSimMenuOpen)}
              className="flex items-center gap-1 py-1.5 px-2.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-xl transition-all shadow-2xs"
              title="Disparar eventos simulados"
            >
              <Radio className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden lg:inline">Simuladores</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isSimMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 block">
                  Simular eventos escolares:
                </span>
                <button
                  onClick={() => {
                    simulateTeacherMaterialChange();
                    setIsSimMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-left text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <BellRing className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-semibold block text-slate-900">Cambio de material</span>
                    <span className="text-[10px] text-slate-500 block">Actualiza Ciencia y notifica a WhatsApp</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    simulateSchoolSensorAttendance();
                    setIsSimMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-left text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Radio className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <div>
                    <span className="font-semibold block text-slate-900">Ingreso por sensor</span>
                    <span className="text-[10px] text-slate-500 block">Registra torniquete y alerta a padres</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Reset button */}
          <button
            onClick={resetAllData}
            title="Restablecer datos originales de la plataforma"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
