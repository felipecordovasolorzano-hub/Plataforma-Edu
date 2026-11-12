import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import type { Expression, Ring, SourceId } from './types';
import { CONNECTIONS, SOURCE_LABEL } from './data';

export const RING_COLOR: Record<Ring, string> = { off: '#cbd5e1', pendiente: '#f59e0b', listo: '#22c55e', escucha: '#3d8bff', alerta: '#ef4444' };
export const RING_LABEL: Record<Ring, string> = { off: 'Apagado', pendiente: 'Tareas pendientes', listo: 'Todo listo', escucha: 'Escuchando', alerta: 'Aviso' };

export const COURSE_COLOR: Record<string, string> = {
  'Matemática': '#2f5fae', 'Comunicación': '#c2410c', 'Arte': '#be185d', 'Ciencia y Tecnología': '#15803d', 'Inglés': '#7c3aed', 'Historia': '#a16207', 'Química': '#0e7490',
};
export const courseColor = (c: string) => COURSE_COLOR[c] ?? '#475569';

// ---------- Rostro de EDU (mismas expresiones que el dispositivo) ----------
export const EduFace: React.FC<{ expr: Expression; size?: number; dim?: boolean }> = ({ expr, size = 120, dim }) => {
  const s = '#e8f6ff';
  const eye = (cx: number) => {
    switch (expr) {
      case 'feliz': return <path d={`M${cx - 11} 46 Q${cx} 32 ${cx + 11} 46`} stroke={s} strokeWidth="6" fill="none" strokeLinecap="round" />;
      case 'meta': { const pts = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 5 : 11; return `${cx + Math.cos(a) * r},${44 + Math.sin(a) * r}`; }).join(' '); return <polygon points={pts} fill={s} />; }
      case 'reposo': return <line x1={cx - 10} y1="46" x2={cx + 10} y2="46" stroke={s} strokeWidth="5" strokeLinecap="round" />;
      case 'ayuda': return <ellipse cx={cx} cy="46" rx="5" ry="6.5" fill={s} />;
      default: return <ellipse cx={cx} cy="44" rx="6.5" ry="8.5" fill={s} />;
    }
  };
  return (
    <svg viewBox="0 0 140 100" width={size} height={size * 100 / 140} aria-label={`EDU: ${expr}`}>
      <defs><filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
      <rect x="2" y="2" width="136" height="96" rx="30" fill="#060a12" stroke="#3d8bff" strokeWidth="3" />
      <g filter="url(#glow)" opacity={dim ? 0.55 : 1}>
        {expr === 'guino' ? (<>{eye(48)}<path d="M81 46 Q92 32 103 46" stroke={s} strokeWidth="6" fill="none" strokeLinecap="round" /></>) : (<>{eye(48)}{eye(92)}</>)}
        {expr === 'ayuda' && (<>
          <line x1="38" y1="31" x2="56" y2="27" stroke={s} strokeWidth="4" strokeLinecap="round" />
          <line x1="102" y1="31" x2="84" y2="27" stroke={s} strokeWidth="4" strokeLinecap="round" />
          <path d="M60 76 Q70 68 80 76" stroke={s} strokeWidth="5" fill="none" strokeLinecap="round" />
          <text x="112" y="34" fill={s} fontSize="22" fontWeight="800" fontFamily="Arial">?</text>
        </>)}
        {expr === 'escucha' && [58, 70, 82].map(x => <circle key={x} cx={x} cy="72" r="3.5" fill={s} />)}
        {(expr === 'feliz' || expr === 'guino') && <path d="M58 66 Q70 78 82 66" stroke={s} strokeWidth="6" fill="none" strokeLinecap="round" />}
        {expr === 'meta' && <path d="M54 64 Q70 84 86 64" stroke={s} strokeWidth="6" fill="none" strokeLinecap="round" />}
      </g>
    </svg>
  );
};

