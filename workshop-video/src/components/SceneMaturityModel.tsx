import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { AbstractGrid } from './ui/AbstractGrid';
import { NodeNetwork } from './ui/NodeNetwork';
import { COLORS, FONTS } from '../theme';
import { fadeIn, fadeOut, springProg, pulse } from '../utils/animations';

// ─── Scene 4 — Modelo de Madurez (660 frames = 22 s) ─────────────────────────

interface Stage {
  id: number;
  title: string;
  subtitle: string;
  descriptor: string;
  detail: string[];
  color: string;
  revealAt: number;   // frame within scene
  nodeConfig: 'single' | 'multi' | 'network';
}

const STAGES: Stage[] = [
  {
    id: 1,
    title: 'Augmented',
    subtitle: 'Asistencia',
    descriptor: '01',
    detail: ['Humano + copiloto', 'Mejora de tareas', 'Velocidad individual'],
    color: COLORS.stageAugmented,
    revealAt: 60,
    nodeConfig: 'single',
  },
  {
    id: 2,
    title: 'Agentic',
    subtitle: 'Ejecución',
    descriptor: '02',
    detail: ['Agentes ejecutan flujos', 'Tareas encadenadas', 'Automatización con criterio'],
    color: COLORS.stageAgentic,
    revealAt: 230,
    nodeConfig: 'multi',
  },
  {
    id: 3,
    title: 'Orchestrated',
    subtitle: 'Orquestación',
    descriptor: '03',
    detail: ['Agentes coordinados', 'Supervisión estratégica', 'Organización expandida'],
    color: COLORS.stageOrchestrated,
    revealAt: 400,
    nodeConfig: 'network',
  },
];

