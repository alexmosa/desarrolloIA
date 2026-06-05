// Lógica central del dashboard: cálculo de rangos de período, filtrado de
// transacciones y agregación de KPIs, vendedores y categorías.
// Todo es de solo lectura sobre los datos mockeados.

// Colores de categoría definidos en el design system.
export const CATEGORY_COLORS = {
  Electrónica: '#3B82F6',
  Ropa: '#8B5CF6',
  Hogar: '#F59E0B',
  Alimentos: '#10B981',
  Deportes: '#EF4444',
}

export const PERIODS = [
  { id: '7d', label: 'Últimos 7 días' },
  { id: 'month', label: 'Este mes' },
  { id: '3m', label: 'Últimos 3 meses' },
]

const DAY_MS = 86400000

// Parsea "YYYY-MM-DD" como fecha UTC (evita corrimientos por zona horaria).
export function parseDate(str) {
  return new Date(str + 'T00:00:00Z')
}

const addDays = (date, n) => new Date(date.getTime() + n * DAY_MS)

function addMonths(date, n) {
  const d = new Date(date)
  d.setUTCMonth(d.getUTCMonth() + n)
  return d
}

const daysInclusive = (start, end) =>
  Math.round((end - start) / DAY_MS) + 1

// Devuelve { start, end } (Date UTC, inclusivos) para el período elegido,
// relativo a la fecha de referencia (tratada como "hoy").
export function getPeriodRange(periodId, referenceDate) {
  const end = referenceDate
  switch (periodId) {
    case '7d':
      return { start: addDays(end, -6), end }
    case '3m':
      return { start: addMonths(end, -3), end }
    case 'month':
    default: {
      const start = new Date(
        Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1)
      )
      return { start, end }
    }
  }
}

// Ventana de igual duración inmediatamente anterior al período actual.
export function getPreviousRange({ start, end }) {
  const length = daysInclusive(start, end)
  const prevEnd = addDays(start, -1)
  const prevStart = addDays(prevEnd, -(length - 1))
  return { start: prevStart, end: prevEnd }
}

export function filterByRange(sales, { start, end }) {
  return sales.filter((t) => {
    const d = parseDate(t.fecha)
    return d >= start && d <= end
  })
}

// Cambio porcentual con 1 decimal. Devuelve null si no hay base de comparación.
export function pctChange(current, previous) {
  if (!previous) return null
  return Math.round(((current - previous) / previous) * 1000) / 10
}

const sumMonto = (rows) => rows.reduce((s, t) => s + t.monto, 0)

// KPIs del período actual con comparación contra el período anterior.
export function computeKPIs(currentSales, previousSales, metaMensual) {
  const total = sumMonto(currentSales)
  const count = currentSales.length
  const avg = count ? total / count : 0

  const prevTotal = sumMonto(previousSales)
  const prevCount = previousSales.length
  const prevAvg = prevCount ? prevTotal / prevCount : 0

  return {
    total,
    totalChange: pctChange(total, prevTotal),
    count,
    countChange: pctChange(count, prevCount),
    avgTicket: Math.round(avg * 100) / 100,
    avgTicketChange: pctChange(avg, prevAvg),
    metaMensual,
    metaPct: metaMensual ? (total / metaMensual) * 100 : 0,
  }
}

// Una fila por vendedor del equipo, con cambio vs. período anterior y
// participación (share) sobre el total del equipo.
export function computeVendors(currentSales, previousSales, team) {
  const teamTotal = sumMonto(currentSales) || 1

  const byVendorCurrent = groupSum(currentSales)
  const byVendorPrev = groupSum(previousSales)

  const rows = team.map((member) => {
    const cur = byVendorCurrent[member.nombre] || { total: 0, count: 0 }
    const prev = byVendorPrev[member.nombre] || { total: 0, count: 0 }
    const avg = cur.count ? cur.total / cur.count : 0
    return {
      nombre: member.nombre,
      color: member.color,
      total: cur.total,
      count: cur.count,
      avgTicket: Math.round(avg * 100) / 100,
      change: pctChange(cur.total, prev.total),
      share: (cur.total / teamTotal) * 100,
    }
  })

  return rows
}

function groupSum(sales) {
  const map = {}
  for (const t of sales) {
    if (!map[t.vendedor]) map[t.vendedor] = { total: 0, count: 0 }
    map[t.vendedor].total += t.monto
    map[t.vendedor].count += 1
  }
  return map
}

// Totales del equipo (fila de totales de la tabla).
export function computeTeamTotals(rows) {
  const total = rows.reduce((s, r) => s + r.total, 0)
  const count = rows.reduce((s, r) => s + r.count, 0)
  return {
    total,
    count,
    avgTicket: count ? Math.round((total / count) * 100) / 100 : 0,
  }
}

// Desglose por categoría, ordenado de mayor a menor venta.
export function computeCategories(currentSales) {
  const total = sumMonto(currentSales) || 1
  const map = {}
  for (const t of currentSales) {
    map[t.categoria] = (map[t.categoria] || 0) + t.monto
  }
  return Object.entries(map)
    .map(([nombre, monto]) => ({
      nombre,
      monto,
      pct: (monto / total) * 100,
      color: CATEGORY_COLORS[nombre] || '#94A3B8',
    }))
    .sort((a, b) => b.monto - a.monto)
}

// Iniciales para el avatar del vendedor: "María García" -> "MG".
export function getInitials(nombre) {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')
}
