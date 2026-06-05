// Helpers de fechas en UTC para evitar el corrimiento por zona horaria del cliente.

export function parseISODate(iso) {
  return new Date(`${iso}T00:00:00Z`);
}

export function toISODate(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

export function startOfMonth(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export function daysBetween(startISO, endISO) {
  const a = parseISODate(startISO).getTime();
  const b = parseISODate(endISO).getTime();
  return Math.round((b - a) / 86400000);
}

// Devuelve {start, end} en formato ISO (yyyy-mm-dd) para los presets.
export function getPeriodRange(periodId, referenceDateISO) {
  const today = parseISODate(referenceDateISO);

  if (periodId === "last7") {
    const start = addDays(today, -6);
    return { startISO: toISODate(start), endISO: toISODate(today) };
  }

  if (periodId === "thisMonth") {
    const start = startOfMonth(today);
    return { startISO: toISODate(start), endISO: toISODate(today) };
  }

  if (periodId === "last3Months") {
    // Mismo día tres meses atrás (aproximación calendario).
    const start = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 3, today.getUTCDate() + 1),
    );
    return { startISO: toISODate(start), endISO: toISODate(today) };
  }

  throw new Error(`Periodo desconocido: ${periodId}`);
}

// Para un rango (start, end), devuelve el rango anterior de la misma duración.
export function getPreviousRange(startISO, endISO) {
  const span = daysBetween(startISO, endISO); // días incluidos = span + 1
  const prevEnd = addDays(parseISODate(startISO), -1);
  const prevStart = addDays(prevEnd, -span);
  return { startISO: toISODate(prevStart), endISO: toISODate(prevEnd) };
}

export function isInRange(dateISO, startISO, endISO) {
  return dateISO >= startISO && dateISO <= endISO;
}
