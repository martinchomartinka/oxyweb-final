import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { AbstractGrid } from './ui/AbstractGrid';
import { COLORS, FONTS } from '../theme';
import { fadeIn, fadeOut, springProg } from '../utils/animations';

// ─── Scene 3 — El Cambio Real (540 frames = 18 s) ────────────────────────────
// Abstract org chart that "flattens" as the scene progresses

// Org node
interface OrgNode {
  id: string;
  label: string;
  level: number; // 0 = top
  col: number;   // column within level
  colTotal: number;
}

// BEFORE: tall hierarchy (5 levels)
const BEFORE_NODES: OrgNode[] = [
  { id: 'ceo', label: 'CEO',     level: 0, col: 0, colTotal: 1 },
  { id: 'd1',  label: 'Dir A',   level: 1, col: 0, colTotal: 2 },
  { id: 'd2',  label: 'Dir B',   level: 1, col: 1, colTotal: 2 },
  { id: 'm1',  label: 'Mgr 1',   level: 2, col: 0, colTotal: 4 },
  { id: 'm2',  label: 'Mgr 2',   level: 2, col: 1, colTotal: 4 },
  { id: 'm3',  label: 'Mgr 3',   level: 2, col: 2, colTotal: 4 },
  { id: 'm4',  label: 'Mgr 4',   level: 2, col: 3, colTotal: 4 },
  { id: 'e1',  label: '●',       level: 3, col: 0, colTotal: 8 },
  { id: 'e2',  label: '●',       level: 3, col: 1, colTotal: 8 },
  { id: 'e3',  label: '●',       level: 3, col: 2, colTotal: 8 },
  { id: 'e4',  label: '●',       level: 3, col: 3, colTotal: 8 },
  { id: 'e5',  label: '●',       level: 3, col: 4, colTotal: 8 },
  { id: 'e6',  label: '●',       level: 3, col: 5, colTotal: 8 },
  { id: 'e7',  label: '●',       level: 3, col: 6, colTotal: 8 },
  { id: 'e8',  label: '●',       level: 3, col: 7, colTotal: 8 },
  { id: 'a1',  label: '·',       level: 4, col: 0, colTotal: 12 },
  { id: 'a2',  label: '·',       level: 4, col: 1, colTotal: 12 },
  { id: 'a3',  label: '·',       level: 4, col: 2, colTotal: 12 },
  { id: 'a4',  label: '·',       level: 4, col: 3, colTotal: 12 },
  { id: 'a5',  label: '·',       level: 4, col: 4, colTotal: 12 },
  { id: 'a6',  label: '·',       level: 4, col: 5, colTotal: 12 },
  { id: 'a7',  label: '·',       level: 4, col: 6, colTotal: 12 },
  { id: 'a8',  label: '·',       level: 4, col: 7, colTotal: 12 },
  { id: 'a9',  label: '·',       level: 4, col: 8, colTotal: 12 },
  { id: 'a10', label: '·',       level: 4, col: 9, colTotal: 12 },
  { id: 'a11', label: '·',       level: 4, col: 10, colTotal: 12 },
  { id: 'a12', label: '·',       level: 4, col: 11, colTotal: 12 },
];

