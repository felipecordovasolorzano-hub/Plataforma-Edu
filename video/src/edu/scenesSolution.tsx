import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Carolina, EduBot, Kid} from './characters';
import {Clock, Icon, IconName, PhoneShape} from './icons';
import {Checklist, Notebook, Table} from './scenesProblem';
import {C, Camera, Caption, CreamBg, FPS, NightBg, Sfx, Stage, bob, easeInOut, glide, lerp, pop, prog, s, useCues} from './theme';

/* ───────────── S9 Aparece EDU ───────────── */
const ORBIT: IconName[] = ['school', 'house', 'task', 'calendar', 'backpack', 'chat'];

export const S9: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const {c, e} = useCues();
	const reveal = c(0);
	const dot = prog(f, 0.6, reveal - 0.6, easeInOut);
	const bloom = prog(f, reveal - 0.05, 1.0, easeInOut);
	const bot = pop(f, reveal + 0.05, 11);
	const absorb = prog(f, c(1) + 0.3, e(1) - c(1), easeInOut);
	const fam = glide(f, c(2));
	const famWalk = fam > 0.02 && fam < 0.97;
	const botX = lerp(960, 960, fam);
	const botY = lerp(440, 380, fam);
	return (
		<NightBg glow="#10283A">
			<CreamCircle r={bloom * 2400} />
			<Stage>
				{bloom < 0.6 && dot > 0 && (
					<g opacity={1 - bloom * 1.6}>
						{[3, 2, 1].map((k) => (
							<circle key={k} cx={960} cy={440} r={lerp(4, 40, dot) * k * (1 + 0.08 * Math.sin(t * 6 + k))} fill={C.teal} opacity={0.1 * (4 - k)} />
						))}
						<circle cx={960} cy={440} r={lerp(3, 34, dot)} fill={C.teal} />
					</g>
				)}
				{bot > 0 &&
					ORBIT.map((ic, i) => {
						const a = (i / ORBIT.length) * Math.PI * 2 + t * 0.7;
						const R = lerp(520, 0, absorb) * Math.min(1, pop(f, c(1) + i * 0.12));
						const k = pop(f, c(1) + i * 0.12) * (1 - absorb * 0.8);
						if (k <= 0.01 || absorb >= 0.98) return null;
						return (
							<g key={ic} transform={`translate(${botX + Math.cos(a) * R} ${botY + Math.sin(a) * R * 0.55}) scale(${k})`} opacity={1 - absorb * 0.6}>
								<circle r={58} fill="#FFFFFF" stroke="#CBD5E1" strokeWidth={3} />
								<Icon name={ic} x={0} y={0} scale={0.7} />
							</g>
						);
					})}
				{bot > 0 && <EduBot x={botX} y={botY + bob(f, 12, 3.2)} scale={1.35 * bot * (1 + 0.06 * Math.sin(Math.PI * absorb))} glow={0.6 + 0.6 * absorb} happy={t > e(1)} armsOpen={t > c(2) ? 1 : 0} />}
				{fam > 0 && (
					<g>
						<Carolina x={lerp(-260, 520, fam)} y={1000} scale={0.95} walk={famWalk ? t * 9 : null} mood="smile" lookX={6} seed={10} />
						<Kid x={lerp(2200, 1420, fam)} y={1000} scale={1.25} walk={famWalk ? t * 10 : null} mood="smile" lookX={-6} wave={prog(f, c(2) + 1.2, 0.4) * (1 - prog(f, c(2) + 3.2, 0.4))} seed={11} />
					</g>
				)}
			</Stage>
			<Caption text="Hasta que aparece EDU" at={reveal + 0.55} until={c(2) - 0.1} y={790} size={78} color={C.night} />
			<Sfx name="impact" at={reveal} volume={0.35} />
			{ORBIT.map((_, i) => (
				<Sfx key={i} name="blip" at={c(1) + i * 0.12} volume={0.22} />
			))}
			<Sfx name="success" at={e(1) + 0.1} volume={0.35} />
			<Sfx name="whoosh" at={c(2)} volume={0.25} />
		</NightBg>
	);
};

