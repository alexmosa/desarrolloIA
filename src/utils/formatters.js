export const formatCurrency = (value, decimals = 0) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

export const formatNumber = (value) => value.toLocaleString('en-US')

export const formatPercent = (value, digits = 1) =>
  `${value >= 0 ? '+' : ''}${value.toFixed(digits)}%`

export const formatRangeLabel = (startDate, endDate) => {
  const startLabel = startDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  })
  const endLabel = endDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return `${startLabel} - ${endLabel}`
}

export const formatHeaderDate = (date) =>
  date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
