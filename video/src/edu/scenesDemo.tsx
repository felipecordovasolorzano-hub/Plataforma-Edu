import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {Carolina, Kid} from './characters';
import {Icon} from './icons';
import {C, Caption, CreamBg, FPS, Sfx, Stage, easeInOut, glide, lerp, pop, prog, useCues} from './theme';

const shot = (name: string) => staticFile(`capturas/${name}.png`);
const IMG_W = 1080;
const IMG_H = 1920;

/**
 * Phone frame showing real prototype captures. Children are positioned in
 * screenshot pixels (1080×1920); `zoom` pushes in around (fx, fy).
 */
const Phone: React.FC<{
	x: number;
	y: number;
	screenH: number;
	zoom?: number;
	fx?: number;
	fy?: number;
	children: React.ReactNode;
}> = ({x, y, screenH, zoom = 1, fx = 540, fy = 960, children}) => {
	const screenW = (screenH * 9) / 16;
	const bezel = screenH * 0.024;
	const base = screenW / IMG_W;
	return (
		<div
			style={{
				position: 'absolute',
				left: x - screenW / 2 - bezel,
				top: y - screenH / 2 - bezel,
				width: screenW + bezel * 2,
				height: screenH + bezel * 2,
				background: C.night,
				borderRadius: bezel * 3.2,
				boxShadow: '0 40px 80px rgba(15, 23, 42, 0.22), 0 0 0 2px rgba(255,255,255,0.06) inset',
			}}
		>
			<div style={{position: 'absolute', left: bezel, top: bezel, width: screenW, height: screenH, overflow: 'hidden', borderRadius: bezel * 2.2, background: '#FFFFFF'}}>
				<div
					style={{
						position: 'absolute',
						left: 0,
						top: 0,
						width: IMG_W,
						height: IMG_H,
						transformOrigin: '0 0',
						transform: `scale(${base}) translate(${fx}px, ${fy}px) scale(${zoom}) translate(${-fx}px, ${-fy}px)`,
					}}
				>
					{children}
				</div>
			</div>
		</div>
	);
};

const Screen: React.FC<{name: string; opacity?: number; dx?: number; dy?: number}> = ({name, opacity = 1, dx = 0, dy = 0}) =>
	opacity <= 0 ? null : <Img src={shot(name)} style={{position: 'absolute', left: dx, top: dy, width: IMG_W, height: IMG_H, opacity}} />;

/** Turquoise ring around a region (screenshot px) that draws in and pulses twice. */
const Ring: React.FC<{x: number; y: number; w: number; h: number; at: number; until?: number}> = ({x, y, w, h, at, until}) => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const k = pop(f, at, 13);
	const out = until === undefined ? 0 : prog(f, until, 0.35);
	if (k <= 0 || out >= 1) return null;
	const pt = t - at - 0.3;
	const pulse = pt > 0 && pt < 2 ? Math.sin((pt % 1) * Math.PI) : 0;
	const pad = 16;
	return (
		<div
			style={{
				position: 'absolute',
				left: x - pad,
				top: y - pad,
				width: w + pad * 2,
				height: h + pad * 2,
				border: `12px solid ${C.teal}`,
				borderRadius: 48,
				opacity: Math.min(1, k) * (1 - out),
				transform: `scale(${(0.9 + 0.1 * k) * (1 + pulse * 0.035)})`,
				boxShadow: `0 0 0 ${pulse * 30}px rgba(20, 184, 166, ${0.25 * pulse})`,
			}}
		/>
	);
};

/** Highlighter stroke that draws left → right over a region. */
const Highlight: React.FC<{x: number; y: number; w: number; h: number; at: number; until?: number}> = ({x, y, w, h, at, until}) => {
	const f = useCurrentFrame();
	const p = prog(f, at, 0.7, easeInOut);
	const out = until === undefined ? 0 : prog(f, until, 0.4);
	if (p <= 0 || out >= 1) return null;
	return <div style={{position: 'absolute', left: x, top: y, width: w * p, height: h, background: C.teal, opacity: 0.3 * (1 - out), borderRadius: 16, mixBlendMode: 'multiply'}} />;
};

