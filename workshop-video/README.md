# Oxy46 Workshop Video — Remotion Project

Video de apertura premium para Workshop Ejecutivo de Oxy46.
Duración: **95 segundos** · Formato: **1920×1080 · 30 fps**

---

## Requisitos

- Node.js 18+
- npm o yarn

## Instalación y preview

```bash
cd workshop-video
npm install
npm run start        # abre Remotion Studio en localhost:3000
```

El Studio de Remotion permite navegar frame a frame, scrubbing interactivo y
preview en tiempo real directamente en el navegador.

---

## Renderizar a video

```bash
# Render estándar (H.264, CRF 18)
npm run build

# Render alta calidad (CRF 12 — archivo más grande)
npm run render:hq

# Preview rápido a mitad de resolución (960×540)
npm run render:preview
```

El video se guarda en `out/video.mp4`.

Para ver en móvil: el MP4 resultante es compatible con cualquier reproductor.
Para redes sociales verticales, re-renderizar con `width: 1080, height: 1920` en `Root.tsx`.

---

## Arquitectura del proyecto

```
src/
├── index.ts                         Entry point (registerRoot)
├── Root.tsx                         Composiciones registradas
├── theme.ts                         Colores, fuentes y timing (EDITAR AQUÍ)
├── utils/
│   └── animations.ts                Helpers: fadeIn, fadeOut, spring, etc.
├── compositions/
│   └── OxyBoardWorkshop.tsx         Composición principal — secuencia de escenas
└── components/
    ├── SceneIntro.tsx               Bloque 1 — Apertura / Tensión
    ├── SceneValueLoss.tsx           Bloque 2 — Pérdida de Valor
    ├── SceneStructuralShift.tsx     Bloque 3 — El Cambio Real
    ├── SceneMaturityModel.tsx       Bloque 4 — Modelo de Madurez
    ├── SceneNewEnterprise.tsx       Bloque 5 — La Nueva Empresa
    ├── SceneClosing.tsx             Bloque 6 — Cierre / Workshop
    └── ui/
        ├── AbstractGrid.tsx         Fondo de grilla animada
        ├── NodeNetwork.tsx          Red de nodos abstractos
        ├── AnimatedText.tsx         Componentes de texto animados
        └── FlowLines.tsx            Líneas de flujo y partículas
```

---

## Dónde cambiar textos

Cada escena tiene sus textos definidos como constantes al inicio del archivo:

| Escena | Archivo | Constante |
|--------|---------|-----------|
| Apertura | `SceneIntro.tsx` | `LINES` (array de strings) |
| Pérdida de valor | `SceneValueLoss.tsx` | `TEXT_CARDS` |
| Cambio estructural | `SceneStructuralShift.tsx` | `TEXT_BLOCKS` |
| Madurez | `SceneMaturityModel.tsx` | `STAGES[].detail` y `HEADER_LINES` |
| Nueva empresa | `SceneNewEnterprise.tsx` | `TEXTS` |
| Cierre | `SceneClosing.tsx` | JSX directo (títulos hardcodeados) |

---

## Dónde cambiar colores

Editar `src/theme.ts` → objeto `COLORS`.

Colores clave:
- `bg` — fondo principal (`#0B0F14`)
- `accent` — azul eléctrico (`#3B82F6`)
- `textPrimary` — texto principal (`#F0EDE8`)
- `negative` — líneas descendentes (`#EF4444`)
- `stageAugmented / stageAgentic / stageOrchestrated` — paleta del modelo de madurez

---

## Dónde ajustar timing

Editar `src/theme.ts` → objeto `SCENES`:

```typescript
export const SCENES = {
  intro:     { start: 0,    duration: 360  }, // 12 s → cambiar duration
  valueLoss: { start: 360,  duration: 450  }, // 15 s
  shift:     { start: 810,  duration: 540  }, // 18 s
  maturity:  { start: 1350, duration: 660  }, // 22 s
  newCo:     { start: 2010, duration: 450  }, // 15 s
  closing:   { start: 2460, duration: 390  }, // 13 s
  total:     2850,                             // total: 95 s
};
```

> **Importante:** si cambiás la duración de una escena, ajustá el `start`
> de todas las escenas siguientes y actualizá `total` en consecuencia.
> Los `start` de cada escena deben coincidir con `start + duration` de la anterior.

---

## Timing interno por escena

### Bloque 1 — Intro (0–360)
4 frases aparecen y se desvanecen secuencialmente, 90 frames cada una.
Cambiar en `LINE_SCHEDULES` dentro de `SceneIntro.tsx`.

### Bloque 2 — Value Loss (0–450 local)
Las métricas del gráfico se dibujan con delay escalonado (ver `METRICS[].delay`).
Los textos de la derecha se controlan en `TEXT_CARDS[].inAt / outAt`.

### Bloque 3 — Structural Shift (0–540 local)
El org chart cambia de "before" a "after" usando un spring que arranca en frame 300.
Los textos siguen en `TEXT_BLOCKS`.

### Bloque 4 — Maturity Model (0–660 local)
Cada tarjeta aparece con spring en `STAGES[].revealAt` (60, 230, 400).

### Bloque 5 — New Enterprise (0–450 local)
El gráfico de P&L empieza a morphear en frame 120 (spring).
Los textos en `TEXTS[].inAt`.

### Bloque 6 — Closing (0–390 local)
Reveals escalonados: marca (frame 10), OXY46 (30), workshop (60), título (95),
subtítulo (135), tagline (220).

---

## Tips de rendimiento

- Para exportar más rápido: `npm run render:preview` → revisa composición a 960×540
- Para calidad máxima: `npm run render:hq` → CRF 12
- El Studio funciona en tiempo real; si va lento, reducir `driftSpeed` en `AbstractGrid`

---

## Vista en móvil

El video MP4 se reproduce sin problemas en cualquier dispositivo móvil moderno.
Para presentaciones en Zoom/Teams, el formato 16:9 es estándar.
Para Stories/Reels verticales, cambiar en `Root.tsx`:
```typescript
width={1080}
height={1920}
```
y ajustar el layout de cada escena (font sizes, posiciones) para el formato vertical.
