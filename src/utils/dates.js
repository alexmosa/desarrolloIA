// Lógica de rangos de fechas para el filtro de período.
// Todo se calcula respecto a una "fecha de referencia" (config.fecha_referencia)
// para que la demo sea determinista sin depender del reloj del sistema.

// Convierte "YYYY-MM-DD" a Date UTC.
export function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

// Convierte Date UTC a "YYYY-MM-DD".
export function toISO(date) {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const ONE_DAY = 86400000

function addDays(date, days) {
  return new Date(date.getTime() + days * ONE_DAY)
}

// Identificadores de los períodos disponibles.
export const PERIODS = [
  { id: '7d', label: 'Últimos 7 días' },
  { id: 'month', label: 'Este mes' },
  { id: '3m', label: 'Últimos 3 meses' },
]

export const DEFAULT_PERIOD = 'month'

// Dado un id de período y la fecha de referencia (ISO), devuelve los rangos
// actual y anterior (para la comparación "vs. mes anterior").
// Cada rango es { start, end } en formato ISO, inclusivo en ambos extremos.
export function getPeriodRange(periodId, refISO) {
  const ref = parseISO(refISO)

  if (periodId === '7d') {
    const start = addDays(ref, -6)
    const prevEnd = addDays(start, -1)
    const prevStart = addDays(prevEnd, -6)
    return {
      current: { start: toISO(start), end: toISO(ref) },
      previous: { start: toISO(prevStart), end: toISO(prevEnd) },
    }
  }

  if (periodId === '3m') {
    const start = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth() - 3, ref.getUTCDate()))
    const prevEnd = addDays(start, -1)
    const prevStart = new Date(
      Date.UTC(prevEnd.getUTCFullYear(), prevEnd.getUTCMonth() - 3, prevEnd.getUTCDate())
    )
    return {
      current: { start: toISO(start), end: toISO(ref) },
      previous: { start: toISO(prevStart), end: toISO(prevEnd) },
    }
  }

  // 'month' (por defecto): del día 1 del mes a la fecha de referencia,
  // comparado contra el mismo rango del mes anterior.
  const start = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), 1))
  const prevStart = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth() - 1, 1))
  const prevEnd = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth() - 1, ref.getUTCDate()))
  return {
    current: { start: toISO(start), end: toISO(ref) },
    previous: { start: toISO(prevStart), end: toISO(prevEnd) },
  }
}

// Filtra transacciones dentro de un rango inclusivo (comparación lexicográfica
// de strings ISO, que es segura porque el formato es ordenable).
export function filterByRange(sales, range) {
  return sales.filter((t) => t.fecha >= range.start && t.fecha <= range.end)
}
