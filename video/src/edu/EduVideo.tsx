import React from 'react';
import {Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {S11, S12, S13, S14} from './scenesDemo';
import {S1, S2, S3, S4, S5, S6, S7, S8} from './scenesProblem';
import {S10, S15, S16, S17, S9} from './scenesSolution';
import {C, SceneFade, SceneTimingProvider, Sfx, easeInOut, s} from './theme';
import {TIMELINE} from './timeline';

const COMPONENTS: Record<string, React.FC> = {S01: S1, S02: S2, S03: S3, S04: S4, S05: S5, S06: S6, S07: S7, S08: S8, S09: S9, S10: S10, S11: S11, S12: S12, S13: S13, S14: S14, S15: S15, S16: S16, S17: S17};

/** How each cut is covered: a diagonal wipe (dark or brand), a dip, or nothing (seamless). */
type Cut = 'dark' | 'brand' | 'dip' | 'none';
const CUTS: Record<string, Cut> = {
	S02: 'dark',
	S03: 'dark',
	S04: 'dark',
	S05: 'dark',
	S06: 'dark',
	S07: 'dark',
	S08: 'dark',
	S09: 'none', // the silence after the wheel stops is the transition
	S10: 'brand',
	S11: 'brand',
	S12: 'none', // same phone, continuous demo
	S13: 'none',
	S14: 'none',
	S15: 'brand',
	S16: 'dip',
	S17: 'brand',
};

export const SCENES = TIMELINE.map((sc) => ({...sc, key: sc.id.slice(0, 3), component: COMPONENTS[sc.id.slice(0, 3)]}));
export const TOTAL_FRAMES = s(TIMELINE[TIMELINE.length - 1].start + TIMELINE[TIMELINE.length - 1].seconds);

const WIPE = 18; // frames

/** Diagonal panel that sweeps across and fully covers the frame exactly at the cut. */
const Wipe: React.FC<{kind: 'dark' | 'brand'}> = ({kind}) => {
	const f = useCurrentFrame();
	const p = interpolate(f, [0, WIPE], [0, 1], {easing: easeInOut});
	const x = interpolate(p, [0, 1], [-3200, 2000]);
	const main = kind === 'dark' ? '#0B1222' : C.teal;
	const edge = kind === 'dark' ? C.amber : '#FFFFFF';
	return (
		<div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
			<div style={{position: 'absolute', top: -400, left: x, width: 2900, height: 1900, transform: 'skewX(-18deg)', background: main}} />
			<div style={{position: 'absolute', top: -400, left: x + 2900, width: 60, height: 1900, transform: 'skewX(-18deg)', background: edge}} />
			<div style={{position: 'absolute', top: -400, left: x - 60, width: 60, height: 1900, transform: 'skewX(-18deg)', background: edge, opacity: 0.6}} />
		</div>
	);
};

export const EduVideo: React.FC = () => (
	<>
		{SCENES.map((sc) => {
			const cut = CUTS[sc.key] ?? 'none';
			return (
				<Sequence key={sc.id} from={s(sc.start)} durationInFrames={s(sc.seconds)} name={sc.id}>
					<SceneTimingProvider value={sc}>
						<sc.component />
					</SceneTimingProvider>
					{cut === 'dip' && <SceneFade color="#FFF9F0" inSec={0.5} />}
				</Sequence>
			);
		})}
		{SCENES.map((sc) => {
			const cut = CUTS[sc.key] ?? 'none';
			if (cut === 'dark' || cut === 'brand') {
				return (
					<Sequence key={`w${sc.id}`} from={s(sc.start) - WIPE / 2} durationInFrames={WIPE} name={`wipe ${sc.key}`}>
						<Wipe kind={cut} />
					</Sequence>
				);
			}
			if (cut === 'dip') {
				return (
					<Sequence key={`d${sc.id}`} from={s(sc.start) - s(0.5)} durationInFrames={s(0.5)} name={`dip ${sc.key}`}>
						<DipOut />
					</Sequence>
				);
			}
			return null;
		})}
		{SCENES.map((sc) =>
			CUTS[sc.key] === 'dark' || CUTS[sc.key] === 'brand' ? <Sfx key={`sx${sc.id}`} name="whoosh" at={sc.start - 0.35} volume={0.3} /> : null,
		)}
		<Audio src={staticFile('audio/voice.flac')} />
		<Audio src={staticFile('audio/music.flac')} />
	</>
);

const DipOut: React.FC = () => {
	const f = useCurrentFrame();
	return <div style={{position: 'absolute', inset: 0, background: '#FFF9F0', opacity: interpolate(f, [0, s(0.5)], [0, 1])}} />;
};