// AFTER: flat (3 levels, more capacity at bottom)
const AFTER_NODES: OrgNode[] = [
  { id: 'ceo', label: 'CEO',     level: 0, col: 0, colTotal: 1 },
  { id: 'd1',  label: 'Dir A',   level: 1, col: 0, colTotal: 3 },
  { id: 'd2',  label: 'Dir B',   level: 1, col: 1, colTotal: 3 },
  { id: 'd3',  label: 'Dir C',   level: 1, col: 2, colTotal: 3 },
  { id: 'e1',  label: '●',       level: 2, col: 0, colTotal: 9 },
  { id: 'e2',  label: '●',       level: 2, col: 1, colTotal: 9 },
  { id: 'e3',  label: '●',       level: 2, col: 2, colTotal: 9 },
  { id: 'e4',  label: '●',       level: 2, col: 3, colTotal: 9 },
  { id: 'e5',  label: '●',       level: 2, col: 4, colTotal: 9 },
  { id: 'e6',  label: '●',       level: 2, col: 5, colTotal: 9 },
  { id: 'e7',  label: '●',       level: 2, col: 6, colTotal: 9 },
  { id: 'e8',  label: '●',       level: 2, col: 7, colTotal: 9 },
  { id: 'e9',  label: '●',       level: 2, col: 8, colTotal: 9 },
  // Agents layer (augmented workers)
  { id: 'm1',  label: '·',       level: 3, col: 0, colTotal: 6 },
  { id: 'm2',  label: '·',       level: 3, col: 1, colTotal: 6 },
  { id: 'm3',  label: '·',       level: 3, col: 2, colTotal: 6 },
  { id: 'm4',  label: '·',       level: 3, col: 3, colTotal: 6 },
  { id: 'm5',  label: '·',       level: 3, col: 4, colTotal: 6 },
  { id: 'm6',  label: '·',       level: 3, col: 5, colTotal: 6 },
];

// Layout constants
const CHART_CX = 680;
const CHART_TOP = 130;
const LEVEL_GAP = 140;
const NODE_W = 88, NODE_H = 34;

function getNodePos(node: OrgNode, levels: number): { x: number; y: number } {
  const y = CHART_TOP + node.level * LEVEL_GAP;
  const totalW = node.colTotal * (NODE_W + 24) - 24;
  const startX = CHART_CX - totalW / 2;
  const x = startX + node.col * (NODE_W + 24) + NODE_W / 2;
  return { x, y };
}

const OrgNodeBox: React.FC<{
  x: number; y: number; label: string; level: number; progress: number; afterMode: boolean;
}> = ({ x, y, label, level, progress, afterMode }) => {
  const isDot = label === '●' || label === '·';
  const isSmallDot = label === '·';
  const size = isSmallDot ? 5 : isDot ? 8 : undefined;

  const isAgentNode = afterMode && level === 3;
  const color = isAgentNode ? COLORS.accent :
    level === 0 ? COLORS.textPrimary :
    level === 1 ? COLORS.textSecond : COLORS.textMuted;
  const strokeColor = isAgentNode ? COLORS.accent :
    level <= 1 ? COLORS.lineMid : COLORS.lineSubtle;

  if (isDot) {
    return (
      <circle
        cx={x} cy={y + NODE_H / 2}
        r={size!}
        fill={color}
        opacity={progress * (isAgentNode ? 0.7 : 0.5)}
      />
    );
  }

  return (
    <g opacity={progress}>
      <rect
        x={x - NODE_W / 2} y={y}
        width={NODE_W} height={NODE_H}
        rx={3}
        fill={COLORS.surface}
        stroke={strokeColor}
        strokeWidth={0.8}
      />
      <text
        x={x} y={y + NODE_H / 2 + 4}
        textAnchor="middle"
        fill={color}
        fontFamily={FONTS.sans}
        fontSize={11}
        fontWeight={300}
        letterSpacing="0.05em"
      >
        {label}
      </text>
    </g>
  );
};

interface TextBlock { text: string; size: number; weight: number; inAt: number; outAt: number; highlight?: boolean }
const TEXT_BLOCKS: TextBlock[] = [
  { text: 'El cambio no es solo tecnológico.',  size: 52, weight: 300, inAt: 5,   outAt: 100 },
  { text: 'Es organizacional.',                 size: 64, weight: 200, inAt: 100, outAt: 185 },
  { text: 'Es económico.',                      size: 64, weight: 200, inAt: 185, outAt: 265 },
  { text: 'Es estratégico.',                    size: 64, weight: 200, inAt: 265, outAt: 345 },
  { text: 'Menos capas.\nMás capacidad por persona.\nMás velocidad de decisión.', size: 38, weight: 300, inAt: 345, outAt: 490, highlight: true },
  { text: 'Más ejecución por equipo.',           size: 52, weight: 300, inAt: 490, outAt: 999 },
];

