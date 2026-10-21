import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FPS} from './theme';

const SW = 3;

export type Mood = 'neutral' | 'smile' | 'tired' | 'sad' | 'laugh' | 'surprised';
export type Pose = 'stand' | 'bust';

/** Idle life shared by characters: breathing, blinking, micro head motion. */
const useIdle = (seed: number) => {
	const f = useCurrentFrame();
	const breath = Math.sin((f / (FPS * 3.2)) * Math.PI * 2 + seed) * 0.008;
	const cycle = (f + Math.floor(seed * 53)) % 118;
	const blink = cycle < 3;
	const nod = Math.sin((f / (FPS * 4.1)) * Math.PI * 2 + seed * 2) * 1.6;
	return {breath, blink, nod, f};
};

const Mouth: React.FC<{mood: Mood; y: number; w: number}> = ({mood, y, w}) => {
	const common = {stroke: C.ink, strokeWidth: SW, fill: 'none', strokeLinecap: 'round' as const};
	switch (mood) {
		case 'smile':
			return <path d={`M ${-w} ${y} Q 0 ${y + w * 0.95} ${w} ${y}`} {...common} />;
		case 'tired':
			return <path d={`M ${-w * 0.8} ${y + 2} Q 0 ${y + w * 0.45} ${w * 0.8} ${y + 2}`} {...common} />;
		case 'sad':
			return <path d={`M ${-w * 0.8} ${y + 6} Q 0 ${y - w * 0.4} ${w * 0.8} ${y + 6}`} {...common} />;
		case 'surprised':
			return <ellipse cx={0} cy={y + 3} rx={w * 0.4} ry={w * 0.55} fill="#7F1D1D" stroke={C.ink} strokeWidth={SW} />;
		case 'laugh':
			return <path d={`M ${-w * 1.1} ${y - 2} Q 0 ${y + w * 1.5} ${w * 1.1} ${y - 2} Z`} fill="#9F1239" stroke={C.ink} strokeWidth={SW} />;
		default:
			return <path d={`M ${-w * 0.7} ${y + 2} L ${w * 0.7} ${y + 2}`} {...common} />;
	}
};

const Eyes: React.FC<{y: number; dx: number; lookX: number; closed?: boolean; r?: number}> = ({y, dx, lookX, closed, r = 5}) =>
	closed ? (
		<g stroke={C.ink} strokeWidth={SW} fill="none" strokeLinecap="round">
			<path d={`M ${-dx - 6 + lookX} ${y} Q ${-dx + lookX} ${y + 5} ${-dx + 6 + lookX} ${y}`} />
			<path d={`M ${dx - 6 + lookX} ${y} Q ${dx + lookX} ${y + 5} ${dx + 6 + lookX} ${y}`} />
		</g>
	) : (
		<g fill={C.ink}>
			<ellipse cx={-dx + lookX} cy={y} rx={r} ry={r * 1.3} />
			<ellipse cx={dx + lookX} cy={y} rx={r} ry={r * 1.3} />
			<circle cx={-dx + lookX + r * 0.35} cy={y - r * 0.5} r={r * 0.32} fill="#FFFFFF" />
			<circle cx={dx + lookX + r * 0.35} cy={y - r * 0.5} r={r * 0.32} fill="#FFFFFF" />
		</g>
	);

/** Legs with an optional walk cycle (`walk` = phase in radians, null = still). */
const Legs: React.FC<{x0: number; w: number; top: number; len: number; color: string; shoe: number; walk: number | null}> = ({
	x0,
	w,
	top,
	len,
	color,
	shoe,
	walk,
}) => {
	const a = walk === null ? 0 : Math.sin(walk) * 16;
	return (
		<g>
			{[-1, 1].map((side) => {
				const ang = side * a;
				const cx = side * x0;
				return (
					<g key={side} transform={`rotate(${ang} ${cx} ${top})`}>
						<rect x={cx - w / 2} y={top} width={w} height={len} rx={w * 0.42} fill={color} stroke={C.ink} strokeWidth={SW} />
						<ellipse cx={cx + side * 2} cy={top + len} rx={shoe} ry={shoe * 0.42} fill={C.ink} />
					</g>
				);
			})}
		</g>
	);
};

