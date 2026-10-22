import React, {useMemo} from 'react';
import {RoundedBox} from '@react-three/drei';
import {useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {C, FPS, easeInOut, lerp, pop, prog} from '../edu/theme';
import {px} from './Stage3D';

export const IMG_W = 1080;
export const IMG_H = 1920;

const roundedRect = (w: number, h: number, r: number) => {
	const s = new THREE.Shape();
	s.moveTo(-w / 2 + r, -h / 2);
	s.lineTo(w / 2 - r, -h / 2);
	s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
	s.lineTo(w / 2, h / 2 - r);
	s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
	s.lineTo(-w / 2 + r, h / 2);
	s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
	s.lineTo(-w / 2, -h / 2 + r);
	s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
	return s;
};

/** Rounded-rect geometry whose UVs span the full rectangle (for textured screens). */
const useScreenGeometry = (w: number, h: number, r: number) =>
	useMemo(() => {
		const g = new THREE.ShapeGeometry(roundedRect(w, h, r), 12);
		const pos = g.attributes.position;
		const uv = new Float32Array(pos.count * 2);
		for (let i = 0; i < pos.count; i++) {
			uv[i * 2] = pos.getX(i) / w + 0.5;
			uv[i * 2 + 1] = pos.getY(i) / h + 0.5;
		}
		g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
		return g;
	}, [w, h, r]);

let glareTexture: THREE.Texture | null = null;
const getGlare = () => {
	if (!glareTexture) {
		const cv = document.createElement('canvas');
		cv.width = 256;
		cv.height = 4;
		const ctx = cv.getContext('2d')!;
		const g = ctx.createLinearGradient(0, 0, 256, 0);
		g.addColorStop(0, 'rgba(255,255,255,0)');
		g.addColorStop(0.5, 'rgba(255,255,255,1)');
		g.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, 256, 4);
		glareTexture = new THREE.CanvasTexture(cv);
	}
	return glareTexture;
};

export type Layer = {tex?: THREE.Texture; color?: string; opacity: number};

/**
 * A 3D phone whose screen shows prototype captures. Children are overlays placed in
 * screenshot pixels (1080×1920, origin top-left) and move with the phone.
 * `zoom` pushes in around the screenshot point (fx, fy).
 */
export const Phone3D: React.FC<{
	x: number;
	y: number;
	screenH: number;
	rot?: [number, number, number];
	zoom?: number;
	fx?: number;
	fy?: number;
	layers: Layer[];
	glare?: number;
	opacity?: number;
	children?: React.ReactNode;
}> = ({x, y, screenH, rot = [0, 0, 0], zoom = 1, fx = 540, fy = 960, layers, glare = -1, opacity = 1, children}) => {
	const screenW = (screenH * 9) / 16;
	const bezel = screenH * 0.026;
	const bodyW = screenW + bezel * 2;
	const bodyH = screenH + bezel * 2;
	const depth = screenH * 0.05;
	const k = screenW / IMG_W;
	const [X, Y] = px(x, y);
	const fxl = (fx - IMG_W / 2) * k;
	const fyl = (IMG_H / 2 - fy) * k;
	const screenGeo = useScreenGeometry(screenW, screenH, bezel * 1.9);
	return (
		<group position={[X, Y, 0]} rotation={rot}>
			<group position={[-fxl * (zoom - 1), -fyl * (zoom - 1), 0]} scale={zoom}>
				<RoundedBox args={[bodyW, bodyH, depth]} radius={Math.min(bezel * 2.8, depth / 2 - 0.5)} smoothness={8} position={[0, 0, -depth / 2]}>
					<meshPhysicalMaterial color="#1B2232" metalness={0.65} roughness={0.28} clearcoat={1} clearcoatRoughness={0.15} transparent={opacity < 1} opacity={opacity} />
				</RoundedBox>
				{/* bezel front face */}
				<mesh position={[0, 0, 0.2]}>
					<shapeGeometry args={[roundedRect(bodyW - 4, bodyH - 4, bezel * 2.6)]} />
					<meshStandardMaterial color="#0B1020" roughness={0.35} transparent={opacity < 1} opacity={opacity} />
				</mesh>
				{/* side buttons */}
				<mesh position={[bodyW / 2 + 1.5, bodyH * 0.2, -depth / 2]}>
					<boxGeometry args={[5, bodyH * 0.1, depth * 0.45]} />
					<meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
				</mesh>
				<mesh position={[-bodyW / 2 - 1.5, bodyH * 0.26, -depth / 2]}>
					<boxGeometry args={[5, bodyH * 0.06, depth * 0.45]} />
					<meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
				</mesh>
				{/* screen layers */}
				{layers.map((l, i) =>
					l.opacity > 0.001 ? (
						<mesh key={i} geometry={screenGeo} position={[0, 0, 0.6 + i * 0.25]}>
							<meshBasicMaterial map={l.tex ?? null} color={l.color ?? '#FFFFFF'} transparent opacity={l.opacity * opacity} toneMapped={false} />
						</mesh>
					) : null,
				)}
				{/* overlays in screenshot pixels */}
				<group position={[-screenW / 2, screenH / 2, 4]} scale={[k, -k, 1]}>
					{children}
				</group>
				{/* moving glass glare */}
				{glare >= 0 && glare <= 1 && (
					<mesh position={[lerp(-screenW, screenW, glare), 0, 7]} rotation={[0, 0, -0.5]}>
						<planeGeometry args={[screenW * 0.35, screenH * 1.8]} />
						<meshBasicMaterial map={getGlare()} transparent opacity={0.22} depthWrite={false} toneMapped={false} />
					</mesh>
				)}
			</group>
		</group>
	);
};

