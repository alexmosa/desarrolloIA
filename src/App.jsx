import { useMemo, useState } from 'react'
import Header from './components/Header'
import PeriodFilter from './components/PeriodFilter'
import KPICards from './components/KPICards'
import SalesTable from './components/SalesTable'
import CategoryBreakdown from './components/CategoryBreakdown'
import salesData from '../data/sales.json'
import teamData from '../data/team.json'
import config from '../data/config.json'
import {
  filterSalesByRange,
  getCategoryStats,
  getPreviousRange,
  getRangeFromPeriod,
  getReferenceDate,
  getSellerStats,
  percentChange,
  summarizeSales,
} from './utils/metrics'

const sortRows = (rows, column, direction) => {
  const directionFactor = direction === 'asc' ? 1 : -1

  return [...rows].sort((a, b) => {
    if (column === 'seller') {
      return a.seller.localeCompare(b.seller) * directionFactor
    }
    return (a[column] - b[column]) * directionFactor
  })
}

function App() {
  const [period, setPeriod] = useState('thisMonth')
  const [sortColumn, setSortColumn] = useState('totalSales')
  const [sortDirection, setSortDirection] = useState('desc')

  const referenceDate = useMemo(() => getReferenceDate(salesData), [])

  const range = useMemo(
    () => getRangeFromPeriod(period, referenceDate),
    [period, referenceDate]
  )

  const previousRange = useMemo(() => getPreviousRange(range), [range])

  const filteredSales = useMemo(
    () => filterSalesByRange(salesData, range),
    [range]
  )

  const previousSales = useMemo(
    () => filterSalesByRange(salesData, previousRange),
    [previousRange]
  )

  const currentSummary = useMemo(() => summarizeSales(filteredSales), [filteredSales])
  const previousSummary = useMemo(() => summarizeSales(previousSales), [previousSales])

  const summary = useMemo(
    () => ({
      current: currentSummary,
      comparison: {
        totalSales: percentChange(
          currentSummary.totalSales,
          previousSummary.totalSales
        ),
        transactions: percentChange(
          currentSummary.transactions,
          previousSummary.transactions
        ),
        avgTicket: percentChange(currentSummary.avgTicket, previousSummary.avgTicket),
      },
      goalPercent:
        config.meta_mensual === 0
          ? 0
          : (currentSummary.totalSales / config.meta_mensual) * 100,
    }),
    [currentSummary, previousSummary]
  )

  const sellerRows = useMemo(
    () => getSellerStats(filteredSales, previousSales, teamData),
    [filteredSales, previousSales]
  )

  const sortedRows = useMemo(
    () => sortRows(sellerRows, sortColumn, sortDirection),
    [sellerRows, sortColumn, sortDirection]
  )

  const topSeller = useMemo(
    () =>
      [...sellerRows].sort((a, b) => b.totalSales - a.totalSales)[0]?.seller ?? null,
    [sellerRows]
  )

  const categoryStats = useMemo(() => getCategoryStats(filteredSales), [filteredSales])

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'))
      return
    }
    setSortColumn(column)
    setSortDirection('desc')
  }

  return (
    <div className="dashboard">
      <Header teamName={config.nombre_equipo} date={new Date()} />
      <PeriodFilter
        selectedPeriod={period}
        onChangePeriod={setPeriod}
        range={range}
      />
      <KPICards summary={summary} config={config} />
      <section className="content-grid">
        <SalesTable
          rows={sortedRows}
          totals={currentSummary}
          topSeller={topSeller}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
        <CategoryBreakdown categories={categoryStats} />
      </section>
    </div>
  )
}

export default App