/**
 * Carolina, 39. Origin: feet centre (stand). For 'bust' the same origin is used,
 * legs are omitted and forearms rest forward (place a table over y > -250).
 */
export const Carolina: React.FC<{
	x: number;
	y: number;
	scale?: number;
	pose?: Pose;
	mood?: Mood;
	lookX?: number;
	headTilt?: number;
	flip?: boolean;
	hug?: boolean;
	bag?: boolean;
	opacity?: number;
	headDrop?: number;
	walk?: number | null;
	phone?: boolean;
	mug?: boolean;
	seed?: number;
}> = ({
	x,
	y,
	scale = 1,
	pose = 'stand',
	mood = 'neutral',
	lookX = 0,
	headTilt = 0,
	flip,
	hug,
	bag = true,
	opacity = 1,
	headDrop = 0,
	walk = null,
	phone,
	mug,
	seed = 0,
}) => {
	const {breath, blink, nod} = useIdle(seed);
	const step = walk === null ? 0 : Math.abs(Math.sin(walk)) * -6;
	const armSwing = walk === null ? 0 : Math.sin(walk) * 10;
	return (
		<g transform={`translate(${x} ${y + step}) scale(${flip ? -scale : scale} ${scale * (1 + breath)})`} opacity={opacity}>
			{pose === 'stand' && <Legs x0={23} w={34} top={-200} len={190} color={C.pants} shoe={24} walk={walk} />}
			{/* torso */}
			<path
				d="M -60 -352 Q -62 -366 -46 -366 L 46 -366 Q 62 -366 60 -352 L 70 -200 Q 70 -186 56 -186 L -56 -186 Q -70 -186 -70 -200 Z"
				fill={C.blouse}
				stroke={C.ink}
				strokeWidth={SW}
			/>
			<path d="M -18 -366 L 0 -340 L 18 -366" fill="none" stroke={C.ink} strokeWidth={SW} strokeLinejoin="round" />
			{bag && pose === 'stand' && <line x1={-38} y1={-362} x2={86} y2={-240} stroke={C.bag} strokeWidth={7} strokeLinecap="round" />}
			{pose === 'stand' ? (
				<g>
					<g transform={`rotate(${armSwing} -78 -350)`}>
						<rect x={-94} y={-354} width={32} height={118} rx={15} fill={C.blouse} stroke={C.ink} strokeWidth={SW} />
						<rect x={-91} y={-248} width={26} height={62} rx={12} fill={C.skin} stroke={C.ink} strokeWidth={SW} />
						<circle cx={-78} cy={-180} r={14} fill={C.skin} stroke={C.ink} strokeWidth={SW} />
					</g>
					{phone || mug ? (
						<g>
							<rect x={62} y={-354} width={32} height={100} rx={15} fill={C.blouse} stroke={C.ink} strokeWidth={SW} />
							<rect x={20} y={-276} width={74} height={26} rx={12} fill={C.skin} stroke={C.ink} strokeWidth={SW} />
							{phone && <rect x={2} y={-318} width={38} height={66} rx={8} fill={C.night} stroke={C.ink} strokeWidth={SW} />}
							{phone && <rect x={7} y={-311} width={28} height={46} rx={4} fill={C.teal} opacity={0.85} />}
							{mug && (
								<g>
									<rect x={4} y={-300} width={40} height={46} rx={8} fill="#F8FAFC" stroke={C.ink} strokeWidth={SW} />
									<path d="M 44 -292 Q 60 -282 44 -268" fill="none" stroke={C.ink} strokeWidth={SW} />
								</g>
							)}
							<circle cx={26} cy={-262} r={14} fill={C.skin} stroke={C.ink} strokeWidth={SW} />
						</g>
					) : (
						<g transform={`rotate(${-armSwing} 78 -350)`}>
							<rect x={62} y={-354} width={32} height={118} rx={15} fill={C.blouse} stroke={C.ink} strokeWidth={SW} />
							<rect x={65} y={-248} width={26} height={62} rx={12} fill={C.skin} stroke={C.ink} strokeWidth={SW} />
							<circle cx={78} cy={-180} r={14} fill={C.skin} stroke={C.ink} strokeWidth={SW} />
						</g>
					)}
				</g>
			) : (
				<g>
					<rect x={-94} y={-354} width={32} height={110} rx={15} fill={C.blouse} stroke={C.ink} strokeWidth={SW} />
					<rect x={-94} y={-262} width={86} height={28} rx={13} fill={C.skin} stroke={C.ink} strokeWidth={SW} />
					<circle cx={-6} cy={-248} r={14} fill={C.skin} stroke={C.ink} strokeWidth={SW} />
					{hug ? (
						<g>
							<path d="M 60 -350 Q 130 -380 205 -330" fill="none" stroke={C.ink} strokeWidth={36} strokeLinecap="round" />
							<path d="M 60 -350 Q 130 -380 205 -330" fill="none" stroke={C.blouse} strokeWidth={30} strokeLinecap="round" />
							<circle cx={212} cy={-322} r={14} fill={C.skin} stroke={C.ink} strokeWidth={SW} />
						</g>
					) : (
						<g>
							<rect x={62} y={-354} width={32} height={110} rx={15} fill={C.blouse} stroke={C.ink} strokeWidth={SW} />
							<rect x={8} y={-262} width={86} height={28} rx={13} fill={C.skin} stroke={C.ink} strokeWidth={SW} />
							<circle cx={6} cy={-248} r={14} fill={C.skin} stroke={C.ink} strokeWidth={SW} />
						</g>
					)}
				</g>
			)}
			{bag && pose === 'stand' && (
				<g transform={`rotate(${-armSwing * 0.4} 86 -240)`}>
					<rect x={70} y={-252} width={66} height={72} rx={12} fill={C.bag} stroke={C.ink} strokeWidth={SW} />
					<path d="M 70 -232 L 136 -232" stroke={C.ink} strokeWidth={SW} />
				</g>
			)}
			{/* head */}
			<g transform={`translate(0 ${headDrop}) rotate(${headTilt + nod} 0 -372)`}>
				<ellipse cx={40} cy={-388} rx={18} ry={36} fill={C.hairCaro} transform={`rotate(${18 + nod * 2} 40 -388)`} />
				<rect x={-12} y={-388} width={24} height={26} fill={C.skin} stroke={C.ink} strokeWidth={SW} />
				<ellipse cx={0} cy={-428} rx={48} ry={54} fill={C.skin} stroke={C.ink} strokeWidth={SW} />
				<path
					d="M -51 -420 Q -58 -488 0 -488 Q 58 -488 51 -420 Q 46 -452 14 -460 Q -10 -446 -40 -448 Q -48 -440 -51 -420 Z"
					fill={C.hairCaro}
					stroke={C.ink}
					strokeWidth={SW}
					strokeLinejoin="round"
				/>
				<Eyes y={-424} dx={17} lookX={lookX} closed={mood === 'laugh' || blink} />
				<g stroke={C.hairCaro} strokeWidth={4} strokeLinecap="round">
					<line x1={-26 + lookX * 0.4} y1={-444} x2={-10 + lookX * 0.4} y2={mood === 'sad' || mood === 'tired' ? -451 : mood === 'surprised' ? -452 : -446} />
					<line x1={10 + lookX * 0.4} y1={mood === 'sad' || mood === 'tired' ? -451 : mood === 'surprised' ? -452 : -446} x2={26 + lookX * 0.4} y2={-444} />
				</g>
				<circle cx={-30} cy={-404} r={8} fill="#F08A7E" opacity={0.35} />
				<circle cx={30} cy={-404} r={8} fill="#F08A7E" opacity={0.35} />
				<Mouth mood={mood} y={-398} w={13} />
			</g>
		</g>
	);
};

