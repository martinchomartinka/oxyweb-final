import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS } from '../../theme';

interface FlowLinesProps {
  opacity?: number;
  color?: string;
  direction?: 'horizontal' | 'vertical';
  count?: number;
}

export const FlowLines: React.FC<FlowLinesProps> = ({
  opacity = 1,
  color = COLORS.accent,
  direction = 'horizontal',
  count = 6,
}) => {
  const frame = useCurrentFrame();

  const W = 1920;
  const H = 1080;
  const dashLen = 60;
  const gapLen  = 220;
  const cycleLen = dashLen + gapLen;

  return (
    <svg
      width={W}
      height={H}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', opacity }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const frac = (i + 1) / (count + 1);
        const offset = ((frame * 1.8) + i * (cycleLen / count)) % cycleLen;

        if (direction === 'horizontal') {
          const y = H * frac;
          return (
            <line
              key={i}
              x1={0} y1={y}
              x2={W} y2={y}
              stroke={color}
              strokeWidth={0.8}
              strokeDasharray={`${dashLen} ${gapLen}`}
              strokeDashoffset={-offset}
              opacity={0.18}
            />
          );
        } else {
          const x = W * frac;
          return (
            <line
              key={i}
              x1={x} y1={0}
              x2={x} y2={H}
              stroke={color}
              strokeWidth={0.8}
              strokeDasharray={`${dashLen} ${gapLen}`}
              strokeDashoffset={-offset}
              opacity={0.18}
            />
          );
        }
      })}
    </svg>
  );
};

// ─── Particle path along a single curve ──────────────────────────────────────

interface CurveParticleProps {
  x1: number; y1: number;
  cx: number; cy: number;
  x2: number; y2: number;
  color?: string;
  speed?: number;
  phase?: number;
  opacity?: number;
}

export const CurveParticle: React.FC<CurveParticleProps> = ({
  x1, y1, cx, cy, x2, y2,
  color = COLORS.accentCyan,
  speed = 1,
  phase = 0,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const t = ((frame * speed * 0.004 + phase) % 1 + 1) % 1;

  // Quadratic Bezier point
  const bx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
  const by = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;

  return (
    <g opacity={opacity}>
      <circle cx={bx} cy={by} r={3} fill={color} opacity={0.7} />
      <circle cx={bx} cy={by} r={7} fill={color} opacity={0.12} />
      <path
        d={`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={0.8}
        opacity={0.12}
      />
    </g>
  );
};
