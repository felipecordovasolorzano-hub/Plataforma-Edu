import React from 'react';

interface EduAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isThinking?: boolean;
  isSpeaking?: boolean;
  className?: string;
}

export const EduAvatar: React.FC<EduAvatarProps> = ({
  size = 'md',
  isThinking = false,
  isSpeaking = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-b from-indigo-500 via-blue-600 to-indigo-700 shadow-md p-1 select-none ${sizeClasses[size]} ${className}`}
    >
      {/* Outer subtle glow */}
      <div className="absolute inset-0 rounded-2xl bg-blue-400/25 blur-xs -z-10" />

      {/* Mascot SVG: EDU the wise, friendly EdTech mentor owl */}
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full drop-shadow-sm ${isSpeaking ? 'animate-bounce duration-1000' : ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ears / Feather tufts */}
        <polygon points="26,18 36,4 40,25" fill="#3B82F6" />
        <polygon points="74,18 64,4 60,25" fill="#3B82F6" />
        <polygon points="28,18 35,8 38,24" fill="#60A5FA" />
        <polygon points="72,18 65,8 62,24" fill="#60A5FA" />

        {/* Head and Body */}
        <circle cx="50" cy="52" r="40" fill="#2563EB" />
        <circle cx="50" cy="56" r="33" fill="#38BDF8" opacity="0.25" />

        {/* Belly patch */}
        <ellipse cx="50" cy="67" rx="22" ry="20" fill="#EFF6FF" />
        {/* Soft feather ripples */}
        <path d="M43,62 Q50,67 57,62" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M45,71 Q50,76 55,71" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />

        {/* Eye backgrounds */}
        <circle cx="37" cy="45" r="15" fill="#FFFFFF" />
        <circle cx="63" cy="45" r="15" fill="#FFFFFF" />

        {/* Scholar Glasses */}
        <circle cx="37" cy="45" r="15" stroke="#F59E0B" strokeWidth="3" fill="none" />
        <circle cx="63" cy="45" r="15" stroke="#F59E0B" strokeWidth="3" fill="none" />
        {/* Glasses bridge */}
        <path d="M52,45 Q50,42 48,45" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
        {/* Glasses side frames */}
        <path d="M22,43 Q18,41 14,43" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <path d="M78,43 Q82,41 86,43" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />

        {/* Pupils & Eye catchlights */}
        {isThinking ? (
          // Thinking squint / looking up
          <>
            <circle cx="37" cy="40" r="7" fill="#1E293B" />
            <circle cx="63" cy="40" r="7" fill="#1E293B" />
            <circle cx="39" cy="38" r="2.5" fill="#FFFFFF" />
            <circle cx="65" cy="38" r="2.5" fill="#FFFFFF" />
          </>
        ) : (
          // Normal friendly gaze
          <>
            <circle cx="38" cy="46" r="7" fill="#0F172A" />
            <circle cx="62" cy="46" r="7" fill="#0F172A" />
            <circle cx="40" cy="43" r="2.5" fill="#FFFFFF" />
            <circle cx="64" cy="43" r="2.5" fill="#FFFFFF" />
            <circle cx="36" cy="48" r="1.2" fill="#FFFFFF" />
            <circle cx="60" cy="48" r="1.2" fill="#FFFFFF" />
          </>
        )}

        {/* Cute blushing cheeks */}
        <ellipse cx="27" cy="56" rx="4.5" ry="2.5" fill="#F43F5E" opacity="0.5" />
        <ellipse cx="73" cy="56" rx="4.5" ry="2.5" fill="#F43F5E" opacity="0.5" />

        {/* Cute Beak */}
        <path d="M47,51 L53,51 L50,60 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1" strokeLinejoin="round" />

        {/* Scholar Graduation mini cap or sparkling pin */}
        <polygon points="50,15 32,23 50,30 68,23" fill="#1E1B4B" />
        <polygon points="40,27 40,32 50,36 60,32 60,27" fill="#312E81" />
        <circle cx="50" cy="22" r="2.5" fill="#FBBF24" />
        <line x1="50" y1="22" x2="62" y2="28" stroke="#FBBF24" strokeWidth="1.5" />
      </svg>

      {/* Online / Active status pulse */}
      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-xs ring-1 ring-emerald-500/20" />
    </div>
  );
};

// Backward compatibility alias
export const SofiAvatar = EduAvatar;
