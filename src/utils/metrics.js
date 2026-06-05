export const PERIODS = [
  { key: 'last7', label: 'Últimos 7 días' },
  { key: 'month', label: 'Este mes' },
  { key: 'quarter', label: 'Últimos 3 meses' },
];

export const CATEGORY_COLORS = {
  Electrónica: '#3B82F6',
  Ropa: '#8B5CF6',
  Hogar: '#F59E0B',
  Alimentos: '#10B981',
  Deportes: '#EF4444',
};

const MONTHS_SHORT = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

export function parseDate(dateString) {
  return new Date(`${dateString}T00:00:00`);
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfDay(date) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function addMonths(date, months) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
}

function daysBetween(startDate, endDate) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((endDate - startDate) / millisecondsPerDay);
}

export function getReferenceDate(transactions) {
  return transactions.reduce((latestDate, transaction) => {
    const transactionDate = parseDate(transaction.fecha);
    return transactionDate > latestDate ? transactionDate : latestDate;
  }, parseDate(transactions[0].fecha));
}

export function getPeriodRange(periodKey, referenceDate) {
  const end = startOfDay(referenceDate);

  if (periodKey === 'last7') {
    return {
      start: addDays(end, -6),
      end,
    };
  }

  if (periodKey === 'quarter') {
    return {
      start: addDays(addMonths(end, -3), 1),
      end,
    };
  }

  return {
    start: new Date(end.getFullYear(), end.getMonth(), 1),
    end,
  };
}

export function getPreviousRange(periodKey, range) {
  if (periodKey === 'month') {
    const previousMonthStart = new Date(
      range.start.getFullYear(),
      range.start.getMonth() - 1,
      1,
    );
    const previousMonthEnd = new Date(
      range.end.getFullYear(),
      range.end.getMonth() - 1,
      range.end.getDate(),
    );

    return {
      start: previousMonthStart,
      end: previousMonthEnd,
    };
  }

  const inclusiveDays = daysBetween(range.start, range.end) + 1;

  return {
    start: addDays(range.start, -inclusiveDays),
    end: addDays(range.end, -inclusiveDays),
  };
}

export function filterTransactionsByRange(transactions, range) {
  return transactions.filter((transaction) => {
    const transactionDate = parseDate(transaction.fecha);
    return transactionDate >= range.start && transactionDate <= range.end;
  });
}

export function summarizeTransactions(transactions) {
  const sales = transactions.reduce(
    (total, transaction) => total + transaction.monto,
    0,
  );
  const transactionsCount = transactions.length;
  const averageTicket = transactionsCount > 0 ? sales / transactionsCount : 0;

  return {
    sales,
    transactions: transactionsCount,
    averageTicket,
  };
}

export function calculateChange(currentValue, previousValue) {
  if (previousValue === 0) {
    return currentValue === 0 ? 0 : null;
  }

  return ((currentValue - previousValue) / previousValue) * 100;
}

export function buildSellerRows(team, currentTransactions, previousTransactions) {
  const currentTotal = summarizeTransactions(currentTransactions).sales;

  return team.map((seller) => {
    const currentSellerTransactions = currentTransactions.filter(
      (transaction) => transaction.vendedor === seller.nombre,
    );
    const previousSellerTransactions = previousTransactions.filter(
      (transaction) => transaction.vendedor === seller.nombre,
    );
    const currentSummary = summarizeTransactions(currentSellerTransactions);
    const previousSummary = summarizeTransactions(previousSellerTransactions);

    return {
      seller: seller.nombre,
      color: seller.color,
      sales: currentSummary.sales,
      transactions: currentSummary.transactions,
      averageTicket: currentSummary.averageTicket,
      change: calculateChange(currentSummary.sales, previousSummary.sales),
      teamShare:
        currentTotal > 0 ? (currentSummary.sales / currentTotal) * 100 : 0,
    };
  });
}

export function buildCategoryRows(currentTransactions) {
  const currentTotal = summarizeTransactions(currentTransactions).sales;
  const categoryTotals = currentTransactions.reduce((totals, transaction) => {
    totals[transaction.categoria] =
      (totals[transaction.categoria] || 0) + transaction.monto;
    return totals;
  }, {});

  return Object.entries(categoryTotals)
    .map(([category, sales]) => ({
      category,
      sales,
      color: CATEGORY_COLORS[category],
      share: currentTotal > 0 ? (sales / currentTotal) * 100 : 0,
    }))
    .sort((first, second) => second.sales - first.sales);
}

export function formatCurrency(value, maximumFractionDigits = 0) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits,
  });
}

export function formatNumber(value) {
  return value.toLocaleString('en-US');
}

export function formatPercent(value, digits = 1) {
  if (value === null) {
    return 'N/D';
  }

  return `${value > 0 ? '+' : ''}${value.toFixed(digits)}%`;
}

function formatDate(date, includeYear = false) {
  const formattedDate = `${date.getDate()} ${
    MONTHS_SHORT[date.getMonth()]
  }`;
  return includeYear ? `${formattedDate} ${date.getFullYear()}` : formattedDate;
}

export function formatPeriodRange(range) {
  const sameYear = range.start.getFullYear() === range.end.getFullYear();
  const startLabel = formatDate(range.start, !sameYear);
  const endLabel = formatDate(range.end, true);

  return `${startLabel} - ${endLabel}`;
}

export function formatDateLong(date) {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function getDateInputValue(date) {
  return toDateKey(date);
}
