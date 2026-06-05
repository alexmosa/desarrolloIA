import { useState, useMemo } from 'react';

function formatCurrency(value) {
  return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

const COLUMNS = [
  { key: 'vendedor', label: 'Vendedor' },
  { key: 'ventas', label: 'Ventas Totales' },
  { key: 'transacciones', label: 'Transacciones' },
  { key: 'ticket', label: 'Ticket Promedio' },
  { key: 'cambio', label: 'vs. Mes Anterior' },
  { key: 'barra', label: '% del Equipo', sortable: false },
];

export default function SalesTable({ currentData, previousData, teamMembers }) {
  const [sortCol, setSortCol] = useState('ventas');
  const [sortDir, setSortDir] = useState('desc');

  const vendorStats = useMemo(() => {
    const currentMap = {};
    const previousMap = {};
    const teamTotal = currentData.reduce((s, d) => s + d.monto, 0);

    teamMembers.forEach((m) => {
      currentMap[m.nombre] = { ventas: 0, transacciones: 0, color: m.color };
      previousMap[m.nombre] = { ventas: 0, transacciones: 0 };
    });

    currentData.forEach((d) => {
      if (currentMap[d.vendedor]) {
        currentMap[d.vendedor].ventas += d.monto;
        currentMap[d.vendedor].transacciones += 1;
      }
    });

    previousData.forEach((d) => {
      if (previousMap[d.vendedor]) {
        previousMap[d.vendedor].ventas += d.monto;
        previousMap[d.vendedor].transacciones += 1;
      }
    });

    return teamMembers.map((m) => {
      const cur = currentMap[m.nombre];
      const prev = previousMap[m.nombre];
      const ticket = cur.transacciones > 0 ? cur.ventas / cur.transacciones : 0;
      const prevSales = prev.ventas;
      const cambio = prevSales > 0 ? ((cur.ventas - prevSales) / prevSales) * 100 : 0;
      const pctEquipo = teamTotal > 0 ? (cur.ventas / teamTotal) * 100 : 0;

      return {
        vendedor: m.nombre,
        color: m.color,
        ventas: cur.ventas,
        transacciones: cur.transacciones,
        ticket,
        cambio,
        pctEquipo,
      };
    });
  }, [currentData, previousData, teamMembers]);

  const sorted = useMemo(() => {
    const data = [...vendorStats];
    data.sort((a, b) => {
      let valA = a[sortCol];
      let valB = b[sortCol];
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [vendorStats, sortCol, sortDir]);

  const totals = useMemo(() => {
    const t = vendorStats.reduce(
      (acc, v) => ({
        ventas: acc.ventas + v.ventas,
        transacciones: acc.transacciones + v.transacciones,
      }),
      { ventas: 0, transacciones: 0 }
    );
    t.ticket = t.transacciones > 0 ? t.ventas / t.transacciones : 0;
    return t;
  }, [vendorStats]);

  const handleSort = (col) => {
    const colDef = COLUMNS.find((c) => c.key === col);
    if (colDef && colDef.sortable === false) return;
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir('desc');
    }
  };

  const topVendor = sorted.length > 0 ? sorted[0].vendedor : null;

  return (
    <div className="sales-table-container">
      <h2 className="section-title">Ventas por vendedor</h2>
      <div className="table-wrapper">
        <table className="sales-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`${col.sortable === false ? '' : 'sortable'} ${sortCol === col.key ? 'sorted' : ''}`}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  {col.sortable !== false && (
                    <span className="sort-icon">
                      {sortCol === col.key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ' ⇅'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.vendedor}>
                <td className="vendor-cell">
                  <span className="avatar" style={{ backgroundColor: row.color }}>
                    {getInitials(row.vendedor)}
                  </span>
                  <span className="vendor-name">
                    {row.vendedor}
                    {sortDir === 'desc' && sortCol === 'ventas' && topVendor === row.vendedor && (
                      <span className="trophy"> 🏆</span>
                    )}
                  </span>
                </td>
                <td className="money-cell">{formatCurrency(row.ventas)}</td>
                <td className="number-cell">{row.transacciones}</td>
                <td className="money-cell">{formatCurrency(Math.round(row.ticket * 100) / 100)}</td>
                <td>
                  <span className={`change-badge ${row.cambio >= 0 ? 'positive' : 'negative'}`}>
                    {row.cambio >= 0 ? '↑' : '↓'} {Math.abs(row.cambio).toFixed(1)}%
                  </span>
                </td>
                <td className="bar-cell">
                  <div className="vendor-bar-container">
                    <div className="vendor-bar-track">
                      <div
                        className="vendor-bar-fill"
                        style={{ width: `${row.pctEquipo}%` }}
                      />
                    </div>
                    <span className="vendor-bar-label">{row.pctEquipo.toFixed(1)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="totals-row">
              <td className="vendor-cell"><strong>Total</strong></td>
              <td className="money-cell"><strong>{formatCurrency(totals.ventas)}</strong></td>
              <td className="number-cell"><strong>{totals.transacciones}</strong></td>
              <td className="money-cell"><strong>{formatCurrency(Math.round(totals.ticket * 100) / 100)}</strong></td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