/** Expanding cream disc used for the S9 reveal. */
const CreamCircle: React.FC<{r: number}> = ({r}) =>
	r <= 0 ? null : (
		<div
			style={{
				position: 'absolute',
				left: 960 - r,
				top: 440 - r,
				width: r * 2,
				height: r * 2,
				borderRadius: '50%',
				background: `radial-gradient(circle, #FFFFFF 0%, ${C.cream} 55%, #E6FFFA 100%)`,
			}}
		/>
	);

/* ───────────── S10 Todo en un lugar ───────────── */
const S10_CARDS: {icon: IconName; from: [number, number]; tilt: number}[] = [
	{icon: 'warning', from: [330, 230], tilt: -10},
	{icon: 'task', from: [1590, 220], tilt: 8},
	{icon: 'backpack', from: [300, 800], tilt: 7},
	{icon: 'calendar', from: [1620, 820], tilt: -8},
];
const BOT: [number, number] = [700, 470];
const PHONE: [number, number] = [1400, 500];
const SLOT_Y = [-210, -80, 50, 180];

const Card: React.FC<{icon: IconName; x: number; y: number; scale: number; rotate?: number; glow?: number}> = ({icon, x, y, scale, rotate = 0, glow = 0}) => (
	<g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
		<rect x={-124} y={-54} width={248} height={108} rx={22} fill="#0F172A" opacity={0.08} transform="translate(0 8)" />
		<rect x={-120} y={-50} width={240} height={100} rx={20} fill="#FFFFFF" stroke={glow > 0 ? C.teal : C.ink} strokeWidth={glow > 0 ? 5 : 3} />
		<circle cx={-72} cy={0} r={32} fill={C.tealSoft} />
		<Icon name={icon} x={-72} y={0} scale={0.45} />
		<rect x={-24} y={-16} width={110} height={12} rx={6} fill="#94A3B8" />
		<rect x={-24} y={6} width={76} height={10} rx={5} fill="#CBD5E1" />
	</g>
);

export const S10: React.FC = () => {
	const f = useCurrentFrame();
	const {c, p} = useCues();
	const gatherAt = p(0, 4);
	const phoneIn = glide(f, c(1) - 0.2);
	const center = prog(f, c(2) - 0.1, 0.9, easeInOut);
	const px = lerp(lerp(2300, PHONE[0], phoneIn), 960, center);
	const py = PHONE[1];
	const pk = lerp(1, 1.18, center);
	const bx = lerp(BOT[0], 420, center);
	const by = BOT[1];
	return (
		<CreamBg>
			<Camera from={1} to={1.04}>
				<Stage>
					{phoneIn > 0 && (
						<g transform={`translate(${px} ${py}) scale(${pk}) translate(${-PHONE[0]} ${-PHONE[1]})`}>
							{center > 0 && <circle cx={PHONE[0]} cy={PHONE[1]} r={420} fill={C.teal} opacity={0.1 * center} />}
							<PhoneShape x={PHONE[0]} y={PHONE[1]} w={330} h={660} stroke={C.night} fill={C.night} screen="#EEF2F7" />
							{S10_CARDS.map((card, j) => {
								const slot = prog(f, c(1) + 0.5 + j * 0.45, 0.6, easeInOut);
								return slot > 0 ? <Card key={j} icon={card.icon} x={lerp(BOT[0] - (px - PHONE[0]) / pk, PHONE[0], slot)} y={lerp(BOT[1], PHONE[1] + SLOT_Y[j], slot)} scale={lerp(0.4, 1, slot)} /> : null;
							})}
						</g>
					)}
					<EduBot x={bx} y={by + bob(f, 10, 3.2)} scale={1.15} armsOpen={1} happy={f > s(c(1) + 2.5)} glow={prog(f, gatherAt, 0.4) * (1 - prog(f, gatherAt + 1.2, 0.6))} />
					{S10_CARDS.map((card, j) => {
						const k = pop(f, p(0, j), 12);
						const fly = prog(f, gatherAt + j * 0.08, 0.7, easeInOut);
						if (k <= 0 || fly >= 1) return null;
						return <Card key={j} icon={card.icon} x={lerp(card.from[0], BOT[0], fly)} y={lerp(card.from[1] + bob(f, 6, 3, j), BOT[1], fly)} scale={k * (1 - fly * 0.7)} rotate={card.tilt * (1 - fly)} />;
					})}
					{center > 0.4 &&
						[0, 1, 2, 3, 4, 5].map((i) => {
							const a = (i / 6) * Math.PI * 2 + 0.4;
							const k = pop(f, c(2) + 0.6 + i * 0.07);
							return <Icon key={i} name="sparkle" x={960 + Math.cos(a) * 300} y={500 + Math.sin(a) * 420} scale={0.35 * k} rotate={f * 2} />;
						})}
				</Stage>
			</Camera>
			<Caption text="Todo en un solo lugar" at={c(1) + 2.8} until={c(2) - 0.1} y={985} size={70} color={C.night} />
			{S10_CARDS.map((_, j) => (
				<Sfx key={j} name="pop" at={p(0, j)} />
			))}
			<Sfx name="whoosh" at={gatherAt} volume={0.35} />
			<Sfx name="whoosh" at={c(1) - 0.2} volume={0.25} />
			{S10_CARDS.map((_, j) => (
				<Sfx key={`s${j}`} name="blip" at={c(1) + 1.0 + j * 0.45} volume={0.3} />
			))}
			<Sfx name="success" at={c(2) + 0.6} volume={0.35} />
		</CreamBg>
	);
};

