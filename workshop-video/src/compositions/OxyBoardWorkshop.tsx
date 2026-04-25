import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { COLORS, SCENES } from '../theme';
import { SceneIntro }           from '../components/SceneIntro';
import { SceneValueLoss }       from '../components/SceneValueLoss';
import { SceneStructuralShift } from '../components/SceneStructuralShift';
import { SceneMaturityModel }   from '../components/SceneMaturityModel';
import { SceneNewEnterprise }   from '../components/SceneNewEnterprise';
import { SceneClosing }         from '../components/SceneClosing';

// ─── Main composition — 95 seconds @ 30 fps ──────────────────────────────────

export const OxyBoardWorkshop: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>

    {/* ── Block 1 — Apertura / Tensión (12 s) ── */}
    <Sequence
      from={SCENES.intro.start}
      durationInFrames={SCENES.intro.duration}
      name="Intro"
    >
      <SceneIntro />
    </Sequence>

    {/* ── Block 2 — Pérdida de Valor (15 s) ── */}
    <Sequence
      from={SCENES.valueLoss.start}
      durationInFrames={SCENES.valueLoss.duration}
      name="ValueLoss"
    >
      <SceneValueLoss />
    </Sequence>

    {/* ── Block 3 — El Cambio Real (18 s) ── */}
    <Sequence
      from={SCENES.shift.start}
      durationInFrames={SCENES.shift.duration}
      name="StructuralShift"
    >
      <SceneStructuralShift />
    </Sequence>

    {/* ── Block 4 — Modelo de Madurez (22 s) ── */}
    <Sequence
      from={SCENES.maturity.start}
      durationInFrames={SCENES.maturity.duration}
      name="MaturityModel"
    >
      <SceneMaturityModel />
    </Sequence>

    {/* ── Block 5 — La Nueva Empresa (15 s) ── */}
    <Sequence
      from={SCENES.newCo.start}
      durationInFrames={SCENES.newCo.duration}
      name="NewEnterprise"
    >
      <SceneNewEnterprise />
    </Sequence>

    {/* ── Block 6 — Cierre (13 s) ── */}
    <Sequence
      from={SCENES.closing.start}
      durationInFrames={SCENES.closing.duration}
      name="Closing"
    >
      <SceneClosing />
    </Sequence>

  </AbsoluteFill>
);
