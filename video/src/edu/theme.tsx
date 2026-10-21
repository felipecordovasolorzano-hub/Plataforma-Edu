import React, {createContext, useContext} from 'react';
import {Audio, Easing, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import type {SceneTiming} from './timeline';

export const FPS = 30;
export const W = 1920;
export const H = 1080;

export const C = {
	night: '#0F172A',
	night2: '#1E293B',
	night3: '#16213B',
	cream: '#F8FAFC',
	warm: '#FFF7E8',
	amber: '#F59E0B',
	red: '#EF4444',
	blue: '#2563EB',
	teal: '#14B8A6',
	tealSoft: '#CCFBF1',
	white: '#F8FAFC',
	ink: '#1E293B',
	skin: '#E2B48F',
	skinKid: '#D9A57E',
	hairCaro: '#3B2416',
	blouse: '#FBF1DF',
	pants: '#1E3A5F',
	bag: '#C08A5B',
	uniform: '#2F5FD0',
	uniformDark: '#1E3A8A',
	pack: '#1D4ED8',
	packYellow: '#FACC15',
	gray: '#94A3B8',
};

export const FONT = 'Inter, sans-serif';

/** Seconds to frames. */
export const s = (sec: number) => Math.round(sec * FPS);

export const easeOut = Easing.out(Easing.cubic);
export const easeInOut = Easing.inOut(Easing.cubic);

/** 0 → 1 progress starting at `start` seconds and lasting `dur` seconds. */
export const prog = (frame: number, start: number, dur = 0.6, easing = easeOut) =>
	interpolate(frame, [s(start), s(start) + Math.max(1, s(dur))], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing,
	});

/** Springy 0 → 1 (with a little overshoot) starting at `start` seconds. */
export const pop = (frame: number, start: number, damping = 12) =>
	frame < s(start) ? 0 : spring({frame: frame - s(start), fps: FPS, config: {damping, mass: 0.7, stiffness: 140}});

/** Soft spring without overshoot. */
export const glide = (frame: number, start: number) =>
	frame < s(start) ? 0 : spring({frame: frame - s(start), fps: FPS, config: {damping: 200, mass: 1, stiffness: 60}});

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Smooth idle float. */
export const bob = (frame: number, amp = 10, periodSec = 3, phase = 0) =>
	Math.sin((frame / (periodSec * FPS)) * Math.PI * 2 + phase) * amp;

/* ───────────── narration timing ───────────── */
const SceneCtx = createContext<SceneTiming | null>(null);
export const SceneTimingProvider = SceneCtx.Provider;

/** Cue helpers for the current scene: c(i) sentence start, e(i) sentence end, p(i, j) fragment start. */
export const useCues = () => {
	const sc = useContext(SceneCtx);
	const cues = sc?.cues ?? [];
	return {
		c: (i: number) => cues[i]?.start ?? 999,
		e: (i: number) => cues[i]?.end ?? 999,
		p: (i: number, j: number) => cues[i]?.parts[j]?.start ?? cues[i]?.start ?? 999,
		pe: (i: number, j: number) => cues[i]?.parts[j]?.end ?? cues[i]?.end ?? 999,
		seconds: sc?.seconds ?? 10,
	};
};

/* ───────────── sound effects ───────────── */
export type SfxName =
	| 'blip'
	| 'bubble'
	| 'buzz'
	| 'impact'
	| 'paper'
	| 'ping'
	| 'pop'
	| 'sad'
	| 'success'
	| 'swoosh_down'
	| 'tap'
	| 'whoosh';

export const Sfx: React.FC<{name: SfxName; at: number; volume?: number}> = ({name, at, volume = 0.55}) =>
	at > 900 ? null : (
		<Sequence from={Math.max(0, s(at))} durationInFrames={s(2)} layout="none">
			<Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={volume} />
		</Sequence>
	);

/* ───────────── layout primitives ───────────── */
export const Bg: React.FC<{color: string; children?: React.ReactNode}> = ({color, children}) => (
	<div style={{position: 'absolute', inset: 0, background: color, overflow: 'hidden'}}>{children}</div>
);

/** Full-frame SVG canvas in 1920×1080 units. */
export const Stage: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
	<svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible', ...style}}>
		{children}
	</svg>
);

/** Night background: radial depth, vignette and slow drifting dust. */
export const NightBg: React.FC<{glow?: string; glowX?: number; glowY?: number; children?: React.ReactNode}> = ({
	glow = '#1D2A4A',
	glowX = 50,
	glowY = 42,
	children,
}) => {
	const f = useCurrentFrame();
	return (
		<div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: `radial-gradient(ellipse at ${glowX}% ${glowY}%, ${glow} 0%, ${C.night} 62%, #0A0F1E 100%)`}}>
			<svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position: 'absolute', inset: 0}}>
				{Array.from({length: 34}).map((_, i) => {
					const x = random(`dx${i}`) * W;
					const speed = 6 + random(`ds${i}`) * 14;
					const y = (((random(`dy${i}`) * H - (f / FPS) * speed) % H) + H) % H;
					const r = 1.2 + random(`dr${i}`) * 2.2;
					const tw = 0.25 + 0.25 * Math.sin(f / 25 + i);
					return <circle key={i} cx={x + Math.sin(f / 60 + i) * 8} cy={y} r={r} fill="#CBD5E1" opacity={tw * 0.6} />;
				})}
			</svg>
			{children}
		</div>
	);
};

