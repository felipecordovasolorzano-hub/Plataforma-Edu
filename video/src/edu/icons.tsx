import React from 'react';
import {C} from './theme';

const SW = 3;
const st = {stroke: C.ink, strokeWidth: SW, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/** Flat icons drawn in a ±60 box around the origin. */
const ICONS: Record<string, React.ReactNode> = {
	house: (
		<g {...st}>
			<path d="M -52 -6 L 0 -54 L 52 -6" fill="none" strokeWidth={6} />
			<rect x={-40} y={-14} width={80} height={66} rx={6} fill="#FDE68A" />
			<rect x={-12} y={14} width={24} height={38} rx={4} fill="#B45309" />
			<rect x={16} y={-2} width={16} height={16} rx={3} fill="#BFDBFE" />
		</g>
	),
	school: (
		<g {...st}>
			<rect x={-56} y={-14} width={112} height={66} rx={6} fill="#FCA5A5" />
			<path d="M -62 -14 L 0 -46 L 62 -14 Z" fill="#B91C1C" />
			<line x1={0} y1={-46} x2={0} y2={-72} />
			<path d="M 0 -72 L 22 -66 L 0 -60 Z" fill={C.amber} />
			<rect x={-12} y={20} width={24} height={32} rx={4} fill="#7C2D12" />
			<rect x={-44} y={0} width={18} height={16} rx={3} fill="#BFDBFE" />
			<rect x={26} y={0} width={18} height={16} rx={3} fill="#BFDBFE" />
		</g>
	),
	office: (
		<g {...st}>
			<rect x={-46} y={-40} width={92} height={60} rx={8} fill="#CBD5E1" />
			<rect x={-38} y={-32} width={76} height={44} rx={4} fill="#38BDF8" />
			<path d="M -60 20 L 60 20 L 52 36 L -52 36 Z" fill="#94A3B8" />
		</g>
	),
	field: (
		<g {...st}>
			<rect x={-58} y={-40} width={116} height={80} rx={8} fill="#4ADE80" />
			<line x1={0} y1={-40} x2={0} y2={40} stroke="#F8FAFC" />
			<circle cx={0} cy={0} r={16} fill="none" stroke="#F8FAFC" />
			<circle cx={34} cy={18} r={11} fill="#F8FAFC" />
		</g>
	),
	bus: (
		<g {...st}>
			<rect x={-50} y={-30} width={100} height={50} rx={10} fill={C.amber} />
			<rect x={-40} y={-22} width={22} height={16} rx={3} fill="#BFDBFE" />
			<rect x={-12} y={-22} width={22} height={16} rx={3} fill="#BFDBFE" />
			<rect x={16} y={-22} width={22} height={16} rx={3} fill="#BFDBFE" />
			<circle cx={-28} cy={22} r={9} fill={C.ink} />
			<circle cx={28} cy={22} r={9} fill={C.ink} />
		</g>
	),
	web: (
		<g {...st}>
			<rect x={-56} y={-44} width={112} height={88} rx={10} fill="#F8FAFC" />
			<path d="M -56 -24 L 56 -24" />
			<circle cx={-44} cy={-34} r={3} fill={C.red} stroke="none" />
			<circle cx={-34} cy={-34} r={3} fill={C.amber} stroke="none" />
			<rect x={-42} y={-12} width={50} height={10} rx={5} fill="#93C5FD" stroke="none" />
			<rect x={-42} y={6} width={84} height={8} rx={4} fill="#CBD5E1" stroke="none" />
			<rect x={-42} y={22} width={64} height={8} rx={4} fill="#CBD5E1" stroke="none" />
		</g>
	),
	chat: (
		<g {...st}>
			<path d="M -50 -38 Q -50 -50 -38 -50 L 38 -50 Q 50 -50 50 -38 L 50 14 Q 50 26 38 26 L -10 26 L -34 48 L -30 26 L -38 26 Q -50 26 -50 14 Z" fill="#22C55E" />
			<circle cx={-20} cy={-12} r={6} fill="#F8FAFC" stroke="none" />
			<circle cx={0} cy={-12} r={6} fill="#F8FAFC" stroke="none" />
			<circle cx={20} cy={-12} r={6} fill="#F8FAFC" stroke="none" />
		</g>
	),
	mail: (
		<g {...st}>
			<rect x={-56} y={-38} width={112} height={76} rx={8} fill="#F8FAFC" />
			<path d="M -56 -34 L 0 8 L 56 -34" fill="none" />
		</g>
	),
	notebook: (
		<g {...st}>
			<rect x={-40} y={-52} width={84} height={104} rx={8} fill="#60A5FA" />
			{[-36, -16, 4, 24, 44].map((y) => (
				<circle key={y} cx={-40} cy={y} r={5} fill="#F8FAFC" />
			))}
			<rect x={-16} y={-30} width={46} height={18} rx={4} fill="#F8FAFC" />
		</g>
	),
	circular: (
		<g {...st}>
			<path d="M -40 -54 L 22 -54 L 42 -34 L 42 54 L -40 54 Z" fill="#F8FAFC" />
			<path d="M 22 -54 L 22 -34 L 42 -34" fill="#E2E8F0" />
			<rect x={-28} y={-30} width={36} height={8} rx={4} fill="#94A3B8" stroke="none" />
			<rect x={-28} y={-10} width={58} height={7} rx={3.5} fill="#CBD5E1" stroke="none" />
			<rect x={-28} y={6} width={58} height={7} rx={3.5} fill="#CBD5E1" stroke="none" />
			<rect x={-28} y={22} width={44} height={7} rx={3.5} fill="#CBD5E1" stroke="none" />
		</g>
	),
	clock: (
		<g {...st}>
			<circle cx={0} cy={4} r={44} fill="#F8FAFC" />
			<circle cx={-34} cy={-40} r={12} fill={C.red} />
			<circle cx={34} cy={-40} r={12} fill={C.red} />
			<line x1={0} y1={4} x2={0} y2={-22} strokeWidth={5} />
			<line x1={0} y1={4} x2={18} y2={14} strokeWidth={5} />
		</g>
	),
	lunch: (
		<g {...st}>
			<rect x={-52} y={-24} width={104} height={64} rx={12} fill="#F472B6" />
			<path d="M -22 -24 Q -22 -48 0 -48 Q 22 -48 22 -24" fill="none" strokeWidth={6} />
			<line x1={-52} y1={0} x2={52} y2={0} />
		</g>
	),
	laptop: (
		<g {...st}>
			<rect x={-44} y={-40} width={88} height={58} rx={8} fill="#CBD5E1" />
			<rect x={-36} y={-32} width={72} height={42} rx={4} fill="#38BDF8" />
			<path d="M -58 18 L 58 18 L 50 34 L -50 34 Z" fill="#94A3B8" />
		</g>
	),
	ball: (
		<g {...st}>
			<circle cx={0} cy={0} r={46} fill="#F8FAFC" />
			<path d="M 0 -16 L 15 -5 L 9 13 L -9 13 L -15 -5 Z" fill={C.ink} />
			<path d="M 0 -16 L 0 -46 M 15 -5 L 42 -14 M 9 13 L 26 38 M -9 13 L -26 38 M -15 -5 L -42 -14" />
		</g>
	),
	math: (
		<g {...st}>
			<rect x={-40} y={-50} width={80} height={100} rx={8} fill="#FDE68A" />
			<path d="M -20 -18 L 0 -18 M -10 -28 L -10 -8" strokeWidth={6} />
			<path d="M 8 -18 L 26 -18" strokeWidth={6} />
			<path d="M -20 16 L 0 36 M 0 16 L -20 36" strokeWidth={6} />
			<path d="M 8 22 L 26 22 M 8 32 L 26 32" strokeWidth={6} />
		</g>
	),
	plant: (
		<g {...st}>
			<path d="M -30 10 L 30 10 L 22 52 L -22 52 Z" fill="#C2410C" />
			<path d="M 0 10 L 0 -30" strokeWidth={5} />
			<path d="M 0 -18 Q -40 -26 -40 -56 Q -6 -52 0 -18 Z" fill="#22C55E" />
			<path d="M 0 -28 Q 36 -34 40 -60 Q 6 -62 0 -28 Z" fill="#4ADE80" />
		</g>
	),
	globe: (
		<g {...st}>
			<circle cx={-6} cy={-4} r={42} fill="#7DD3FC" />
			<path d="M -36 -20 Q -20 -30 -10 -14 Q 0 0 -20 10 Q -30 20 -40 6" fill="#4ADE80" />
			<path d="M 6 -40 Q 24 -30 20 -12 Q 10 -6 4 -22" fill="#4ADE80" />
			<circle cx={36} cy={34} r={22} fill={C.blue} />
			<path d="M 27 44 L 36 22 L 45 44 M 30 37 L 42 37" stroke="#F8FAFC" strokeWidth={4} fill="none" />
		</g>
	),
	book: (
		<g {...st}>
			<path d="M 0 -36 Q -30 -50 -56 -40 L -56 42 Q -30 32 0 46 Z" fill="#FCA5A5" />
			<path d="M 0 -36 Q 30 -50 56 -40 L 56 42 Q 30 32 0 46 Z" fill="#FECACA" />
			<line x1={0} y1={-36} x2={0} y2={46} />
		</g>
	),
	calendar: (
		<g {...st}>
			<rect x={-30} y={-26} width={60} height={56} rx={8} fill="#F8FAFC" />
			<path d="M -30 -26 L 30 -26 L 30 -8 L -30 -8 Z" fill={C.red} />
			<line x1={-16} y1={-34} x2={-16} y2={-20} strokeWidth={5} />
			<line x1={16} y1={-34} x2={16} y2={-20} strokeWidth={5} />
			<rect x={-18} y={2} width={12} height={10} rx={2} fill="#CBD5E1" stroke="none" />
			<rect x={4} y={2} width={12} height={10} rx={2} fill={C.amber} stroke="none" />
			<rect x={-18} y={16} width={12} height={10} rx={2} fill="#CBD5E1" stroke="none" />
		</g>
	),
	brush: (
		<g {...st}>
			<line x1={-34} y1={30} x2={20} y2={-24} stroke="#B45309" strokeWidth={8} />
			<path d="M 18 -22 L 30 -34 Q 44 -42 40 -26 L 28 -14 Z" fill={C.ink} />
		</g>
	),
	paint: (
		<g {...st}>
			<path d="M -40 -12 L 26 -12 L 34 -4 L 34 4 L 26 12 L -40 12 Z" fill="#3B82F6" />
			<rect x={34} y={-6} width={10} height={12} rx={2} fill="#E2E8F0" />
		</g>
	),
	warning: (
		<g {...st}>
			<path d="M 0 -40 L 40 32 L -40 32 Z" fill={C.amber} />
			<line x1={0} y1={-12} x2={0} y2={10} strokeWidth={6} />
			<circle cx={0} cy={21} r={3.5} fill={C.ink} />
		</g>
	),
	task: (
		<g {...st}>
			<rect x={-36} y={-44} width={72} height={88} rx={8} fill="#F8FAFC" />
			<path d="M -20 -16 L -12 -8 L 2 -24" fill="none" stroke={C.teal} strokeWidth={5} />
			<path d="M -20 14 L -12 22 L 2 6" fill="none" stroke={C.teal} strokeWidth={5} />
			<line x1={10} y1={-16} x2={24} y2={-16} />
			<line x1={10} y1={14} x2={24} y2={14} />
		</g>
	),
	heart: (
		<g {...st}>
			<path d="M 0 44 Q -60 4 -54 -22 Q -46 -52 -16 -46 Q -4 -42 0 -28 Q 4 -42 16 -46 Q 46 -52 54 -22 Q 60 4 0 44 Z" fill="#FB7185" />
		</g>
	),
	helmet: (
		<g {...st}>
			<path d="M -54 18 Q -54 -46 0 -46 Q 54 -46 54 18 Z" fill="#FACC15" />
			<rect x={-64} y={14} width={128} height={16} rx={8} fill="#EAB308" />
			<path d="M 0 -46 L 0 14" />
			<path d="M -22 -40 Q -30 -12 -30 14 M 22 -40 Q 30 -12 30 14" fill="none" />
		</g>
	),
	puzzle: (
		<g {...st}>
			<path d="M -40 -40 L -10 -40 Q -10 -58 4 -58 Q 18 -58 18 -40 L 40 -40 L 40 -12 Q 58 -12 58 2 Q 58 16 40 16 L 40 40 L -40 40 Z" fill="#A78BFA" />
		</g>
	),
	sparkle: (
		<g {...st}>
			<path d="M 0 -50 Q 8 -8 50 0 Q 8 8 0 50 Q -8 8 -50 0 Q -8 -8 0 -50 Z" fill={C.teal} stroke="none" />
		</g>
	),
	talk: (
		<g {...st}>
			<path d="M -50 -34 Q -50 -46 -38 -46 L 38 -46 Q 50 -46 50 -34 L 50 6 Q 50 18 38 18 L -14 18 L -32 38 L -30 18 L -38 18 Q -50 18 -50 6 Z" fill="#FFFFFF" />
			<circle cx={-18} cy={-14} r={6} fill={C.teal} stroke="none" />
			<circle cx={0} cy={-14} r={6} fill={C.teal} stroke="none" />
			<circle cx={18} cy={-14} r={6} fill={C.teal} stroke="none" />
		</g>
	),
	backpack: (
		<g {...st}>
			<rect x={-38} y={-40} width={76} height={92} rx={18} fill={C.pack} />
			<rect x={-24} y={6} width={48} height={32} rx={8} fill={C.packYellow} />
			<path d="M -16 -40 Q 0 -60 16 -40" fill="none" strokeWidth={6} />
		</g>
	),
};

export type IconName = keyof typeof ICONS;

export const Icon: React.FC<{name: IconName; x: number; y: number; scale?: number; opacity?: number; rotate?: number}> = ({
	name,
	x,
	y,
	scale = 1,
	opacity = 1,
	rotate = 0,
}) => (
	<g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} opacity={opacity}>
		{ICONS[name]}
	</g>
);