/** Circular cursor that glides to a point and taps (ripple) at `tap`. */
const Cursor: React.FC<{from: [number, number]; to: [number, number]; appear: number; tap: number; hide: number}> = ({from, to, appear, tap, hide}) => {
	const f = useCurrentFrame();
	const vis = prog(f, appear, 0.3) * (1 - prog(f, hide, 0.3));
	if (vis <= 0) return null;
	const move = prog(f, appear, Math.max(0.3, tap - appear - 0.25), easeInOut);
	const x = lerp(from[0], to[0], move);
	const y = lerp(from[1], to[1], move);
	const ripple = prog(f, tap, 0.7);
	const press = prog(f, tap - 0.08, 0.08) * (1 - prog(f, tap + 0.08, 0.15));
	return (
		<>
			{ripple > 0 && ripple < 1 && (
				<div
					style={{
						position: 'absolute',
						left: x - 40 - ripple * 80,
						top: y - 40 - ripple * 80,
						width: 80 + ripple * 160,
						height: 80 + ripple * 160,
						borderRadius: '50%',
						border: `9px solid ${C.teal}`,
						opacity: 1 - ripple,
					}}
				/>
			)}
			<div
				style={{
					position: 'absolute',
					left: x - 42,
					top: y - 42,
					width: 84,
					height: 84,
					borderRadius: '50%',
					background: 'rgba(255,255,255,0.88)',
					border: `8px solid ${C.night}`,
					opacity: vis,
					transform: `scale(${1 - press * 0.2})`,
					boxShadow: '0 10px 24px rgba(15,23,42,0.28)',
				}}
			/>
		</>
	);
};

const SideText: React.FC<{text: string; at: number; until?: number}> = ({text, at, until}) => (
	<Caption text={text} at={at} until={until} x={1120} y={500} size={86} color={C.night} align="left" width={700} />
);

/** Small numbered step chip above the side text: 1 → 4 through the demo. */
const Step: React.FC<{n: number; at: number; x?: number; y?: number}> = ({n, at, x = 1120, y = 330}) => {
	const f = useCurrentFrame();
	const k = pop(f, at, 14);
	if (k <= 0) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				height: 64,
				padding: '0 26px',
				borderRadius: 99,
				background: C.tealSoft,
				color: '#0F766E',
				fontFamily: 'Inter, sans-serif',
				fontWeight: 800,
				fontSize: 34,
				display: 'flex',
				alignItems: 'center',
				gap: 12,
				transform: `scale(${k})`,
				transformOrigin: 'left center',
			}}
		>
			<span style={{width: 40, height: 40, borderRadius: 99, background: C.teal, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24}}>{n}</span>
			<span>de 4</span>
		</div>
	);
};

const PX = 700;
const PY = 540;
const PH = 880;

