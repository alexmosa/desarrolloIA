import { useMemo, useState } from 'react';
import Header from './components/Header';
import PeriodFilter from './components/PeriodFilter';
import KPICards from './components/KPICards';
import SalesTable from './components/SalesTable';
import CategoryBreakdown from './components/CategoryBreakdown';
import config from '../data/config.json';
import salesData from '../data/sales.json';
import teamData from '../data/team.json';
import { formatDateRange } from './utils/formatters';
import {
  PERIOD_OPTIONS,
  buildCategoryRows,
  buildKpiMetrics,
  buildSellerRows,
  buildSellerTotals,
  filterSalesByRange,
  getLatestSalesDate,
  getPeriodRange,
  getPreviousPeriodRange,
  sortSellerRows,
} from './utils/metrics';

export default function App() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [sortConfig, setSortConfig] = useState({
    column: 'totalSales',
    direction: 'desc',
  });

  const referenceDate = useMemo(() => getLatestSalesDate(salesData), []);

  const currentRange = useMemo(
    () => getPeriodRange(selectedPeriod, referenceDate),
    [referenceDate, selectedPeriod],
  );

  const previousRange = useMemo(
    () => getPreviousPeriodRange(currentRange),
    [currentRange],
  );

  const currentSales = useMemo(
    () => filterSalesByRange(salesData, currentRange),
    [currentRange],
  );

  const previousSales = useMemo(
    () => filterSalesByRange(salesData, previousRange),
    [previousRange],
  );

  const kpis = useMemo(
    () => buildKpiMetrics(currentSales, previousSales, config.meta_mensual),
    [currentSales, previousSales],
  );

  const sellerRows = useMemo(
    () => buildSellerRows(currentSales, previousSales, teamData),
    [currentSales, previousSales],
  );

  const sortedSellerRows = useMemo(
    () => sortSellerRows(sellerRows, sortConfig),
    [sellerRows, sortConfig],
  );

  const topSellerName = useMemo(() => {
    const [topSeller] = [...sellerRows].sort(
      (left, right) => right.totalSales - left.totalSales,
    );

    return topSeller?.name || '';
  }, [sellerRows]);

  const sellerTotals = useMemo(
    () => buildSellerTotals(sellerRows),
    [sellerRows],
  );

  const categoryRows = useMemo(
    () => buildCategoryRows(currentSales),
    [currentSales],
  );

  const leadingCategory = categoryRows[0];
  const periodLabel = formatDateRange(currentRange.start, currentRange.end);

  function handleSort(column) {
    setSortConfig((currentSort) => {
      if (currentSort.column === column) {
        return {
          column,
          direction: currentSort.direction === 'desc' ? 'asc' : 'desc',
        };
      }

      return {
        column,
        direction: 'desc',
      };
    });
  }

  return (
    <div className="app-shell">
      <Header teamName={config.nombre_equipo} currentDate={referenceDate} />

      <main className="dashboard">
        <PeriodFilter
          options={PERIOD_OPTIONS}
          selectedPeriod={selectedPeriod}
          onChange={setSelectedPeriod}
          periodLabel={periodLabel}
        />

        <KPICards kpis={kpis} />

        <section className="dashboard-grid">
          <SalesTable
            rows={sortedSellerRows}
            totals={sellerTotals}
            sortConfig={sortConfig}
            onSort={handleSort}
            topSellerName={topSellerName}
          />

          <CategoryBreakdown
            categories={categoryRows}
            leader={leadingCategory}
          />
        </section>
      </main>
    </div>
  );
}
