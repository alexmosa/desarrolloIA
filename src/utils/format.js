// Utilidades de formateo. Los montos usan toLocaleString('en-US') con
// separador de miles y símbolo $, según el spec.

export function formatCurrency(amount, { decimals = 0 } = {}) {
  const value = Number(amount) || 0
  return (
    '$' +
    value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  )
}

export function formatNumber(value) {
  return (Number(value) || 0).toLocaleString('en-US')
}

// Porcentaje de cambio con signo: "+12.3%" / "-5.2%". 1 decimal.
export function formatChange(percent) {
  if (percent === null || percent === undefined || Number.isNaN(percent)) {
    return '—'
  }
  const sign = percent > 0 ? '+' : ''
  return `${sign}${percent.toFixed(1)}%`
}

const MONTHS_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
]

// Fecha corta en español: "1 Mar 2026". Recibe un Date (en UTC).
export function formatDateShort(date) {
  return `${date.getUTCDate()} ${MONTHS_ES[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

// Fecha larga para el header: "22 de marzo de 2026".
const MONTHS_LONG_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]
export function formatDateLong(date) {
  return `${date.getUTCDate()} de ${MONTHS_LONG_ES[date.getUTCMonth()]} de ${date.getUTCFullYear()}`
}
