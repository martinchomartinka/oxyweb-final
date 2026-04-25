import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS } from '../../theme';
import { pulse } from '../../utils/animations';

interface Node {
  id: number;
  x: number;
  y: number;
  r: number;
  phase: number; // pulse phase offset
}

interface Edge {
  a: number;
  b: number;
}

interface NodeNetworkProps {
  opacity?: number;
  accent?: string;
  animated?: boolean;
  scale?: number;
}

const NODES: Node[] = [
  { id: 0,  x: 180,  y: 320,  r: 3,   phase: 0    },
  { id: 1,  x: 420,  y: 190,  r: 4,   phase: 0.2  },
  { id: 2,  x: 680,  y: 400,  r: 3.5, phase: 0.6  },
  { id: 3,  x: 880,  y: 230,  r: 5,   phase: 1.0  },
  { id: 4,  x: 1080, y: 420,  r: 3,   phase: 0.4  },
  { id: 5,  x: 1280, y: 260,  r: 4,   phase: 0.8  },
  { id: 6,  x: 1500, y: 380,  r: 3.5, phase: 0.3  },
  { id: 7,  x: 1740, y: 220,  r: 3,   phase: 0.7  },
  { id: 8,  x: 320,  y: 560,  r: 3,   phase: 1.2  },
  { id: 9,  x: 560,  y: 700,  r: 4,   phase: 0.5  },
  { id: 10, x: 800,  y: 580,  r: 3.5, phase: 0.9  },
  { id: 11, x: 1020, y: 720,  r: 3,   phase: 0.1  },
  { id: 12, x: 1240, y: 600,  r: 4,   phase: 1.3  },
  { id: 13, x: 1460, y: 680,  r: 3,   phase: 0.6  },
  { id: 14, x: 1680, y: 560,  r: 4.5, phase: 0.2  },
  { id: 15, x: 960,  y: 860,  r: 3,   phase: 0.8  },
  { id: 16, x: 660,  y: 920,  r: 3,   phase: 1.1  },
  { id: 17, x: 1300, y: 880,  r: 3.5, phase: 0.4  },
];

const EDGES: Edge[] = [
  { a: 0, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 4 },
  { a: 4, b: 5 }, { a: 5, b: 6 }, { a: 6, b: 7 },
  { a: 0, b: 8 }, { a: 8, b: 9 }, { a: 9, b: 10 }, { a: 10, b: 11 },
  { a: 11, b: 12 }, { a: 12, b: 13 }, { a: 13, b: 14 },
  { a: 1, b: 8 }, { a: 2, b: 9 }, { a: 3, b: 10 }, { a: 4, b: 11 },
  { a: 5, b: 12 }, { a: 6, b: 13 }, { a: 7, b: 14 },
  { a: 9, b: 16 }, { a: 10, b: 15 }, { a: 11, b: 15 }, { a: 12, b: 17 },
  { a: 15, b: 16 }, { a: 15, b: 17 },
];

export const NodeNetwork: React.FC<NodeNetworkProps> = ({
  opacity = 1,
  accent = COLORS.accent,
  animated = true,
  scale = 1,
}) => {
  const frame = useCurrentFrame();

  return (
    <svg
      width={1920}
      height={1080}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
      }}
    >
      <defs>
        <radialGradient id="netFade" cx="50%" cy="50%" r="60%">
          <stop offset="20%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="netMask">
          <rect width={1920} height={1080} fill="url(#netFade)" />
        </mask>
      </defs>

      <g mask="url(#netMask)">
        {/* Edges */}
        {EDGES.map((e, i) => {
          const na = NODES[e.a];
          const nb = NODES[e.b];
          const lineOpacity = animated
            ? pulse(frame + i * 7, 180, 0.03, 0.07)
            : 0.07;
          return (
            <line
              key={`e-${i}`}
              x1={na.x} y1={na.y}
              x2={nb.x} y2={nb.y}
              stroke={accent}
              strokeWidth={0.8}
              opacity={lineOpacity}
            />
          );
        })}

        {/* Nodes */}
        {NODES.map((n) => {
          const pulsed = animated
            ? pulse(frame + n.phase * 60, 120, 0.3, 0.7)
            : 0.7;
          const glowR = n.r * (animated ? pulse(frame + n.phase * 60, 120, 0.5, 2.5) : 2);
          return (
            <g key={`n-${n.id}`}>
              {/* Glow */}
              <circle
                cx={n.x} cy={n.y}
                r={glowR * 3}
                fill={accent}
                opacity={0.03 * pulsed}
              />
              {/* Core */}
              <circle
                cx={n.x} cy={n.y}
                r={n.r}
                fill={accent}
                opacity={pulsed * 0.7}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
};
