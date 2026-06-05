// Number / date formatting helpers used across the dashboard.

const MONTHS_ES = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

const MONTHS_ES_LONG = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const WEEKDAYS_ES = [
  'domingo', 'lunes', 'martes', 'miércoles',
  'jueves', 'viernes', 'sábado',
];

// Money: always whole dollars in the dashboard (e.g. "$124,500").
export function formatMoney(amount) {
  const safe = Number.isFinite(amount) ? amount : 0;
  return `$${Math.round(safe).toLocaleString('en-US')}`;
}

// Money with two decimals (used for average ticket where it reads better).
export function formatMoneyDecimal(amount) {
  const safe = Number.isFinite(amount) ? amount : 0;
  return `$${safe.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatInt(n) {
  return Number.isFinite(n) ? Math.round(n).toLocaleString('en-US') : '0';
}

// "+12.3%" / "-5.2%" — rounded to 1 decimal.
export function formatPercentChange(pct) {
  if (!Number.isFinite(pct)) return '—';
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}

export function formatPercent(pct, decimals = 0) {
  if (!Number.isFinite(pct)) return '0%';
  return `${pct.toFixed(decimals)}%`;
}

// "1 Mar 2026" style.
export function formatShortDate(dateStr) {
  const d = parseDate(dateStr);
  return `${d.getUTCDate()} ${capitalize(MONTHS_ES[d.getUTCMonth()])} ${d.getUTCFullYear()}`;
}

// "viernes, 5 de junio de 2026"
export function formatLongDate(dateStr) {
  const d = parseDate(dateStr);
  const wd = WEEKDAYS_ES[d.getUTCDay()];
  return `${capitalize(wd)}, ${d.getUTCDate()} de ${MONTHS_ES_LONG[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

// Accept either a Date or a "YYYY-MM-DD" string; always work in UTC.
export function parseDate(value) {
  if (value instanceof Date) return value;
  const [y, m, d] = value.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toISODate(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function initialsOf(fullName) {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function capitalize(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}