/* ───────────── S15 La misma noche ───────────── */
export const S15: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const {c, p} = useCues();
	const place = prog(f, c(1) + 0.3, 1.0, easeInOut);
	const writing = t > c(1) + 3.6;
	return (
		<CreamBg warm>
			<Camera from={1} to={1.05}>
				<Stage>
					<circle cx={960} cy={560} r={640} fill="#FDE68A" opacity={0.3} />
					<line x1={960} y1={0} x2={960} y2={70} stroke="#94A3B8" strokeWidth={5} />
					<path d="M 880 130 Q 960 50 1040 130 Z" fill="#FCD34D" stroke={C.ink} strokeWidth={3} />
					<Kid x={560} y={914} scale={1.5} pose="bust" mood={writing ? 'smile' : 'neutral'} pencilAngle={writing ? Math.sin(t * 9) * 10 : 8} lookX={writing ? 0 : 6} seed={12} />
					<Carolina x={1340} y={1025} scale={1.35} pose="bust" mood="smile" lookX={-7} seed={13} />
					<Table top="#D8B48A" edge="#B88B5E" />
					<Notebook x={560} y={760} />
					<g transform={`translate(${lerp(1330, 900, place)} ${lerp(690, 770, place) - Math.sin(place * Math.PI) * 60}) rotate(${lerp(0, -70, place)})`}>
						<rect x={-30} y={-48} width={60} height={96} rx={12} fill={C.night} stroke={C.ink} strokeWidth={3} />
						<rect x={-22} y={-38} width={44} height={74} rx={6} fill={C.teal} opacity={0.8} />
					</g>
					{t > c(1) + 1.3 && <path d={`M 905 ${lerp(740, 540, prog(f, c(1) + 1.3, 0.5))} L 905 740`} stroke={C.teal} strokeWidth={4} strokeDasharray="10 10" />}
					<Checklist x={960} y={370} rows={3} checkTimes={[p(2, 0) + 0.15, p(2, 1) + 0.15, p(2, 2) + 0.15]} dark={false} width={460} at={c(1) + 1.3} />
					<Clock x={170} y={160} r={90} minutes={420 + Math.min(4, Math.max(0, t - 2) * 0.15)} />
				</Stage>
			</Camera>
			<Caption text="7:00 p. m." at={c(0) + 0.3} x={340} y={165} size={64} align="left" color={C.night} accent={null} />
			<Sfx name="swoosh_down" at={c(1) + 0.3} volume={0.25} />
			<Sfx name="pop" at={c(1) + 1.3} />
			{[0, 1, 2].map((j) => (
				<Sfx key={j} name="blip" at={p(2, j) + 0.15} volume={0.4} />
			))}
		</CreamBg>
	);
};

