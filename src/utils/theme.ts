import { ThemeColor } from '../types';

export interface ThemeClasses {
  name: string;
  hex: string;
  primaryBg: string;
  primaryHover: string;
  primaryText: string;
  lightBg: string;
  lightBorder: string;
  activeTab: string;
  ring: string;
  badgeBg: string;
  badgeText: string;
  gradient: string;
}

export const THEME_CONFIGS: Record<ThemeColor, ThemeClasses> = {
  blue: {
    name: 'Azul Institucional',
    hex: '#2563EB',
    primaryBg: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-700',
    primaryText: 'text-blue-600',
    lightBg: 'bg-blue-50',
    lightBorder: 'border-blue-200',
    activeTab: 'bg-blue-600 text-white shadow-xs',
    ring: 'focus:ring-blue-500',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    gradient: 'from-blue-600 to-blue-700',
  },
  emerald: {
    name: 'Verde Educación',
    hex: '#059669',
    primaryBg: 'bg-emerald-600',
    primaryHover: 'hover:bg-emerald-700',
    primaryText: 'text-emerald-600',
    lightBg: 'bg-emerald-50',
    lightBorder: 'border-emerald-200',
    activeTab: 'bg-emerald-600 text-white shadow-xs',
    ring: 'focus:ring-emerald-500',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    gradient: 'from-emerald-600 to-teal-700',
  },
  warm: {
    name: 'Tonos Cálidos',
    hex: '#D97706',
    primaryBg: 'bg-amber-600',
    primaryHover: 'hover:bg-amber-700',
    primaryText: 'text-amber-600',
    lightBg: 'bg-amber-50',
    lightBorder: 'border-amber-200',
    activeTab: 'bg-amber-600 text-white shadow-xs',
    ring: 'focus:ring-amber-500',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    gradient: 'from-amber-600 to-amber-700',
  },
  indigo: {
    name: 'Índigo Moderno',
    hex: '#4F46E5',
    primaryBg: 'bg-indigo-600',
    primaryHover: 'hover:bg-indigo-700',
    primaryText: 'text-indigo-600',
    lightBg: 'bg-indigo-50',
    lightBorder: 'border-indigo-200',
    activeTab: 'bg-indigo-600 text-white shadow-xs',
    ring: 'focus:ring-indigo-500',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    gradient: 'from-indigo-600 to-indigo-700',
  },
};
