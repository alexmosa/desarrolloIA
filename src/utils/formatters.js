const DEFAULT_LOCALE = 'es-ES';

export function formatCurrency(
  value,
  { minimumFractionDigits = 0, maximumFractionDigits = 0 } = {},
) {
  return Number(value || 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits,
  });
}

export function formatNumber(value) {
  return Number(value || 0).toLocaleString('en-US');
}

export function formatPercent(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const prefix = safeValue > 0 ? '+' : '';
  return `${prefix}${safeValue.toFixed(1)}%`;
}

export function getTrendDirection(value) {
  if (value > 0) {
    return 'up';
  }

  if (value < 0) {
    return 'down';
  }

  return 'flat';
}

export function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function formatHeaderDate(date) {
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatDatePart(date) {
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    day: 'numeric',
    month: 'short',
  }).format(date);
}

export function formatDateRange(startDate, endDate) {
  return `${formatDatePart(startDate)} - ${formatDatePart(endDate)} ${endDate.getFullYear()}`;
}
