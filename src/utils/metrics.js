export const PERIOD_OPTIONS = [
  { key: 'last7', label: 'Últimos 7 días' },
  { key: 'thisMonth', label: 'Este mes' },
  { key: 'last3Months', label: 'Últimos 3 meses' },
]

export const CATEGORY_COLORS = {
  'Electrónica': '#3B82F6',
  Ropa: '#8B5CF6',
  Hogar: '#F59E0B',
  Alimentos: '#10B981',
  Deportes: '#EF4444',
}

export const SORTABLE_COLUMNS = [
  'seller',
  'sales',
  'transactions',
  'avgTicket',
  'change',
  'share',
]

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000

export function parseISODate(dateString) {
  return new Date(`${dateString}T00:00:00`)
}

export function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function dateDiffInDays(start, end) {
  return Math.floor((startOfDay(end) - startOfDay(start)) / MILLISECONDS_PER_DAY)
}

export function getRangeForPeriod(periodKey, referenceDate) {
  const end = startOfDay(referenceDate)

  if (periodKey === 'last7') {
    return { start: addDays(end, -6), end }
  }

  if (periodKey === 'last3Months') {
    return {
      start: new Date(end.getFullYear(), end.getMonth() - 2, 1),
      end,
    }
  }

  return {
    start: new Date(end.getFullYear(), end.getMonth(), 1),
    end,
  }
}

export function getPreviousRange({ start, end }) {
  const rangeLength = dateDiffInDays(start, end) + 1
  const previousEnd = addDays(start, -1)
  const previousStart = addDays(previousEnd, -(rangeLength - 1))

  return { start: previousStart, end: previousEnd }
}

export function filterTransactionsByDate(transactions, start, end) {
  const startTime = startOfDay(start).getTime()
  const endTime = startOfDay(end).getTime()

  return transactions.filter((tx) => {
    const txDate = tx.date.getTime()
    return txDate >= startTime && txDate <= endTime
  })
}

export function sumSales(transactions) {
  return transactions.reduce((acc, tx) => acc + tx.monto, 0)
}

export function getAverageTicket(totalSales, transactionCount) {
  if (transactionCount === 0) return 0
  return totalSales / transactionCount
}

export function getChangePercentage(current, previous) {
  if (previous === 0) return null
  return ((current - previous) / previous) * 100
}

export function formatCurrency(value) {
  return `$${Number(value).toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })}`
}

export function formatPercent(value, fractionDigits = 1) {
  if (value === null || Number.isNaN(value)) return '—'
  return `${value > 0 ? '+' : ''}${value.toFixed(fractionDigits)}%`
}

export function getInitials(fullName) {
  return fullName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function formatDateRangeLabel(start, end) {
  const startLabel = start.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  })
  const endLabel = end.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return `${startLabel.replace('.', '')} - ${endLabel.replace('.', '')}`
}
