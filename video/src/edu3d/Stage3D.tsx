import React, {useEffect, useState} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {Environment, Lightformer} from '@react-three/drei';
import {continueRender, delayRender, staticFile} from 'remotion';
import * as THREE from 'three';
import {H, W} from '../edu/theme';

/**
 * Transparent full-frame 3D layer. The camera is placed so that the z = 0 plane maps
 * 1 unit = 1 pixel, with (0, 0) at the centre of the frame: use `px()` to place
 * objects in the same pixel coordinates as the 2D layers.
 */
const FOV = 30;
export const CAM_Z = H / 2 / Math.tan(((FOV / 2) * Math.PI) / 180);

export const px = (x: number, y: number): [number, number] => [x - W / 2, H / 2 - y];

export const Stage3D: React.FC<{children: React.ReactNode; warm?: boolean}> = ({children, warm}) => (
	<div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
		<ThreeCanvas
			width={W}
			height={H}
			camera={{fov: FOV, position: [0, 0, CAM_Z], near: 10, far: 6000}}
			gl={{antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping, preserveDrawingBuffer: true}}
		>
			<ambientLight intensity={0.55} />
			<directionalLight position={[-600, 900, 1400]} intensity={2.2} color={warm ? '#FFF1DC' : '#FFFFFF'} />
			<directionalLight position={[900, -300, 600]} intensity={0.6} color="#CCFBF1" />
			<Environment resolution={256}>
				<Lightformer intensity={2.2} position={[0, 5, -9]} scale={[12, 6, 1]} />
				<Lightformer intensity={1.6} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[12, 3, 1]} />
				<Lightformer intensity={1.2} position={[6, -1, 2]} rotation-y={-Math.PI / 2} scale={[12, 3, 1]} color="#99F6E4" />
				<Lightformer intensity={0.8} position={[0, -5, 4]} rotation-x={-Math.PI / 2} scale={[12, 12, 1]} />
			</Environment>
			{children}
		</ThreeCanvas>
	</div>
);

/** Loads `public/capturas/<name>.png` as sRGB textures, holding the render until they are ready. */
export const useCaptures = (names: string[]) => {
	const key = names.join('|');
	const [textures, setTextures] = useState<Record<string, THREE.Texture> | null>(null);
	const [handle] = useState(() => delayRender(`captures ${key}`));
	useEffect(() => {
		const loader = new THREE.TextureLoader();
		Promise.all(
			names.map(
				(n) =>
					new Promise<[string, THREE.Texture]>((resolve, reject) =>
						loader.load(
							staticFile(`capturas/${n}.png`),
							(t) => {
								t.colorSpace = THREE.SRGBColorSpace;
								t.anisotropy = 8;
								resolve([n, t]);
							},
							undefined,
							reject,
						),
					),
			),
		).then((pairs) => {
			setTextures(Object.fromEntries(pairs));
			continueRender(handle);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key]);
	return textures;
};
