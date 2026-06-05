const DAY_MS = 24 * 60 * 60 * 1000

export const CATEGORY_COLORS = {
  Electrónica: '#3B82F6',
  Ropa: '#8B5CF6',
  Hogar: '#F59E0B',
  Alimentos: '#10B981',
  Deportes: '#EF4444',
}

export const PERIOD_OPTIONS = [
  { id: 'last7', label: 'Últimos 7 días' },
  { id: 'thisMonth', label: 'Este mes' },
  { id: 'last3Months', label: 'Últimos 3 meses' },
]

const parseSaleDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const addDays = (date, days) => new Date(date.getTime() + days * DAY_MS)

const getDaysBetween = (startDate, endDate) =>
  Math.floor((endDate - startDate) / DAY_MS) + 1

export const getReferenceDate = (salesData) =>
  salesData.reduce((latest, sale) => {
    const saleDate = parseSaleDate(sale.fecha)
    return saleDate > latest ? saleDate : latest
  }, parseSaleDate(salesData[0].fecha))

export const getRangeFromPeriod = (periodId, referenceDate) => {
  const endDate = new Date(referenceDate)

  if (periodId === 'last7') {
    return { startDate: addDays(endDate, -6), endDate }
  }

  if (periodId === 'last3Months') {
    return {
      startDate: new Date(
        endDate.getFullYear(),
        endDate.getMonth() - 2,
        1
      ),
      endDate,
    }
  }

  return {
    startDate: new Date(endDate.getFullYear(), endDate.getMonth(), 1),
    endDate,
  }
}

export const getPreviousRange = (range) => {
  const days = getDaysBetween(range.startDate, range.endDate)
  const prevEndDate = addDays(range.startDate, -1)
  const prevStartDate = addDays(prevEndDate, -(days - 1))
  return { startDate: prevStartDate, endDate: prevEndDate }
}

export const filterSalesByRange = (salesData, range) =>
  salesData.filter((sale) => {
    const saleDate = parseSaleDate(sale.fecha)
    return saleDate >= range.startDate && saleDate <= range.endDate
  })

export const summarizeSales = (sales) => {
  const totalSales = sales.reduce((acc, sale) => acc + sale.monto, 0)
  const transactions = sales.length
  const avgTicket = transactions === 0 ? 0 : totalSales / transactions

  return { totalSales, transactions, avgTicket }
}

export const percentChange = (current, previous) => {
  if (previous === 0) {
    return current === 0 ? 0 : 100
  }
  return ((current - previous) / previous) * 100
}

export const getSellerStats = (sales, previousSales, team) => {
  const sellerMap = new Map(
    team.map((member) => [
      member.nombre,
      {
        seller: member.nombre,
        color: member.color,
        totalSales: 0,
        transactions: 0,
      },
    ])
  )

  for (const sale of sales) {
    const row = sellerMap.get(sale.vendedor)
    if (!row) continue
    row.totalSales += sale.monto
    row.transactions += 1
  }

  const previousBySeller = previousSales.reduce((acc, sale) => {
    acc[sale.vendedor] = (acc[sale.vendedor] ?? 0) + sale.monto
    return acc
  }, {})

  const teamTotal = sales.reduce((acc, sale) => acc + sale.monto, 0)

  return Array.from(sellerMap.values()).map((row) => {
    const avgTicket = row.transactions === 0 ? 0 : row.totalSales / row.transactions
    const previous = previousBySeller[row.seller] ?? 0
    const changePct = percentChange(row.totalSales, previous)
    const sharePct = teamTotal === 0 ? 0 : (row.totalSales / teamTotal) * 100

    return {
      ...row,
      avgTicket,
      changePct,
      sharePct,
    }
  })
}

export const getCategoryStats = (sales) => {
  const totals = sales.reduce((acc, sale) => {
    acc[sale.categoria] = (acc[sale.categoria] ?? 0) + sale.monto
    return acc
  }, {})

  const totalSales = sales.reduce((acc, sale) => acc + sale.monto, 0)

  return Object.entries(totals)
    .map(([name, amount]) => ({
      name,
      amount,
      percent: totalSales === 0 ? 0 : (amount / totalSales) * 100,
      color: CATEGORY_COLORS[name] ?? '#94A3B8',
    }))
    .sort((a, b) => b.amount - a.amount)
}
