import { useMemo, useState } from "react";

import salesData from "../data/sales.json";
import teamData from "../data/team.json";
import configData from "../data/config.json";

import Header from "./components/Header.jsx";
import PeriodFilter from "./components/PeriodFilter.jsx";
import KPICards from "./components/KPICards.jsx";
import SalesTable from "./components/SalesTable.jsx";
import CategoryBreakdown from "./components/CategoryBreakdown.jsx";

import {
  buildCategoryRows,
  buildVendorRows,
  filterSales,
  pctChange,
  totals,
} from "./utils/calc.js";
import { getPeriodRange, getPreviousRange } from "./utils/dates.js";

const CATEGORY_PALETTE = {
  Electrónica: "#3B82F6",
  Ropa: "#8B5CF6",
  Hogar: "#F59E0B",
  Alimentos: "#10B981",
  Deportes: "#EF4444",
};

export default function App() {
  const [periodId, setPeriodId] = useState("thisMonth");

  const todayISO = configData.fecha_referencia;

  const range = useMemo(() => getPeriodRange(periodId, todayISO), [periodId, todayISO]);
  const prevRange = useMemo(
    () => getPreviousRange(range.startISO, range.endISO),
    [range.startISO, range.endISO],
  );

  const currentSales = useMemo(
    () => filterSales(salesData, range.startISO, range.endISO),
    [range.startISO, range.endISO],
  );
  const previousSales = useMemo(
    () => filterSales(salesData, prevRange.startISO, prevRange.endISO),
    [prevRange.startISO, prevRange.endISO],
  );

  const kpis = useMemo(() => {
    const cur = totals(currentSales);
    const prev = totals(previousSales);
    return {
      totalSales: cur.total,
      txCount: cur.count,
      avgTicket: cur.avg,
      goal: configData.meta_mensual,
      salesChange: pctChange(cur.total, prev.total),
      txChange: pctChange(cur.count, prev.count),
      avgChange: pctChange(cur.avg, prev.avg),
    };
  }, [currentSales, previousSales]);

  const vendorRows = useMemo(
    () => buildVendorRows(currentSales, previousSales, teamData),
    [currentSales, previousSales],
  );

  const categoryRows = useMemo(
    () => buildCategoryRows(currentSales, CATEGORY_PALETTE),
    [currentSales],
  );

  return (
    <div className="app-shell">
      <Header teamName={configData.nombre_equipo} todayISO={todayISO} />
      <main className="app-main">
        <PeriodFilter
          selectedId={periodId}
          onSelect={setPeriodId}
          range={range}
        />
        <KPICards kpis={kpis} />
        <div className="dashboard-grid">
          <SalesTable rows={vendorRows} />
          <CategoryBreakdown rows={categoryRows} />
        </div>
      </main>
    </div>
  );
}
