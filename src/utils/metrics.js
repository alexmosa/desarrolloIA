const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const CATEGORY_COLORS = {
  Electrónica: '#3B82F6',
  Ropa: '#8B5CF6',
  Hogar: '#F59E0B',
  Alimentos: '#10B981',
  Deportes: '#EF4444',
};

export const PERIOD_OPTIONS = [
  { key: 'last7', label: 'Últimos 7 días' },
  { key: 'month', label: 'Este mes' },
  { key: 'last3Months', label: 'Últimos 3 meses' },
];

export function parseISODate(value) {
  return new Date(`${value}T00:00:00`);
}

export function getLatestSalesDate(sales) {
  return sales.reduce((latest, sale) => {
    const saleDate = parseISODate(sale.fecha);
    return saleDate > latest ? saleDate : latest;
  }, parseISODate(sales[0].fecha));
}

export function addDays(date, amount) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getRangeLength(start, end) {
  return Math.round((end.getTime() - start.getTime()) / DAY_IN_MS) + 1;
}

export function getPeriodRange(periodKey, referenceDate) {
  const end = new Date(referenceDate);

  if (periodKey === 'last7') {
    return { start: addDays(end, -6), end };
  }

  if (periodKey === 'last3Months') {
    return { start: addDays(end, -89), end };
  }

  return { start: startOfMonth(end), end };
}

export function getPreviousPeriodRange(range) {
  const rangeLength = getRangeLength(range.start, range.end);
  const previousEnd = addDays(range.start, -1);
  const previousStart = addDays(previousEnd, -(rangeLength - 1));

  return {
    start: previousStart,
    end: previousEnd,
  };
}

export function isDateInRange(date, range) {
  return date >= range.start && date <= range.end;
}

export function filterSalesByRange(sales, range) {
  return sales.filter((sale) => isDateInRange(parseISODate(sale.fecha), range));
}

export function sumSalesAmount(sales) {
  return sales.reduce((total, sale) => total + sale.monto, 0);
}

export function getAverageTicket(totalSales, transactions) {
  if (!transactions) {
    return 0;
  }

  return totalSales / transactions;
}

export function calculateChange(currentValue, previousValue) {
  if (previousValue === 0) {
    return currentValue === 0 ? 0 : 100;
  }

  return ((currentValue - previousValue) / previousValue) * 100;
}

export function buildKpiMetrics(currentSales, previousSales, goalAmount) {
  const totalSales = sumSalesAmount(currentSales);
  const previousTotalSales = sumSalesAmount(previousSales);
  const transactions = currentSales.length;
  const previousTransactions = previousSales.length;
  const averageTicket = getAverageTicket(totalSales, transactions);
  const previousAverageTicket = getAverageTicket(
    previousTotalSales,
    previousTransactions,
  );
  const goalProgress = goalAmount ? (totalSales / goalAmount) * 100 : 0;

  return {
    totalSales: {
      value: totalSales,
      change: calculateChange(totalSales, previousTotalSales),
    },
    transactions: {
      value: transactions,
      change: calculateChange(transactions, previousTransactions),
    },
    averageTicket: {
      value: averageTicket,
      change: calculateChange(averageTicket, previousAverageTicket),
    },
    goal: {
      value: goalProgress,
      currentSales: totalSales,
      targetSales: goalAmount,
    },
  };
}

function buildSellerLookup(team) {
  return team.reduce((lookup, member) => {
    lookup[member.nombre] = member;
    return lookup;
  }, {});
}

function getSalesByKey(sales, keyName) {
  return sales.reduce((accumulator, sale) => {
    const key = sale[keyName];
    accumulator[key] = accumulator[key] || [];
    accumulator[key].push(sale);
    return accumulator;
  }, {});
}

export function buildSellerRows(currentSales, previousSales, team) {
  const currentSalesBySeller = getSalesByKey(currentSales, 'vendedor');
  const previousSalesBySeller = getSalesByKey(previousSales, 'vendedor');
  const teamLookup = buildSellerLookup(team);
  const teamTotalSales = sumSalesAmount(currentSales);

  return team.map((member) => {
    const sellerCurrentSales = currentSalesBySeller[member.nombre] || [];
    const sellerPreviousSales = previousSalesBySeller[member.nombre] || [];
    const totalSales = sumSalesAmount(sellerCurrentSales);
    const previousTotalSales = sumSalesAmount(sellerPreviousSales);
    const transactions = sellerCurrentSales.length;
    const averageTicket = getAverageTicket(totalSales, transactions);
    const share = teamTotalSales ? (totalSales / teamTotalSales) * 100 : 0;

    return {
      name: member.nombre,
      color: teamLookup[member.nombre]?.color || '#94A3B8',
      totalSales,
      transactions,
      averageTicket,
      change: calculateChange(totalSales, previousTotalSales),
      share,
    };
  });
}

export function buildCategoryRows(currentSales) {
  const totalSales = sumSalesAmount(currentSales);
  const grouped = currentSales.reduce((accumulator, sale) => {
    accumulator[sale.categoria] = (accumulator[sale.categoria] || 0) + sale.monto;
    return accumulator;
  }, {});

  return Object.entries(CATEGORY_COLORS)
    .map(([name, color]) => {
      const total = grouped[name] || 0;
      return {
        name,
        color,
        total,
        percentage: totalSales ? (total / totalSales) * 100 : 0,
      };
    })
    .sort((left, right) => right.total - left.total);
}

export function sortSellerRows(rows, sortConfig) {
  const sortableRows = [...rows];
  const direction = sortConfig.direction === 'asc' ? 1 : -1;

  sortableRows.sort((left, right) => {
    const leftValue = left[sortConfig.column];
    const rightValue = right[sortConfig.column];

    if (typeof leftValue === 'string' && typeof rightValue === 'string') {
      return leftValue.localeCompare(rightValue, 'es') * direction;
    }

    return (leftValue - rightValue) * direction;
  });

  return sortableRows;
}

export function buildSellerTotals(rows) {
  const totalSales = rows.reduce((sum, row) => sum + row.totalSales, 0);
  const totalTransactions = rows.reduce((sum, row) => sum + row.transactions, 0);

  return {
    totalSales,
    transactions: totalTransactions,
    averageTicket: getAverageTicket(totalSales, totalTransactions),
  };
}
