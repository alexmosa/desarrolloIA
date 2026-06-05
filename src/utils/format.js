export function formatCurrency(amount, { withDecimals = false } = {}) {
  const value = Number.isFinite(amount) ? amount : 0;
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: withDecimals ? 2 : 0,
    maximumFractionDigits: withDecimals ? 2 : 0,
  });
}

export function formatNumber(value) {
  const n = Number.isFinite(value) ? value : 0;
  return n.toLocaleString("en-US");
}

export function formatPercentChange(percent) {
  if (!Number.isFinite(percent)) return "—";
  const rounded = Math.round(percent * 10) / 10;
  const sign = rounded > 0 ? "+" : rounded < 0 ? "" : "";
  return `${sign}${rounded.toFixed(1)}%`;
}

export function formatPercent(percent, decimals = 1) {
  if (!Number.isFinite(percent)) return "0%";
  return `${percent.toFixed(decimals)}%`;
}

export function getInitials(fullName) {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

const MONTHS_ES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

const MONTHS_ES_LONG = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const WEEKDAYS_ES_LONG = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

export function formatShortRange(startISO, endISO) {
  const start = parseISODate(startISO);
  const end = parseISODate(endISO);
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const startStr = `${start.getUTCDate()} ${MONTHS_ES[start.getUTCMonth()]}`;
  const endStr = `${end.getUTCDate()} ${MONTHS_ES[end.getUTCMonth()]} ${end.getUTCFullYear()}`;
  return sameYear ? `${startStr} - ${endStr}` : `${startStr} ${start.getUTCFullYear()} - ${endStr}`;
}

export function formatLongDate(dateISO) {
  const d = parseISODate(dateISO);
  const weekday = WEEKDAYS_ES_LONG[d.getUTCDay()];
  return `${capitalize(weekday)} ${d.getUTCDate()} de ${MONTHS_ES_LONG[d.getUTCMonth()]}, ${d.getUTCFullYear()}`;
}

function parseISODate(iso) {
  return new Date(`${iso}T00:00:00Z`);
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
