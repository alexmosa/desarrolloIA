export const CATEGORY_COLORS = {
  Electrónica: '#3B82F6',
  Ropa: '#8B5CF6',
  Hogar: '#F59E0B',
  Alimentos: '#10B981',
  Deportes: '#EF4444',
};

export const PERIOD_OPTIONS = [
  { id: 'last7', label: 'Últimos 7 días' },
  { id: 'month', label: 'Este mes' },
  { id: 'last3months', label: 'Últimos 3 meses' },
];

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function parseDate(dateValue) {
  const [year, month, day] = dateValue.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
}

export function addDays(date, amount) {
  return new Date(date.getTime() + amount * DAY_IN_MS);
}

export function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, date.getDate(), 12);
}

export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12);
}

export function formatCurrency(value, options = {}) {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = minimumFractionDigits,
  } = options;

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits,
  });
}

export function formatInteger(value) {
  return Math.round(value).toLocaleString('en-US');
}

export function formatPercent(value) {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export function getDeltaDirection(value) {
  return value >= 0 ? 'positive' : 'negative';
}

export function getReferenceDate(sales) {
  return sales.reduce((latestDate, sale) => {
    const saleDate = parseDate(sale.fecha);
    return saleDate > latestDate ? saleDate : latestDate;
  }, parseDate(sales[0].fecha));
}

export function getPeriodDateRange(period, referenceDate) {
  if (period === 'last7') {
    const start = addDays(referenceDate, -6);
    const end = referenceDate;

    return {
      current: { start, end },
      previous: {
        start: addDays(start, -7),
        end: addDays(end, -7),
      },
    };
  }

  if (period === 'last3months') {
    return {
      current: {
        start: startOfMonth(addMonths(referenceDate, -2)),
        end: referenceDate,
      },
      previous: {
        start: startOfMonth(addMonths(referenceDate, -5)),
        end: addMonths(referenceDate, -3),
      },
    };
  }

  return {
    current: {
      start: startOfMonth(referenceDate),
      end: referenceDate,
    },
    previous: {
      start: startOfMonth(addMonths(referenceDate, -1)),
      end: addMonths(referenceDate, -1),
    },
  };
}

export function formatShortDate(date) {
  return `${date.getDate()} ${MONTH_LABELS[date.getMonth()]}`;
}

export function formatLongDate(date) {
  return `${date.getDate()} ${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatRangeLabel(start, end) {
  return `${formatShortDate(start)} - ${formatLongDate(end)}`;
}

export function isDateInRange(date, range) {
  return date >= range.start && date <= range.end;
}

export function filterSalesByRange(sales, range) {
  return sales.filter((sale) => isDateInRange(parseDate(sale.fecha), range));
}

export function calculatePercentageChange(currentValue, previousValue) {
  if (previousValue === 0) {
    return currentValue === 0 ? 0 : 100;
  }

  return ((currentValue - previousValue) / previousValue) * 100;
}

export function summarizeSales(sales) {
  const totalSales = sales.reduce((sum, sale) => sum + sale.monto, 0);
  const transactions = sales.length;

  return {
    totalSales,
    transactions,
    averageTicket: transactions > 0 ? totalSales / transactions : 0,
  };
}

export function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export function buildSellerRows(team, currentSales, previousSales) {
  const previousTotals = previousSales.reduce((accumulator, sale) => {
    accumulator[sale.vendedor] = (accumulator[sale.vendedor] || 0) + sale.monto;
    return accumulator;
  }, {});

  const rows = team.map((member) => ({
    name: member.nombre,
    color: member.color,
    initials: getInitials(member.nombre),
    totalSales: 0,
    transactions: 0,
    averageTicket: 0,
    previousTotalSales: previousTotals[member.nombre] || 0,
    change: 0,
    share: 0,
  }));

  const rowByName = rows.reduce((accumulator, row) => {
    accumulator[row.name] = row;
    return accumulator;
  }, {});

  currentSales.forEach((sale) => {
    const row = rowByName[sale.vendedor];
    if (!row) {
      return;
    }

    row.totalSales += sale.monto;
    row.transactions += 1;
  });

  const totalTeamSales = rows.reduce((sum, row) => sum + row.totalSales, 0);

  return rows.map((row) => {
    const averageTicket = row.transactions > 0 ? row.totalSales / row.transactions : 0;
    return {
      ...row,
      averageTicket,
      change: calculatePercentageChange(row.totalSales, row.previousTotalSales),
      share: totalTeamSales > 0 ? (row.totalSales / totalTeamSales) * 100 : 0,
    };
  });
}

export function buildCategoryRows(sales) {
  const totalSales = sales.reduce((sum, sale) => sum + sale.monto, 0);
  const categories = Object.keys(CATEGORY_COLORS).map((category) => ({
    category,
    totalSales: 0,
    percentage: 0,
    color: CATEGORY_COLORS[category],
  }));

  const categoryMap = categories.reduce((accumulator, row) => {
    accumulator[row.category] = row;
    return accumulator;
  }, {});

  sales.forEach((sale) => {
    if (categoryMap[sale.categoria]) {
      categoryMap[sale.categoria].totalSales += sale.monto;
    }
  });

  return categories
    .map((row) => ({
      ...row,
      percentage: totalSales > 0 ? (row.totalSales / totalSales) * 100 : 0,
    }))
    .sort((left, right) => right.totalSales - left.totalSales);
}
