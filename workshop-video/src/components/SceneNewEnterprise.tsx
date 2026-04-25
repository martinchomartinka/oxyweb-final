import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { AbstractGrid } from './ui/AbstractGrid';
import { CurveParticle } from './ui/FlowLines';
import { COLORS, FONTS } from '../theme';
import { fadeIn, fadeOut, springProg, lineDraw, pulse } from '../utils/animations';

// ─── Scene 5 — La Nueva Empresa (450 frames = 15 s) ──────────────────────────

// Abstract P&L / cost structure visualization
const PLChart: React.FC<{ frame: number }> = ({ frame }) => {
  const bars = [
    { label: 'Estructura',    before: 0.68, after: 0.38, color: COLORS.accent     },
    { label: 'Operaciones',   before: 0.55, after: 0.28, color: COLORS.accentCyan },
    { label: 'Decisión',      before: 0.42, after: 0.14, color: COLORS.stageOrchestrated },
    { label: 'Capacidad',     before: 0.30, after: 0.72, color: COLORS.positive   },
  ];

  const morphP = springProg(frame, 30, 120, 120);

  const CHART_X = 100, CHART_Y = 180;
  const BAR_H = 26, BAR_GAP = 56;
  const MAX_W = 480;

  return (
    <svg width={700} height={560} style={{ position: 'absolute', left: 60, top: 180 }}>
      {/* Chart label */}
      <text x={CHART_X} y={CHART_Y - 38} fill={COLORS.textMuted} fontFamily={FONTS.mono}
        fontSize={10} letterSpacing="0.14em">
        ESTRUCTURA DE COSTOS / CAPACIDAD  →
      </text>

      {bars.map((bar, i) => {
        const op = fadeIn(frame, i * 25 + 30, 20);
        const w = interpolate(morphP, [0, 1], [bar.before * MAX_W, bar.after * MAX_W], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });
        const isCapacity = bar.label === 'Capacidad';
        const y = CHART_Y + i * BAR_GAP;

        return (
          <g key={i} opacity={op}>
            {/* Track */}
            <rect x={CHART_X} y={y} width={MAX_W} height={BAR_H} rx={3}
              fill="white" opacity={0.04} />
            {/* Bar */}
            <rect x={CHART_X} y={y} width={w} height={BAR_H} rx={3}
              fill={bar.color} opacity={isCapacity ? 0.65 : 0.45} />
            {/* Label */}
            <text x={CHART_X - 8} y={y + BAR_H / 2 + 4}
              textAnchor="end" fill={COLORS.textSecond}
              fontFamily={FONTS.mono} fontSize={10} letterSpacing="0.10em">
              {bar.label.toUpperCase()}
            </text>
            {/* Value percentage */}
            <text x={CHART_X + w + 10} y={y + BAR_H / 2 + 4}
              fill={bar.color} fontFamily={FONTS.mono} fontSize={10} opacity={0.8}>
              {Math.round(interpolate(morphP, [0, 1], [bar.before * 100, bar.after * 100], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              }))}%
            </text>
          </g>
        );
      })}

      {/* Before/After labels */}
      <text x={CHART_X} y={CHART_Y + bars.length * BAR_GAP + 32}
        fill={COLORS.textMuted} fontFamily={FONTS.mono} fontSize={10} opacity={0.5}>
        {morphP < 0.5 ? 'ESTRUCTURA ACTUAL' : 'ESTRUCTURA AUMENTADA'}
      </text>
    </svg>
  );
};

