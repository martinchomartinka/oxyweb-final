import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { AbstractGrid } from './ui/AbstractGrid';
import { COLORS, FONTS } from '../theme';
import { fadeIn, fadeOut, lineDraw } from '../utils/animations';

// ─── Scene 2 — Pérdida de Valor (450 frames = 15 s) ─────────────────────────

interface MetricLine {
  label: string;
  startY: number;
  endY: number;
  color: string;
  delay: number;
}

const METRICS: MetricLine[] = [
  { label: 'Margen',    startY: 0.14, endY: 0.74, color: COLORS.negative,   delay: 20 },
  { label: 'Velocidad', startY: 0.22, endY: 0.62, color: COLORS.accent,     delay: 55 },
  { label: 'Capacidad', startY: 0.30, endY: 0.80, color: COLORS.accentCyan, delay: 90 },
];

const CL = 240, CR = 1040, CT = 160, CB = 880;
const CW = CR - CL, CH = CB - CT;

const DeclinePath: React.FC<{ m: MetricLine; frame: number }> = ({ m, frame }) => {
  const PATH_LEN = 880;
  const progress = lineDraw(frame, m.delay, 130);
  const drawn = progress * PATH_LEN;
  const x1 = CL, y1 = CT + m.startY * CH;
  const x2 = CR, y2 = CT + m.endY * CH;
  const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2 + 24;
  const d = `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
  const lblOp = fadeIn(frame, m.delay, 18);

  return (
    <g>
      <path d={d} fill="none" stroke={m.color} strokeWidth={1} opacity={0.08} />
      <path d={d} fill="none" stroke={m.color} strokeWidth={1.8}
        strokeDasharray={`${drawn} ${PATH_LEN}`} opacity={0.7} />
      {progress > 0.96 && (
        <>
          <circle cx={x2} cy={y2} r={10} fill={m.color} opacity={0.10} />
          <circle cx={x2} cy={y2} r={3.5} fill={m.color} opacity={0.85} />
        </>
      )}
      <text x={CL + 6} y={y1 - 22} fill={m.color} fontFamily={FONTS.mono}
        fontSize={10} letterSpacing="0.13em" opacity={lblOp * 0.65}>
        {m.label.toUpperCase()}
      </text>
    </g>
  );
};

interface TextCard { text: string; size: number; weight: number; inAt: number; outAt: number; neg?: boolean }
const TEXT_CARDS: TextCard[] = [
  { text: 'No adoptar IA ya no te deja igual.',                             size: 48, weight: 300, inAt: 5,   outAt: 115 },
  { text: 'Te hace retroceder.',                                            size: 64, weight: 200, inAt: 110, outAt: 225, neg: true },
  { text: 'Más fricción.\nMás costo.\nMenor velocidad.\nMenor capacidad.', size: 36, weight: 300, inAt: 220, outAt: 390 },
  { text: 'Pérdida de valor\ninvisible.',                                   size: 52, weight: 200, inAt: 385, outAt: 999 },
];

export const SceneValueLoss: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneIn  = fadeIn(frame, 0, 20);
  const sceneOut = fadeOut(frame, 415, 25);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: sceneIn * sceneOut }}>
      <AbstractGrid opacity={0.4} />

      {/* Bottom red glow */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 360,
        background: `linear-gradient(0deg, ${COLORS.negativeGlow} 0%, transparent 100%)`,
        pointerEvents: 'none',
      }} />

      {/* Chart */}
      <svg width={1920} height={1080} style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Grid dashes */}
        {[0.25, 0.5, 0.75].map((f, i) => (
          <line key={i} x1={CL} y1={CT + f * CH} x2={CR} y2={CT + f * CH}
            stroke="white" strokeWidth={0.7} strokeDasharray="4 8" opacity={0.06} />
        ))}
        {/* Axes */}
        <line x1={CL} y1={CT - 10} x2={CL} y2={CB} stroke={COLORS.lineMid} strokeWidth={0.8} />
        <line x1={CL} y1={CT} x2={CR} y2={CT} stroke={COLORS.lineMid} strokeWidth={0.8} strokeDasharray="3 6" />
        <text x={CL + 4} y={CT - 28} fill={COLORS.textMuted} fontFamily={FONTS.mono}
          fontSize={10} letterSpacing="0.14em">
          ÍNDICE DE COMPETITIVIDAD  →  Tiempo
        </text>

        {METRICS.map((m, i) => <DeclinePath key={i} m={m} frame={frame} />)}
      </svg>

      {/* Text column — right side */}
      {TEXT_CARDS.map((c, i) => {
        const op = fadeIn(frame, c.inAt, 20) * (c.outAt < 900 ? fadeOut(frame, c.outAt, 15) : 1);
        const ty = interpolate(frame, [c.inAt, c.inAt + 22], [14, 0], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });
        return (
          <div key={i} style={{
            position: 'absolute',
            right: 100,
            top: '50%',
            transform: `translateY(calc(-50% + ${ty}px))`,
            opacity: op,
            width: 760,
            textAlign: 'right',
            fontFamily: FONTS.sans,
            fontSize: c.size,
            fontWeight: c.weight,
            color: c.neg ? COLORS.negative : COLORS.textPrimary,
            letterSpacing: '-0.022em',
            lineHeight: 1.22,
            pointerEvents: 'none',
            whiteSpace: 'pre-wrap',
          }}>
            {c.text}
          </div>
        );
      })}

      {/* Scene label */}
      <div style={{
        position: 'absolute', bottom: 52, left: 72,
        fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textMuted,
        letterSpacing: '0.14em', opacity: fadeIn(frame, 15, 25) * 0.35,
      }}>
        EROSIÓN DE VALOR
      </div>
    </AbsoluteFill>
  );
};