/** Round flat clock with hands driven by minutes past 12:00 (e.g. 5:00 → 300). */
export const Clock: React.FC<{
	x: number;
	y: number;
	r: number;
	minutes: number;
	face?: string;
	rim?: string;
	hand?: string;
}> = ({x, y, r, minutes, face = '#F8FAFC', rim = C.ink, hand = C.ink}) => {
	const minAngle = (minutes % 60) * 6;
	const hourAngle = (minutes / 60) * 30;
	return (
		<g transform={`translate(${x} ${y})`}>
			<circle r={r} fill={face} stroke={rim} strokeWidth={Math.max(3, r * 0.06)} />
			{Array.from({length: 12}).map((_, i) => (
				<line
					key={i}
					x1={0}
					y1={-r * 0.82}
					x2={0}
					y2={-r * (i % 3 === 0 ? 0.68 : 0.74)}
					stroke={hand}
					strokeWidth={i % 3 === 0 ? Math.max(3, r * 0.04) : 3}
					strokeLinecap="round"
					transform={`rotate(${i * 30})`}
				/>
			))}
			<line x1={0} y1={0} x2={0} y2={-r * 0.45} stroke={hand} strokeWidth={Math.max(4, r * 0.07)} strokeLinecap="round" transform={`rotate(${hourAngle})`} />
			<line x1={0} y1={0} x2={0} y2={-r * 0.66} stroke={hand} strokeWidth={Math.max(3, r * 0.045)} strokeLinecap="round" transform={`rotate(${minAngle})`} />
			<circle r={Math.max(4, r * 0.06)} fill={hand} />
		</g>
	);
};

/** Flat phone silhouette, origin at centre. */
export const PhoneShape: React.FC<{
	x: number;
	y: number;
	w?: number;
	h?: number;
	stroke?: string;
	fill?: string;
	screen?: string;
	children?: React.ReactNode;
}> = ({x, y, w = 300, h = 600, stroke = C.ink, fill = C.night2, screen = '#0B1222', children}) => (
	<g transform={`translate(${x} ${y})`}>
		<rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.14} fill={fill} stroke={stroke} strokeWidth={6} />
		<rect x={-w / 2 + 14} y={-h / 2 + 14} width={w - 28} height={h - 28} rx={w * 0.1} fill={screen} />
		<rect x={-30} y={-h / 2 + 26} width={60} height={10} rx={5} fill={stroke} opacity={0.6} />
		{children}
	</g>
);
