import { useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import PeriodFilter from './components/PeriodFilter.jsx'
import KPICards from './components/KPICards.jsx'
import SalesTable from './components/SalesTable.jsx'
import CategoryBreakdown from './components/CategoryBreakdown.jsx'
import {
  getPeriodRange,
  getPreviousRange,
  filterByRange,
  computeKPIs,
  computeVendors,
  computeCategories,
  parseDate,
} from './utils/calculations.js'

// Datos mockeados (solo lectura) cargados desde la carpeta data/.
import sales from '../data/sales.json'
import team from '../data/team.json'
import config from '../data/config.json'

// La fecha de referencia (config) se trata como "hoy" para que las vistas
// por período siempre muestren datos significativos.
const referenceDate = parseDate(config.fecha_referencia)

export default function App() {
  const [period, setPeriod] = useState('month')

  const data = useMemo(() => {
    const range = getPeriodRange(period, referenceDate)
    const prevRange = getPreviousRange(range)

    const current = filterByRange(sales, range)
    const previous = filterByRange(sales, prevRange)

    return {
      range,
      kpis: computeKPIs(current, previous, config.meta_mensual),
      vendors: computeVendors(current, previous, team),
      categories: computeCategories(current),
    }
  }, [period])

  return (
    <div className="app">
      <Header teamName={config.nombre_equipo} currentDate={referenceDate} />

      <main className="container">
        <PeriodFilter
          activePeriod={period}
          onChange={setPeriod}
          range={data.range}
        />

        <KPICards kpis={data.kpis} />

        <div className="main-grid">
          <SalesTable vendors={data.vendors} />
          <CategoryBreakdown categories={data.categories} />
        </div>
      </main>
    </div>
  )
}
