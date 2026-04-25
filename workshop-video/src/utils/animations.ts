import { interpolate, spring, Easing } from 'remotion';

// ─── Easing helpers ──────────────────────────────────────────────────────────

export const ease = {
  out:    Easing.out(Easing.cubic),
  inOut:  Easing.inOut(Easing.cubic),
  expo:   Easing.out(Easing.exp),
  linear: Easing.linear,
} as const;

// ─── Opacity ─────────────────────────────────────────────────────────────────

export const fadeIn = (
  frame: number,
  start: number = 0,
  duration: number = 20,
): number =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease.out,
  });

export const fadeOut = (
  frame: number,
  start: number,
  duration: number = 20,
): number =>
  interpolate(frame, [start, start + duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease.inOut,
  });

export const fadeInOut = (
  frame: number,
  inStart: number,
  inDuration: number,
  holdDuration: number,
  outDuration: number,
): number => {
  const inEnd  = inStart + inDuration;
  const outStart = inEnd + holdDuration;
  const outEnd   = outStart + outDuration;
  return interpolate(
    frame,
    [inStart, inEnd, outStart, outEnd],
    [0,       1,     1,        0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut },
  );
};

// ─── Translate Y (slide up) ──────────────────────────────────────────────────

export const slideUp = (
  frame: number,
  fps: number,
  delay: number = 0,
  distance: number = 18,
): number => {
  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 70, mass: 0.9, stiffness: 140 },
    durationInFrames: 35,
  });
  return interpolate(s, [0, 1], [distance, 0]);
};

export const slideDown = (
  frame: number,
  fps: number,
  delay: number = 0,
  distance: number = 18,
): number => {
  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 70, mass: 0.9, stiffness: 140 },
    durationInFrames: 35,
  });
  return interpolate(s, [0, 1], [-distance, 0]);
};

// ─── Scale ───────────────────────────────────────────────────────────────────

export const scaleIn = (
  frame: number,
  fps: number,
  delay: number = 0,
  from: number = 0.94,
): number => {
  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 80, mass: 0.8, stiffness: 160 },
    durationInFrames: 30,
  });
  return interpolate(s, [0, 1], [from, 1]);
};

// ─── Spring progress (0→1) ───────────────────────────────────────────────────

export const springProg = (
  frame: number,
  fps: number,
  delay: number = 0,
  duration: number = 40,
): number =>
  spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 80, mass: 1, stiffness: 100 },
    durationInFrames: duration,
  });

// ─── Line draw progress (0→1) ────────────────────────────────────────────────

export const lineDraw = (
  frame: number,
  start: number,
  duration: number,
): number =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease.expo,
  });

// ─── Pulse (oscillator) ──────────────────────────────────────────────────────

export const pulse = (
  frame: number,
  periodFrames: number = 90,
  amplitude: number = 0.5,
  baseline: number = 0.5,
): number =>
  baseline + amplitude * Math.sin((frame / periodFrames) * Math.PI * 2);
