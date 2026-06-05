import { useState } from 'react';
import styles from './SalesTable.module.css';

function formatMoney(value) {
  return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function Avatar({ name, color }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
  return (
    <span className={styles.avatar} style={{ backgroundColor: color }}>
      {initials}
    </span>
  );
}

function SortIcon({ column, sortColumn, sortDir }) {
  if (sortColumn !== column) {
    return <span className={styles.sortIconInactive}>↕</span>;
  }
  return (
    <span className={`${styles.sortIcon} ${sortDir === 'asc' ? styles.sortAsc : styles.sortDesc}`}>
      {sortDir === 'asc' ? '↑' : '↓'}
    </span>
  );
}

const COLUMNS = [
  { key: 'vendedor', label: 'Vendedor' },
  { key: 'ventas', label: 'Ventas totales' },
  { key: 'transacciones', label: 'Transacciones' },
  { key: 'ticket', label: 'Ticket promedio' },
  { key: 'cambio', label: 'vs. Mes anterior' },
  { key: 'barra', label: 'Participación' },
];

export default function SalesTable({ vendedores }) {
  const [sortCol, setSortCol] = useState('ventas');
  const [sortDir, setSortDir] = useState('desc');

  function handleSort(col) {
    if (col === 'barra') return;
    if (sortCol === col) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortCol(col);
      setSortDir('desc');
    }
  }

  const sorted = [...vendedores].sort((a, b) => {
    let va, vb;
    switch (sortCol) {
      case 'vendedor': va = a.nombre; vb = b.nombre; break;
      case 'ventas': va = a.ventas; vb = b.ventas; break;
      case 'transacciones': va = a.transacciones; vb = b.transacciones; break;
      case 'ticket': va = a.ticket; vb = b.ticket; break;
      case 'cambio': va = a.cambio ?? -Infinity; vb = b.cambio ?? -Infinity; break;
      default: va = a.ventas; vb = b.ventas;
    }
    if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    return sortDir === 'asc' ? va - vb : vb - va;
  });

  const topVentas = sorted.length > 0 ? Math.max(...vendedores.map(v => v.ventas)) : 0;
  const totalVentas = vendedores.reduce((s, v) => s + v.ventas, 0);
  const totalTx = vendedores.reduce((s, v) => s + v.transacciones, 0);
  const totalTicket = totalTx > 0 ? totalVentas / totalTx : 0;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Ventas por vendedor</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  className={`${styles.th} ${col.key !== 'barra' ? styles.sortable : ''} ${sortCol === col.key ? styles.thActive : ''}`}
                  onClick={() => handleSort(col.key)}
                >
                  <span className={styles.thInner}>
                    {col.label}
                    {col.key !== 'barra' && (
                      <SortIcon column={col.key} sortColumn={sortCol} sortDir={sortDir} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((v) => {
              const isTop = v.ventas === topVentas;
              const pct = totalVentas > 0 ? (v.ventas / totalVentas) * 100 : 0;
              const hasChange = v.cambio !== null && !isNaN(v.cambio);
              return (
                <tr key={v.nombre} className={styles.row}>
                  <td className={styles.td}>
                    <div className={styles.vendedorCell}>
                      <Avatar name={v.nombre} color={v.color} />
                      <span className={styles.vendedorName}>{v.nombre}</span>
                      {isTop && <span className={styles.trophy} title="Mejor vendedor">🏆</span>}
                    </div>
                  </td>
                  <td className={`${styles.td} ${styles.mono}`}>{formatMoney(v.ventas)}</td>
                  <td className={styles.td}>{v.transacciones.toLocaleString('en-US')}</td>
                  <td className={`${styles.td} ${styles.mono}`}>{formatMoney(v.ticket)}</td>
                  <td className={styles.td}>
                    {hasChange ? (
                      <span className={`${styles.changeTag} ${v.cambio >= 0 ? styles.pos : styles.neg}`}>
                        {v.cambio >= 0 ? '↑' : '↓'} {v.cambio >= 0 ? '+' : ''}{v.cambio.toFixed(1)}%
                      </span>
                    ) : (
                      <span className={styles.noData}>—</span>
                    )}
                  </td>
                  <td className={styles.td}>
                    <div className={styles.barCell}>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.barFill}
                          style={{ width: `${pct}%`, backgroundColor: v.color }}
                        />
                      </div>
                      <span className={styles.barLabel}>{pct.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className={styles.footRow}>
              <td className={styles.footTd}>
                <span className={styles.footLabel}>Total equipo</span>
              </td>
              <td className={`${styles.footTd} ${styles.mono}`}>{formatMoney(totalVentas)}</td>
              <td className={styles.footTd}>{totalTx.toLocaleString('en-US')}</td>
              <td className={`${styles.footTd} ${styles.mono}`}>{formatMoney(totalTicket)}</td>
              <td className={styles.footTd} colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
