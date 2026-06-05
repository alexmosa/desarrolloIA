/**
 * Generador de datos mockeados para SalesView.
 *
 * Produce data/sales.json de forma determinista (RNG con semilla) para que la
 * demo siempre se vea igual. El total de "Este mes" (1–22 Mar 2026) se escala
 * para representar ~78% de la meta mensual (160.000).
 *
 * Uso: npm run gen:data
 */
import { writeFileSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '..', 'data')

const config = JSON.parse(readFileSync(join(dataDir, 'config.json'), 'utf8'))
const team = JSON.parse(readFileSync(join(dataDir, 'team.json'), 'utf8'))

// RNG determinista (mulberry32)
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rng = mulberry32(20260322)

const between = (min, max) => min + rng() * (max - min)

const vendors = team.map((t) => t.nombre)
// Pesos para crear diferencias interesantes entre vendedores.
const vendorWeights = [1.6, 1.3, 1.1, 0.9, 0.75, 0.6]

const categories = ['Electrónica', 'Ropa', 'Hogar', 'Alimentos', 'Deportes']
// Rango de monto típico por categoría (crea un líder claro: Electrónica).
const categoryRanges = {
  Electrónica: [600, 4200],
  Ropa: [120, 1100],
  Hogar: [200, 1800],
  Alimentos: [60, 650],
  Deportes: [150, 1400],
}
const categoryWeights = [1.7, 1.2, 1.1, 0.9, 0.8]

function weightedPick(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = rng() * total
  for (let i = 0; i < items.length; i++) {
    if (r < weights[i]) return items[i]
    r -= weights[i]
  }
  return items[items.length - 1]
}

function fmtDate(d) {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const ref = new Date(config.fecha_referencia + 'T00:00:00Z')

// Genera una transacción con una fecha dada.
function makeTx(date) {
  const vendedor = weightedPick(vendors, vendorWeights)
  const categoria = weightedPick(categories, categoryWeights)
  const [min, max] = categoryRanges[categoria]
  const monto = Math.round(between(min, max) * 100) / 100
  return { vendedor, categoria, monto, fecha: fmtDate(date) }
}

// Genera N transacciones con fechas uniformes entre [start, end] (inclusive).
function txInRange(start, end, n) {
  const startMs = start.getTime()
  const endMs = end.getTime()
  const out = []
  for (let i = 0; i < n; i++) {
    const ms = startMs + Math.floor(rng() * (endMs - startMs + 1))
    out.push(makeTx(new Date(ms)))
  }
  return out
}

// Segmento 1: mes actual, 1–22 Mar 2026 (~78% de la meta).
const curStart = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), 1))
const curEnd = ref
const current = txInRange(curStart, curEnd, 34)

// Segmento 2: mismo rango del mes anterior, 1–22 Feb 2026 (base de comparación).
const prevStart = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth() - 1, 1))
const prevEnd = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth() - 1, ref.getUTCDate()))
const previous = txInRange(prevStart, prevEnd, 27)

// Segmento 3: resto de la ventana de 3 meses (22 Dic 2025 – 31 Ene 2026 y 23–28 Feb).
// El inicio coincide exactamente con el borde del período "Últimos 3 meses"
// para que toda la data quede dentro de la ventana actual (sin transacciones
// huérfanas en el período de comparación anterior).
const winStart = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth() - 3, ref.getUTCDate()))
const janEnd = new Date(Date.UTC(2026, 0, 31))
const rest1 = txInRange(winStart, janEnd, 24)
const febTailStart = new Date(Date.UTC(2026, 1, 23))
const febTailEnd = new Date(Date.UTC(2026, 1, 28))
const rest2 = txInRange(febTailStart, febTailEnd, 6)

// Escala los montos de un segmento para que sumen un objetivo exacto.
function scaleTo(segment, target) {
  const sum = segment.reduce((a, t) => a + t.monto, 0)
  const factor = target / sum
  let running = 0
  segment.forEach((t, i) => {
    if (i === segment.length - 1) {
      t.monto = Math.round((target - running) * 100) / 100
    } else {
      t.monto = Math.round(t.monto * factor * 100) / 100
      running += t.monto
    }
  })
}

// 78% de 160.000 = 124.800 para el mes actual.
scaleTo(current, Math.round(config.meta_mensual * 0.78 * 100) / 100)
// Mes anterior un poco menor → crecimiento positivo en KPIs.
scaleTo(previous, 109500)

const all = [...rest1, ...rest2, ...previous, ...current]

// Orden cronológico y asignación de id.
all.sort((a, b) => a.fecha.localeCompare(b.fecha))
const sales = all.map((t, i) => ({
  id: i + 1,
  vendedor: t.vendedor,
  categoria: t.categoria,
  monto: t.monto,
  fecha: t.fecha,
}))

writeFileSync(join(dataDir, 'sales.json'), JSON.stringify(sales, null, 2) + '\n')

const curTotal = current.reduce((a, t) => a + t.monto, 0)
console.log(`Generadas ${sales.length} transacciones.`)
console.log(`Total mes actual (1–22 Mar): $${curTotal.toLocaleString('en-US')}`)
console.log(`% de meta: ${((curTotal / config.meta_mensual) * 100).toFixed(1)}%`)
