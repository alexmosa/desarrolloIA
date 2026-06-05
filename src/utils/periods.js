// Period (date-range) definitions and helpers.
// All dates handled here are UTC-only to keep the dashboard deterministic
// regardless of the browser's local timezone.

import { parseDate, toISODate } from './format.js';

export const PERIOD_KEYS = {
  LAST_7: 'last_7',
  THIS_MONTH: 'this_month',
  LAST_3_MONTHS: 'last_3_months',
};

export const PERIOD_OPTIONS = [
  { key: PERIOD_KEYS.LAST_7,        label: 'Últimos 7 días' },
  { key: PERIOD_KEYS.THIS_MONTH,    label: 'Este mes' },
  { key: PERIOD_KEYS.LAST_3_MONTHS, label: 'Últimos 3 meses' },
];

function addDaysUTC(date, days) {
  const x = new Date(date);
  x.setUTCDate(x.getUTCDate() + days);
  return x;
}

function startOfMonthUTC(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function endOfMonthUTC(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
}

function subMonthsUTC(date, months) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - months, date.getUTCDate()));
}

// Returns { start, end } as Date (UTC, inclusive) for the current and previous
// comparison range, given a reference "today".
export function getPeriodRange(periodKey, todayStr) {
  const today = parseDate(todayStr);

  switch (periodKey) {
    case PERIOD_KEYS.LAST_7: {
      const end = today;
      const start = addDaysUTC(today, -6); // 7 days inclusive
      const prevEnd = addDaysUTC(start, -1);
      const prevStart = addDaysUTC(prevEnd, -6);
      return {
        current: { start, end },
        previous: { start: prevStart, end: prevEnd },
      };
    }

    case PERIOD_KEYS.THIS_MONTH: {
      const start = startOfMonthUTC(today);
      const end = today;
      const prevMonthAnchor = subMonthsUTC(today, 1);
      const prevStart = startOfMonthUTC(prevMonthAnchor);
      const prevEnd = endOfMonthUTC(prevMonthAnchor);
      return {
        current: { start, end },
        previous: { start: prevStart, end: prevEnd },
      };
    }

    case PERIOD_KEYS.LAST_3_MONTHS: {
      const end = today;
      // ~90 days inclusive of today
      const start = addDaysUTC(today, -89);
      const prevEnd = addDaysUTC(start, -1);
      const prevStart = addDaysUTC(prevEnd, -89);
      return {
        current: { start, end },
        previous: { start: prevStart, end: prevEnd },
      };
    }

    default:
      throw new Error(`Unknown period key: ${periodKey}`);
  }
}

// True if a "YYYY-MM-DD" date string falls within [start, end] (inclusive).
export function isInRange(dateStr, range) {
  const iso = typeof dateStr === 'string' ? dateStr : toISODate(dateStr);
  const startISO = toISODate(range.start);
  const endISO = toISODate(range.end);
  return iso >= startISO && iso <= endISO;
}

export function filterByRange(transactions, range) {
  return transactions.filter((t) => isInRange(t.fecha, range));
}
