import React from 'react';
import {interpolate, interpolateColors, random, useCurrentFrame} from 'remotion';
import {Carolina, Kid} from './characters';
import {Clock, Icon, IconName, PhoneShape} from './icons';
import {C, Camera, Caption, FPS, NightBg, Sfx, Stage, bob, easeInOut, glide, lerp, pop, prog, s, useCues} from './theme';

/* ───────────── shared pieces ───────────── */

/** Icon on a round plate that springs in. */
export const Badge: React.FC<{
	icon: IconName;
	x: number;
	y: number;
	at: number;
	r?: number;
	plate?: string;
	ring?: string;
	scale?: number;
}> = ({icon, x, y, at, r = 70, plate = C.night2, ring = '#334155', scale = 1}) => {
	const f = useCurrentFrame();
	const k = pop(f, at);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y + bob(f, 4, 3.4, x)}) scale(${k * scale})`}>
			<circle r={r} fill={plate} stroke={ring} strokeWidth={5} />
			<Icon name={icon} x={0} y={0} scale={(r / 70) * 0.85} />
		</g>
	);
};

export const Table: React.FC<{top: string; edge: string}> = ({top, edge}) => (
	<g>
		<polygon points="260,700 1660,700 1780,810 140,810" fill={top} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
		<rect x={140} y={810} width={1640} height={34} fill={edge} stroke={C.ink} strokeWidth={3} />
		<rect x={200} y={844} width={34} height={240} fill={edge} stroke={C.ink} strokeWidth={3} />
		<rect x={1686} y={844} width={34} height={240} fill={edge} stroke={C.ink} strokeWidth={3} />
	</g>
);

export const Notebook: React.FC<{x: number; y: number}> = ({x, y}) => (
	<g transform={`translate(${x} ${y})`}>
		<polygon points="-120,-26 120,-26 136,26 -136,26" fill="#F8FAFC" stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
		<line x1={0} y1={-26} x2={0} y2={26} stroke={C.ink} strokeWidth={3} />
		{[-8, 6].map((yy) => (
			<g key={yy}>
				<line x1={-100} y1={yy} x2={-20} y2={yy} stroke="#93C5FD" strokeWidth={3} />
				<line x1={20} y1={yy} x2={100} y2={yy} stroke="#93C5FD" strokeWidth={3} />
			</g>
		))}
	</g>
);

export const Checklist: React.FC<{x: number; y: number; rows: number; checkTimes: number[]; dark: boolean; width?: number; at?: number}> = ({
	x,
	y,
	rows,
	checkTimes,
	dark,
	width = 420,
	at = 0,
}) => {
	const f = useCurrentFrame();
	const k = pop(f, at, 15);
	if (k <= 0) return null;
	const h = 70 + rows * 56;
	return (
		<g transform={`translate(${x} ${y}) scale(${k}) translate(${-width / 2} ${-h / 2})`}>
			<rect width={width} height={h} rx={26} fill={dark ? C.night2 : '#FFFFFF'} stroke={dark ? '#334155' : C.ink} strokeWidth={dark ? 4 : 3} />
			<rect x={34} y={26} width={140} height={14} rx={7} fill={dark ? '#475569' : '#CBD5E1'} />
			{Array.from({length: rows}).map((_, i) => {
				const p = prog(f, checkTimes[i] ?? 999, 0.45);
				return (
					<g key={i} transform={`translate(34 ${66 + i * 56})`}>
						<rect width={32} height={32} rx={8} fill={p > 0.4 ? (dark ? C.amber : C.teal) : 'none'} stroke={dark ? '#64748B' : C.ink} strokeWidth={3} />
						{p > 0 && <path d="M 7 16 L 14 23 L 26 9" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" strokeDasharray={30} strokeDashoffset={30 * (1 - p)} />}
						<rect x={52} y={10} width={(width - 140) * (0.65 + ((i * 37) % 30) / 100)} height={12} rx={6} fill={dark ? '#475569' : '#CBD5E1'} opacity={p > 0.5 ? 0.55 : 1} />
					</g>
				);
			})}
		</g>
	);
};

/* ───────────── S1 Apertura ───────────── */
export const S1: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const {c} = useCues();
	const clockIn = pop(f, 0.05, 14);
	const snapAt = c(0) + 1.0;
	const snap = pop(f, snapAt, 9);
	const minutes = 299.6 + 0.4 * snap + Math.max(0, t - snapAt) * 0.02;
	const move = glide(f, c(1) - 0.2);
	const caroIn = glide(f, c(1));
	const walking = caroIn < 0.97 && t > c(1);
	const dawn = prog(f, c(2), 7, easeInOut);
	const sky = interpolateColors(dawn, [0, 1], ['#0A1022', '#25335C']);
	const lamp = prog(f, c(1), 0.8);
	const thinkAt = c(2) + 3.5;
	return (
		<NightBg glowX={lerp(50, 70, move)} glow={interpolateColors(lamp, [0, 1], ['#1D2A4A', '#3A2E25'])}>
			<Camera from={1} to={1.06} ox={55}>
				<Stage>
					<defs>
						<clipPath id="s1win">
							<rect x={510} y={110} width={900} height={620} rx={28} />
						</clipPath>
						<linearGradient id="s1dawn" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0.45" stopColor={sky} />
							<stop offset="1" stopColor={interpolateColors(dawn, [0, 1], ['#0A1022', '#F59E0B'])} />
						</linearGradient>
					</defs>
					<g transform={`translate(${lerp(0, -330, move)} ${lerp(0, 40, move)}) translate(960 420) scale(${lerp(1, 0.78, move)}) translate(-960 -420)`}>
						<g clipPath="url(#s1win)">
							<rect x={510} y={110} width={900} height={620} fill="url(#s1dawn)" />
							{Array.from({length: 22}).map((_, i) => (
								<circle
									key={i}
									cx={540 + random(`sx${i}`) * 840}
									cy={130 + random(`sy${i}`) * 300}
									r={1.5 + random(`sr${i}`) * 2.2}
									fill="#F8FAFC"
									opacity={(0.5 + 0.4 * Math.sin(f / 12 + i * 1.7)) * (1 - dawn * 0.7)}
								/>
							))}
							{[
								[510, 560, 150],
								[660, 500, 120],
								[780, 590, 160],
								[1160, 520, 130],
								[1290, 470, 140],
							].map(([x, top, w], i) => (
								<g key={i} transform={`translate(${Math.sin(f / 80) * 3 * (i % 2 ? 1 : -1)} 0)`}>
									<rect x={x} y={top} width={w} height={300} fill="#0B1020" />
									{[0, 1, 2].map((r) =>
										[0, 1].map((cc) => {
											const on = random(`w${i}${r}${cc}`) > 0.45 && t > random(`wt${i}${r}${cc}`) * 6;
											return on ? <rect key={`${r}${cc}`} x={x + 24 + cc * 54} y={top + 30 + r * 50} width={22} height={18} rx={3} fill={C.amber} opacity={0.8} /> : null;
										}),
									)}
								</g>
							))}
						</g>
						<rect x={510} y={110} width={900} height={620} rx={28} fill="none" stroke="#334155" strokeWidth={10} />
						<line x1={960} y1={110} x2={960} y2={730} stroke="#334155" strokeWidth={8} />
						<line x1={510} y1={420} x2={1410} y2={420} stroke="#334155" strokeWidth={8} />
						<rect x={480} y={730} width={960} height={26} rx={8} fill="#334155" />
						<g transform={`translate(960 420) scale(${clockIn}) rotate(${snap > 0 && snap < 1.05 ? Math.sin(t * 40) * 3 * (1 - Math.min(1, (t - snapAt) / 1.2)) : 0}) translate(-960 -420)`}>
							<circle cx={960} cy={420} r={200} fill={C.night} opacity={0.65} />
							<circle cx={890} cy={238} r={30} fill={C.red} stroke={C.ink} strokeWidth={4} />
							<circle cx={1030} cy={238} r={30} fill={C.red} stroke={C.ink} strokeWidth={4} />
							<Clock x={960} y={420} r={170} minutes={minutes} face="#E2E8F0" rim="#F8FAFC" />
						</g>
					</g>
					{caroIn > 0 && (
						<g>
							<ellipse cx={lerp(2250, 1380, caroIn)} cy={950} rx={110} ry={16} fill="#000" opacity={0.25} />
							<Carolina x={lerp(2250, 1380, caroIn)} y={945} scale={1.05} mug mood={t > c(2) ? 'smile' : 'neutral'} walk={walking ? t * 9 : null} lookX={-4} seed={1} />
						</g>
					)}
					<Badge icon="heart" x={1150} y={300} at={c(2) + 0.45} r={62} />
					<Badge icon="helmet" x={1610} y={300} at={c(2) + 1.35} r={62} />
					{f >= s(thinkAt) && (
						<g transform={`translate(1380 150) scale(${pop(f, thinkAt)})`}>
							<circle cx={-90} cy={150} r={10} fill="#F8FAFC" opacity={0.85} />
							<circle cx={-60} cy={118} r={16} fill="#F8FAFC" opacity={0.85} />
							<rect x={-170} y={-70} width={340} height={150} rx={60} fill="#F8FAFC" />
							{(['task', 'calendar', 'backpack'] as IconName[]).map((ic, i) => (
								<Icon key={ic} name={ic} x={-100 + i * 100} y={5} scale={0.62 * pop(f, thinkAt + 0.35 + i * 0.3)} />
							))}
						</g>
					)}
				</Stage>
				<Caption text="Carolina" at={c(1) + 0.5} x={1380} y={1000} size={76} />
			</Camera>
			<Sfx name="whoosh" at={0.02} volume={0.3} />
			<Sfx name="tap" at={snapAt} volume={0.6} />
			<Sfx name="whoosh" at={c(1)} volume={0.35} />
			<Sfx name="pop" at={c(2) + 0.45} />
			<Sfx name="pop" at={c(2) + 1.35} />
			<Sfx name="bubble" at={thinkAt} />
		</NightBg>
	);
};

/* ───────────── S2 Su día ───────────── */
const S2_ST: {x: number; icon: IconName}[] = [
	{x: 470, icon: 'school'},
	{x: 860, icon: 'office'},
	{x: 1250, icon: 'bus'},
	{x: 1640, icon: 'field'},
];

export const S2: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const {c, p} = useCues();
	const lineY = 650;
	const draw = prog(f, 0.15, 1.1, easeInOut);
	// Carolina walks to station j when that stop is named.
	let cx = 190;
	let walking = false;
	for (let j = 0; j < 4; j++) {
		const go = p(1, j) - 0.25;
		const k = prog(f, go, 0.9, easeInOut);
		if (k > 0) cx = lerp(j === 0 ? 190 : S2_ST[j - 1].x, S2_ST[j].x, k);
		if (k > 0 && k < 1) walking = true;
	}
	const squeeze = 1 - 0.12 * prog(f, c(3), 1.2, easeInOut);
	const ringing = t > c(2) && t < c(3) + 0.5;
	const pings = [0.15, 0.85, 1.55, 2.25].map((d) => c(2) + d);
	const pingIcons: IconName[] = ['chat', 'mail', 'chat', 'web'];
	return (
		<NightBg>
			<Camera from={1.02} to={1.07}>
				<Stage>
					<g transform={`translate(960 0) scale(${squeeze} 1) translate(-960 0)`}>
						<rect x={140} y={lineY + 26} width={1640 * draw} height={34} rx={17} fill={C.night2} />
						<line x1={150} y1={lineY + 43} x2={140 + 1640 * draw - 10} y2={lineY + 43} stroke="#475569" strokeWidth={4} strokeDasharray="24 18" strokeDashoffset={-t * 60} />
						<line x1={140} y1={lineY} x2={140 + 1640 * draw} y2={lineY} stroke={C.amber} strokeWidth={8} strokeLinecap="round" />
						<g opacity={draw}>
							<Icon name="house" x={190} y={lineY - 70} scale={0.7} />
						</g>
						{S2_ST.map((st, j) => {
							const dot = pop(f, c(0) + 0.35 + j * 0.14);
							const icon = pop(f, p(1, j) + 0.35);
							const active = t > p(1, j) + 0.3;
							return (
								<g key={j}>
									<line x1={st.x} y1={lineY - 210} x2={st.x} y2={lineY} stroke="#334155" strokeWidth={5} opacity={dot} strokeDasharray="6 10" />
									<circle cx={st.x} cy={lineY} r={14 * dot} fill={active ? C.amber : '#475569'} />
									<g transform={`translate(${st.x} ${lineY - 320 + bob(f, 5, 3, j)}) scale(${0.35 + 0.65 * Math.max(dot * 0.4, icon)})`} opacity={dot}>
										<circle r={96} fill={C.night2} stroke={active ? C.amber : '#334155'} strokeWidth={6} />
										{icon > 0 && <Icon name={st.icon} x={0} y={0} scale={1.1 * icon} />}
									</g>
								</g>
							);
						})}
						{[0, 1, 2].map((i) => {
							const pr = ((t * (0.16 + i * 0.07) + i * 0.37) % 1 + 1) % 1;
							return draw > 0.9 ? <Icon key={i} name="bus" x={lerp(250, 1700, pr)} y={lineY + 43} scale={0.4} /> : null;
						})}
						<Carolina x={cx} y={lineY - 6} scale={0.46} walk={walking ? t * 10 : null} phone={ringing} mood={ringing ? 'tired' : 'neutral'} seed={2} />
						{pings.map((pt, i) => {
							const k = prog(f, pt, 1.6);
							if (k <= 0 || k >= 1) return null;
							return (
								<g key={i} transform={`translate(${cx + (i % 2 ? 90 : -90)} ${lineY - 280 - k * 120}) scale(${pop(f, pt) * 0.75})`} opacity={1 - k}>
									<Icon name={pingIcons[i]} x={0} y={0} />
									<circle cx={42} cy={-40} r={14} fill={C.red} />
								</g>
							);
						})}
					</g>
					{f >= s(c(3)) && (
						<g transform={`translate(960 190) scale(${pop(f, c(3))})`}>
							<Clock x={0} y={0} r={74} minutes={(t - c(3)) * 240} face="#E2E8F0" rim={C.amber} />
						</g>
					)}
				</Stage>
			</Camera>
			<Caption text="Un día, cuatro lugares" at={c(0) + 0.3} y={960} size={70} />
			<Sfx name="whoosh" at={0.1} volume={0.3} />
			{S2_ST.map((_, j) => (
				<Sfx key={j} name="pop" at={p(1, j) + 0.35} />
			))}
			{pings.map((pt, i) => (
				<Sfx key={`p${i}`} name="ping" at={pt} volume={0.3} />
			))}
			<Sfx name="pop" at={c(3)} />
		</NightBg>
	);
};

/* ───────────── S3 Mateo ───────────── */
const S3_CARDS: {icon: IconName; color: string}[] = [
	{icon: 'math', color: C.amber},
	{icon: 'plant', color: '#22C55E'},
	{icon: 'globe', color: '#3B82F6'},
	{icon: 'book', color: '#F472B6'},
];
const S3_BADGES: IconName[] = ['task', 'paint', 'calendar'];

export const S3: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const {c, p} = useCues();
	const mIn = glide(f, 0.1);
	const mWalking = mIn < 0.97;
	const wave = prog(f, c(0) + 1.4, 0.4) * (1 - prog(f, c(0) + 3.2, 0.4));
	const gather = prog(f, c(3) - 0.1, 0.8, easeInOut);
	const caroIn = glide(f, c(3) + 0.1);
	const caroWalking = caroIn > 0.02 && caroIn < 0.97;
	const drop = prog(f, c(3) + 1.5, 0.9, easeInOut);
	return (
		<NightBg>
			<Camera from={1} to={1.05}>
				<Stage>
					<ellipse cx={lerp(-200, 470, mIn)} cy={905} rx={120} ry={16} fill="#000" opacity={0.25} />
					<Kid x={lerp(-200, 470, mIn)} y={900} scale={1.65} walk={mWalking ? t * 10 : null} wave={wave} mood={t > c(3) + 1 ? 'neutral' : 'smile'} lookX={t > c(3) + 0.3 ? 6 : 0} seed={3} />
					{caroIn > 0 && <Carolina x={lerp(2200, 1540, caroIn)} y={960} scale={1.1} walk={caroWalking ? t * 9 : null} mood={drop > 0.6 ? 'tired' : 'neutral'} lookX={-5} seed={4} />}
					{S3_CARDS.map((card, i) => {
						const enter = pop(f, p(1, i), 13);
						if (enter <= 0) return null;
						const gx = 1060 + (i % 2) * 370;
						const gy = 300 + Math.floor(i / 2) * 350;
						const x = lerp(lerp(gx, 1250, gather), 1540, drop);
						const y = lerp(lerp(gy, 470 - i * 16, gather), 735 - i * 16, drop);
						const k = lerp(lerp(1, 0.7, gather), 0.46, drop);
						return (
							<g key={i} transform={`translate(${x} ${y + bob(f, 5, 3.6, i) * (1 - gather)}) rotate(${(1 - Math.min(1, enter)) * -14 + (i % 2 ? 2 : -2) * (1 - gather)}) scale(${k * enter})`}>
								<rect x={-155} y={-145} width={310} height={290} rx={30} fill={C.night2} stroke="#475569" strokeWidth={4} />
								<rect x={-155} y={-145} width={310} height={40} rx={20} fill={card.color} />
								<rect x={-155} y={-125} width={310} height={20} fill={card.color} />
								<Icon name={card.icon} x={0} y={0} scale={1.2} />
								{S3_BADGES.map((b, j) => {
									const bk = pop(f, c(2) + 0.85 + j * 0.75 + i * 0.06);
									return bk > 0 ? (
										<g key={b} transform={`translate(${-90 + j * 90} 108) scale(${bk})`}>
											<circle r={28} fill={C.night} stroke={card.color} strokeWidth={3} />
											<Icon name={b} x={0} y={0} scale={0.36} />
										</g>
									) : null;
								})}
							</g>
						);
					})}
				</Stage>
			</Camera>
			<Caption text="Mateo, 3.° de primaria" at={c(0) + 0.5} x={470} y={1000} size={54} />
			<Sfx name="whoosh" at={0.1} volume={0.3} />
			{S3_CARDS.map((_, i) => (
				<Sfx key={i} name="pop" at={p(1, i)} />
			))}
			{S3_BADGES.map((_, j) => (
				<Sfx key={`b${j}`} name="blip" at={c(2) + 0.85 + j * 0.75} volume={0.35} />
			))}
			<Sfx name="whoosh" at={c(3) + 1.45} volume={0.35} />
		</NightBg>
	);
};

/* ───────────── S4 Todo disperso ───────────── */
const S4_IN: {icon: IconName; from: [number, number]; badge: [number, number]}[] = [
	{icon: 'web', from: [-160, 300], badge: [-150, -250]},
	{icon: 'chat', from: [2080, 240], badge: [150, -190]},
	{icon: 'mail', from: [640, -160], badge: [-160, -20]},
	{icon: 'notebook', from: [1300, 1240], badge: [160, 80]},
	{icon: 'circular', from: [-160, 920], badge: [-150, 210]},
];
const PUZZLE_COLORS = ['#A78BFA', '#F472B6', '#60A5FA', '#FBBF24', '#34D399'];

export const S4: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const {c, p} = useCues();
	const phoneIn = pop(f, c(0) + 0.1, 14);
	const accent = interpolateColors(f, [s(c(1)), s(c(2))], [C.amber, C.red]);
	const hit = (j: number) => p(1, j) + 0.55;
	let shake = 0;
	for (let j = 0; j < 5; j++) {
		const dt = t - hit(j);
		if (dt > 0 && dt < 0.6) shake += Math.sin(dt * 55) * 10 * (1 - dt / 0.6);
	}
	const ring = prog(f, c(2) - 0.1, 0.8, easeInOut);
	const phoneShrink = lerp(1, 0.78, ring);
	const broken = prog(f, c(2) + 2.0, 0.4);
	const puzzle = prog(f, c(3), 0.7);
	const caro = glide(f, c(3) + 0.3);
	return (
		<NightBg glow={interpolateColors(ring, [0, 1], ['#1D2A4A', '#2A1A2A'])}>
			<Camera from={1} to={1.05}>
				<Stage>
					<g transform={`translate(${shake} 0) translate(960 480) scale(${phoneIn * phoneShrink}) translate(-960 -480)`}>
						<PhoneShape x={960} y={480} w={300} h={600} stroke={accent} />
						{S4_IN.map((_, j) => {
							const on = pop(f, hit(j), 16);
							return on > 0 ? (
								<g key={j} transform={`translate(0 ${(1 - Math.min(1, on)) * 20})`} opacity={Math.min(1, on)}>
									<rect x={850} y={290 + j * 72} width={220} height={56} rx={14} fill={C.night2} />
									<circle cx={878} cy={318 + j * 72} r={12} fill={j === 1 ? '#22C55E' : '#64748B'} />
									<rect x={900} y={308 + j * 72} width={140} height={10} rx={5} fill="#475569" />
									<rect x={900} y={324 + j * 72} width={100} height={8} rx={4} fill="#334155" />
								</g>
							) : null;
						})}
						{S4_IN.map((h, j) => {
							const k = pop(f, hit(j));
							return k > 0 ? (
								<g key={`b${j}`} transform={`translate(${960 + h.badge[0]} ${480 + h.badge[1]}) scale(${k * (1 - ring)})`}>
									<circle r={30} fill={C.red} stroke={C.night} strokeWidth={5} />
									<circle r={8} fill="#F8FAFC" />
								</g>
							) : null;
						})}
					</g>
					{/* incoming channels */}
					{S4_IN.map((h, j) => {
						const fly = prog(f, p(1, j), 0.55, easeInOut);
						const gone = prog(f, hit(j), 0.25);
						if (fly <= 0 || gone >= 1) return null;
						return <Icon key={j} name={h.icon} x={lerp(h.from[0], 960 + h.badge[0] * 0.4, fly)} y={lerp(h.from[1], 480 + h.badge[1] * 0.4, fly)} scale={1.15 * (1 - gone * 0.6)} opacity={1 - gone} rotate={(1 - fly) * 40} />;
					})}
					{/* five disconnected channels around the phone */}
					{ring > 0 &&
						S4_IN.map((h, j) => {
							const a = ((-90 + j * 72) * Math.PI) / 180;
							const a2 = ((-90 + (j + 1) * 72) * Math.PI) / 180;
							const R = 380;
							const x = 960 + Math.cos(a) * R;
							const y = 470 + Math.sin(a) * R * 0.92;
							const x2 = 960 + Math.cos(a2) * R;
							const y2 = 470 + Math.sin(a2) * R * 0.92;
							const k = pop(f, c(2) + j * 0.12);
							const mx = (x + x2) / 2;
							const my = (y + y2) / 2;
							const drift = puzzle * 30;
							return (
								<g key={`r${j}`}>
									<line
										x1={x}
										y1={y}
										x2={lerp(x, x2, prog(f, c(2) + 0.6 + j * 0.1, 0.5))}
										y2={lerp(y, y2, prog(f, c(2) + 0.6 + j * 0.1, 0.5))}
										stroke={broken > 0 ? C.red : '#64748B'}
										strokeWidth={4}
										strokeDasharray="14 12"
										opacity={(1 - puzzle) * 0.9}
									/>
									{broken > 0 && (
										<g transform={`translate(${mx} ${my}) scale(${pop(f, c(2) + 2.0 + j * 0.08)})`} opacity={1 - puzzle}>
											<circle r={20} fill={C.night} stroke={C.red} strokeWidth={4} />
											<path d="M -8 -8 L 8 8 M 8 -8 L -8 8" stroke={C.red} strokeWidth={5} strokeLinecap="round" />
										</g>
									)}
									<g transform={`translate(${x + Math.cos(a) * drift + Math.sin(f / 20 + j) * 6 * puzzle} ${y + Math.sin(a) * drift}) rotate(${puzzle * (j % 2 ? 18 : -14) + Math.sin(f / 25 + j) * 4 * puzzle}) scale(${k})`}>
										<circle r={74} fill={C.night2} stroke="#475569" strokeWidth={4} opacity={1 - puzzle} />
										<g opacity={1 - puzzle}>
											<Icon name={h.icon} x={0} y={0} scale={0.9} />
										</g>
										{puzzle > 0 && (
											<g opacity={puzzle} transform={`scale(${0.7 + 0.5 * puzzle})`}>
												<path
													d="M -40 -40 L -10 -40 Q -10 -58 4 -58 Q 18 -58 18 -40 L 40 -40 L 40 -12 Q 58 -12 58 2 Q 58 16 40 16 L 40 40 L -40 40 Z"
													fill={PUZZLE_COLORS[j]}
													stroke={C.ink}
													strokeWidth={3}
												/>
												<Icon name={h.icon} x={-2} y={0} scale={0.45} />
											</g>
										)}
									</g>
								</g>
							);
						})}
					{caro > 0 && <Carolina x={lerp(2150, 1640, caro)} y={1180} scale={1.05} pose="bust" mood="tired" lookX={-7} seed={5} />}
				</Stage>
			</Camera>
			<Caption text="Todo llega por separado" at={c(2) + 0.4} y={985} size={66} />
			<Sfx name="pop" at={c(0) + 0.1} />
			{S4_IN.map((_, j) => (
				<React.Fragment key={j}>
					<Sfx name="whoosh" at={p(1, j)} volume={0.25} />
					<Sfx name="ping" at={hit(j)} volume={0.3} />
				</React.Fragment>
			))}
			<Sfx name="pop" at={c(2) + 2.0} volume={0.4} />
			<Sfx name="swoosh_down" at={c(3)} volume={0.3} />
		</NightBg>
	);
};

/* ───────────── S5 El cambio que se pierde ───────────── */
type Bubble = {x: number; y: number; w: number; h: number; right: boolean};
const S5_BUBBLES: Bubble[] = (() => {
	const out: Bubble[] = [];
	let y = 0;
	for (let i = 0; i < 90; i++) {
		const right = random(`side${i}`) > 0.55;
		const w = 260 + random(`w${i}`) * 300;
		const h = 70 + Math.floor(random(`h${i}`) * 3) * 26;
		out.push({x: right ? 1440 - w : 480, y, w, h, right});
		y += h + 22;
	}
	return out;
})();
const S5_IMP = 30;

const BubbleShape: React.FC<{b: Bubble; fill: string; line: string; opacity?: number; stroke?: string}> = ({b, fill, line, opacity = 1, stroke}) => (
	<g opacity={opacity}>
		<rect x={b.x} y={b.y} width={b.w} height={b.h} rx={24} fill={fill} stroke={stroke} strokeWidth={stroke ? 6 : 0} />
		{Array.from({length: Math.max(1, Math.round((b.h - 40) / 26))}).map((_, k, arr) => (
			<rect key={k} x={b.x + 26} y={b.y + 26 + k * 26} width={(b.w - 52) * (k === arr.length - 1 ? 0.6 : 1)} height={10} rx={5} fill={line} />
		))}
	</g>
);

export const S5: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const {c, e} = useCues();
	const impAt = c(0) + 1.4;
	// scroll speed (px/s), integrated per frame
	const speed = (tt: number) =>
		tt < c(2) + 0.6 ? 45 : tt < e(2) ? lerp(45, 420, Math.min(1, (tt - c(2) - 0.6) / 1.2)) : lerp(420, 0, Math.min(1, (tt - e(2)) / 0.5));
	let off = 0;
	for (let k = 0; k < f; k++) off += speed(k / FPS) / FPS;
	let offImp = 0;
	for (let k = 0; k < s(impAt); k++) offImp += speed(k / FPS) / FPS;
	const imp = S5_BUBBLES[S5_IMP];
	const base = 700 - imp.y + offImp; // the important bubble enters at the bottom when it is mentioned
	const dy = base - off;
	const impOn = prog(f, impAt - 0.3, 0.3);
	const glowPulse = t > c(1) && t < e(1) + 0.4 ? 0.5 + 0.5 * Math.sin((t - c(1)) * 6) : 0;
	const zoomOut = prog(f, c(3) - 0.2, 1.4, easeInOut);
	const zk = lerp(1, 0.42, zoomOut);
	const covers = [0, 1, 2, 3].map((k) => prog(f, c(2) + 0.5 + k * 0.45, 0.4));
	const caro = glide(f, c(3) + 0.4);
	const camZoom = lerp(1, 1.08, prog(f, c(1), 1.2, easeInOut)) * lerp(1, 1 / 1.08, zoomOut);
	return (
		<NightBg>
			<div style={{position: 'absolute', inset: 0, transform: `scale(${camZoom})`}}>
				<Stage>
					<g transform={`translate(960 520) scale(${zk}) translate(${-lerp(960, imp.x + 274, zoomOut)} ${-lerp(540, imp.y + imp.h / 2 + dy, zoomOut)})`}>
						<g transform={`translate(0 ${dy})`}>
							{S5_BUBBLES.map((b, i) => {
								if (i === S5_IMP) return null;
								const y = b.y + dy;
								if (zoomOut === 0 && (y > 1150 || y + b.h < -60)) return null;
								if (i > S5_IMP + 8 && b.y + dy > 1000 && t < impAt) return null;
								return <BubbleShape key={i} b={b} fill={b.right ? '#1E3A5F' : C.night2} line={b.right ? '#3B5B85' : '#475569'} />;
							})}
							<g opacity={impOn}>
								<rect x={imp.x - 14} y={imp.y - 14} width={576} height={imp.h + 28} rx={34} fill={C.amber} opacity={0.18 + 0.25 * glowPulse} />
								<BubbleShape b={{...imp, w: 548}} fill={C.night2} line="#92400E" stroke={C.amber} />
								<Icon name="warning" x={imp.x + 485} y={imp.y + imp.h / 2} scale={0.55} />
								<Icon name="paint" x={imp.x + 380} y={imp.y + imp.h / 2} scale={0.45} />
							</g>
							{covers.map((pk, k) =>
								pk > 0 ? (
									<BubbleShape
										key={k}
										b={{x: imp.x + 10 + k * 50 + (1 - pk) * 500, y: imp.y - 34 + k * 26, w: 430 + k * 25, h: 96, right: false}}
										fill={k % 2 ? '#1E3A5F' : '#273449'}
										line="#475569"
										opacity={pk}
									/>
								) : null,
							)}
							{zoomOut > 0.5 && (
								<circle cx={imp.x + 274} cy={imp.y + imp.h / 2} r={380 + Math.sin(t * 5) * 20} fill="none" stroke={C.amber} strokeWidth={14} strokeDasharray="40 28" opacity={prog(f, c(3) + 1.0, 0.5)} />
							)}
						</g>
					</g>
					<defs>
						<linearGradient id="s5fade" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0" stopColor={C.night} stopOpacity={0} />
							<stop offset="1" stopColor={C.night} stopOpacity={0.96} />
						</linearGradient>
					</defs>
					<rect x={0} y={840} width={1920} height={240} fill="url(#s5fade)" />
					{caro > 0 && <Carolina x={lerp(-300, 330, caro)} y={1230} scale={1.15} pose="bust" phone={false} mood="neutral" lookX={6} seed={6} />}
				</Stage>
			</div>
			<Caption text="El aviso importante" at={impAt + 0.3} y={985} size={64} />
			<Sfx name="ping" at={impAt} volume={0.45} />
			{covers.map((_, k) => (
				<Sfx key={k} name="bubble" at={c(2) + 0.5 + k * 0.45} volume={0.3} />
			))}
			<Sfx name="swoosh_down" at={c(3) - 0.2} volume={0.3} />
		</NightBg>
	);
};

/* ───────────── S6 La hora de organizar ───────────── */
const S6_PAPERS = [
	{x: 820, y: 742, r: -8},
	{x: 1010, y: 760, r: 6},
	{x: 900, y: 775, r: 14},
	{x: 1100, y: 735, r: -12},
	{x: 760, y: 785, r: 4},
	{x: 980, y: 730, r: -3},
];

export const S6: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const {c, p} = useCues();
	const endAt = c(3) + 0.4;
	const mins =
		t < c(2) ? 420 + 22 * prog(f, c(0), c(2) - c(0), easeInOut) : t < endAt ? lerp(442, 480, prog(f, c(2), endAt - c(2), easeInOut)) : 480;
	const clockZoom = 1 + 0.5 * prog(f, c(2) - 0.2, 0.6, easeInOut) * (1 - prog(f, c(3) + 0.9, 0.6, easeInOut));
	const lookPhase = t < p(1, 1) ? 0 : t < p(1, 2) ? -8 : t < p(1, 3) ? 7 : -3;
	const writing = t > c(3) + 1.2;
	const slump = prog(f, c(2), 0.8) * (1 - prog(f, c(3) + 1.0, 0.6));
	const webOn = pop(f, p(1, 1));
	const chatsOn = t > p(1, 2);
	return (
		<NightBg glow="#3A2E25" glowY={55}>
			<Camera from={1} to={1.05}>
				<Stage>
					<circle cx={960} cy={560} r={620} fill={C.amber} opacity={0.08 + 0.02 * Math.sin(t * 2)} />
					<line x1={960} y1={0} x2={960} y2={70} stroke="#475569" strokeWidth={5} />
					<path d="M 880 130 Q 960 50 1040 130 Z" fill={C.amber} stroke={C.ink} strokeWidth={3} />
					<Kid x={560} y={914} scale={1.5} pose="bust" mood={writing ? 'neutral' : slump > 0.5 ? 'tired' : 'smile'} headDrop={slump * 12} headTilt={slump * -5} pencilAngle={writing ? Math.sin(t * 10) * 10 : 8} seed={7} />
					<Carolina x={1340} y={1025} scale={1.35} pose="bust" mood={t > c(3) + 1.0 ? 'smile' : 'tired'} lookX={lookPhase} seed={8} />
					<Table top="#4A3A2E" edge="#3A2C22" />
					<Notebook x={560} y={760} />
					<g>
						<Icon name="laptop" x={1180} y={676} scale={1.5} />
						{webOn > 0 && (
							<g transform={`translate(1180 655) scale(${webOn * 0.42})`}>
								<Icon name="web" x={0} y={0} />
							</g>
						)}
					</g>
					<g transform={`translate(1500 700) rotate(-8)`}>
						<rect x={-32} y={-60} width={64} height={110} rx={12} fill="#334155" stroke={C.ink} strokeWidth={3} />
						<rect x={-24} y={-50} width={48} height={88} rx={6} fill={C.night} />
						{chatsOn &&
							[0, 1, 2, 3].map((i) => {
								const yy = 30 - (((t - p(1, 2)) * 60 + i * 22) % 88);
								return <rect key={i} x={i % 2 ? -18 : -8} y={yy} width={26} height={12} rx={5} fill={i % 2 ? '#22C55E' : '#64748B'} />;
							})}
					</g>
					{S6_PAPERS.map((pp, i) => {
						const at = p(1, 3) + i * 0.35;
						const on = pop(f, at, 14);
						return on > 0 ? (
							<g key={i} transform={`translate(${pp.x} ${pp.y - (1 - Math.min(1, on)) * 80}) rotate(${pp.r * on})`} opacity={Math.min(1, on)}>
								{i === 3 ? (
									<Icon name="calendar" x={0} y={0} scale={0.8} />
								) : (
									<g>
										<rect x={-56} y={-30} width={112} height={60} rx={6} fill="#CBD5E1" stroke={C.ink} strokeWidth={3} />
										<rect x={-40} y={-14} width={70} height={7} rx={3.5} fill="#64748B" />
										<rect x={-40} y={2} width={56} height={7} rx={3.5} fill="#94A3B8" />
									</g>
								)}
							</g>
						) : null;
					})}
					<Checklist x={960} y={290} rows={5} checkTimes={[p(1, 1) + 0.5, p(1, 2) + 0.6, p(1, 3) + 0.6, c(2) + 1.5, c(3) + 0.6]} dark at={c(1)} />
					<g transform={`translate(170 160) scale(${clockZoom}) translate(-170 -160)`}>
						<Clock x={170} y={160} r={90} minutes={mins} face="#E2E8F0" rim={t > c(2) ? C.amber : '#F8FAFC'} />
					</g>
				</Stage>
			</Camera>
			<Caption text="7:00 p. m." at={c(0) + 0.3} until={c(3) + 0.1} x={340} y={165} size={64} align="left" accent={null} />
			<Caption text="8:00 p. m." at={c(3) + 0.45} x={340} y={165} size={64} align="left" color={C.amber} accent={null} />
			<Sfx name="pop" at={p(1, 1)} />
			<Sfx name="bubble" at={p(1, 2) + 0.1} volume={0.35} />
			{S6_PAPERS.map((_, i) => (
				<Sfx key={i} name="paper" at={p(1, 3) + i * 0.35} volume={0.35} />
			))}
			<Sfx name="pop" at={c(3) + 0.4} />
		</NightBg>
	);
};

/* ───────────── S7 Sin material ───────────── */
const S7_DESKS = [360, 760, 1160, 1560];
const S7_KIDS = [{hair: '#7C2D12', skin: '#E8B98F'}, {hair: '#1F2937', skin: '#C68B63'}, null, {hair: '#A16207', skin: '#F0C7A0'}];

export const S7: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const {c, e} = useCues();
	const placeAt = [c(0) + 1.7, c(0) + 2.2, 0, c(0) + 2.7];
	const open = prog(f, c(1) + 0.6, 0.5) * (1 - prog(f, c(2) + 1.8, 0.5));
	const sheet = prog(f, c(1) + 1.0, 0.7) * (1 - prog(f, c(2) + 1.5, 0.5));
	const sad = prog(f, c(1) + 1.9, 0.6);
	const look = t < c(2) + 0.1 ? 0 : t < c(2) + 1.0 ? -7 : t < c(2) + 1.9 ? 7 : 0;
	const drop = prog(f, c(2) + 1.9, 0.6);
	const cloud = pop(f, c(3) + 0.3, 14);
	const push = prog(f, c(3), 2.6, easeInOut);
	return (
		<div style={{position: 'absolute', inset: 0, background: '#172033', overflow: 'hidden'}}>
			<div style={{position: 'absolute', inset: 0, transform: `scale(${1 + 0.28 * push})`, transformOrigin: '60% 62%'}}>
				<Stage>
					<rect x={0} y={860} width={1920} height={220} fill="#111827" />
					<rect x={560} y={110} width={800} height={290} rx={18} fill="#1F3A3A" stroke="#475569" strokeWidth={14} />
					{S7_DESKS.map((dx, i) => {
						const isMateo = i === 2;
						const kid = S7_KIDS[i];
						const place = pop(f, placeAt[i], 14);
						return (
							<g key={i} opacity={isMateo ? 1 : 1 - 0.45 * push}>
								{isMateo ? (
									<Kid x={dx} y={928} scale={1.2} pose="bust" mood={sad > 0.3 ? 'sad' : t > c(1) + 1.3 ? 'surprised' : 'neutral'} headDrop={drop * 14 + open * 6} headTilt={drop * 4} lookX={look} seed={9} />
								) : (
									<Kid x={dx} y={928} scale={1.2} pose="bust" hair={kid!.hair} skin={kid!.skin} mood="smile" seed={i * 3.1} />
								)}
								<rect x={dx - 160} y={748} width={320} height={26} rx={8} fill="#475569" stroke={C.ink} strokeWidth={3} />
								<rect x={dx - 140} y={774} width={20} height={110} fill="#334155" />
								<rect x={dx + 120} y={774} width={20} height={110} fill="#334155" />
								{!isMateo && place > 0 && (
									<g transform={`translate(0 ${-(1 - Math.min(1, place)) * 70})`} opacity={Math.min(1, place)}>
										<Icon name="paint" x={dx - 55} y={734} scale={0.9} />
										<Icon name="brush" x={dx + 70} y={724} scale={0.8} />
									</g>
								)}
								{isMateo && (
									<g>
										{sheet > 0 && <rect x={dx + 6} y={690 - sheet * 50} width={110} height={70} rx={4} fill="#F8FAFC" stroke={C.ink} strokeWidth={3} transform={`rotate(14 ${dx + 60} 700)`} />}
										<rect x={dx - 62} y={642} width={124} height={108} rx={22} fill={C.pack} stroke={C.ink} strokeWidth={3} />
										<rect x={dx - 38} y={690} width={76} height={40} rx={8} fill={C.packYellow} stroke={C.ink} strokeWidth={3} />
										<path d={`M ${dx - 62} 668 Q ${dx} ${636 - open * 60} ${dx + 62} 668`} fill={C.pack} stroke={C.ink} strokeWidth={3} />
									</g>
								)}
							</g>
						);
					})}
					{cloud > 0 && (
						<g transform={`translate(1160 ${455 + bob(f, 6, 2.6)}) scale(${cloud})`} opacity={0.92}>
							<path d="M -80 20 Q -100 -20 -60 -30 Q -50 -70 -6 -60 Q 30 -86 60 -50 Q 104 -50 96 -6 Q 110 30 70 34 L -60 34 Q -90 34 -80 20 Z" fill="#64748B" stroke={C.ink} strokeWidth={3} />
							{[0, 1, 2].map((i) => {
								const yy = ((t * 80 + i * 22) % 60) + 40;
								return <line key={i} x1={-40 + i * 40} y1={yy} x2={-44 + i * 40} y2={yy + 14} stroke="#93C5FD" strokeWidth={4} strokeLinecap="round" opacity={0.7} />;
							})}
						</g>
					)}
				</Stage>
			</div>
			<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 60% 62%, transparent 20%, rgba(10,15,30,0.75) 70%)', opacity: push}} />
			<Caption text="Al día siguiente" at={0.35} until={c(3) - 0.2} y={258} size={68} />
			{placeAt.map((pa, i) => (i === 2 ? null : <Sfx key={i} name="pop" at={pa} volume={0.4} />))}
			<Sfx name="whoosh" at={c(1) + 0.6} volume={0.25} />
			<Sfx name="sad" at={e(1) + 0.1} volume={0.45} />
		</div>
	);
};

/* ───────────── S8 El bucle (wheel reused in S9) ───────────── */
const WHEEL: IconName[] = ['clock', 'lunch', 'bus', 'laptop', 'ball', 'notebook'];

export const Wheel: React.FC<{angle: number; saturation: number; opacity?: number; coupleOpacity?: number; scale?: number}> = ({
	angle,
	saturation,
	opacity = 1,
	coupleOpacity = 0,
	scale = 1,
}) => (
	<g opacity={opacity} transform={`translate(960 480) scale(${scale}) translate(-960 -480)`}>
		<defs>
			<filter id="desat">
				<feColorMatrix type="saturate" values={String(saturation)} />
			</filter>
		</defs>
		<g filter="url(#desat)">
			<circle cx={960} cy={480} r={300} fill="none" stroke="#334155" strokeWidth={6} strokeDasharray="4 22" strokeLinecap="round" transform={`rotate(${angle * 0.5} 960 480)`} />
			{coupleOpacity > 0 && (
				<g opacity={coupleOpacity}>
					<Carolina x={905} y={760} scale={0.62} pose="bust" mood="smile" />
					<Kid x={1030} y={672} scale={0.62} pose="bust" mood="smile" backpack={false} headTilt={-10} />
				</g>
			)}
			{WHEEL.map((name, i) => {
				const a = ((angle + i * 60) * Math.PI) / 180;
				const x = 960 + Math.cos(a) * 300;
				const y = 480 + Math.sin(a) * 300;
				return (
					<g key={name}>
						<circle cx={x} cy={y} r={74} fill={C.night2} stroke="#475569" strokeWidth={4} />
						<Icon name={name} x={x} y={y} scale={0.9} />
					</g>
				);
			})}
		</g>
	</g>
);

/** Rotation of the wheel at time t (s), frozen at `stop`. */
export const wheelAngle = (t: number, start: number, stop: number) => {
	const tt = Math.max(0, Math.min(t, stop) - start);
	return 18 * tt + 3.2 * tt * tt;
};

export const S8: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const {c, e, p} = useCues();
	const stop = e(1) + 0.35; // same instant the music cuts
	const start = c(0) - 0.2;
	const sat = interpolate(t, [c(1), stop], [1, 0.05], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const couple = interpolate(t, [c(1), c(1) + 1.5, stop - 1], [0, 0.5, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const stopped = t >= stop;
	const k = pop(f, start, 14);
	const light = prog(f, stop + 0.3, 1.5);
	return (
		<NightBg glow={stopped ? C.night : '#1D2A4A'}>
			<Stage>
				{!stopped && <Wheel angle={wheelAngle(t, start, stop)} saturation={sat} scale={k} opacity={interpolate(t, [c(1), stop], [1, 0.7], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} coupleOpacity={couple} />}
				{stopped && <circle cx={960} cy={500} r={300} fill="#F8FAFC" opacity={0.045 * light} />}
			</Stage>
			<Caption text="Y mañana, otra vez" at={c(0) + 0.3} until={stop - 0.05} y={960} size={66} />
			<Caption text="Le falta un sistema" at={p(2, 1) + 0.05} x={960} y={520} size={96} accent={C.teal} />
		</NightBg>
	);
};
