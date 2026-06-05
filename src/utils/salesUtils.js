const CATEGORY_COLORS = {
  Electrónica: '#3B82F6',
  Ropa: '#8B5CF6',
  Hogar: '#F59E0B',
  Alimentos: '#10B981',
  Deportes: '#EF4444',
};

export const PERIOD_PRESETS = {
  last7: 'last7',
  thisMonth: 'thisMonth',
  last3Months: 'last3Months',
};

/** Reference "today" for consistent demo dates (matches spec examples). */
export function getReferenceDate() {
  return new Date('2026-06-05T12:00:00');
}

export function getPeriodRange(preset, referenceDate = getReferenceDate()) {
  const end = new Date(referenceDate);
  end.setHours(23, 59, 59, 999);

  const start = new Date(referenceDate);
  start.setHours(0, 0, 0, 0);

  if (preset === PERIOD_PRESETS.last7) {
    start.setDate(start.getDate() - 6);
  } else if (preset === PERIOD_PRESETS.thisMonth) {
    start.setDate(1);
  } else if (preset === PERIOD_PRESETS.last3Months) {
    start.setMonth(start.getMonth() - 3);
    start.setDate(start.getDate() + 1);
  }

  return { start, end };
}

export function getPreviousPeriodRange(start, end) {
  const durationMs = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  prevEnd.setHours(23, 59, 59, 999);
  const prevStart = new Date(prevEnd.getTime() - durationMs);
  prevStart.setHours(0, 0, 0, 0);
  return { start: prevStart, end: prevEnd };
}

export function filterTransactionsByRange(transactions, start, end) {
  const startStr = formatDateISO(start);
  const endStr = formatDateISO(end);
  return transactions.filter((t) => t.fecha >= startStr && t.fecha <= endStr);
}

function formatDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatCurrency(amount) {
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function formatCurrencyDetailed(amount) {
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPercentChange(current, previous) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export function formatPeriodLabel(start, end) {
  const opts = { day: 'numeric', month: 'short', year: 'numeric' };
  const locale = 'es-ES';
  const startLabel = start.toLocaleDateString(locale, opts);
  const endLabel = end.toLocaleDateString(locale, opts);
  return `Mostrando datos de: ${startLabel} - ${endLabel}`;
}

export function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function computePeriodMetrics(transactions, start, end) {
  const current = filterTransactionsByRange(transactions, start, end);
  const { start: prevStart, end: prevEnd } = getPreviousPeriodRange(start, end);
  const previous = filterTransactionsByRange(transactions, prevStart, prevEnd);

  const totalSales = current.reduce((sum, t) => sum + t.monto, 0);
  const prevTotalSales = previous.reduce((sum, t) => sum + t.monto, 0);
  const transactionCount = current.length;
  const prevTransactionCount = previous.length;
  const avgTicket =
    transactionCount > 0
      ? Math.round((totalSales / transactionCount) * 100) / 100
      : 0;
  const prevAvgTicket =
    prevTransactionCount > 0
      ? Math.round((prevTotalSales / prevTransactionCount) * 100) / 100
      : 0;

  return {
    totalSales,
    prevTotalSales,
    transactionCount,
    prevTransactionCount,
    avgTicket,
    prevAvgTicket,
    salesChange: formatPercentChange(totalSales, prevTotalSales),
    transactionsChange: formatPercentChange(
      transactionCount,
      prevTransactionCount
    ),
    avgTicketChange: formatPercentChange(avgTicket, prevAvgTicket),
  };
}

export function computeSellerRows(transactions, team, start, end) {
  const current = filterTransactionsByRange(transactions, start, end);
  const { start: prevStart, end: prevEnd } = getPreviousPeriodRange(start, end);
  const previous = filterTransactionsByRange(transactions, prevStart, prevEnd);

  const teamMap = Object.fromEntries(team.map((m) => [m.nombre, m]));
  const sellers = team.map((m) => m.nombre);

  const rows = sellers.map((nombre) => {
    const sellerCurrent = current.filter((t) => t.vendedor === nombre);
    const sellerPrevious = previous.filter((t) => t.vendedor === nombre);

    const ventas = sellerCurrent.reduce((s, t) => s + t.monto, 0);
    const prevVentas = sellerPrevious.reduce((s, t) => s + t.monto, 0);
    const transacciones = sellerCurrent.length;
    const ticketPromedio =
      transacciones > 0 ? Math.round((ventas / transacciones) * 100) / 100 : 0;
    const vsMesAnterior = formatPercentChange(ventas, prevVentas);

    return {
      nombre,
      color: teamMap[nombre]?.color ?? '#64748B',
      ventas,
      transacciones,
      ticketPromedio,
      vsMesAnterior,
    };
  });

  const totalVentas = rows.reduce((s, r) => s + r.ventas, 0);
  return rows.map((row) => ({
    ...row,
    sharePercent: totalVentas > 0 ? (row.ventas / totalVentas) * 100 : 0,
  }));
}

export function computeCategoryBreakdown(transactions, start, end) {
  const current = filterTransactionsByRange(transactions, start, end);
  const total = current.reduce((s, t) => s + t.monto, 0);

  const byCategory = {};
  for (const t of current) {
    byCategory[t.categoria] = (byCategory[t.categoria] || 0) + t.monto;
  }

  return Object.entries(byCategory)
    .map(([nombre, monto]) => ({
      nombre,
      monto,
      percent: total > 0 ? Math.round((monto / total) * 1000) / 10 : 0,
      color: CATEGORY_COLORS[nombre] ?? '#64748B',
    }))
    .sort((a, b) => b.monto - a.monto);
}

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] ?? '#64748B';
}

export { CATEGORY_COLORS };
