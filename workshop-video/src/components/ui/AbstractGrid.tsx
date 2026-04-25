import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS } from '../../theme';

interface AbstractGridProps {
  cols?: number;
  rows?: number;
  opacity?: number;
  driftSpeed?: number; // pixels per 300 frames
}

export const AbstractGrid: React.FC<AbstractGridProps> = ({
  cols = 28,
  rows = 16,
  opacity = 1,
  driftSpeed = 40,
}) => {
  const frame = useCurrentFrame();

  const W = 1920;
  const H = 1080;
  const cw = W / cols;
  const rh = H / rows;

  // Very slow vertical drift
  const drift = interpolate(frame, [0, 3000], [0, driftSpeed], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <svg
      width={W}
      height={H}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      <defs>
        <radialGradient id="gridFade" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="white" stopOpacity="0.10" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="gridMask">
          <rect width={W} height={H} fill="url(#gridFade)" />
        </mask>
      </defs>
      <g mask="url(#gridMask)" opacity={opacity}>
        {/* Vertical lines */}
        {Array.from({ length: cols + 1 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * cw}
            y1={0}
            x2={i * cw}
            y2={H}
            stroke="white"
            strokeWidth={0.5}
            opacity={0.55}
          />
        ))}
        {/* Horizontal lines — drifting slowly */}
        {Array.from({ length: rows + 2 }).map((_, i) => {
          const y = ((i * rh - drift) % H + H) % H;
          return (
            <line
              key={`h-${i}`}
              x1={0}
              y1={y}
              x2={W}
              y2={y}
              stroke="white"
              strokeWidth={0.5}
              opacity={0.55}
            />
          );
        })}
      </g>
    </svg>
  );
};