/* ───────────── S16 Tiempo recuperado ───────────── */
export const S16: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const {c, p} = useCues();
	const laugh = t > p(1, 1) ? Math.abs(Math.sin(t * 2.2)) * 6 : 0;
	const talk = pop(f, p(1, 0) + 0.1) * (1 - prog(f, p(1, 1), 0.4));
	const read = prog(f, p(1, 1), 0.5);
	const calm = prog(f, p(1, 2), 2.5, easeInOut);
	return (
		<CreamBg warm>
			<Camera from={1.16} to={1} oy={55}>
				<Stage>
					<circle cx={1640} cy={430} r={lerp(300, 420, calm)} fill="#FDE68A" opacity={0.45 + 0.15 * calm} />
					<Clock x={960} y={170} r={64} minutes={1170 + interpolate(t, [0, 20], [0, 3])} />
					<rect x={1630} y={360} width={14} height={540} fill="#94A3B8" />
					<path d="M 1560 360 L 1720 360 L 1680 270 L 1600 270 Z" fill="#FCD34D" stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
					<rect x={1590} y={890} width={94} height={14} rx={7} fill="#94A3B8" />
					<Icon name="backpack" x={260} y={850} scale={1.1} />
					<rect x={330} y={830} width={90} height={74} rx={14} fill={C.bag} stroke={C.ink} strokeWidth={3} />
					<path d="M 345 830 Q 375 780 405 830" fill="none" stroke={C.ink} strokeWidth={5} />
					<rect x={500} y={430} width={920} height={360} rx={60} fill="#93C5FD" stroke={C.ink} strokeWidth={3} />
					<Carolina x={840} y={1000 - laugh} scale={1.25} pose="bust" mood={t > p(1, 1) ? 'laugh' : 'smile'} hug bag={false} lookX={5} seed={14} />
					<Kid x={1110} y={945} scale={1.38} pose="bust" mood={t > p(1, 1) ? 'laugh' : 'smile'} headTilt={-14} backpack={false} seed={15} />
					<Icon name="book" x={1110} y={770} scale={1.45} />
					{read > 0 &&
						[0, 1, 2].map((i) => (
							<Icon key={i} name="sparkle" x={1060 + i * 50} y={700 - read * 40 - i * 20} scale={0.22 * pop(f, p(1, 1) + i * 0.15)} rotate={f * 3} />
						))}
					{talk > 0 && (
						<g>
							<g transform={`translate(700 330) scale(${talk * 0.9})`}>
								<Icon name="talk" x={0} y={0} />
							</g>
							<g transform={`translate(1240 400) scale(${pop(f, p(1, 0) + 0.45) * 0.75 * (1 - prog(f, p(1, 1), 0.4))})`}>
								<Icon name="heart" x={0} y={0} />
							</g>
						</g>
					)}
					{t > c(2) &&
						[0, 1, 2].map((i) => {
							const k = prog(f, c(2) + i * 0.8, 3.5);
							return k > 0 && k < 1 ? <Icon key={i} name="heart" x={900 + i * 110} y={560 - k * 360} scale={0.35} opacity={Math.sin(k * Math.PI)} /> : null;
						})}
					<rect x={470} y={790} width={980} height={120} rx={30} fill="#BFDBFE" stroke={C.ink} strokeWidth={3} />
					<rect x={430} y={560} width={110} height={350} rx={50} fill="#93C5FD" stroke={C.ink} strokeWidth={3} />
					<rect x={1380} y={560} width={110} height={350} rx={50} fill="#93C5FD" stroke={C.ink} strokeWidth={3} />
				</Stage>
			</Camera>
			<Caption text="Tiempo para ellos" at={c(0) + 0.5} y={1000} size={72} color={C.night} />
			<Sfx name="bubble" at={p(1, 0) + 0.1} volume={0.35} />
			<Sfx name="blip" at={p(1, 1)} volume={0.3} />
		</CreamBg>
	);
};

/* ───────────── S17 Frase final ───────────── */
export const S17: React.FC = () => {
	const f = useCurrentFrame();
	const {c, seconds} = useCues();
	const bot = pop(f, 0.25, 12);
	const out = prog(f, seconds - 2.2, 2.0, easeInOut);
	return (
		<CreamBg>
			<Stage>
				<EduBot x={960} y={370 + bob(f, 12, 3.2)} scale={1.3 * bot} happy={f > s(c(1))} glow={prog(f, c(0), 0.6)} armsOpen={f > s(c(1)) ? 1 : 0} />
			</Stage>
			<Caption text="EDU" at={c(0)} y={690} size={170} color={C.night} />
			<Caption text={'Menos tiempo buscando.\nMás tiempo compartiendo.'} at={c(1)} y={850} size={54} weight={700} color={C.night} accent={null} />
			<div style={{position: 'absolute', inset: 0, background: C.cream, opacity: out}} />
			<Sfx name="pop" at={0.25} />
		</CreamBg>
	);
};

