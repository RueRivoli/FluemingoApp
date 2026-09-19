<script setup lang="ts">
// Section "Dramatically increase your vocabulary" : texte à gauche, graphique en aires à droite.
// Le graphique est un SVG inline calculé à partir des données ci-dessous (pas de lib de charts).

interface Series {
  id: string;
  label: string;
  color: string;
  values: number[]; // % d'augmentation du vocabulaire, un point par demi-semaine
  logo?: string; // si défini, remplace le label en bout de courbe
}

const weeks = 4;
const series: Series[] = [
  {
    id: "fluemingo",
    label: "Fluemingo",
    color: "#849bfe",
    logo: "/logo/official_small.png",
    values: [0, 12, 22, 30, 38, 48, 57, 68, 82],
  },
  {
    id: "classroom",
    label: "Classroom study",
    color: "#b0921a",
    values: [0, 5, 10, 15, 20, 25, 30, 36, 45],
  },
  {
    id: "apps",
    label: "Other apps",
    color: "#c86b8a",
    values: [0, 3, 6, 9, 12, 15, 19, 23, 27],
  },
];

// Géométrie du SVG (viewBox fixe, le SVG s'adapte à la largeur de la carte)
const width = 640;
const height = 400;
const pad = { top: 40, right: 140, bottom: 48, left: 56 };
const plotW = width - pad.left - pad.right;
const plotH = height - pad.top - pad.bottom;
const yMax = 100;
const yTicks = [20, 40, 60, 80];
const logoSize = 36;

const pointCount = series[0].values.length;
const x = (i: number) => pad.left + (i / (pointCount - 1)) * plotW;
const y = (v: number) => pad.top + plotH - (v / yMax) * plotH;

function linePath(values: number[]) {
  return values
    .map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`)
    .join(" ");
}

function areaPath(values: number[]) {
  const baseline = y(0);
  return `${linePath(values)} L${x(pointCount - 1)},${baseline} L${x(0)},${baseline} Z`;
}

const xTicks = Array.from({ length: weeks }, (_, i) => ({
  label: `week ${i + 1}`,
  x: x((i + 1) * 2),
}));
</script>

<template>
  <section id="vocabulary" class="vocab">
    <div class="vocab-inner">
      <div class="vocab-text">
        <h2 class="vocab-title">Dramatically increase your vocabulary</h2>
        <p class="vocab-desc">
          Learning with real news articles and audiobooks means learning from
          context rather than just drilling words. You meet each expression in a
          sentence that matters, and it sticks.
        </p>
      </div>

      <figure class="vocab-card">
        <svg
          class="vocab-chart"
          :viewBox="`0 0 ${width} ${height}`"
          role="img"
          aria-labelledby="vocab-chart-title"
        >
          <title id="vocab-chart-title">
            Vocabulary increase over 4 weeks: Fluemingo vs classroom study vs
            other apps
          </title>
          <defs>
            <linearGradient
              v-for="s in series"
              :id="`vocab-grad-${s.id}`"
              :key="s.id"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" :stop-color="s.color" stop-opacity="0.55" />
              <stop offset="100%" :stop-color="s.color" stop-opacity="0.02" />
            </linearGradient>
            <clipPath id="vocab-logo-clip" clipPathUnits="objectBoundingBox">
              <rect width="1" height="1" rx="0.22" ry="0.22" />
            </clipPath>
          </defs>

          <!-- Grille -->
          <g class="grid">
            <line
              v-for="t in yTicks"
              :key="`y${t}`"
              :x1="pad.left"
              :x2="pad.left + plotW"
              :y1="y(t)"
              :y2="y(t)"
            />
            <line
              v-for="t in xTicks"
              :key="t.label"
              :x1="t.x"
              :x2="t.x"
              :y1="pad.top"
              :y2="pad.top + plotH"
            />
          </g>

          <!-- Axes -->
          <g class="axis">
            <text :x="pad.left" :y="pad.top - 16" class="axis-title">
              increase
            </text>
            <text
              v-for="t in yTicks"
              :key="`yl${t}`"
              :x="pad.left - 10"
              :y="y(t)"
              text-anchor="end"
              dominant-baseline="middle"
            >
              {{ t }}%
            </text>
            <text
              v-for="t in xTicks"
              :key="`xl${t.label}`"
              :x="t.x"
              :y="height - 14"
              text-anchor="middle"
            >
              {{ t.label }}
            </text>
          </g>

          <!-- Aires + lignes (la 1re série est dessinée en dernier pour passer au-dessus) -->
          <g v-for="s in [...series].reverse()" :key="s.id" class="series">
            <path :d="areaPath(s.values)" :fill="`url(#vocab-grad-${s.id})`" />
            <path
              :d="linePath(s.values)"
              :stroke="s.color"
              class="series-line"
            />
            <circle
              :cx="x(pointCount - 1)"
              :cy="y(s.values[pointCount - 1])"
              r="4"
              :fill="s.color"
              class="series-end"
            />
            <image
              v-if="s.logo"
              :href="s.logo"
              :x="x(pointCount - 1) + 12"
              :y="y(s.values[pointCount - 1]) - logoSize / 2"
              :width="logoSize"
              :height="logoSize"
              clip-path="url(#vocab-logo-clip)"
              class="series-logo"
            >
              <title>{{ s.label }}</title>
            </image>
            <text
              v-else
              :x="x(pointCount - 1) + 12"
              :y="y(s.values[pointCount - 1])"
              dominant-baseline="middle"
              class="series-label"
            >
              {{ s.label }}
            </text>
          </g>
        </svg>

        <figcaption class="vocab-legend">
          <span v-for="s in series" :key="s.id" class="vocab-legend-item">
            <span class="vocab-swatch" :style="{ background: s.color }"></span>
            {{ s.label }}
          </span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.vocab {
  padding: var(--section-spacing) var(--page-gutter);
  background-color: var(--color-bg);
  color: var(--color-text);
}

.vocab-inner {
  max-width: var(--page-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: clamp(2rem, 6vw, 5rem);
  align-items: center;
}

.vocab-title {
  font-size: clamp(2rem, 1.4rem + 2.5vw, 3.4rem);
  font-weight: 800;
  line-height: 1.1;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.vocab-desc {
  font-size: 1.125rem;
  color: var(--color-text-muted);
}

.vocab-card {
  position: relative;
  background: var(--color-bg-dark);
  border-radius: 1.5rem;
  padding: 1.5rem 1rem 1rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}

.vocab-chart {
  display: block;
  width: 100%;
  height: auto;
  font-family: var(--font-sans);
}

.grid line {
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 1;
}

.axis text {
  fill: rgba(255, 255, 255, 0.55);
  font-size: 13px;
}

.axis-title {
  font-size: 14px;
}

.series-line {
  fill: none;
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.series-end {
  stroke: var(--color-bg-dark);
  stroke-width: 2;
}

.series-label {
  fill: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  font-weight: 600;
}

.series-logo {
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
}

.vocab-swatch {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}

.vocab-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.vocab-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

@media (max-width: 900px) {
  .vocab-inner {
    grid-template-columns: 1fr;
  }

  .vocab-text {
    text-align: center;
  }
}
</style>
