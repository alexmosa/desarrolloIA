import { useMemo, useState } from 'react';
import ChangeBadge from './ChangeBadge.jsx';
import { formatCurrency, formatNumber } from '../utils/metrics.js';

const COLUMNS = [
  { key: 'seller', label: 'Vendedor' },
  { key: 'sales', label: 'Ventas totales' },
  { key: 'transactions', label: 'Transacciones' },
  { key: 'averageTicket', label: 'Ticket promedio' },
  { key: 'change', label: 'vs. Mes anterior' },
  { key: 'teamShare', label: 'Barra de progreso' },
];

function getInitials(name) {
  return name
    .split(' ')
    .map((segment) => segment[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function compareValues(firstValue, secondValue) {
  if (typeof firstValue === 'string') {
    return firstValue.localeCompare(secondValue, 'es');
  }

  const normalizedFirst = firstValue ?? Number.NEGATIVE_INFINITY;
  const normalizedSecond = secondValue ?? Number.NEGATIVE_INFINITY;
  return normalizedFirst - normalizedSecond;
}

export default function SalesTable({ rows, totalSummary }) {
  const [sortColumn, setSortColumn] = useState('sales');
  const [sortDirection, setSortDirection] = useState('desc');
  const leader = rows.reduce(
    (topSeller, row) => (row.sales > topSeller.sales ? row : topSeller),
    rows[0],
  );

  const sortedRows = useMemo(() => {
    return [...rows].sort((firstRow, secondRow) => {
      const comparison = compareValues(
        firstRow[sortColumn],
        secondRow[sortColumn],
      );
      return sortDirection === 'asc' ? comparison : comparison * -1;
    });
  }, [rows, sortColumn, sortDirection]);

  function handleSort(columnKey) {
    if (sortColumn === columnKey) {
      setSortDirection((currentDirection) =>
        currentDirection === 'asc' ? 'desc' : 'asc',
      );
      return;
    }

    setSortColumn(columnKey);
    setSortDirection('desc');
  }

  return (
    <section className="panel sales-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Equipo comercial</p>
          <h2>Ventas por vendedor</h2>
        </div>
        <span>{formatNumber(totalSummary.transactions)} transacciones</span>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {COLUMNS.map((column) => (
                <th key={column.key}>
                  <button type="button" onClick={() => handleSort(column.key)}>
                    {column.label}
                    <span aria-hidden="true">
                      {sortColumn === column.key
                        ? sortDirection === 'asc'
                          ? '↑'
                          : '↓'
                        : '↕'}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => (
              <tr className={row.seller === leader.seller ? 'top-row' : ''} key={row.seller}>
                <td>
                  <div className="seller-cell">
                    <span
                      className="avatar"
                      style={{ backgroundColor: row.color }}
                      aria-hidden="true"
                    >
                      {getInitials(row.seller)}
                    </span>
                    <div>
                      <strong>
                        {row.seller === leader.seller && (
                          <span className="rank-icon" aria-label="Primer lugar">
                            🏆
                          </span>
                        )}
                        {row.seller}
                      </strong>
                    </div>
                  </div>
                </td>
                <td className="amount">{formatCurrency(row.sales)}</td>
                <td>{formatNumber(row.transactions)}</td>
                <td className="amount">{formatCurrency(row.averageTicket, 2)}</td>
                <td>
                  <ChangeBadge value={row.change} />
                </td>
                <td>
                  <div className="seller-progress">
                    <div className="seller-progress-label">
                      <span>{row.teamShare.toFixed(1)}%</span>
                    </div>
                    <div className="seller-track" aria-hidden="true">
                      <div
                        className="seller-fill"
                        style={{
                          width: `${row.teamShare}%`,
                          backgroundColor: row.color,
                        }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total equipo</td>
              <td>{formatCurrency(totalSummary.sales)}</td>
              <td>{formatNumber(totalSummary.transactions)}</td>
              <td>{formatCurrency(totalSummary.averageTicket, 2)}</td>
              <td colSpan="2">100% del total seleccionado</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
