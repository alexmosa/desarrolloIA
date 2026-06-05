// Deterministic mock data generator for SalesView.
// Re-run with `npm run generate-data` after tweaking parameters.
// "Today" anchor for the dataset (the dashboard treats June 5, 2026 as the current date).

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, '..', 'data');
mkdirSync(dataDir, { recursive: true });

// ---- Config ---------------------------------------------------------------

const TODAY = new Date(Date.UTC(2026, 5, 5)); // 2026-06-05
const META_MENSUAL = 160000;
const NOMBRE_EQUIPO = 'Equipo Ventas — Región Norte';

const TEAM = [
  { nombre: 'María García',   color: '#3B82F6' },
  { nombre: 'Carlos López',   color: '#8B5CF6' },
  { nombre: 'Ana Martínez',   color: '#F59E0B' },
  { nombre: 'Pedro Sánchez',  color: '#10B981' },
  { nombre: 'Laura Torres',   color: '#EF4444' },
  { nombre: 'Diego Ramírez',  color: '#0EA5E9' },
];

const CATEGORIES = ['Electrónica', 'Ropa', 'Hogar', 'Alimentos', 'Deportes'];

// Deterministic PRNG (mulberry32) so repeated runs produce identical data.
function rng(seed) {
  let t = seed >>> 0;
  return function next() {
    t = (t + 0x6D2B79F5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = rng(42);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const between = (min, max) => min + rand() * (max - min);

const fmtDate = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + n);
  return x;
};

// Per-vendor and per-category weights so the breakdown looks interesting.
const VENDOR_WEIGHTS = [1.35, 1.15, 1.0, 0.85, 1.1, 0.7]; // by team order
const CATEGORY_WEIGHTS = {
  Electrónica: 1.6,
  Ropa: 1.1,
  Hogar: 1.0,
  Alimentos: 0.7,
  Deportes: 0.9,
};

function makeTransaction(id, date, vendorIdx) {
  const vendor = TEAM[vendorIdx].nombre;
  const categoria = pick(CATEGORIES);
  const base = between(180, 2400);
  const monto =
    Math.round(base * VENDOR_WEIGHTS[vendorIdx] * CATEGORY_WEIGHTS[categoria] * 100) / 100;
  return { id, vendedor: vendor, categoria, monto, fecha: fmtDate(date) };
}

// Build a transaction list whose totals roughly hit:
//   - current month (Jun 1..Jun 5)  ≈ 78% of META_MENSUAL  →  ~124,800
//   - previous month (May 1..May 31) >  current month (so % change is meaningful)
//   - month before that (Apr 1..Apr 30) > prev month (downward trend visible)
//
// We generate per-day transaction counts and adjust until totals land in range.

function generateWindow(startDate, endDate, dailyMin, dailyMax, idStart) {
  const txs = [];
  let id = idStart;
  let day = new Date(startDate);
  while (day <= endDate) {
    const count = Math.floor(between(dailyMin, dailyMax + 1));
    for (let i = 0; i < count; i++) {
      const vendorIdx = Math.floor(rand() * TEAM.length);
      txs.push(makeTransaction(`tx_${String(id).padStart(5, '0')}`, day, vendorIdx));
      id++;
    }
    day = addDays(day, 1);
  }
  return txs;
}

function totalOf(txs) {
  return txs.reduce((s, t) => s + t.monto, 0);
}

function scaleTo(txs, target) {
  const current = totalOf(txs);
  if (current === 0) return txs;
  const factor = target / current;
  return txs.map((t) => ({
    ...t,
    monto: Math.round(t.monto * factor * 100) / 100,
  }));
}

// Windows
const aprStart = new Date(Date.UTC(2026, 3, 1));
const aprEnd   = new Date(Date.UTC(2026, 3, 30));
const mayStart = new Date(Date.UTC(2026, 4, 1));
const mayEnd   = new Date(Date.UTC(2026, 4, 31));
const junStart = new Date(Date.UTC(2026, 5, 1));
const junEnd   = TODAY; // inclusive of today

// Generate raw transactions (counts give us ~80-100 total).
let id = 1;
const aprTx = generateWindow(aprStart, aprEnd, 0, 2, id);    id += aprTx.length;
const mayTx = generateWindow(mayStart, mayEnd, 0, 2, id);    id += mayTx.length;
const junTx = generateWindow(junStart, junEnd, 4, 7, id);    id += junTx.length;

// Scale each window to hit our targets:
//   Jun  ≈ 124,800 (78% of 160k)
//   May  ≈ 142,000
//   Apr  ≈ 158,500
const scaledJun = scaleTo(junTx, 124800);
const scaledMay = scaleTo(mayTx, 142000);
const scaledApr = scaleTo(aprTx, 158500);

const all = [...scaledApr, ...scaledMay, ...scaledJun]
  .sort((a, b) => (a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : 0))
  // Re-id to keep ids sequential and tidy after concat.
  .map((t, i) => ({ ...t, id: `tx_${String(i + 1).padStart(5, '0')}` }));

// ---- Write files ----------------------------------------------------------

writeFileSync(resolve(dataDir, 'sales.json'), JSON.stringify(all, null, 2) + '\n');
writeFileSync(resolve(dataDir, 'team.json'), JSON.stringify(TEAM, null, 2) + '\n');
writeFileSync(
  resolve(dataDir, 'config.json'),
  JSON.stringify(
    {
      meta_mensual: META_MENSUAL,
      nombre_equipo: NOMBRE_EQUIPO,
      fecha_referencia: fmtDate(TODAY),
    },
    null,
    2,
  ) + '\n',
);

// ---- Sanity log -----------------------------------------------------------

const sum = (txs) => txs.reduce((s, t) => s + t.monto, 0);
console.log(`Generated ${all.length} transactions`);
console.log(`  Apr total: $${sum(scaledApr).toLocaleString('en-US')}`);
console.log(`  May total: $${sum(scaledMay).toLocaleString('en-US')}`);
console.log(`  Jun total: $${sum(scaledJun).toLocaleString('en-US')} (${((sum(scaledJun) / META_MENSUAL) * 100).toFixed(1)}% of meta)`);
