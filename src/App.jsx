import { useMemo, useState } from 'react';
import salesData from '../data/sales.json';
import teamData from '../data/team.json';
import configData from '../data/config.json';
import CategoryBreakdown from './components/CategoryBreakdown';
import Header from './components/Header';
import KPICards from './components/KPICards';
import PeriodFilter from './components/PeriodFilter';
import SalesTable from './components/SalesTable';
import {
  buildCategoryRows,
  buildSellerRows,
  calculatePercentageChange,
  filterSalesByRange,
  formatCurrency,
  formatRangeLabel,
  getPeriodDateRange,
  getReferenceDate,
  summarizeSales,
} from './utils';

function App() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const referenceDate = useMemo(() => getReferenceDate(salesData), []);

  const ranges = useMemo(
    () => getPeriodDateRange(selectedPeriod, referenceDate),
    [referenceDate, selectedPeriod],
  );

  const currentSales = useMemo(
    () => filterSalesByRange(salesData, ranges.current),
    [ranges],
  );

  const previousSales = useMemo(
    () => filterSalesByRange(salesData, ranges.previous),
    [ranges],
  );

  const currentSummary = useMemo(() => summarizeSales(currentSales), [currentSales]);
  const previousSummary = useMemo(() => summarizeSales(previousSales), [previousSales]);

  const sellerRows = useMemo(
    () => buildSellerRows(teamData, currentSales, previousSales),
    [currentSales, previousSales],
  );

  const categoryRows = useMemo(() => buildCategoryRows(currentSales), [currentSales]);

  const totalSalesChange = calculatePercentageChange(
    currentSummary.totalSales,
    previousSummary.totalSales,
  );
  const transactionChange = calculatePercentageChange(
    currentSummary.transactions,
    previousSummary.transactions,
  );
  const averageTicketChange = calculatePercentageChange(
    currentSummary.averageTicket,
    previousSummary.averageTicket,
  );
  const goalProgress = (currentSummary.totalSales / configData.meta_mensual) * 100;

  const kpiCards = [
    {
      label: 'Ventas totales',
      icon: '💰',
      value: formatCurrency(currentSummary.totalSales),
      delta: totalSalesChange,
    },
    {
      label: 'Número de transacciones',
      icon: '🛒',
      value: currentSummary.transactions,
      delta: transactionChange,
      type: 'count',
    },
    {
      label: 'Ticket promedio',
      icon: '📊',
      value: formatCurrency(currentSummary.averageTicket, { minimumFractionDigits: 2 }),
      delta: averageTicketChange,
    },
  ];

  return (
    <div className="app-shell">
      <Header teamName={configData.nombre_equipo} referenceDate={referenceDate} />

      <main className="dashboard-content">
        <PeriodFilter
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          rangeLabel={formatRangeLabel(ranges.current.start, ranges.current.end)}
        />

        <KPICards
          cards={kpiCards}
          goalProgress={goalProgress}
          goalTarget={configData.meta_mensual}
          goalValue={currentSummary.totalSales}
        />

        <section className="dashboard-grid">
          <SalesTable
            rows={sellerRows}
            totals={{
              totalSales: currentSummary.totalSales,
              transactions: currentSummary.transactions,
              averageTicket: currentSummary.averageTicket,
              change: totalSalesChange,
            }}
          />

          <CategoryBreakdown categories={categoryRows} />
        </section>
      </main>
    </div>
  );
}

export default App;