/* ───────────── S11 Aviso de cambio ───────────── */
export const S11: React.FC = () => {
	const f = useCurrentFrame();
	const {c, e} = useCues();
	const enter = glide(f, 0.15);
	const zoomIn = prog(f, c(1) + 1.0, 1.4, easeInOut);
	const tap = e(1) + 0.25;
	const zoomOut = prog(f, tap + 0.4, 0.7, easeInOut);
	const zoom = 1 + 0.25 * zoomIn * (1 - zoomOut);
	return (
		<CreamBg>
			<div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - enter) * 1200}px) rotate(${(1 - enter) * 6}deg)`}}>
				<Phone x={PX} y={PY} screenH={PH} zoom={zoom} fx={540} fy={960}>
					<Screen name="captura-01-inicio-aviso" />
					<Ring x={45} y={765} w={990} h={390} at={c(1) + 3.0} until={tap + 0.2} />
					<Cursor from={[920, 1500]} to={[860, 860]} appear={tap - 1.4} tap={tap} hide={tap + 0.8} />
				</Phone>
			</div>
			<Step n={1} at={c(1) + 0.9} />
			<SideText text="Un aviso a tiempo" at={c(1) + 1.1} />
			<Sfx name="whoosh" at={0.15} volume={0.35} />
			<Sfx name="ping" at={c(1) + 3.0} volume={0.35} />
			<Sfx name="tap" at={tap} />
		</CreamBg>
	);
};

/* ───────────── S12 La tarea ───────────── */
export const S12: React.FC = () => {
	const f = useCurrentFrame();
	const {c, e, p} = useCues();
	const slide = prog(f, 0.05, 0.6, easeInOut);
	const zoom = 1 + 0.2 * prog(f, c(2), 1.2, easeInOut) * (1 - prog(f, e(2) + 0.8, 0.7, easeInOut));
	return (
		<CreamBg>
			<Phone x={PX} y={PY} screenH={PH} zoom={zoom} fx={540} fy={1686}>
				<Screen name="captura-01-inicio-aviso" dx={-IMG_W * slide} />
				<Screen name="captura-02-detalle-cambio" dx={IMG_W * (1 - slide)} />
				<Highlight x={100} y={292} w={880} h={56} at={p(1, 0) + 0.3} />
				<Highlight x={100} y={350} w={880} h={100} at={p(1, 1) + 0.4} />
				<Highlight x={100} y={1616} w={880} h={140} at={c(2) + 0.7} />
				<Ring x={95} y={1612} w={890} h={148} at={c(2) + 1.4} />
			</Phone>
			<Step n={2} at={c(0) + 0.3} />
			<SideText text="Qué cambió y qué falta" at={c(0) + 0.5} />
			<Sfx name="swoosh_down" at={0.05} volume={0.3} />
			<Sfx name="blip" at={p(1, 0) + 0.3} volume={0.35} />
			<Sfx name="blip" at={p(1, 1) + 0.4} volume={0.35} />
			<Sfx name="ping" at={c(2) + 1.4} volume={0.3} />
		</CreamBg>
	);
};

/* ───────────── S13 Organizar el horario ───────────── */
export const S13: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const {c, p} = useCues();
	const sheet = prog(f, 0.05, 0.6, easeInOut);
	const aiTap = c(1) + 0.6;
	const toAi = prog(f, aiTap + 1.0, 0.5);
	const toConfirm = prog(f, c(2) - 0.3, 0.4);
	const saveTap = c(2) + 1.5;
	const toSaved = prog(f, saveTap + 0.35, 0.5);
	const check = pop(f, saveTap + 0.45, 10);
	return (
		<CreamBg>
			<Phone x={PX} y={PY} screenH={PH}>
				<Screen name="captura-02-detalle-cambio" />
				<Screen name="captura-03-organizar" dy={IMG_H * (1 - sheet)} />
				<Screen name="captura-04-sugerencia-ia" opacity={toAi} />
				<Screen name="captura-04b-confirmar" opacity={toConfirm} />
				<Screen name="captura-06-programado" opacity={toSaved} />
				{t > aiTap && t < aiTap + 1.6 &&
					[0, 1, 2, 3, 4, 5].map((i) => {
						const a = (i / 6) * Math.PI * 2;
						const k = prog(f, aiTap, 1.2);
						return (
							<div
								key={i}
								style={{
									position: 'absolute',
									left: 540 + Math.cos(a) * (120 + k * 320) - 30,
									top: 941 + Math.sin(a) * (60 + k * 140) - 30,
									width: 60,
									height: 60,
									opacity: 1 - k,
									transform: `rotate(${k * 180}deg)`,
								}}
							>
								<svg viewBox="-60 -60 120 120" width={60} height={60}>
									<Icon name="sparkle" x={0} y={0} />
								</svg>
							</div>
						);
					})}
				<Ring x={4} y={1698} w={1028} h={176} at={p(1, 1)} until={c(2) - 0.4} />
				<Cursor from={[900, 1500]} to={[540, 941]} appear={aiTap - 1.0} tap={aiTap} hide={aiTap + 0.6} />
				<Cursor from={[880, 1450]} to={[789, 1811]} appear={saveTap - 1.0} tap={saveTap} hide={saveTap + 0.6} />
			</Phone>
			{check > 0 && (
				<Stage>
					<g transform={`translate(${PX + 290} ${PY - 410}) scale(${check})`}>
						<circle r={60} fill={C.teal} stroke="#FFFFFF" strokeWidth={8} />
						<path d="M -24 2 L -6 20 L 26 -16" fill="none" stroke="#FFFFFF" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
					</g>
				</Stage>
			)}
			<Step n={3} at={c(0) + 0.3} />
			<SideText text="Sugiere el mejor momento" at={c(0) + 0.5} />
			<Sfx name="swoosh_down" at={0.05} volume={0.3} />
			<Sfx name="tap" at={aiTap} />
			<Sfx name="success" at={aiTap + 0.1} volume={0.25} />
			<Sfx name="ping" at={p(1, 1)} volume={0.3} />
			<Sfx name="tap" at={saveTap} />
			<Sfx name="success" at={saveTap + 0.45} volume={0.4} />
		</CreamBg>
	);
};

/* ───────────── S14 WhatsApp ───────────── */
export const S14: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const {c} = useCues();
	const shift = prog(f, 0.1, 1.0, easeInOut);
	const bIn = glide(f, c(0) + 2.0);
	const buzzAt = c(0) + 3.0;
	const out = prog(f, c(2) - 0.15, 0.7, easeInOut);
	const hA = lerp(PH, 740, shift);
	const aX = lerp(PX, 560, shift);
	const aY = lerp(PY, 460, shift);
	const bX = lerp(2400, 1360, bIn);
	const buzz = (t > buzzAt && t < buzzAt + 0.3) || (t > buzzAt + 0.45 && t < buzzAt + 0.75) ? Math.sin(t * 120) * 10 : 0;
	const lineStart = 560 + (740 * 9) / 32 + 30;
	const lineEnd = 1360 - (740 * 9) / 32 - 30;
	const draw = prog(f, c(0) + 1.4, 1.0, easeInOut);
	const dotP = t > c(0) + 2.0 ? ((t - c(0) - 2.0) / 1.6) % 1 : -1;
	const fam = glide(f, c(2) + 0.2);
	const famWalk = fam > 0.02 && fam < 0.97;
	return (
		<CreamBg>
			<div style={{position: 'absolute', inset: 0, transform: `translateY(${out * 1200}px)`, opacity: 1 - out * 0.3}}>
				<Phone x={aX} y={aY} screenH={hA}>
					<Screen name="captura-06-programado" />
				</Phone>
				<div style={{position: 'absolute', inset: 0, transform: `translateX(${buzz}px)`}}>
					<Phone x={bX} y={460} screenH={740}>
						<Screen name="captura-05-whatsapp" />
						<Ring x={48} y={555} w={907} h={823} at={c(1) + 0.3} />
					</Phone>
				</div>
				<Step n={4} at={c(0) + 2.4} x={70} y={40} />
				<Stage>
					{draw > 0 && (
						<g>
							<line x1={lineStart} y1={460} x2={lerp(lineStart, lineEnd, draw)} y2={460} stroke={C.teal} strokeWidth={8} strokeLinecap="round" strokeDasharray="2 18" />
							{dotP >= 0 && <circle cx={lerp(lineStart, lineEnd, dotP)} cy={460} r={16} fill={C.teal} stroke="#FFFFFF" strokeWidth={5} />}
						</g>
					)}
				</Stage>
			</div>
			{fam > 0 && (
				<Stage>
					<ellipse cx={lerp(-300, 820, fam)} cy={900} rx={120} ry={16} fill="#0F172A" opacity={0.08} />
					<Carolina x={lerp(-300, 820, fam)} y={895} scale={1.05} walk={famWalk ? t * 9 : null} mood="smile" lookX={5} seed={16} />
					<Kid x={lerp(-120, 1080, fam)} y={895} scale={1.5} walk={famWalk ? t * 10 : null} mood="smile" lookX={-4} wave={prog(f, c(2) + 2.0, 0.4)} seed={17} />
				</Stage>
			)}
			<Caption text="Y le recuerda" at={c(0) + 2.6} until={c(2) - 0.3} x={960} y={990} size={70} color={C.night} />
			<Caption text="Llegan preparados" at={c(2) + 1.0} x={960} y={1000} size={70} color={C.night} />
			<Sfx name="whoosh" at={c(0) + 2.0} volume={0.3} />
			<Sfx name="buzz" at={buzzAt} volume={0.5} />
			<Sfx name="ping" at={buzzAt + 0.1} volume={0.4} />
			<Sfx name="whoosh" at={c(2) - 0.15} volume={0.3} />
		</CreamBg>
	);
};
