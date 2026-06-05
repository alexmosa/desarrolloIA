// Utilidades de formateo. Los montos usan toLocaleString('en-US') con
// separador de miles y símbolo $, según la especificación.

export function formatCurrency(value, decimals = 0) {
  const n = Number.isFinite(value) ? value : 0
  return (
    '$' +
    n.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  )
}

export function formatNumber(value) {
  const n = Number.isFinite(value) ? value : 0
  return n.toLocaleString('en-US')
}

// Devuelve un objeto describiendo el cambio porcentual vs. un valor previo.
// { value, label, sign, isPositive, isNegative, hasData }
export function getChange(current, previous) {
  if (!previous || previous === 0) {
    return { value: null, label: '—', sign: '', isPositive: false, isNegative: false, hasData: false }
  }
  const pct = ((current - previous) / previous) * 100
  const rounded = Math.round(pct * 10) / 10
  const isPositive = rounded > 0
  const isNegative = rounded < 0
  const arrow = isPositive ? '↑' : isNegative ? '↓' : ''
  const sign = isPositive ? '+' : ''
  return {
    value: rounded,
    label: `${arrow} ${sign}${rounded.toFixed(1)}%`.trim(),
    sign,
    isPositive,
    isNegative,
    hasData: true,
  }
}

const MESES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
]

// "2026-03-22" -> "22 Mar 2026"
export function formatDateLabel(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MESES[m - 1]} ${y}`
}

// "2026-03-22" -> "22 de marzo de 2026" (para el header)
const MESES_LARGOS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]
export function formatDateLong(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} de ${MESES_LARGOS[m - 1]} de ${y}`
}

// Iniciales para el avatar del vendedor: "María García" -> "MG"
export function getInitials(nombre) {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')
}