/** Mateo, 9 (also used for classmates with other hair/shirt colours). Origin: feet centre. */
export const Kid: React.FC<{
	x: number;
	y: number;
	scale?: number;
	pose?: Pose;
	mood?: Mood;
	lookX?: number;
	headTilt?: number;
	headDrop?: number;
	hair?: string;
	shirt?: string;
	backpack?: boolean;
	pencilAngle?: number | null;
	flip?: boolean;
	opacity?: number;
	skin?: string;
	walk?: number | null;
	wave?: number;
	seed?: number;
}> = ({
	x,
	y,
	scale = 1,
	pose = 'stand',
	mood = 'neutral',
	lookX = 0,
	headTilt = 0,
	headDrop = 0,
	hair = '#111827',
	shirt = C.uniform,
	backpack = true,
	pencilAngle = null,
	flip,
	opacity = 1,
	skin = C.skinKid,
	walk = null,
	wave = 0,
	seed = 1,
}) => {
	const {breath, blink, nod, f} = useIdle(seed);
	const step = walk === null ? 0 : Math.abs(Math.sin(walk)) * -5;
	const armSwing = walk === null ? 0 : Math.sin(walk) * 12;
	const waveAng = wave > 0 ? -150 * wave + Math.sin(f / 4) * 14 * wave : armSwing;
	return (
		<g transform={`translate(${x} ${y + step}) scale(${flip ? -scale : scale} ${scale * (1 + breath)})`} opacity={opacity}>
			{backpack && pose === 'stand' && (
				<g>
					<rect x={24} y={-232} width={58} height={110} rx={16} fill={C.pack} stroke={C.ink} strokeWidth={SW} />
					<rect x={34} y={-182} width={40} height={36} rx={8} fill={C.packYellow} stroke={C.ink} strokeWidth={SW} />
				</g>
			)}
			{pose === 'stand' && <Legs x0={17} w={26} top={-122} len={114} color={C.uniformDark} shoe={19} walk={walk} />}
			<path
				d="M -46 -218 Q -48 -230 -34 -230 L 34 -230 Q 48 -230 46 -218 L 50 -124 Q 50 -114 40 -114 L -40 -114 Q -50 -114 -50 -124 Z"
				fill={shirt}
				stroke={C.ink}
				strokeWidth={SW}
			/>
			<path d="M -16 -230 L 0 -208 L 16 -230 Z" fill="#F8FAFC" stroke={C.ink} strokeWidth={SW} strokeLinejoin="round" />
			{backpack && pose === 'stand' && (
				<g stroke={C.packYellow} strokeWidth={7} strokeLinecap="round">
					<line x1={-30} y1={-226} x2={-34} y2={-150} />
					<line x1={30} y1={-226} x2={34} y2={-150} />
				</g>
			)}
			{pose === 'stand' ? (
				<g>
					<g transform={`rotate(${-armSwing} -58 -220)`}>
						<rect x={-70} y={-224} width={24} height={86} rx={11} fill={shirt} stroke={C.ink} strokeWidth={SW} />
						<circle cx={-58} cy={-132} r={11} fill={skin} stroke={C.ink} strokeWidth={SW} />
					</g>
					<g transform={`rotate(${waveAng} 58 -220)`}>
						<rect x={46} y={-224} width={24} height={86} rx={11} fill={shirt} stroke={C.ink} strokeWidth={SW} />
						<circle cx={58} cy={-132} r={11} fill={skin} stroke={C.ink} strokeWidth={SW} />
					</g>
				</g>
			) : (
				<g>
					<rect x={-70} y={-224} width={24} height={80} rx={11} fill={shirt} stroke={C.ink} strokeWidth={SW} />
					<rect x={-70} y={-160} width={64} height={22} rx={10} fill={shirt} stroke={C.ink} strokeWidth={SW} />
					<circle cx={-6} cy={-149} r={11} fill={skin} stroke={C.ink} strokeWidth={SW} />
					<rect x={46} y={-224} width={24} height={80} rx={11} fill={shirt} stroke={C.ink} strokeWidth={SW} />
					<rect x={6} y={-160} width={64} height={22} rx={10} fill={shirt} stroke={C.ink} strokeWidth={SW} />
					<circle cx={10} cy={-149} r={11} fill={skin} stroke={C.ink} strokeWidth={SW} />
					{pencilAngle !== null && (
						<g transform={`rotate(${pencilAngle} 12 -150)`}>
							<line x1={12} y1={-150} x2={40} y2={-196} stroke="#F59E0B" strokeWidth={8} strokeLinecap="round" />
							<line x1={12} y1={-150} x2={17} y2={-158} stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
						</g>
					)}
				</g>
			)}
			<g transform={`translate(0 ${headDrop}) rotate(${headTilt + nod} 0 -236)`}>
				<rect x={-10} y={-246} width={20} height={20} fill={skin} stroke={C.ink} strokeWidth={SW} />
				<ellipse cx={0} cy={-282} rx={42} ry={45} fill={skin} stroke={C.ink} strokeWidth={SW} />
				<path
					d="M -44 -282 Q -48 -334 0 -334 Q 48 -334 44 -282 Q 40 -300 30 -306 Q 12 -298 -6 -306 Q -24 -298 -38 -304 Q -42 -296 -44 -282 Z"
					fill={hair}
					stroke={C.ink}
					strokeWidth={SW}
					strokeLinejoin="round"
				/>
				<Eyes y={-278} dx={15} lookX={lookX} r={4.5} closed={mood === 'laugh' || blink} />
				<circle cx={-26} cy={-262} r={7} fill="#F08A7E" opacity={0.35} />
				<circle cx={26} cy={-262} r={7} fill="#F08A7E" opacity={0.35} />
				<Mouth mood={mood} y={-256} w={10} />
			</g>
		</g>
	);
};

