import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cursor3D, Highlight3D, Phone3D, Ring3D} from '../edu3d/Phone3D';
import {Stage3D, useCaptures} from '../edu3d/Stage3D';
import {Carolina, Kid} from './characters';
import {C, Caption, CreamBg, FPS, Sfx, Stage, easeInOut, glide, lerp, pop, prog, useCues} from './theme';

const SideText: React.FC<{text: string; at: number; until?: number}> = ({text, at, until}) => (
	<Caption text={text} at={at} until={until} x={1120} y={500} size={86} color={C.night} align="left" width={700} />
);

/** Small numbered step chip: 1 → 4 through the demo. */
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

/** Idle pose shared by the demo scenes, driven by video time so it stays continuous across cuts. */
const idle = (T: number): [number, number, number] => [0.035 * Math.sin(T * 0.5), 0.17 + 0.05 * Math.sin(T * 0.6), 0.01 * Math.sin(T * 0.4)];
const glareAt = (T: number) => ((T % 7) - 1) / 1.6;
/** Small forward nod of the phone when it is tapped. */
const tapKick = (t: number, tap: number) => (t > tap && t < tap + 0.5 ? Math.sin(((t - tap) / 0.5) * Math.PI) * 0.05 : 0);

/* ───────────── S11 Aviso de cambio ───────────── */
export const S11: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const {c, e, start} = useCues();
	const tex = useCaptures(['captura-01-inicio-aviso']);
	const T = start + t;
	const enter = glide(f, 0.15);
	const tap = e(1) + 0.25;
	const zoom = 1 + 0.25 * prog(f, c(1) + 1.0, 1.4, easeInOut) * (1 - prog(f, tap + 0.4, 0.7, easeInOut));
	const [rx, ry, rz] = idle(T);
	return (
		<CreamBg>
			{tex && (
				<Stage3D>
					<Phone3D
						x={PX}
						y={lerp(1700, PY, enter)}
						screenH={PH}
						rot={[rx + (1 - enter) * 0.6 + tapKick(t, tap), ry - (1 - enter) * 1.3, rz + (1 - enter) * 0.25]}
						zoom={zoom}
						fx={540}
						fy={960}
						layers={[{tex: tex['captura-01-inicio-aviso'], opacity: 1}]}
						glare={glareAt(T)}
					>
						<Ring3D x={45} y={765} w={990} h={390} at={c(1) + 3.0} until={tap + 0.2} />
						<Cursor3D from={[920, 1500]} to={[860, 860]} appear={tap - 1.4} tap={tap} hide={tap + 0.8} />
					</Phone3D>
				</Stage3D>
			)}
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
	const t = f / FPS;
	const {c, e, p, start} = useCues();
	const tex = useCaptures(['captura-01-inicio-aviso', 'captura-02-detalle-cambio']);
	const T = start + t;
	const swap = prog(f, 0.05, 0.6, easeInOut);
	const zoom = 1 + 0.2 * prog(f, c(2), 1.2, easeInOut) * (1 - prog(f, e(2) + 0.8, 0.7, easeInOut));
	const [rx, ry, rz] = idle(T);
	return (
		<CreamBg>
			{tex && (
				<Stage3D>
					<Phone3D
						x={PX}
						y={PY}
						screenH={PH}
						rot={[rx, ry + Math.sin(swap * Math.PI) * 0.18, rz]}
						zoom={zoom}
						fx={540}
						fy={1686}
						layers={[
							{tex: tex['captura-01-inicio-aviso'], opacity: 1 - swap},
							{tex: tex['captura-02-detalle-cambio'], opacity: swap},
						]}
						glare={glareAt(T)}
					>
						<Highlight3D x={100} y={292} w={880} h={56} at={p(1, 0) + 0.3} />
						<Highlight3D x={100} y={350} w={880} h={100} at={p(1, 1) + 0.4} />
						<Highlight3D x={100} y={1616} w={880} h={140} at={c(2) + 0.7} />
						<Ring3D x={95} y={1612} w={890} h={148} at={c(2) + 1.4} />
					</Phone3D>
				</Stage3D>
			)}
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
const SPARKS = [0, 1, 2, 3, 4, 5, 6, 7];

export const S13: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const {c, p, start} = useCues();
	const tex = useCaptures(['captura-02-detalle-cambio', 'captura-03-organizar', 'captura-04-sugerencia-ia', 'captura-04b-confirmar', 'captura-06-programado']);
	const T = start + t;
	const sheet = prog(f, 0.05, 0.6, easeInOut);
	const aiTap = c(1) + 0.6;
	const toAi = prog(f, aiTap + 1.0, 0.5);
	const toConfirm = prog(f, c(2) - 0.3, 0.4);
	const saveTap = c(2) + 1.5;
	const toSaved = prog(f, saveTap + 0.35, 0.5);
	const check = pop(f, saveTap + 0.45, 10);
	const spark = prog(f, aiTap, 1.2);
	const [rx, ry, rz] = idle(T);
	return (
		<CreamBg>
			{tex && (
				<Stage3D>
					<Phone3D
						x={PX}
						y={PY}
						screenH={PH}
						rot={[rx + tapKick(t, aiTap) + tapKick(t, saveTap), ry, rz]}
						layers={[
							{tex: tex['captura-02-detalle-cambio'], opacity: 1},
							{tex: tex['captura-03-organizar'], opacity: sheet},
							{tex: tex['captura-04-sugerencia-ia'], opacity: toAi},
							{tex: tex['captura-04b-confirmar'], opacity: toConfirm},
							{tex: tex['captura-06-programado'], opacity: toSaved},
						]}
						glare={glareAt(T)}
					>
						{spark > 0 &&
							spark < 1 &&
							SPARKS.map((i) => {
								const a = (i / SPARKS.length) * Math.PI * 2;
								return (
									<mesh key={i} position={[540 + Math.cos(a) * (140 + spark * 330), 941 + Math.sin(a) * (70 + spark * 160), 2]} rotation={[0, 0, spark * 3]}>
										<circleGeometry args={[16 * (1 - spark * 0.6), 4]} />
										<meshBasicMaterial color={C.teal} transparent opacity={1 - spark} toneMapped={false} side={2} />
									</mesh>
								);
							})}
						<Ring3D x={4} y={1698} w={1028} h={176} at={p(1, 1)} until={c(2) - 0.4} />
						<Cursor3D from={[900, 1500]} to={[540, 941]} appear={aiTap - 1.0} tap={aiTap} hide={aiTap + 0.6} />
						<Cursor3D from={[880, 1450]} to={[789, 1811]} appear={saveTap - 1.0} tap={saveTap} hide={saveTap + 0.6} />
					</Phone3D>
				</Stage3D>
			)}
			{check > 0 && (
				<Stage>
					<g transform={`translate(${PX + 300} ${PY - 420}) scale(${check})`}>
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
	const {c, start} = useCues();
	const tex = useCaptures(['captura-06-programado', 'captura-05-whatsapp']);
	const T = start + t;
	const shift = prog(f, 0.1, 1.0, easeInOut);
	const bIn = glide(f, c(0) + 2.0);
	const buzzAt = c(0) + 3.0;
	const out = prog(f, c(2) - 0.15, 0.8, easeInOut);
	const hA = lerp(PH, 740, shift);
	const aX = lerp(PX, 560, shift);
	const aY = lerp(PY, 460, shift);
	const bX = lerp(2500, 1360, bIn);
	const buzzing = (t > buzzAt && t < buzzAt + 0.3) || (t > buzzAt + 0.45 && t < buzzAt + 0.75);
	const buzz = buzzing ? Math.sin(t * 120) * 0.05 : 0;
	const lineStart = 560 + (740 * 9) / 32 + 40;
	const lineEnd = 1360 - (740 * 9) / 32 - 40;
	const draw = prog(f, c(0) + 1.4, 1.0, easeInOut);
	const dotP = t > c(0) + 2.0 ? ((t - c(0) - 2.0) / 1.6) % 1 : -1;
	const fam = glide(f, c(2) + 0.2);
	const famWalk = fam > 0.02 && fam < 0.97;
	const [rx, ry, rz] = idle(T);
	const drop = out * 1300;
	return (
		<CreamBg>
			{tex && (
				<Stage3D>
					<Phone3D
						x={aX}
						y={aY + drop}
						screenH={hA}
						rot={[rx - out * 0.5, lerp(ry, 0.3, shift), rz]}
						layers={[{tex: tex['captura-06-programado'], opacity: 1}]}
						glare={glareAt(T)}
					/>
					<Phone3D
						x={bX}
						y={460 + drop}
						screenH={740}
						rot={[rx - out * 0.5, -0.3 - (1 - bIn) * 1.1, buzz]}
						layers={[{tex: tex['captura-05-whatsapp'], opacity: 1}]}
						glare={glareAt(T + 3)}
					>
						<Ring3D x={48} y={555} w={907} h={823} at={c(1) + 0.3} />
					</Phone3D>
				</Stage3D>
			)}
			<div style={{position: 'absolute', inset: 0, transform: `translateY(${drop}px)`}}>
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
