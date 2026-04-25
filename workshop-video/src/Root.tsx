import React from 'react';
import { Composition } from 'remotion';
import { OxyBoardWorkshop } from './compositions/OxyBoardWorkshop';
import { SCENES, FPS } from './theme';

// ─── Root — registers all Remotion compositions ───────────────────────────────

export const RemotionRoot: React.FC = () => (
  <>
    {/* Full video — 95 seconds */}
    <Composition
      id="OxyBoardWorkshop"
      component={OxyBoardWorkshop}
      durationInFrames={SCENES.total}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{}}
    />

    {/* Preview thumbnails — one per scene for fast iteration */}
    <Composition
      id="Preview_Intro"
      component={OxyBoardWorkshop}
      durationInFrames={SCENES.intro.duration}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="Preview_ValueLoss"
      component={OxyBoardWorkshop}
      durationInFrames={SCENES.valueLoss.duration}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="Preview_MaturityModel"
      component={OxyBoardWorkshop}
      durationInFrames={SCENES.maturity.duration}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
    <Composition
      id="Preview_Closing"
      component={OxyBoardWorkshop}
      durationInFrames={SCENES.closing.duration}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  </>
);