// ---------- Dispositivo EDU en miniatura ----------
export const EduDevice: React.FC<{ expr: Expression; ring: Ring; lampOn: boolean; size?: number }> = ({ expr, ring, lampOn, size = 220 }) => {
  const rc = RING_COLOR[ring];
  return (
    <svg viewBox="0 0 240 260" width={size} height={size * 260 / 240} aria-label="Dispositivo EDU">
      <defs>
        <radialGradient id="body" cx="40%" cy="35%" r="70%"><stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#dfe3ea" /></radialGradient>
        <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffe3b0" stopOpacity="0.85" /><stop offset="100%" stopColor="#ffe3b0" stopOpacity="0" /></linearGradient>
        <pattern id="knit" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#c3c7cd" /><rect width="2" height="2" fill="#aeb3ba" /></pattern>
      </defs>
      {lampOn && <path d="M88 46 L132 46 L196 254 L24 254 Z" fill="url(#beam)" opacity="0.7" />}
      <path d="M150 178 C150 110 160 70 168 40 C172 26 150 22 132 30" stroke="#e5e7eb" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M150 178 C150 110 160 70 168 40 C172 26 150 22 132 30" stroke="#cfd4db" strokeWidth="10" fill="none" strokeDasharray="1.6 2.2" strokeLinecap="round" />
      <ellipse cx="110" cy="38" rx="52" ry="12" fill="#f3f4f6" stroke="#d1d5db" />
      <ellipse cx="110" cy="44" rx="44" ry="6" fill={lampOn ? '#fff1d6' : '#e5e7eb'} />
      <circle cx="110" cy="44" r="4" fill="#111827" />
      <ellipse cx="120" cy="248" rx="70" ry="8" fill={rc} opacity={ring === 'off' ? 0.25 : 0.45} />
      <circle cx="120" cy="178" r="70" fill="url(#body)" stroke="#d6dae1" />
      <path d="M57 205 A70 70 0 0 0 183 205 Z" fill="url(#knit)" />
      <text x="120" y="232" textAnchor="middle" fill="#2f5fae" fontWeight="800" fontSize="15" fontFamily="Nunito, Arial">EDU</text>
      <foreignObject x="66" y="130" width="108" height="78"><EduFace expr={expr} size={108} dim={!lampOn && expr === 'reposo'} /></foreignObject>
      <rect x="62" y="244" width="116" height="7" rx="3.5" fill={rc} />
    </svg>
  );
};

export const SourceChip: React.FC<{ source: SourceId; small?: boolean }> = ({ source, small }) => {
  const c = CONNECTIONS.find(x => x.id === source);
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white ${small ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]'} font-semibold text-slate-600`}>
      <span className="inline-block h-2 w-2 rounded-full" style={{ background: c?.color ?? '#94a3b8' }} />
      {SOURCE_LABEL[source] ?? source}
    </span>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`rounded-3xl bg-white border border-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${onClick ? 'cursor-pointer active:scale-[0.99] transition' : ''} ${className}`}>{children}</div>
);

export const SectionTitle: React.FC<{ children: React.ReactNode; right?: React.ReactNode }> = ({ children, right }) => (
  <div className="mb-2 mt-5 flex items-center justify-between px-1">
    <h2 className="text-[13px] font-extrabold uppercase tracking-wide text-slate-500">{children}</h2>{right}
  </div>
);

export const Toggle: React.FC<{ on: boolean; onChange: (v: boolean) => void; disabled?: boolean; label?: string }> = ({ on, onChange, disabled, label }) => (
  <button role="switch" aria-checked={on} aria-label={label} disabled={disabled} onClick={() => onChange(!on)}
    className={`relative h-7 w-12 shrink-0 rounded-full transition ${on ? 'bg-edu' : 'bg-slate-300'} ${disabled ? 'opacity-60' : ''}`}>
    <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
  </button>
);

export const StatusPill: React.FC<{ status: 'pendiente' | 'en_curso' | 'completada' }> = ({ status }) => {
  const m = { pendiente: ['Pendiente', 'bg-amber-50 text-amber-700 border-amber-200'], en_curso: ['Haciéndola', 'bg-blue-50 text-blue-700 border-blue-200'], completada: ['Lista', 'bg-emerald-50 text-emerald-700 border-emerald-200'] }[status];
  return <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${m[1]}`}>{m[0]}</span>;
};

// Hoja inferior (modal) dentro del teléfono
export const Sheet: React.FC<{ open: boolean; onClose: () => void; title?: React.ReactNode; children: React.ReactNode; full?: boolean; dark?: boolean }> = ({ open, onClose, title, children, full, dark }) => (
  <AnimatePresence>
    {open && (
      <motion.div className="absolute inset-0 z-40 flex items-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
        <motion.div initial={{ y: 40, opacity: 0.6 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className={`relative flex w-full flex-col overflow-hidden rounded-t-[28px] ${dark ? 'bg-slate-950 text-white' : 'bg-slate-50'} ${full ? 'h-[94%]' : 'max-h-[88%]'}`}>
          <div className={`flex items-center justify-between px-5 pb-2 pt-4 ${dark ? '' : 'bg-slate-50'}`}>
            <div className="min-w-0 flex-1 text-[17px] font-extrabold">{title}</div>
            <button onClick={onClose} aria-label="Cerrar" className={`ml-3 grid h-9 w-9 place-items-center rounded-full ${dark ? 'bg-white/10' : 'bg-white border border-slate-200'}`}><X className="h-4 w-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 pb-8">{children}</div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const Avatar: React.FC<{ name: string; color: string; size?: number }> = ({ name, color, size = 36 }) => (
  <span className="inline-grid shrink-0 place-items-center rounded-full font-extrabold text-white" style={{ background: color, width: size, height: size, fontSize: size * 0.42 }}>{name[0]}</span>
);
