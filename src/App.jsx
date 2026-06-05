import { useState, useMemo } from 'react';
import Header from './components/Header';
import PeriodFilter from './components/PeriodFilter';
import KPICards from './components/KPICards';
import SalesTable from './components/SalesTable';
import CategoryBreakdown from './components/CategoryBreakdown';
import salesData from '../data/sales.json';
import teamData from '../data/team.json';
import configData from '../data/config.json';
import './App.css';

function getDateRange(periodKey) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  let start;

  switch (periodKey) {
    case 'last7': {
      start = new Date(today);
      start.setDate(today.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case 'thisMonth': {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    }
    case 'last3Months': {
      start = new Date(today.getFullYear(), today.getMonth() - 2, 1);
      break;
    }
    default:
      start = new Date(today.getFullYear(), today.getMonth(), 1);
  }

  return { start, end: today };
}

function getPreviousRange(start, end) {
  const duration = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  prevEnd.setHours(23, 59, 59, 999);
  const prevStart = new Date(prevEnd.getTime() - duration);
  prevStart.setHours(0, 0, 0, 0);
  return { start: prevStart, end: prevEnd };
}

function filterByRange(data, start, end) {
  return data.filter((d) => {
    const date = new Date(d.fecha + 'T12:00:00');
    return date >= start && date <= end;
  });
}

export default function App() {
  const [period, setPeriod] = useState('thisMonth');

  const dateRange = useMemo(() => getDateRange(period), [period]);
  const previousRange = useMemo(
    () => getPreviousRange(dateRange.start, dateRange.end),
    [dateRange]
  );

  const currentData = useMemo(
    () => filterByRange(salesData, dateRange.start, dateRange.end),
    [dateRange]
  );
  const previousData = useMemo(
    () => filterByRange(salesData, previousRange.start, previousRange.end),
    [previousRange]
  );

  return (
    <div className="app">
      <Header teamName={configData.nombre_equipo} />
      <main className="main-content">
        <PeriodFilter
          activePeriod={period}
          dateRange={dateRange}
          onPeriodChange={setPeriod}
        />
        <KPICards
          currentData={currentData}
          previousData={previousData}
          monthlyGoal={configData.meta_mensual}
        />
        <div className="content-grid">
          <SalesTable
            currentData={currentData}
            previousData={previousData}
            teamMembers={teamData}
          />
          <CategoryBreakdown data={currentData} />
        </div>
      </main>
    </div>
  );
}
