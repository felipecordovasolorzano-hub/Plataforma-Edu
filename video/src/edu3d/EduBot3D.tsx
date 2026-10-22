import React from 'react';
import {RoundedBox} from '@react-three/drei';
import {useCurrentFrame} from 'remotion';
import {C, FPS} from '../edu/theme';
import {px} from './Stage3D';

const WHITE = '#FFFFFF';

/** Glossy limb: small white sphere with a turquoise cuff. */
const Hand: React.FC<{side: 1 | -1; open: number; wiggle: number}> = ({side, open, wiggle}) => (
	<group rotation={[0, 0, side * (open * 0.32 - wiggle * 0.08)]}>
		<group position={[side * 114, -8, 6]}>
			<mesh>
				<sphereGeometry args={[19, 48, 48]} />
				<meshPhysicalMaterial color={WHITE} roughness={0.18} clearcoat={1} clearcoatRoughness={0.1} />
			</mesh>
			<mesh rotation={[0, Math.PI / 2, 0]}>
				<torusGeometry args={[18, 3.2, 16, 48]} />
				<meshStandardMaterial color={C.teal} roughness={0.35} emissive={C.teal} emissiveIntensity={0.25} />
			</mesh>
		</group>
	</group>
);

/**
 * EDU in 3D. (x, y) are frame pixels of its centre, matching the 2D EduBot.
 * Faces the camera with a gentle sway so its volume reads, eyes blink and can smile.
 */
export const EduBot3D: React.FC<{
	x: number;
	y: number;
	scale?: number;
	armsOpen?: number;
	happy?: boolean;
	glow?: number;
	spin?: number;
	opacity?: number;
}> = ({x, y, scale = 1, armsOpen = 0, happy, glow = 0, spin = 0, opacity = 1}) => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const blink = (f + 20) % 140 < 4;
	const sway = Math.sin(t * 1.3) * 0.22 + spin * Math.PI * 2;
	const tilt = Math.sin(t * 0.9) * 0.06 - 0.08;
	const wiggle = Math.sin(t * 7) * armsOpen;
	const [X, Y] = px(x, y);
	const eyeY = -2;
	return (
		<group position={[X, Y, 0]} scale={scale} visible={opacity > 0.01}>
			{glow > 0 && (
				<>
					<mesh position={[0, 0, -120]}>
						<circleGeometry args={[190, 64]} />
						<meshBasicMaterial color={C.teal} transparent opacity={0.13 * glow * opacity} depthWrite={false} />
					</mesh>
					<mesh position={[0, 0, -130]}>
						<circleGeometry args={[260, 64]} />
						<meshBasicMaterial color={C.teal} transparent opacity={0.06 * glow * opacity} depthWrite={false} />
					</mesh>
				</>
			)}
			<group rotation={[tilt, sway, Math.sin(t * 1.1) * 0.03]}>
				{/* body */}
				<mesh>
					<sphereGeometry args={[92, 96, 96]} />
					<meshPhysicalMaterial color={WHITE} roughness={0.16} clearcoat={1} clearcoatRoughness={0.08} sheen={0.3} transparent={opacity < 1} opacity={opacity} />
				</mesh>
				{/* turquoise equator band */}
				<mesh rotation={[Math.PI / 2 + 0.18, 0, 0]} position={[0, -30, 0]}>
					<torusGeometry args={[86, 4.5, 24, 128]} />
					<meshStandardMaterial color={C.teal} roughness={0.3} emissive={C.teal} emissiveIntensity={0.35} />
				</mesh>
				{/* visor */}
				<RoundedBox args={[132, 82, 34]} radius={16} smoothness={6} position={[0, 6, 82]}>
					<meshPhysicalMaterial color={C.night} roughness={0.12} clearcoat={1} metalness={0.2} />
				</RoundedBox>
				{/* eyes */}
				{[-1, 1].map((side) => (
					<group key={side} position={[side * 27, 6 + eyeY, 100]}>
						{blink ? (
							<mesh rotation={[0, 0, Math.PI / 2]}>
								<capsuleGeometry args={[3.5, 22, 8, 16]} />
								<meshBasicMaterial color={C.teal} />
							</mesh>
						) : happy ? (
							<mesh rotation={[0, 0, 0]} position={[0, -6, 0]}>
								<torusGeometry args={[13, 4, 16, 48, Math.PI]} />
								<meshBasicMaterial color={C.teal} />
							</mesh>
						) : (
							<mesh>
								<capsuleGeometry args={[12, 12, 12, 24]} />
								<meshBasicMaterial color={C.teal} />
							</mesh>
						)}
						{!blink && !happy && (
							<mesh position={[4, 8, 12]}>
								<sphereGeometry args={[3.6, 16, 16]} />
								<meshBasicMaterial color="#CCFBF1" />
							</mesh>
						)}
					</group>
				))}
				{/* antenna */}
				<mesh position={[0, 98, 0]}>
					<cylinderGeometry args={[3, 3, 18, 16]} />
					<meshStandardMaterial color="#CBD5E1" roughness={0.3} metalness={0.4} />
				</mesh>
				<mesh position={[0, 112, 0]}>
					<sphereGeometry args={[10, 32, 32]} />
					<meshStandardMaterial color={C.teal} emissive={C.teal} emissiveIntensity={0.6 + 0.4 * Math.sin(t * 4)} roughness={0.2} />
				</mesh>
				<Hand side={-1} open={armsOpen} wiggle={wiggle} />
				<Hand side={1} open={armsOpen} wiggle={-wiggle} />
			</group>
			{/* contact shadow */}
			<mesh position={[0, -150, -60]} scale={[1, 0.17, 1]}>
				<circleGeometry args={[72, 48]} />
				<meshBasicMaterial color="#0F172A" transparent opacity={0.1 * opacity} depthWrite={false} />
			</mesh>
		</group>
	);
};
