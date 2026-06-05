import { useMemo, useState } from 'react'
import sales from '../data/sales.json'
import team from '../data/team.json'
import config from '../data/config.json'
import { CATEGORY_COLORS } from './constants.js'
import { DEFAULT_PERIOD, getPeriodRange, filterByRange } from './utils/dates.js'
import { computeKPIs, computeVendorRows, computeCategoryBreakdown } from './utils/metrics.js'
import Header from './components/Header.jsx'
import PeriodFilter from './components/PeriodFilter.jsx'
import KPICards from './components/KPICards.jsx'
import SalesTable from './components/SalesTable.jsx'
import CategoryBreakdown from './components/CategoryBreakdown.jsx'

export default function App() {
  const [period, setPeriod] = useState(DEFAULT_PERIOD)

  // Al cambiar el período se recalcula TODO: KPIs, tabla y categorías.
  const view = useMemo(() => {
    const range = getPeriodRange(period, config.fecha_referencia)
    const currentTxs = filterByRange(sales, range.current)
    const previousTxs = filterByRange(sales, range.previous)

    return {
      range,
      kpis: computeKPIs(currentTxs),
      prevKpis: computeKPIs(previousTxs),
      vendors: computeVendorRows(currentTxs, previousTxs, team),
      categories: computeCategoryBreakdown(currentTxs, CATEGORY_COLORS),
    }
  }, [period])

  return (
    <div className="app">
      <Header nombreEquipo={config.nombre_equipo} fechaActual={config.fecha_referencia} />

      <main className="content">
        <PeriodFilter active={period} onChange={setPeriod} range={view.range.current} />

        <KPICards kpis={view.kpis} prevKpis={view.prevKpis} meta={config.meta_mensual} />

        <div className="grid">
          <SalesTable data={view.vendors} />
          <CategoryBreakdown data={view.categories} />
        </div>
      </main>
    </div>
  )
}