// Small abstract visual for each stage
const StageVisual: React.FC<{ stage: Stage; frame: number; cardFrame: number }> = ({
  stage, frame, cardFrame,
}) => {
  const W = 220, H = 160;
  const cx = W / 2, cy = H / 2;
  const p = cardFrame > 0 ? Math.min(cardFrame / 60, 1) : 0;

  if (stage.nodeConfig === 'single') {
    // One large node + one small satellite
    const satelliteAngle = (frame / 200) * Math.PI * 2;
    const sR = 40;
    const sx = cx + Math.cos(satelliteAngle) * sR;
    const sy = cy + Math.sin(satelliteAngle) * sR;
    return (
      <svg width={W} height={H}>
        <circle cx={cx} cy={cy} r={22 * p} fill={stage.color} opacity={0.15} />
        <circle cx={cx} cy={cy} r={10 * p} fill={stage.color} opacity={0.8} />
        <line x1={cx} y1={cy} x2={sx * p + cx * (1 - p)} y2={sy * p + cy * (1 - p)}
          stroke={stage.color} strokeWidth={0.8} opacity={0.3} />
        <circle cx={sx} cy={sy} r={4 * p} fill={stage.color} opacity={0.5} />
        <circle cx={cx} cy={cy} r={36 * p} fill="none"
          stroke={stage.color} strokeWidth={0.6} strokeDasharray="3 6" opacity={0.25} />
      </svg>
    );
  }

  if (stage.nodeConfig === 'multi') {
    // 3 nodes arranged in triangle, all connected to center
    const angles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
    const r = 44;
    return (
      <svg width={W} height={H}>
        {angles.map((a, i) => {
          const nx = cx + Math.cos(a + frame / 240) * r;
          const ny = cy + Math.sin(a + frame / 240) * r;
          const pLocal = Math.max(0, Math.min((cardFrame - i * 15) / 45, 1));
          return (
            <g key={i} opacity={pLocal}>
              <line x1={cx} y1={cy} x2={nx} y2={ny}
                stroke={stage.color} strokeWidth={0.8} opacity={0.3} />
              <circle cx={nx} cy={ny} r={6} fill={stage.color} opacity={0.7} />
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={10} fill={stage.color} opacity={0.9 * p} />
        <circle cx={cx} cy={cy} r={22} fill={stage.color} opacity={0.08 * p} />
      </svg>
    );
  }

  // network — all interconnected
  const pts = [
    { x: cx,      y: cy - 50 },
    { x: cx + 48, y: cy - 20 },
    { x: cx + 48, y: cy + 22 },
    { x: cx,      y: cy + 50 },
    { x: cx - 48, y: cy + 22 },
    { x: cx - 48, y: cy - 20 },
  ];
  return (
    <svg width={W} height={H}>
      {pts.map((a, i) => pts.map((b, j) => {
        if (j <= i) return null;
        const pLocal = Math.max(0, Math.min((cardFrame - (i + j) * 5) / 40, 1));
        return (
          <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={stage.color} strokeWidth={0.7} opacity={0.22 * pLocal} />
        );
      }))}
      {pts.map((pt, i) => {
        const pLocal = Math.max(0, Math.min((cardFrame - i * 8) / 35, 1));
        const r = i === 0 ? 8 : 5;
        return (
          <g key={i} opacity={pLocal}>
            <circle cx={pt.x} cy={pt.y} r={r * 2.2} fill={stage.color} opacity={0.08} />
            <circle cx={pt.x} cy={pt.y} r={r} fill={stage.color} opacity={0.75} />
          </g>
        );
      })}
    </svg>
  );
};

// Single stage card
const StageCard: React.FC<{ stage: Stage; frame: number; cardX: number }> = ({
  stage, frame, cardX,
}) => {
  const { fps } = useVideoConfig() as { fps: number };
  const cardFrame = Math.max(0, frame - stage.revealAt);
  const slideIn = springProg(frame, fps, stage.revealAt, 50);
  const op = interpolate(slideIn, [0, 0.3], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const tx = interpolate(slideIn, [0, 1], [40, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const CARD_W = 420, CARD_H = 600;

  return (
    <div style={{
      position: 'absolute',
      left: cardX,
      top: '50%',
      transform: `translateY(-50%) translateX(${tx}px)`,
      opacity: op,
      width: CARD_W,
    }}>
      {/* Card container */}
      <div style={{
        width: CARD_W,
        background: COLORS.surface,
        border: `1px solid ${stage.color}30`,
        borderRadius: 8,
        padding: '48px 40px 44px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          backgroundColor: stage.color, opacity: 0.7,
        }} />

        {/* Stage number */}
        <div style={{
          fontFamily: FONTS.mono, fontSize: 12, color: stage.color,
          letterSpacing: '0.22em', marginBottom: 32, opacity: 0.7,
        }}>
          {stage.descriptor}
        </div>

        {/* Visual */}
        <div style={{ marginBottom: 28, opacity: 0.9 }}>
          <StageVisual stage={stage} frame={frame} cardFrame={cardFrame} />
        </div>

        {/* Title */}
        <div style={{
          fontFamily: FONTS.sans, fontSize: 36, fontWeight: 200,
          color: COLORS.textPrimary, letterSpacing: '-0.02em', marginBottom: 6,
        }}>
          {stage.title}
        </div>

        {/* Subtitle */}
        <div style={{
          fontFamily: FONTS.mono, fontSize: 12, color: stage.color,
          letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 32, opacity: 0.85,
        }}>
          {stage.subtitle}
        </div>

        {/* Detail lines */}
        {stage.detail.map((d, i) => {
          const lineOp = Math.min(1, Math.max(0, (cardFrame - 30 - i * 12) / 20));
          return (
            <div key={i} style={{
              fontFamily: FONTS.sans, fontSize: 14, fontWeight: 300,
              color: COLORS.textSecond, letterSpacing: '-0.01em',
              lineHeight: 1.5, opacity: lineOp,
              paddingLeft: 16,
              borderLeft: `1px solid ${stage.color}40`,
              marginBottom: 12,
            }}>
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HEADER_LINES = [
  { text: 'Pasamos de software a agentes.',        inAt: 5,   outAt: 55  },
  { text: 'De tareas asistidas a flujos ejecutados.', inAt: 50,  outAt: 999 },
] as const;

export const SceneMaturityModel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn  = fadeIn(frame, 0, 20);
  const sceneOut = fadeOut(frame, 615, 30);

  // Cards positions — spread horizontally
  const CARD_POSITIONS = [100, 580, 1060];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgAlt, opacity: sceneIn * sceneOut }}>
      <AbstractGrid opacity={0.3} cols={32} />
      <NodeNetwork opacity={0.06} animated />

      {/* Header text — top center */}
      {HEADER_LINES.map((h, i) => {
        const op = fadeIn(frame, h.inAt, 22) * (h.outAt < 900 ? fadeOut(frame, h.outAt, 18) : 1);
        const ty = interpolate(frame, [h.inAt, h.inAt + 22], [10, 0], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });
        return (
          <div key={i} style={{
            position: 'absolute', left: '50%', top: 68,
            transform: `translateX(-50%) translateY(${ty}px)`,
            opacity: op,
            fontFamily: FONTS.sans, fontSize: 22, fontWeight: 300,
            color: COLORS.textSecond, letterSpacing: '-0.01em',
            whiteSpace: 'nowrap', pointerEvents: 'none',
          }}>
            {h.text}
          </div>
        );
      })}

      {/* Three stage cards */}
      {STAGES.map((stage, i) => (
        <StageCard key={stage.id} stage={stage} frame={frame} cardX={CARD_POSITIONS[i]} />
      ))}

      {/* Bottom connector line between cards */}
      {frame > 440 && (
        <div style={{
          position: 'absolute', left: 320, right: 340,
          top: '50%', marginTop: 322,
          height: 1,
          background: `linear-gradient(90deg, ${COLORS.stageAugmented}60, ${COLORS.stageAgentic}60, ${COLORS.stageOrchestrated}60)`,
          opacity: Math.min(1, (frame - 440) / 40),
        }} />
      )}

      <div style={{
        position: 'absolute', bottom: 52, left: 72,
        fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textMuted,
        letterSpacing: '0.14em', opacity: fadeIn(frame, 10, 25) * 0.35,
      }}>
        MODELO DE MADUREZ / OXY46
      </div>
    </AbsoluteFill>
  );
};
