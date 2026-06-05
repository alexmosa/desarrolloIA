import { useMemo, useState } from 'react';

import salesData from '../data/sales.json';
import teamData from '../data/team.json';
import configData from '../data/config.json';

import Header from './components/Header.jsx';
import PeriodFilter from './components/PeriodFilter.jsx';
import KPICards from './components/KPICards.jsx';
import SalesTable from './components/SalesTable.jsx';
import CategoryBreakdown from './components/CategoryBreakdown.jsx';

import {
  PERIOD_KEYS,
  getPeriodRange,
  filterByRange,
} from './utils/periods.js';
import {
  totalSales,
  transactionCount,
  averageTicket,
  pctChange,
  vendorBreakdown,
  categoryBreakdown,
} from './utils/calculations.js';

export default function App() {
  const todayStr = configData.fecha_referencia;
  const [period, setPeriod] = useState(PERIOD_KEYS.THIS_MONTH);

  const { current, previous } = useMemo(
    () => getPeriodRange(period, todayStr),
    [period, todayStr],
  );

  const currentTx  = useMemo(() => filterByRange(salesData, current),  [current]);
  const previousTx = useMemo(() => filterByRange(salesData, previous), [previous]);

  const totalCurrent  = totalSales(currentTx);
  const totalPrevious = totalSales(previousTx);
  const countCurrent  = transactionCount(currentTx);
  const countPrevious = transactionCount(previousTx);
  const ticketCurrent  = averageTicket(currentTx);
  const ticketPrevious = averageTicket(previousTx);

  // The "Meta del mes" tile always reflects the current calendar month-to-date,
  // independent of the active period filter (the meta is monthly).
  const monthRange = useMemo(
    () => getPeriodRange(PERIOD_KEYS.THIS_MONTH, todayStr).current,
    [todayStr],
  );
  const monthToDateTotal = useMemo(
    () => totalSales(filterByRange(salesData, monthRange)),
    [monthRange],
  );

  const vendorRows   = useMemo(() => vendorBreakdown(currentTx, previousTx, teamData), [currentTx, previousTx]);
  const categoryRows = useMemo(() => categoryBreakdown(currentTx), [currentTx]);

  return (
    <div className="sv-app">
      <Header teamName={configData.nombre_equipo} todayStr={todayStr} />

      <main className="sv-main">
        <PeriodFilter
          active={period}
          onChange={setPeriod}
          range={current}
        />

        <KPICards
          totalCurrent={totalCurrent}
          totalPrevious={totalPrevious}
          countCurrent={countCurrent}
          countPrevious={countPrevious}
          ticketCurrent={ticketCurrent}
          ticketPrevious={ticketPrevious}
          metaMensual={configData.meta_mensual}
          monthToDateTotal={monthToDateTotal}
          deltaTotal={pctChange(totalCurrent, totalPrevious)}
          deltaCount={pctChange(countCurrent, countPrevious)}
          deltaTicket={pctChange(ticketCurrent, ticketPrevious)}
        />

        <div className="sv-grid">
          <SalesTable rows={vendorRows} />
          <CategoryBreakdown rows={categoryRows} />
        </div>
      </main>
    </div>
  );
}
