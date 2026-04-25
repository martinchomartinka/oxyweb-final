import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { AbstractGrid } from './ui/AbstractGrid';
import { NodeNetwork } from './ui/NodeNetwork';
import { FadingLine } from './ui/AnimatedText';
import { COLORS, FONTS } from '../theme';
import { fadeIn, fadeOut, pulse } from '../utils/animations';

// ─── Scene 1 — Apertura / Tensión (360 frames = 12 s) ────────────────────────

const LINES = [
  'No estamos entrando en\nuna nueva era de software.',
  'Estamos entrando en\nuna nueva era de capacidad.',
  'La IA no suma una herramienta.',
  'Redefine cómo se crea valor.',
] as const;

// Timing: 4 lines × ~85 frames each, with 10 frame crossfade
const LINE_SCHEDULES = [
  { inAt: 5,   outAt: 75,  outDur: 15 },
  { inAt: 80,  outAt: 165, outDur: 15 },
  { inAt: 170, outAt: 255, outDur: 15 },
  { inAt: 260, outAt: 999, outDur: 20 }, // stays till end
] as const;

// Subtle radial pulse behind the text
const BackgroundPulse: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = 1 + 0.04 * Math.sin((frame / 180) * Math.PI);
  const opacity = 0.06 + 0.02 * Math.sin((frame / 160) * Math.PI);
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        width: 800,
        height: 800,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${COLORS.accent} 0%, transparent 70%)`,
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

// Thin horizontal divider line
const DividerLine: React.FC<{ frame: number }> = ({ frame }) => {
  const progress = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '38%',
        transform: 'translateX(-50%)',
        width: progress * 80,
        height: 1,
        backgroundColor: COLORS.accent,
        opacity: 0.5,
      }}
    />
  );
};

export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneOpacity = fadeIn(frame, 0, 15);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        opacity: sceneOpacity,
      }}
    >
      {/* Background layer */}
      <AbstractGrid opacity={0.7} driftSpeed={25} />
      <BackgroundPulse />
      <NodeNetwork opacity={0.12} animated />

      {/* Thin top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${COLORS.accent}, transparent)`,
          opacity: 0.35,
        }}
      />

      {/* OXY46 — small brand top left */}
      <div
        style={{
          position: 'absolute',
          top: 52,
          left: 72,
          opacity: fadeIn(frame, 10, 25) * 0.55,
          fontFamily: FONTS.mono,
          fontSize: 12,
          color: COLORS.accent,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
        }}
      >
        OXY46
      </div>

      {/* Divider accent */}
      <DividerLine frame={frame} />

      {/* Text lines — sequential reveal */}
      {LINES.map((text, i) => {
        const s = LINE_SCHEDULES[i];
        return (
          <FadingLine
            key={i}
            text={text}
            size={62}
            weight={300}
            color={COLORS.textPrimary}
            tracking={-0.025}
            lineHeight={1.25}
            inAt={s.inAt}
            inDur={22}
            outAt={s.outAt}
            outDur={s.outDur}
            slideDistance={16}
            align="center"
            x="50%"
            y="50%"
            maxWidth={900}
          />
        );
      })}

      {/* Bottom counter label */}
      <div
        style={{
          position: 'absolute',
          bottom: 52,
          right: 72,
          fontFamily: FONTS.mono,
          fontSize: 11,
          color: COLORS.textMuted,
          letterSpacing: '0.14em',
          opacity: fadeIn(frame, 20, 30) * 0.4,
        }}
      >
        WORKSHOP EJECUTIVO / OXY46
      </div>
    </AbsoluteFill>
  );
};
