import { useMemo, useState } from 'react'
import salesData from '../data/sales.json'
import teamData from '../data/team.json'
import config from '../data/config.json'
import Header from './components/Header.jsx'
import PeriodFilter from './components/PeriodFilter.jsx'
import KPICards from './components/KPICards.jsx'
import SalesTable from './components/SalesTable.jsx'
import CategoryBreakdown from './components/CategoryBreakdown.jsx'

const CATEGORY_COLORS = {
  Electrónica: '#3B82F6',
  Ropa: '#8B5CF6',
  Hogar: '#F59E0B',
  Alimentos: '#10B981',
  Deportes: '#EF4444',
}

const PERIODS = [
  { key: 'last7', label: 'Últimos 7 días' },
  { key: 'month', label: 'Este mes' },
  { key: 'last3Months', label: 'Últimos 3 meses' },
]

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function parseDate(dateString) {
  return new Date(`${dateString}T00:00:00`)
}

function addDays(date, days) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}

function addMonths(date, months) {
  const nextDate = new Date(date)
  nextDate.setMonth(nextDate.getMonth() + months)
  return nextDate
}

function firstDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function clampToMonthDay(year, month, day) {
  const lastDay = new Date(year, month + 1, 0).getDate()
  return new Date(year, month, Math.min(day, lastDay))
}

function getRange(periodKey, referenceDate) {
  if (periodKey === 'last7') {
    return {
      start: addDays(referenceDate, -6),
      end: referenceDate,
    }
  }

  if (periodKey === 'last3Months') {
    return {
      start: addMonths(firstDayOfMonth(referenceDate), -2),
      end: referenceDate,
    }
  }

  return {
    start: firstDayOfMonth(referenceDate),
    end: referenceDate,
  }
}

function getPreviousRange(periodKey, currentRange) {
  if (periodKey === 'last7') {
    const end = addDays(currentRange.start, -1)
    return {
      start: addDays(end, -6),
      end,
    }
  }

  if (periodKey === 'last3Months') {
    return {
      start: addMonths(currentRange.start, -3),
      end: addMonths(currentRange.end, -3),
    }
  }

  const previousStartSeed = addMonths(currentRange.start, -1)
  return {
    start: firstDayOfMonth(previousStartSeed),
    end: clampToMonthDay(previousStartSeed.getFullYear(), previousStartSeed.getMonth(), currentRange.end.getDate()),
  }
}

function isWithinRange(sale, range) {
  const date = parseDate(sale.fecha)
  return date >= range.start && date <= range.end
}

function sumSales(sales) {
  return sales.reduce((total, sale) => total + sale.monto, 0)
}

function safeAverage(total, count) {
  return count === 0 ? 0 : total / count
}

function percentageChange(currentValue, previousValue) {
  if (previousValue === 0) {
    return currentValue === 0 ? 0 : 100
  }

  return ((currentValue - previousValue) / previousValue) * 100
}

function formatRange(range) {
  const start = `${range.start.getDate()} ${MONTH_LABELS[range.start.getMonth()]}`
  const end = `${range.end.getDate()} ${MONTH_LABELS[range.end.getMonth()]} ${range.end.getFullYear()}`
  return `${start} - ${end}`
}

function buildSellerMetrics(team, currentSales, previousSales, totalSales) {
  return team.map((seller) => {
    const sellerSales = currentSales.filter((sale) => sale.vendedor === seller.nombre)
    const sellerPreviousSales = previousSales.filter((sale) => sale.vendedor === seller.nombre)
    const sales = sumSales(sellerSales)
    const previousTotal = sumSales(sellerPreviousSales)
    const transactions = sellerSales.length

    return {
      name: seller.nombre,
      color: seller.color,
      sales,
      transactions,
      averageTicket: safeAverage(sales, transactions),
      change: percentageChange(sales, previousTotal),
      share: totalSales === 0 ? 0 : (sales / totalSales) * 100,
    }
  })
}