// Flow particles system — right side
const FlowSystem: React.FC<{ frame: number }> = ({ frame }) => {
  const curves = [
    { x1: 800, y1: 200, cx: 900, cy: 350, x2: 1100, y2: 280, phase: 0,   speed: 1.2 },
    { x1: 820, y1: 360, cx: 960, cy: 280, x2: 1150, y2: 400, phase: 0.4, speed: 0.9 },
    { x1: 780, y1: 520, cx: 920, cy: 440, x2: 1120, y2: 550, phase: 0.7, speed: 1.4 },
    { x1: 850, y1: 650, cx: 990, cy: 580, x2: 1180, y2: 700, phase: 0.2, speed: 1.0 },
    { x1: 1100, y1: 280, cx: 1220, cy: 380, x2: 1400, y2: 320, phase: 0.6, speed: 1.1 },
    { x1: 1120, y1: 440, cx: 1260, cy: 360, x2: 1450, y2: 480, phase: 0.9, speed: 0.8 },
    { x1: 1150, y1: 580, cx: 1300, cy: 650, x2: 1480, y2: 600, phase: 0.3, speed: 1.3 },
  ];

  const sysOp = fadeIn(frame, 40, 40);

  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', top: 0, left: 0, opacity: sysOp }}>
      {/* Node hubs */}
      {[
        { x: 800, y: 430 },
        { x: 1130, y: 410 },
        { x: 1460, y: 440 },
      ].map((hub, i) => {
        const hubOp = fadeIn(frame, i * 30 + 50, 25);
        const pulsed = 1 + 0.06 * Math.sin((frame / 100 + i) * Math.PI);
        return (
          <g key={i} opacity={hubOp}>
            <circle cx={hub.x} cy={hub.y} r={30 * pulsed} fill={COLORS.accent} opacity={0.05} />
            <circle cx={hub.x} cy={hub.y} r={16} fill={COLORS.accent} opacity={0.12} />
            <circle cx={hub.x} cy={hub.y} r={7}  fill={COLORS.accent} opacity={0.7} />
          </g>
        );
      })}

      {/* Connection lines between hubs */}
      {[[800, 430, 1130, 410], [1130, 410, 1460, 440]].map(([x1, y1, x2, y2], i) => {
        const p = lineDraw(frame, 80 + i * 30, 60);
        return (
          <line key={i}
            x1={x1} y1={y1}
            x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p}
            stroke={COLORS.accent} strokeWidth={1} opacity={0.25} />
        );
      })}

      {/* Particles */}
      {curves.map((c, i) => (
        <CurveParticle key={i} {...c} color={COLORS.accentCyan} opacity={0.7} />
      ))}
    </svg>
  );
};

interface TextItem { text: string; size: number; weight: number; inAt: number; outAt: number; color?: string }
const TEXTS: TextItem[] = [
  { text: 'Las empresas no solo van a usar IA.',     size: 48, weight: 300, inAt: 5,   outAt: 110 },
  { text: 'Van a operar distinto.',                   size: 64, weight: 200, inAt: 105, outAt: 210, color: COLORS.accent },
  { text: 'Menos fricción.\nMás margen.',             size: 44, weight: 300, inAt: 205, outAt: 310 },
  { text: 'Más capacidad.\nMás escala\ncon menos estructura.', size: 40, weight: 300, inAt: 305, outAt: 410 },
  { text: 'Una empresa más inteligente.',             size: 52, weight: 200, inAt: 405, outAt: 999 },
];

export const SceneNewEnterprise: React.FC = () => {
  const frame = useCurrentFrame();

  const sceneIn  = fadeIn(frame, 0, 20);
  const sceneOut = fadeOut(frame, 415, 25);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: sceneIn * sceneOut }}>
      <AbstractGrid opacity={0.3} driftSpeed={35} />

      {/* Accent glow — center */}
      <div style={{
        position: 'absolute', left: '55%', top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 900, height: 600, borderRadius: '50%',
        background: `radial-gradient(ellipse, ${COLORS.accentFaint} 0%, transparent 70%)`,
        opacity: 0.8, pointerEvents: 'none',
      }} />

      <PLChart frame={frame} />
      <FlowSystem frame={frame} />

      {/* Text — bottom left */}
      {TEXTS.map((t, i) => {
        const op = fadeIn(frame, t.inAt, 22) * (t.outAt < 900 ? fadeOut(frame, t.outAt, 18) : 1);
        const ty = interpolate(frame, [t.inAt, t.inAt + 22], [14, 0], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });
        return (
          <div key={i} style={{
            position: 'absolute', left: 88, bottom: 120,
            transform: `translateY(${ty}px)`,
            opacity: op, width: 700,
            fontFamily: FONTS.sans, fontSize: t.size, fontWeight: t.weight,
            color: t.color ?? COLORS.textPrimary,
            letterSpacing: '-0.022em', lineHeight: 1.22,
            pointerEvents: 'none', whiteSpace: 'pre-wrap',
          }}>
            {t.text}
          </div>
        );
      })}

      <div style={{
        position: 'absolute', bottom: 52, right: 88,
        fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textMuted,
        letterSpacing: '0.14em', opacity: fadeIn(frame, 10, 25) * 0.35,
      }}>
        LA NUEVA EMPRESA
      </div>
    </AbsoluteFill>
  );
};
