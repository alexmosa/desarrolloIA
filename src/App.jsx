import { useMemo, useState } from 'react';
import salesData from '../data/sales.json';
import teamData from '../data/team.json';
import configData from '../data/config.json';
import Header from './components/Header';
import PeriodFilter from './components/PeriodFilter';
import KPICards from './components/KPICards';
import SalesTable from './components/SalesTable';
import CategoryBreakdown from './components/CategoryBreakdown';
import {
  PERIOD_PRESETS,
  computeCategoryBreakdown,
  computePeriodMetrics,
  computeSellerRows,
  formatPeriodLabel,
  getPeriodRange,
  getReferenceDate,
} from './utils/salesUtils';

export default function App() {
  const referenceDate = getReferenceDate();
  const [activePeriod, setActivePeriod] = useState(PERIOD_PRESETS.thisMonth);

  const { start, end } = useMemo(
    () => getPeriodRange(activePeriod, referenceDate),
    [activePeriod, referenceDate]
  );

  const periodLabel = useMemo(
    () => formatPeriodLabel(start, end),
    [start, end]
  );

  const metrics = useMemo(
    () => computePeriodMetrics(salesData, start, end),
    [start, end]
  );

  const sellerRows = useMemo(() => {
    const rows = computeSellerRows(salesData, teamData, start, end);
    return rows.sort((a, b) => b.ventas - a.ventas);
  }, [start, end]);

  const categories = useMemo(
    () => computeCategoryBreakdown(salesData, start, end),
    [start, end]
  );

  const isThisMonth = activePeriod === PERIOD_PRESETS.thisMonth;

  return (
    <div className="app">
      <Header teamName={configData.nombre_equipo} currentDate={referenceDate} />
      <main className="main">
        <PeriodFilter
          activePeriod={activePeriod}
          onPeriodChange={setActivePeriod}
          periodLabel={periodLabel}
        />
        <KPICards
          metrics={metrics}
          metaMensual={configData.meta_mensual}
          isThisMonth={isThisMonth}
        />
        <div className="dashboard-grid">
          <SalesTable sellerRows={sellerRows} />
          <CategoryBreakdown categories={categories} />
        </div>
      </main>
    </div>
  );
}
