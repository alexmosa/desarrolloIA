// Generador determinista de datos mockeados para SalesView.
// Produce data/sales.json, data/team.json y data/config.json.
//
// Los datos se anclan a una "fecha de referencia" (referenceDate) que el
// dashboard trata como "hoy", de modo que las vistas por período siempre
// muestran datos significativos sin depender del reloj real.

import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '..', 'data')

// --- RNG determinista (mulberry32) para que el output sea estable ---
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(20260322)

const randBetween = (min, max) => min + rand() * (max - min)
const randInt = (min, max) => Math.floor(randBetween(min, max + 1))
const pickWeighted = (items) => {
  const total = items.reduce((s, i) => s + i.weight, 0)
  let r = rand() * total
  for (const item of items) {
    r -= item.weight
    if (r <= 0) return item
  }
  return items[items.length - 1]
}

// --- Configuración ---
const REFERENCE_DATE = '2026-03-22'
const META_MENSUAL = 160000
const NOMBRE_EQUIPO = 'Equipo Ventas — Región Norte'

const team = [
  { nombre: 'María García', color: '#3B82F6', weight: 1.5 },
  { nombre: 'Carlos López', color: '#8B5CF6', weight: 1.25 },
  { nombre: 'Ana Martínez', color: '#10B981', weight: 1.1 },
  { nombre: 'Pedro Sánchez', color: '#F59E0B', weight: 0.95 },
  { nombre: 'Laura Torres', color: '#EF4444', weight: 0.85 },
  { nombre: 'Diego Ramírez', color: '#0EA5E9', weight: 0.7 },
]

const categories = [
  { nombre: 'Electrónica', weight: 1.6, min: 600, max: 3200 },
  { nombre: 'Ropa', weight: 1.2, min: 120, max: 900 },
  { nombre: 'Hogar', weight: 1.0, min: 250, max: 1600 },
  { nombre: 'Alimentos', weight: 0.9, min: 60, max: 480 },
  { nombre: 'Deportes', weight: 0.8, min: 180, max: 1400 },
]

// --- Helpers de fecha ---
const fmt = (d) => d.toISOString().slice(0, 10)
const addDays = (d, n) => {
  const c = new Date(d)
  c.setUTCDate(c.getUTCDate() + n)
  return c
}

const sales = []
let id = 1

function makeSale(date) {
  const vendor = pickWeighted(team)
  const cat = pickWeighted(categories)
  const monto = Math.round(randBetween(cat.min, cat.max) * 100) / 100
  return {
    id: `T-${String(id++).padStart(4, '0')}`,
    vendedor: vendor.nombre,
    categoria: cat.nombre,
    monto,
    fecha: fmt(date),
    _raw: monto,
  }
}

// Generamos mes por mes con un total objetivo, escalando los montos del mes
// a ese objetivo. Así las comparaciones "vs. período anterior" quedan en
// rangos realistas (crecimiento/caída moderados) en vez de saltos absurdos.
//
// [año, mesIndex(0-11), díaMáximo (inclusive), total objetivo, #transacciones]
const monthlyPlan = [
  [2025, 8, 30, 128000, 78], // Septiembre
  [2025, 9, 31, 136000, 82], // Octubre
  [2025, 10, 30, 131000, 79], // Noviembre
  [2025, 11, 31, 149000, 90], // Diciembre
  [2026, 0, 31, 142000, 86], // Enero
  [2026, 1, 28, 151000, 92], // Febrero
  [2026, 2, 22, META_MENSUAL * 0.78, 76], // Marzo (mes en curso, 1-22) ≈ 124,800
]

for (const [year, month, maxDay, target, n] of monthlyPlan) {
  const monthStart = new Date(Date.UTC(year, month, 1))
  const monthSales = []
  for (let i = 0; i < n; i++) {
    const day = randInt(0, maxDay - 1)
    monthSales.push(makeSale(addDays(monthStart, day)))
  }
  // Escalar los montos del mes para clavar el total objetivo manteniendo
  // las proporciones entre vendedores y categorías.
  const raw = monthSales.reduce((s, t) => s + t._raw, 0)
  const scale = target / raw
  for (const t of monthSales) {
    t.monto = Math.round(t._raw * scale * 100) / 100
  }
  sales.push(...monthSales)
}

// Quitar el campo auxiliar y ordenar por fecha ascendente.
for (const t of sales) delete t._raw
sales.sort((a, b) => a.fecha.localeCompare(b.fecha) || a.id.localeCompare(b.id))

const marchSales = sales.filter((t) => t.fecha >= '2026-03-01')

const config = {
  meta_mensual: META_MENSUAL,
  nombre_equipo: NOMBRE_EQUIPO,
  // Fecha que el dashboard trata como "hoy" para los cálculos de período.
  fecha_referencia: REFERENCE_DATE,
}

const teamOut = team.map(({ nombre, color }) => ({ nombre, color }))

mkdirSync(dataDir, { recursive: true })
writeFileSync(join(dataDir, 'sales.json'), JSON.stringify(sales, null, 2) + '\n')
writeFileSync(join(dataDir, 'team.json'), JSON.stringify(teamOut, null, 2) + '\n')
writeFileSync(join(dataDir, 'config.json'), JSON.stringify(config, null, 2) + '\n')

const marchTotal = marchSales.reduce((s, t) => s + t.monto, 0)
console.log(`Generadas ${sales.length} transacciones.`)
console.log(`Total marzo 1-22: $${marchTotal.toLocaleString('en-US')} (${((marchTotal / META_MENSUAL) * 100).toFixed(1)}% de la meta)`)
