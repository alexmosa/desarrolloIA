import { useMemo, useState } from 'react'
import './App.css'
import CategoryBreakdown from './components/CategoryBreakdown'
import Header from './components/Header'
import KPICards from './components/KPICards'
import PeriodFilter from './components/PeriodFilter'
import SalesTable from './components/SalesTable'
import config from '../data/config.json'
import salesData from '../data/sales.json'
import teamData from '../data/team.json'
import {
  CATEGORY_COLORS,
  filterTransactionsByDate,
  formatDateRangeLabel,
  getAverageTicket,
  getChangePercentage,
  getPreviousRange,
  getRangeForPeriod,
  parseISODate,
  sumSales,
} from './utils/metrics'

function App() {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth')
  const [sortColumn, setSortColumn] = useState('sales')
  const [sortDirection, setSortDirection] = useState('desc')

  const transactions = useMemo(
    () =>
      salesData.map((transaction) => ({
        ...transaction,
        date: parseISODate(transaction.fecha),
      })),
    [],
  )

  const referenceDate = useMemo(() => {
    if (transactions.length === 0) return new Date()
    return new Date(Math.max(...transactions.map((tx) => tx.date.getTime())))
  }, [transactions])

  const dateLabel = useMemo(
    () =>
      new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    [],
  )

  const selectedRange = useMemo(
    () => getRangeForPeriod(selectedPeriod, referenceDate),
    [selectedPeriod, referenceDate],
  )

  const previousRange = useMemo(() => getPreviousRange(selectedRange), [selectedRange])

  const currentTransactions = useMemo(
    () => filterTransactionsByDate(transactions, selectedRange.start, selectedRange.end),
    [transactions, selectedRange],
  )

  const previousTransactions = useMemo(
    () => filterTransactionsByDate(transactions, previousRange.start, previousRange.end),
    [transactions, previousRange],
  )

  const summary = useMemo(() => {
    const totalSales = sumSales(currentTransactions)
    const previousTotalSales = sumSales(previousTransactions)
    const totalTransactions = currentTransactions.length
    const previousTransactionsCount = previousTransactions.length
    const avgTicket = getAverageTicket(totalSales, totalTransactions)
    const previousAvgTicket = getAverageTicket(previousTotalSales, previousTransactionsCount)

    return {
      totalSales,
      totalTransactions,
      avgTicket,
      salesChange: getChangePercentage(totalSales, previousTotalSales),
      transactionsChange: getChangePercentage(totalTransactions, previousTransactionsCount),
      ticketChange: getChangePercentage(avgTicket, previousAvgTicket),
      previousTotalSales,
    }
  }, [currentTransactions, previousTransactions])

  const { sellerRows, topSeller } = useMemo(() => {
    const currentBySeller = new Map(
      teamData.map((member) => [
        member.nombre,
        {
          seller: member.nombre,
          color: member.color,
          sales: 0,
          transactions: 0,
          avgTicket: 0,
          previousSales: 0,
          change: null,
          share: 0,
        },
      ]),
    )

    const previousBySeller = new Map()

    for (const tx of currentTransactions) {
      if (!currentBySeller.has(tx.vendedor)) {
        currentBySeller.set(tx.vendedor, {
          seller: tx.vendedor,
          color: '#94A3B8',
          sales: 0,
          transactions: 0,
          avgTicket: 0,
          previousSales: 0,
          change: null,
          share: 0,
        })
      }

      const sellerMetrics = currentBySeller.get(tx.vendedor)
      sellerMetrics.sales += tx.monto
      sellerMetrics.transactions += 1
    }

    for (const tx of previousTransactions) {
      previousBySeller.set(tx.vendedor, (previousBySeller.get(tx.vendedor) ?? 0) + tx.monto)
    }

    const rows = Array.from(currentBySeller.values()).map((row) => {
      const previousSales = previousBySeller.get(row.seller) ?? 0
      const avgTicket = getAverageTicket(row.sales, row.transactions)
      const share = summary.totalSales === 0 ? 0 : (row.sales / summary.totalSales) * 100

      return {
        ...row,
        avgTicket,
        previousSales,
        change: getChangePercentage(row.sales, previousSales),
        share,
      }
    })

    const salesRanking = [...rows].sort((a, b) => b.sales - a.sales)
    const topPerformer = salesRanking[0]?.seller ?? null

    rows.sort((a, b) => {
      if (sortColumn === 'seller') {
        const alphabeticalOrder = a.seller.localeCompare(b.seller, 'es')
        return sortDirection === 'asc' ? alphabeticalOrder : -alphabeticalOrder
      }

      const aValue = a[sortColumn] ?? 0
      const bValue = b[sortColumn] ?? 0
      if (aValue === bValue) return b.sales - a.sales

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    })

    return { sellerRows: rows, topSeller: topPerformer }
  }, [currentTransactions, previousTransactions, sortColumn, sortDirection, summary.totalSales])

  const totalsRow = useMemo(
    () => ({
      sales: summary.totalSales,
      transactions: summary.totalTransactions,
      avgTicket: summary.avgTicket,
      change: getChangePercentage(summary.totalSales, summary.previousTotalSales),
    }),
    [summary],
  )

  const categories = useMemo(() => {
    const salesByCategory = new Map(Object.keys(CATEGORY_COLORS).map((name) => [name, 0]))

    for (const tx of currentTransactions) {
      salesByCategory.set(tx.categoria, (salesByCategory.get(tx.categoria) ?? 0) + tx.monto)
    }

    return Array.from(salesByCategory.entries())
      .map(([name, sales]) => ({
        name,
        sales,
        color: CATEGORY_COLORS[name] ?? '#64748B',
        percent: summary.totalSales === 0 ? 0 : (sales / summary.totalSales) * 100,
      }))
      .sort((a, b) => b.sales - a.sales)
  }, [currentTransactions, summary.totalSales])

  const leaderCategory = categories.find((category) => category.sales > 0) ?? null

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((current) => (current === 'desc' ? 'asc' : 'desc'))
      return
    }

    setSortColumn(column)
    setSortDirection('desc')
  }

  return (
    <div className="app-shell">
      <Header teamName={config.nombre_equipo} currentDateLabel={dateLabel} />
      <PeriodFilter
        selectedPeriod={selectedPeriod}
        onSelectPeriod={setSelectedPeriod}
        rangeLabel={formatDateRangeLabel(selectedRange.start, selectedRange.end)}
      />
      <KPICards summary={summary} monthlyGoal={config.meta_mensual} />

      <div className="dashboard-content">
        <div className="primary-panel">
          <SalesTable
            rows={sellerRows}
            totals={totalsRow}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            topSeller={topSeller}
          />
        </div>
        <div className="secondary-panel">
          <CategoryBreakdown categories={categories} leader={leaderCategory} />
        </div>
      </div>
    </div>
  )
}

export default App
