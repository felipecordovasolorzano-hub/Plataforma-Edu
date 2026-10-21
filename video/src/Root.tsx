import React from 'react';
import {Composition, Folder} from 'remotion';
import {EduVideo, SCENES, TOTAL_FRAMES} from './edu/EduVideo';
import {FPS, H, SceneTimingProvider, W, s} from './edu/theme';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="EDU" component={EduVideo} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
		<Folder name="Escenas">
			{SCENES.map((sc) => (
				<Composition
					key={sc.id}
					id={sc.id}
					component={() => (
						<SceneTimingProvider value={sc}>
							<sc.component />
						</SceneTimingProvider>
					)}
					durationInFrames={s(sc.seconds)}
					fps={FPS}
					width={W}
					height={H}
				/>
			))}
		</Folder>
	</>
);