/* ───────────── overlays (coordinates in screenshot pixels, y down) ───────────── */

/** Turquoise rounded outline that springs in and pulses twice. */
export const Ring3D: React.FC<{x: number; y: number; w: number; h: number; at: number; until?: number}> = ({x, y, w, h, at, until}) => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const k = pop(f, at, 13);
	const out = until === undefined ? 0 : prog(f, until, 0.35);
	const pad = 18;
	const geo = useMemo(() => {
		const outer = roundedRect(w + pad * 2 + 24, h + pad * 2 + 24, 56);
		const hole = new THREE.Path(roundedRect(w + pad * 2, h + pad * 2, 44).getPoints(12));
		outer.holes.push(hole);
		return new THREE.ShapeGeometry(outer, 12);
	}, [w, h]);
	if (k <= 0 || out >= 1) return null;
	const pt = t - at - 0.3;
	const pulse = pt > 0 && pt < 2 ? Math.sin((pt % 1) * Math.PI) : 0;
	const sc = (0.9 + 0.1 * Math.min(1.2, k)) * (1 + pulse * 0.035);
	return (
		<group position={[x + w / 2, y + h / 2, 1]} scale={[sc, sc, 1]}>
			<mesh geometry={geo}>
				<meshBasicMaterial color={C.teal} transparent opacity={Math.min(1, k) * (1 - out)} toneMapped={false} side={THREE.DoubleSide} />
			</mesh>
			{pulse > 0 && (
				<mesh geometry={geo} scale={[1 + pulse * 0.05, 1 + pulse * 0.08, 1]} position={[0, 0, -0.1]}>
					<meshBasicMaterial color={C.teal} transparent opacity={0.25 * pulse * (1 - out)} toneMapped={false} side={THREE.DoubleSide} />
				</mesh>
			)}
		</group>
	);
};

/** Highlighter band drawn left → right. */
export const Highlight3D: React.FC<{x: number; y: number; w: number; h: number; at: number}> = ({x, y, w, h, at}) => {
	const f = useCurrentFrame();
	const p = prog(f, at, 0.7, easeInOut);
	if (p <= 0) return null;
	return (
		<mesh position={[x + (w * p) / 2, y + h / 2, 0.5]}>
			<planeGeometry args={[w * p, h]} />
			<meshBasicMaterial color={C.teal} transparent opacity={0.3} toneMapped={false} side={THREE.DoubleSide} depthWrite={false} />
		</mesh>
	);
};

/** Touch cursor that glides to a point and taps with a ripple. */
export const Cursor3D: React.FC<{from: [number, number]; to: [number, number]; appear: number; tap: number; hide: number}> = ({from, to, appear, tap, hide}) => {
	const f = useCurrentFrame();
	const vis = prog(f, appear, 0.3) * (1 - prog(f, hide, 0.3));
	if (vis <= 0) return null;
	const move = prog(f, appear, Math.max(0.3, tap - appear - 0.25), easeInOut);
	const x = lerp(from[0], to[0], move);
	const y = lerp(from[1], to[1], move);
	const ripple = prog(f, tap, 0.7);
	const press = prog(f, tap - 0.08, 0.08) * (1 - prog(f, tap + 0.08, 0.15));
	const s = 1 - press * 0.2;
	return (
		<group position={[x, y, 3]}>
			{ripple > 0 && ripple < 1 && (
				<mesh position={[0, 0, -0.5]}>
					<ringGeometry args={[40 + ripple * 75, 50 + ripple * 80, 64]} />
					<meshBasicMaterial color={C.teal} transparent opacity={1 - ripple} toneMapped={false} side={THREE.DoubleSide} />
				</mesh>
			)}
			<group scale={[s, s, 1]}>
				<mesh>
					<circleGeometry args={[38, 48]} />
					<meshBasicMaterial color="#FFFFFF" transparent opacity={0.9 * vis} toneMapped={false} side={THREE.DoubleSide} />
				</mesh>
				<mesh position={[0, 0, 0.3]}>
					<ringGeometry args={[36, 45, 48]} />
					<meshBasicMaterial color={C.night} transparent opacity={vis} toneMapped={false} side={THREE.DoubleSide} />
				</mesh>
			</group>
		</group>
	);
};