/** EDU: round floating assistant, white and turquoise, big digital eyes, small hands. Origin: centre. */
export const EduBot: React.FC<{
	x: number;
	y: number;
	scale?: number;
	armsOpen?: number;
	opacity?: number;
	shadow?: boolean;
	happy?: boolean;
	glow?: number;
}> = ({x, y, scale = 1, armsOpen = 0, opacity = 1, shadow = true, happy, glow = 0}) => {
	const f = useCurrentFrame();
	const blink = (f + 20) % 140 < 4;
	const wiggle = Math.sin(f / 9) * 6 * armsOpen;
	return (
		<g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
			{glow > 0 && <circle r={150} fill={C.teal} opacity={0.12 * glow} />}
			{glow > 0 && <circle r={210} fill={C.teal} opacity={0.06 * glow} />}
			{shadow && <ellipse cx={0} cy={150} rx={70} ry={12} fill="#0F172A" opacity={0.1} />}
			<g transform={`rotate(${-armsOpen * 35 + wiggle} -104 10)`}>
				<circle cx={-112} cy={20} r={20} fill="#FFFFFF" stroke={C.teal} strokeWidth={5} />
			</g>
			<g transform={`rotate(${armsOpen * 35 - wiggle} 104 10)`}>
				<circle cx={112} cy={20} r={20} fill="#FFFFFF" stroke={C.teal} strokeWidth={5} />
			</g>
			<circle cx={0} cy={0} r={92} fill="#FFFFFF" stroke={C.teal} strokeWidth={6} />
			<path d="M -60 58 Q 0 96 60 58" fill="none" stroke={C.teal} strokeWidth={6} strokeLinecap="round" opacity={0.5} />
			<rect x={-62} y={-44} width={124} height={76} rx={30} fill={C.night} />
			{blink ? (
				<g stroke={C.teal} strokeWidth={6} strokeLinecap="round">
					<line x1={-38} y1={-6} x2={-14} y2={-6} />
					<line x1={14} y1={-6} x2={38} y2={-6} />
				</g>
			) : happy ? (
				<g fill="none" stroke={C.teal} strokeWidth={7} strokeLinecap="round">
					<path d="M -40 0 Q -26 -22 -12 0" />
					<path d="M 12 0 Q 26 -22 40 0" />
				</g>
			) : (
				<g>
					<ellipse cx={-26} cy={-6} rx={13} ry={17} fill={C.teal} />
					<ellipse cx={26} cy={-6} rx={13} ry={17} fill={C.teal} />
					<circle cx={-22} cy={-12} r={4} fill="#CCFBF1" />
					<circle cx={30} cy={-12} r={4} fill="#CCFBF1" />
				</g>
			)}
			<circle cx={0} cy={-104} r={9} fill={C.teal} />
			<line x1={0} y1={-95} x2={0} y2={-92} stroke={C.teal} strokeWidth={5} />
		</g>
	);
};