function buildCategoryMetrics(currentSales, totalSales) {
  return Object.entries(CATEGORY_COLORS)
    .map(([name, color]) => {
      const sales = sumSales(currentSales.filter((sale) => sale.categoria === name))

      return {
        name,
        color,
        sales,
        percentage: totalSales === 0 ? 0 : (sales / totalSales) * 100,
      }
    })
    .sort((first, second) => second.sales - first.sales)
}

function App() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [sortConfig, setSortConfig] = useState({ column: 'sales', direction: 'desc' })

  const referenceDate = useMemo(() => {
    const timestamps = salesData.map((sale) => parseDate(sale.fecha).getTime())
    return new Date(Math.max(...timestamps))
  }, [])

  const dashboardData = useMemo(() => {
    const currentRange = getRange(selectedPeriod, referenceDate)
    const previousRange = getPreviousRange(selectedPeriod, currentRange)
    const currentSales = salesData.filter((sale) => isWithinRange(sale, currentRange))
    const previousSales = salesData.filter((sale) => isWithinRange(sale, previousRange))
    const totalSales = sumSales(currentSales)
    const previousTotalSales = sumSales(previousSales)
    const transactions = currentSales.length
    const previousTransactions = previousSales.length
    const averageTicket = safeAverage(totalSales, transactions)
    const previousAverageTicket = safeAverage(previousTotalSales, previousTransactions)
    const goalProgress = (totalSales / config.meta_mensual) * 100

    const sellerMetrics = buildSellerMetrics(teamData, currentSales, previousSales, totalSales)
    const categories = buildCategoryMetrics(currentSales, totalSales)

    return {
      currentRange,
      previousRange,
      kpis: [
        {
          id: 'sales',
          title: 'Ventas totales del mes',
          icon: '💰',
          value: totalSales,
          valueType: 'currency',
          change: percentageChange(totalSales, previousTotalSales),
        },
        {
          id: 'transactions',
          title: 'Número de transacciones',
          icon: '🛒',
          value: transactions,
          valueType: 'number',
          change: percentageChange(transactions, previousTransactions),
        },
        {
          id: 'average',
          title: 'Ticket promedio',
          icon: '📊',
          value: averageTicket,
          valueType: 'currency',
          change: percentageChange(averageTicket, previousAverageTicket),
        },
        {
          id: 'goal',
          title: 'Meta del mes',
          icon: '🎯',
          value: goalProgress,
          valueType: 'goal',
          goal: config.meta_mensual,
          sales: totalSales,
        },
      ],
      sellerMetrics,
      categories,
      totals: {
        sales: totalSales,
        transactions,
        averageTicket,
      },
    }
  }, [referenceDate, selectedPeriod])

  function handleSort(column) {
    setSortConfig((currentSort) => {
      if (currentSort.column === column) {
        return {
          column,
          direction: currentSort.direction === 'desc' ? 'asc' : 'desc',
        }
      }

      return { column, direction: 'desc' }
    })
  }

  const sortedSellers = useMemo(() => {
    const direction = sortConfig.direction === 'asc' ? 1 : -1

    return [...dashboardData.sellerMetrics].sort((first, second) => {
      if (sortConfig.column === 'name') {
        return first.name.localeCompare(second.name, 'es') * direction
      }

      return (first[sortConfig.column] - second[sortConfig.column]) * direction
    })
  }, [dashboardData.sellerMetrics, sortConfig])

  const topSellerName = useMemo(() => {
    return [...dashboardData.sellerMetrics].sort((first, second) => second.sales - first.sales)[0]?.name
  }, [dashboardData.sellerMetrics])

  return (
    <div className="app-shell">
      <Header teamName={config.nombre_equipo} currentDate={new Date()} />

      <main className="dashboard">
        <PeriodFilter
          periods={PERIODS}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          rangeLabel={formatRange(dashboardData.currentRange)}
        />

        <KPICards kpis={dashboardData.kpis} />

        <section className="dashboard-grid" aria-label="Métricas detalladas de ventas">
          <SalesTable
            sellers={sortedSellers}
            totals={dashboardData.totals}
            sortConfig={sortConfig}
            onSort={handleSort}
            topSellerName={topSellerName}
          />
          <CategoryBreakdown categories={dashboardData.categories} />
        </section>
      </main>
    </div>
  )
}

export default App
