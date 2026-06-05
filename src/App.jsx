import { useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import PeriodFilter from './components/PeriodFilter.jsx';
import KPICards from './components/KPICards.jsx';
import SalesTable from './components/SalesTable.jsx';
import CategoryBreakdown from './components/CategoryBreakdown.jsx';
import sales from '../data/sales.json';
import team from '../data/team.json';
import config from '../data/config.json';
import {
  buildCategoryRows,
  buildSellerRows,
  calculateChange,
  filterTransactionsByRange,
  formatPeriodRange,
  getPeriodRange,
  getPreviousRange,
  getReferenceDate,
  summarizeTransactions,
} from './utils/metrics.js';

export default function App() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const referenceDate = useMemo(() => getReferenceDate(sales), []);

  const dashboardData = useMemo(() => {
    const range = getPeriodRange(selectedPeriod, referenceDate);
    const previousRange = getPreviousRange(selectedPeriod, range);
    const currentTransactions = filterTransactionsByRange(sales, range);
    const previousTransactions = filterTransactionsByRange(sales, previousRange);
    const currentSummary = summarizeTransactions(currentTransactions);
    const previousSummary = summarizeTransactions(previousTransactions);

    return {
      range,
      currentSummary,
      changes: {
        sales: calculateChange(currentSummary.sales, previousSummary.sales),
        transactions: calculateChange(
          currentSummary.transactions,
          previousSummary.transactions,
        ),
        averageTicket: calculateChange(
          currentSummary.averageTicket,
          previousSummary.averageTicket,
        ),
      },
      sellers: buildSellerRows(team, currentTransactions, previousTransactions),
      categories: buildCategoryRows(currentTransactions),
    };
  }, [referenceDate, selectedPeriod]);

  const goalProgress =
    (dashboardData.currentSummary.sales / config.meta_mensual) * 100;

  return (
    <div className="app-shell">
      <Header teamName={config.nombre_equipo} currentDate={referenceDate} />
      <main>
        <PeriodFilter
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          periodLabel={formatPeriodRange(dashboardData.range)}
        />
        <KPICards
          currentSummary={dashboardData.currentSummary}
          changes={dashboardData.changes}
          monthlyGoal={config.meta_mensual}
          goalProgress={goalProgress}
        />
        <div className="dashboard-grid">
          <SalesTable
            rows={dashboardData.sellers}
            totalSummary={dashboardData.currentSummary}
          />
          <CategoryBreakdown categories={dashboardData.categories} />
        </div>
      </main>
    </div>
  );
}