/** Light background: cream with soft drifting colour blobs. */
export const CreamBg: React.FC<{warm?: boolean; children?: React.ReactNode}> = ({warm, children}) => {
	const f = useCurrentFrame();
	const blobs = warm
		? [
				{c: '#FDE68A', x: 18, y: 25, r: 520, o: 0.35},
				{c: '#FBCFE8', x: 85, y: 75, r: 480, o: 0.22},
				{c: '#99F6E4', x: 75, y: 15, r: 380, o: 0.18},
			]
		: [
				{c: '#99F6E4', x: 15, y: 20, r: 520, o: 0.28},
				{c: '#BFDBFE', x: 88, y: 80, r: 560, o: 0.3},
				{c: '#FDE68A', x: 80, y: 10, r: 360, o: 0.16},
			];
	return (
		<div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: warm ? '#FFF9F0' : C.cream}}>
			{blobs.map((b, i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: `calc(${b.x}% - ${b.r}px + ${Math.sin(f / 90 + i * 2) * 40}px)`,
						top: `calc(${b.y}% - ${b.r}px + ${Math.cos(f / 110 + i) * 30}px)`,
						width: b.r * 2,
						height: b.r * 2,
						borderRadius: '50%',
						background: `radial-gradient(circle, ${b.c} 0%, transparent 68%)`,
						opacity: b.o,
					}}
				/>
			))}
			{children}
		</div>
	);
};

/**
 * Kinetic caption: each word rises in with a short stagger, then an accent bar draws under it.
 * Appears at `at` seconds; optional `until`.
 */
export const Caption: React.FC<{
	text: string;
	at: number;
	until?: number;
	x?: number;
	y?: number;
	size?: number;
	color?: string;
	accent?: string | null;
	weight?: 500 | 700 | 800;
	align?: 'center' | 'left';
	width?: number;
}> = ({text, at, until, x = W / 2, y = 960, size = 64, color = C.white, accent, weight = 800, align = 'center', width = 1800}) => {
	const frame = useCurrentFrame();
	const outP = until === undefined ? 0 : prog(frame, until, 0.35);
	if (frame < s(at) || outP >= 1) return null;
	const lines = text.split('\n');
	let wi = 0;
	const acc = accent === undefined ? (color === C.white ? C.amber : C.teal) : accent;
	const nWords = text.split(/\s+/).length;
	const bar = prog(frame, at + 0.12 * nWords + 0.15, 0.5);
	return (
		<div
			style={{
				position: 'absolute',
				left: align === 'center' ? x - width / 2 : x,
				width,
				top: y - size * 0.62,
				textAlign: align,
				fontFamily: FONT,
				fontWeight: weight,
				fontSize: size,
				letterSpacing: -1,
				lineHeight: 1.1,
				color,
				opacity: 1 - outP,
				transform: `translateY(${-outP * 16}px)`,
			}}
		>
			{lines.map((line, li) => (
				<div key={li}>
					{line.split(' ').map((word, k) => {
						const p = pop(frame, at + 0.1 * wi++, 16);
						return (
							<span key={k} style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: size * 0.08}}>
								<span style={{display: 'inline-block', transform: `translateY(${(1 - Math.min(1, p)) * 100}%)`, opacity: Math.min(1, p * 1.5)}}>
									{word}
									{k < line.split(' ').length - 1 ? ' ' : ''}
								</span>
							</span>
						);
					})}
				</div>
			))}
			{acc && (
				<div
					style={{
						height: Math.max(6, size * 0.09),
						width: size * 1.6 * bar,
						background: acc,
						borderRadius: 99,
						marginTop: size * 0.12,
						marginLeft: align === 'center' ? 'auto' : 0,
						marginRight: align === 'center' ? 'auto' : 0,
					}}
				/>
			)}
		</div>
	);
};

/** Slow camera push/pull over the whole scene, with optional extra punch-in. */
export const Camera: React.FC<{from?: number; to?: number; ox?: number; oy?: number; children: React.ReactNode}> = ({
	from = 1,
	to = 1.05,
	ox = 50,
	oy = 50,
	children,
}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const k = interpolate(frame, [0, durationInFrames], [from, to], {easing: easeInOut});
	return (
		<div style={{position: 'absolute', inset: 0, transform: `scale(${k})`, transformOrigin: `${ox}% ${oy}%`}}>
			{children}
		</div>
	);
};

/** Fade the scene in from / out to a colour over its first/last frames (used for dips). */
export const SceneFade: React.FC<{color: string; inSec?: number; outSec?: number}> = ({color, inSec = 0, outSec = 0}) => {
	const f = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const a = inSec > 0 ? 1 - interpolate(f, [0, s(inSec)], [0, 1], {extrapolateRight: 'clamp'}) : 0;
	const b = outSec > 0 ? interpolate(f, [durationInFrames - s(outSec), durationInFrames], [0, 1], {extrapolateLeft: 'clamp'}) : 0;
	const o = Math.max(a, b);
	return o > 0 ? <div style={{position: 'absolute', inset: 0, background: color, opacity: o}} /> : null;
};
