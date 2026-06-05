import { useState, useEffect } from 'react';
import Header from './components/Header';
import PeriodFilter from './components/PeriodFilter';
import KPICards from './components/KPICards';
import SalesTable from './components/SalesTable';
import CategoryBreakdown from './components/CategoryBreakdown';
import styles from './App.module.css';

// ─── Date helpers ─────────────────────────────────────────────────────────────

function toYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getPeriodRange(periodKey) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (periodKey === '7d') {
    const start = new Date(today);
    start.setDate(today.getDate() - 6);
    return { start, end: today };
  }

  if (periodKey === 'month') {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { start, end: today };
  }

  // 3m
  const start = new Date(today);
  start.setMonth(today.getMonth() - 3);
  start.setDate(start.getDate() + 1);
  return { start, end: today };
}

function getPrevPeriodRange(periodKey) {
  const curr = getPeriodRange(periodKey);
  const duration = curr.end - curr.start; // ms

  const prevEnd = new Date(curr.start.getTime() - 24 * 60 * 60 * 1000);
  const prevStart = new Date(prevEnd.getTime() - duration);
  return { start: prevStart, end: prevEnd };
}

function filterByRange(transactions, start, end) {
  const s = toYMD(start);
  const e = toYMD(end);
  return transactions.filter(t => t.fecha >= s && t.fecha <= e);
}

// ─── Computation helpers ───────────────────────────────────────────────────────

function computeKPIs(curr, prev) {
  const totalVentas = curr.reduce((s, t) => s + t.monto, 0);
  const totalTransacciones = curr.length;
  const ticketPromedio = totalTransacciones > 0 ? totalVentas / totalTransacciones : 0;

  const prevVentas = prev.reduce((s, t) => s + t.monto, 0);
  const prevTransacciones = prev.length;
  const prevTicket = prevTransacciones > 0 ? prevVentas / prevTransacciones : 0;

  return { totalVentas, totalTransacciones, ticketPromedio, prevVentas, prevTransacciones, prevTicket };
}

function computeVendedores(curr, prev, teamMap) {
  const currMap = {};
  curr.forEach(t => {
    if (!currMap[t.vendedor]) currMap[t.vendedor] = { ventas: 0, transacciones: 0 };
    currMap[t.vendedor].ventas += t.monto;
    currMap[t.vendedor].transacciones += 1;
  });

  const prevMap = {};
  prev.forEach(t => {
    if (!prevMap[t.vendedor]) prevMap[t.vendedor] = { ventas: 0, transacciones: 0 };
    prevMap[t.vendedor].ventas += t.monto;
    prevMap[t.vendedor].transacciones += 1;
  });

  return Object.entries(currMap).map(([nombre, data]) => {
    const ticket = data.transacciones > 0 ? data.ventas / data.transacciones : 0;
    const prevData = prevMap[nombre];
    const cambio = prevData && prevData.ventas > 0
      ? ((data.ventas - prevData.ventas) / prevData.ventas) * 100
      : null;
    const teamEntry = teamMap[nombre] || {};
    return {
      nombre,
      ventas: data.ventas,
      transacciones: data.transacciones,
      ticket,
      cambio,
      color: teamEntry.color || '#94A3B8',
    };
  });
}

function computeCategorias(curr) {
  const map = {};
  curr.forEach(t => {
    if (!map[t.categoria]) map[t.categoria] = 0;
    map[t.categoria] += t.monto;
  });
  return Object.entries(map).map(([nombre, ventas]) => ({ nombre, ventas }));
}

// ─── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [sales, setSales] = useState([]);
  const [teamMap, setTeamMap] = useState({});
  const [config, setConfig] = useState({ meta_mensual: 160000, nombre_equipo: '' });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    Promise.all([
      fetch('/data/sales.json').then(r => r.json()),
      fetch('/data/team.json').then(r => r.json()),
      fetch('/data/config.json').then(r => r.json()),
    ]).then(([salesData, teamData, configData]) => {
      setSales(salesData);
      const tm = {};
      teamData.forEach(v => { tm[v.nombre] = v; });
      setTeamMap(tm);
      setConfig(configData);
      setLoading(false);
    });
  }, []);

  const range = getPeriodRange(period);
  const prevRange = getPrevPeriodRange(period);

  const currTx = filterByRange(sales, range.start, range.end);
  const prevTx = filterByRange(sales, prevRange.start, prevRange.end);

  const kpis = computeKPIs(currTx, prevTx);
  const vendedores = computeVendedores(currTx, prevTx, teamMap);
  const categorias = computeCategorias(currTx);

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner} />
        <span className={styles.loadingText}>Cargando SalesView…</span>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <Header teamName={config.nombre_equipo} />
      <PeriodFilter
        activePeriod={period}
        onChangePeriod={setPeriod}
        dateRange={range}
      />
      <main className={styles.main}>
        <KPICards kpis={kpis} metaMensual={config.meta_mensual} />
        <div className={styles.contentRow}>
          <div className={styles.tableCol}>
            <SalesTable vendedores={vendedores} />
          </div>
          <div className={styles.categoryCol}>
            <CategoryBreakdown categorias={categorias} />
          </div>
        </div>
      </main>
    </div>
  );
}
