import { useMemo, useState } from 'react';
import {
  formatCurrency,
  getInitials,
} from '../utils/salesUtils';

const COLUMNS = [
  { key: 'nombre', label: 'Vendedor', sortable: true },
  { key: 'ventas', label: 'Ventas totales', sortable: true },
  { key: 'transacciones', label: 'Transacciones', sortable: true },
  { key: 'ticketPromedio', label: 'Ticket promedio', sortable: true },
  { key: 'vsMesAnterior', label: 'vs. Mes anterior', sortable: true },
  { key: 'sharePercent', label: 'Participación', sortable: true },
];

function SortIcon({ direction }) {
  if (!direction) return <span className="sort-icon sort-icon--idle">↕</span>;
  return (
    <span className="sort-icon">
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  );
}

function ChangeCell({ value }) {
  const isPositive = value >= 0;
  const isNeutral = value === 0;
  return (
    <span
      className={
        isNeutral
          ? 'table-change table-change--neutral'
          : isPositive
            ? 'table-change table-change--positive'
            : 'table-change table-change--negative'
      }
    >
      {isPositive && !isNeutral ? '+' : ''}
      {value}%
    </span>
  );
}

export default function SalesTable({ sellerRows }) {
  const [sortColumn, setSortColumn] = useState('ventas');
  const [sortDirection, setSortDirection] = useState('desc');

  const sortedRows = useMemo(() => {
    const rows = [...sellerRows];
    rows.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
    return rows;
  }, [sellerRows, sortColumn, sortDirection]);

  const totals = useMemo(() => {
    const ventas = sellerRows.reduce((s, r) => s + r.ventas, 0);
    const transacciones = sellerRows.reduce((s, r) => s + r.transacciones, 0);
    const ticketPromedio =
      transacciones > 0 ? Math.round((ventas / transacciones) * 100) / 100 : 0;
    return { ventas, transacciones, ticketPromedio };
  }, [sellerRows]);

  const handleSort = (key) => {
    if (sortColumn === key) {
      setSortDirection((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortColumn(key);
      setSortDirection('desc');
    }
  };

  const topSeller =
    sortedRows.length > 0
      ? [...sellerRows].sort((a, b) => b.ventas - a.ventas)[0]?.nombre
      : null;

  return (
    <section className="sales-table-section">
      <h2 className="section-title">Ventas por vendedor</h2>
      <div className="table-wrapper">
        <table className="sales-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key}>
                  {col.sortable ? (
                    <button
                      type="button"
                      className="sales-table__sort-btn"
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                      <SortIcon
                        direction={
                          sortColumn === col.key ? sortDirection : null
                        }
                      />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => (
              <tr
                key={row.nombre}
                className={
                  row.nombre === topSeller ? 'sales-table__row--top' : ''
                }
              >
                <td>
                  <div className="seller-cell">
                    {row.nombre === topSeller && (
                      <span className="seller-cell__trophy" aria-hidden="true">
                        🏆
                      </span>
                    )}
                    <span
                      className="seller-avatar"
                      style={{ backgroundColor: row.color }}
                    >
                      {getInitials(row.nombre)}
                    </span>
                    <span className="seller-name">{row.nombre}</span>
                  </div>
                </td>
                <td className="sales-table__amount">
                  {formatCurrency(row.ventas)}
                </td>
                <td>{row.transacciones.toLocaleString('en-US')}</td>
                <td className="sales-table__amount">
                  {formatCurrency(row.ticketPromedio)}
                </td>
                <td>
                  <ChangeCell value={row.vsMesAnterior} />
                </td>
                <td>
                  <div className="share-bar">
                    <div className="share-bar__track">
                      <div
                        className="share-bar__fill"
                        style={{ width: `${row.sharePercent}%` }}
                      />
                    </div>
                    <span className="share-bar__label">
                      {Math.round(row.sharePercent * 10) / 10}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>
                <strong>Total</strong>
              </td>
              <td className="sales-table__amount">
                <strong>{formatCurrency(totals.ventas)}</strong>
              </td>
              <td>
                <strong>{totals.transacciones.toLocaleString('en-US')}</strong>
              </td>
              <td className="sales-table__amount">
                <strong>{formatCurrency(totals.ticketPromedio)}</strong>
              </td>
              <td>—</td>
              <td>100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
