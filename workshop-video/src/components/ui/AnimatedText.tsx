import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { fadeIn, fadeOut, slideUp } from '../../utils/animations';
import { COLORS, FONTS } from '../../theme';

// ─── Single text line that fades in then fades out ──────────────────────────

interface FadingLineProps {
  text: string;
  size?: number;
  weight?: number | string;
  color?: string;
  tracking?: number;
  inAt?: number;
  inDur?: number;
  outAt?: number;
  outDur?: number;
  slideDistance?: number;
  align?: 'left' | 'center' | 'right';
  x?: number | string;
  y?: number | string;
  maxWidth?: number;
  lineHeight?: number;
}

export const FadingLine: React.FC<FadingLineProps> = ({
  text,
  size = 52,
  weight = 300,
  color = COLORS.textPrimary,
  tracking = -0.02,
  inAt = 0,
  inDur = 22,
  outAt,
  outDur = 18,
  slideDistance = 14,
  align = 'center',
  x = '50%',
  y = '50%',
  maxWidth,
  lineHeight = 1.2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opIn  = fadeIn(frame, inAt, inDur);
  const opOut = outAt !== undefined ? fadeOut(frame, outAt, outDur) : 1;
  const opacity = opIn * opOut;
  const translateY = slideUp(frame, fps, inAt, slideDistance);

  return (
    <div
      style={{
        position: 'absolute',
        left: typeof x === 'number' ? x : x,
        top:  typeof y === 'number' ? y : y,
        transform: `translate(-50%, -50%) translateY(${translateY}px)`,
        opacity,
        fontFamily: FONTS.sans,
        fontSize: size,
        fontWeight: weight,
        color,
        letterSpacing: `${tracking}em`,
        lineHeight,
        textAlign: align,
        maxWidth: maxWidth ?? '80%',
        whiteSpace: 'pre-wrap',
        pointerEvents: 'none',
      }}
    >
      {text}
    </div>
  );
};

// ─── Label badge (mono, small, dimmed) ───────────────────────────────────────

interface LabelProps {
  text: string;
  x?: string | number;
  y?: string | number;
  inAt?: number;
  color?: string;
  size?: number;
}

export const Label: React.FC<LabelProps> = ({
  text,
  x = '50%',
  y = '50%',
  inAt = 0,
  color = COLORS.textMuted,
  size = 13,
}) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, inAt, 20);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        opacity,
        fontFamily: FONTS.mono,
        fontSize: size,
        color,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        pointerEvents: 'none',
      }}
    >
      {text}
    </div>
  );
};

// ─── Accent bar (horizontal rule with color) ──────────────────────────────────

interface AccentBarProps {
  x?: string | number;
  y?: string | number;
  width?: number;
  color?: string;
  inAt?: number;
  inDur?: number;
}

export const AccentBar: React.FC<AccentBarProps> = ({
  x = '50%',
  y = '50%',
  width = 48,
  color = COLORS.accent,
  inAt = 0,
  inDur = 25,
}) => {
  const frame = useCurrentFrame();
  const progress = fadeIn(frame, inAt, inDur);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        width: progress * width,
        height: 2,
        backgroundColor: color,
        borderRadius: 1,
        pointerEvents: 'none',
      }}
    />
  );
};