export const SceneStructuralShift: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn  = fadeIn(frame, 0, 20);
  const sceneOut = fadeOut(frame, 505, 25);

  // Morph progress: org chart starts morphing at frame 300
  const morphProgress = springProg(frame, fps, 300, 100);
  const afterMode = morphProgress > 0.5;

  // Choose nodes based on morph stage
  const nodes = morphProgress > 0.5 ? AFTER_NODES : BEFORE_NODES;
  const maxLevels = afterMode ? 4 : 5;

  // Accent glow when morph happens
  const glowOpacity = interpolate(morphProgress, [0.3, 0.7], [0, 0.15], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: sceneIn * sceneOut }}>
      <AbstractGrid opacity={0.35} />

      {/* Glow when morphing */}
      <div style={{
        position: 'absolute', top: '50%', left: '35%',
        transform: 'translate(-50%, -50%)',
        width: 700, height: 700, borderRadius: '50%',
        background: `radial-gradient(circle, ${COLORS.accentGlow} 0%, transparent 70%)`,
        opacity: glowOpacity,
        pointerEvents: 'none',
      }} />

      {/* Org chart — left portion */}
      <svg width={1920} height={1080} style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Chart background panel */}
        <rect x={60} y={80} width={1200} height={920} rx={8}
          fill={COLORS.surface} opacity={0.15} />

        {/* Label */}
        <text x={80} y={60} fill={COLORS.textMuted} fontFamily={FONTS.mono}
          fontSize={10} letterSpacing="0.14em" opacity={0.5}>
          {afterMode ? 'ESTRUCTURA AUMENTADA' : 'ESTRUCTURA TRADICIONAL'}
        </text>

        {nodes.map((n) => {
          const pos = getNodePos(n, maxLevels);
          return (
            <OrgNodeBox
              key={n.id}
              x={pos.x} y={pos.y}
              label={n.label}
              level={n.level}
              progress={1}
              afterMode={afterMode}
            />
          );
        })}

        {/* Agent layer label */}
        {afterMode && (
          <text x={CHART_CX} y={CHART_TOP + 3.5 * LEVEL_GAP + NODE_H + 24}
            textAnchor="middle"
            fill={COLORS.accent} fontFamily={FONTS.mono}
            fontSize={10} letterSpacing="0.14em" opacity={morphProgress * 0.7}>
            AGENTES
          </text>
        )}
      </svg>

      {/* Text messages — right side */}
      {TEXT_BLOCKS.map((b, i) => {
        const op = fadeIn(frame, b.inAt, 22) * (b.outAt < 900 ? fadeOut(frame, b.outAt, 18) : 1);
        const ty = interpolate(frame, [b.inAt, b.inAt + 22], [14, 0], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });
        return (
          <div key={i} style={{
            position: 'absolute', right: 88, top: '50%',
            transform: `translateY(calc(-50% + ${ty}px))`,
            opacity: op, width: 620, textAlign: 'right',
            fontFamily: FONTS.sans, fontSize: b.size, fontWeight: b.weight,
            color: b.highlight ? COLORS.accent : COLORS.textPrimary,
            letterSpacing: '-0.022em', lineHeight: 1.28,
            pointerEvents: 'none', whiteSpace: 'pre-wrap',
          }}>
            {b.text}
          </div>
        );
      })}

      <div style={{
        position: 'absolute', bottom: 52, left: 72,
        fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textMuted,
        letterSpacing: '0.14em', opacity: fadeIn(frame, 10, 25) * 0.35,
      }}>
        REORGANIZACIÓN ESTRUCTURAL
      </div>
    </AbsoluteFill>
  );
};
