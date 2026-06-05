// Genera data/sales.json determinísticamente.
// Regenerar con: node scripts/generate-sales.js
// La fecha de referencia y la meta mensual viven en data/config.json.

import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, "..", "data");

const config = JSON.parse(readFileSync(resolve(dataDir, "config.json"), "utf8"));

const REFERENCE_DATE = new Date(`${config.fecha_referencia}T00:00:00Z`);
const META = config.meta_mensual;

// Mulberry32 seeded RNG para que la data sea reproducible.
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260322);

const between = (min, max) => min + rand() * (max - min);
const round2 = (n) => Math.round(n * 100) / 100;

function isoDate(d) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dayOffset(base, days) {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

// Pesos por vendedor para crear diferencias interesantes.
const vendorWeights = {
  "María García": 1.45,
  "Carlos López": 0.85,
  "Ana Martínez": 1.15,
  "Pedro Sánchez": 0.7,
  "Laura Torres": 1.0,
  "Diego Ramírez": 0.9,
};

// Pesos por categoría: Electrónica domina, Deportes es la cola.
const categoryWeights = {
  Electrónica: 1.7,
  Ropa: 1.1,
  Hogar: 1.0,
  Alimentos: 0.8,
  Deportes: 0.6,
};

function weightedPick(weights) {
  const entries = Object.entries(weights);
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [k, w] of entries) {
    r -= w;
    if (r <= 0) return k;
  }
  return entries[entries.length - 1][0];
}

// Rango promedio de monto por categoría (en USD).
const categoryRange = {
  Electrónica: [400, 3500],
  Ropa: [80, 600],
  Hogar: [120, 1400],
  Alimentos: [40, 350],
  Deportes: [90, 900],
};

// Genera transacciones en una ventana de días con un objetivo aproximado de monto total.
// `evenDistribution` reparte aproximadamente parejo a lo largo de los días para
// evitar que una sub-ventana (ej. "Últimos 7 días") quede prácticamente vacía.
function generateWindow({
  startOffset,
  endOffset,
  txCount,
  targetTotal,
  idStart,
  evenDistribution = true,
}) {
  const txs = [];
  const span = endOffset - startOffset + 1;
  for (let i = 0; i < txCount; i++) {
    const offset = evenDistribution
      ? startOffset + Math.floor((i / txCount) * span + rand() * (span / txCount))
      : Math.floor(between(startOffset, endOffset + 1));
    const dayInWindow = Math.min(Math.max(offset, startOffset), endOffset);
    const date = dayOffset(REFERENCE_DATE, dayInWindow);
    const vendedor = weightedPick(vendorWeights);
    const categoria = weightedPick(categoryWeights);
    const [lo, hi] = categoryRange[categoria];
    const base = between(lo, hi) * vendorWeights[vendedor];
    txs.push({
      id: idStart + i,
      vendedor,
      categoria,
      monto: round2(base),
      fecha: isoDate(date),
    });
  }
  // Ajuste suave para acercarse al targetTotal sin distorsionar la distribución.
  const currentTotal = txs.reduce((s, t) => s + t.monto, 0);
  const factor = targetTotal / currentTotal;
  for (const t of txs) t.monto = round2(t.monto * factor);
  return txs;
}

// Ventana 1: mes actual (día -21 a día 0 inclusive). Target = 78% de la meta.
const currentMonthTxs = generateWindow({
  startOffset: -21,
  endOffset: 0,
  txCount: 38,
  targetTotal: META * 0.78,
  idStart: 1000,
});

// Ventana 2: rango "mes anterior" (mismo tamaño 22 días, alineado a Feb 7-28).
// Total un poco menor para que el mes actual muestre crecimiento (~+12%).
const prevMonthTxs = generateWindow({
  startOffset: -43,
  endOffset: -22,
  txCount: 33,
  targetTotal: (META * 0.78) / 1.12,
  idStart: 2000,
});

// Ventana 3: cola que rellena Feb 1 - Feb 6 y antes (día -83 a día -44) para
// completar "Últimos 3 meses" con varianza por categorías y vendedores.
const olderTxs = generateWindow({
  startOffset: -83,
  endOffset: -44,
  txCount: 33,
  targetTotal: META * 0.7,
  idStart: 3000,
});

const all = [...olderTxs, ...prevMonthTxs, ...currentMonthTxs].sort((a, b) =>
  a.fecha.localeCompare(b.fecha),
);

writeFileSync(resolve(dataDir, "sales.json"), JSON.stringify(all, null, 2) + "\n");

const total = all.reduce((s, t) => s + t.monto, 0);
const monthTotal = currentMonthTxs.reduce((s, t) => s + t.monto, 0);
console.log(
  `Generadas ${all.length} transacciones. Mes actual: $${monthTotal.toFixed(2)} ` +
    `(${((monthTotal / META) * 100).toFixed(1)}% de la meta). Total 3 meses: $${total.toFixed(2)}.`,
);
