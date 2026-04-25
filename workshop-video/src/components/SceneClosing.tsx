import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { fadeIn, fadeOut, springProg, pulse } from '../utils/animations';

// ─── Scene 6 — Cierre (390 frames = 13 s) ────────────────────────────────────

// Animated horizontal rule
const AnimRule: React.FC<{ frame: number; delay?: number; color?: string; w?: number }> = ({
  frame, delay = 0, color = COLORS.accent, w = 60,
}) => {
  const p = fadeIn(frame, delay, 30);
  return (
    <div style={{
      width: p * w, height: 1.5,
      backgroundColor: color, borderRadius: 1,
      opacity: 0.65,
    }} />
  );
};

// Oxy46 logo mark — abstract geometric mark
const OxyMark: React.FC<{ frame: number }> = ({ frame }) => {
  const p = springProg(frame, 30, 5, 55);
  const rot = interpolate(p, [0, 1], [-4, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const s = interpolate(p, [0, 1], [0.85, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const pulsing = 0.85 + 0.05 * Math.sin((frame / 120) * Math.PI);

  return (
    <div style={{
      transform: `scale(${s}) rotate(${rot}deg)`,
      opacity: p * pulsing,
    }}>
      <svg width={56} height={56} viewBox="0 0 56 56">
        {/* Abstract mark: two overlapping diamonds */}
        <rect x={14} y={14} width={28} height={28} rx={2}
          fill="none" stroke={COLORS.accent} strokeWidth={1.5}
          transform="rotate(45 28 28)" opacity={0.9} />
        <rect x={18} y={18} width={20} height={20} rx={1}
          fill={COLORS.accent} opacity={0.15}
          transform="rotate(45 28 28)" />
        <circle cx={28} cy={28} r={4} fill={COLORS.accent} opacity={0.8} />
      </svg>
    </div>
  );
};

export const SceneClosing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn = fadeIn(frame, 0, 25);

  // Staggered element reveals
  const markOp     = springProg(frame, fps, 10, 50);
  const oxy46Op    = fadeIn(frame, 30, 25);
  const workshopOp = fadeIn(frame, 60, 28);
  const titleOp    = fadeIn(frame, 95, 30);
  const subtitleOp = fadeIn(frame, 135, 30);
  const taglineOp  = fadeIn(frame, 220, 35);

  // Gentle pulse on final hold
  const holdPulse  = frame > 300 ? 1 + 0.015 * Math.sin((frame / 90) * Math.PI) : 1;

  // Tagline highlight glow
  const taglineGlow = frame > 250 ? fadeIn(frame, 250, 40) * 0.12 : 0;

  const workshopTy = interpolate(frame, [60, 85], [12, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const titleTy = interpolate(frame, [95, 122], [14, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        opacity: sceneIn,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        width: 800, height: 600,
        borderRadius: '50%',
        background: `radial-gradient(ellipse, ${COLORS.accentGlow} 0%, transparent 65%)`,
        opacity: 0.7,
        pointerEvents: 'none',
      }} />

      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent 0%, ${COLORS.accent} 50%, transparent 100%)`,
        opacity: fadeIn(frame, 5, 30) * 0.4,
      }} />

      {/* Main lockup — centered */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
        transform: `scale(${holdPulse})`,
      }}>

        {/* Brand mark */}
        <div style={{ marginBottom: 28, opacity: markOp }}>
          <OxyMark frame={frame} />
        </div>

        {/* OXY46 wordmark */}
        <div style={{
          fontFamily: FONTS.mono, fontSize: 13, fontWeight: 400,
          color: COLORS.accent, letterSpacing: '0.38em',
          textTransform: 'uppercase', marginBottom: 36,
          opacity: oxy46Op,
        }}>
          OXY46
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <AnimRule frame={frame} delay={45} w={72} />
        </div>

        {/* Workshop label */}
        <div style={{
          fontFamily: FONTS.mono, fontSize: 12, color: COLORS.textMuted,
          letterSpacing: '0.24em', textTransform: 'uppercase',
          marginBottom: 20, opacity: workshopOp,
          transform: `translateY(${workshopTy}px)`,
        }}>
          Workshop Ejecutivo
        </div>

        {/* Main title */}
        <div style={{
          fontFamily: FONTS.sans, fontSize: 68, fontWeight: 200,
          color: COLORS.textPrimary, letterSpacing: '-0.03em',
          lineHeight: 1.08, marginBottom: 18,
          opacity: titleOp,
          transform: `translateY(${titleTy}px)`,
          maxWidth: 860,
        }}>
          IA para Directorios
        </div>

        {/* Subtitle */}
        <div style={{
          fontFamily: FONTS.sans, fontSize: 19, fontWeight: 300,
          color: COLORS.textSecond, letterSpacing: '-0.01em',
          lineHeight: 1.4, opacity: subtitleOp,
          maxWidth: 680,
        }}>
          Cómo preservar, ampliar y capturar valor
          <br />en la era agéntica
        </div>

        {/* Bottom divider */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0 32px' }}>
          <AnimRule frame={frame} delay={180} w={44} color={COLORS.textMuted} />
        </div>

        {/* Final tagline */}
        <div style={{
          fontFamily: FONTS.sans, fontSize: 15, fontWeight: 300,
          color: COLORS.textMuted, letterSpacing: '0.04em',
          opacity: taglineOp,
          position: 'relative',
        }}>
          <span style={{ color: COLORS.textSecond }}>La experimentación terminó.</span>
          {' '}Empieza la operacionalización.
          {/* Glow on tagline */}
          <div style={{
            position: 'absolute', inset: '-6px -12px',
            background: `radial-gradient(ellipse, ${COLORS.accent} 0%, transparent 80%)`,
            opacity: taglineGlow, borderRadius: 4,
          }} />
        </div>
      </div>

      {/* Bottom info line */}
      <div style={{
        position: 'absolute', bottom: 44,
        left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textMuted,
        letterSpacing: '0.18em', opacity: fadeIn(frame, 200, 40) * 0.35,
      }}>
        ROSARIO · ARGENTINA · 2025
      </div>
    </AbsoluteFill>
  );
};
