import { useMemo, useState } from 'react';
import {
  formatMoney,
  formatMoneyDecimal,
  formatInt,
  formatPercentChange,
  initialsOf,
} from '../utils/format.js';
import { sortVendorRows, vendorTotals } from '../utils/calculations.js';

const COLUMNS = [
  { key: 'vendedor',      label: 'Vendedor',      align: 'left'  },
  { key: 'ventas',        label: 'Ventas totales', align: 'right' },
  { key: 'transacciones', label: 'Transacciones', align: 'right' },
  { key: 'ticket',        label: 'Ticket prom.',   align: 'right' },
  { key: 'vsPrev',        label: 'vs. mes ant.',  align: 'right' },
  { key: 'share',         label: '% del equipo',  align: 'left'  },
];

function SortIcon({ direction }) {
  return (
    <span className={`sv-sort-icon sv-sort-icon--${direction}`} aria-hidden="true">
      {direction === 'asc' ? '▲' : '▼'}
    </span>
  );
}

export default function SalesTable({ rows }) {
  const [sortColumn, setSortColumn] = useState('ventas');
  const [sortDirection, setSortDirection] = useState('desc');

  const sortedRows = useMemo(
    () => sortVendorRows(rows, sortColumn, sortDirection),
    [rows, sortColumn, sortDirection],
  );

  const totals = useMemo(() => vendorTotals(rows), [rows]);

  // Identify the top-selling vendor (by raw ventas, regardless of sort).
  const topVendor = useMemo(() => {
    if (!rows.length) return null;
    return [...rows].sort((a, b) => b.ventas - a.ventas)[0].vendedor;
  }, [rows]);

  function handleSort(column) {
    if (column === sortColumn) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  }

  return (
    <section className="sv-card sv-table-card" aria-label="Ventas por vendedor">
      <header className="sv-card__header">
        <h2 className="sv-card__title">Ventas por vendedor</h2>
        <p className="sv-card__subtitle">Comparativa del período seleccionado vs. el período anterior equivalente.</p>
      </header>

      <div className="sv-table-wrapper">
        <table className="sv-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => {
                const isActive = col.key === sortColumn;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={`sv-th sv-th--${col.align}${isActive ? ' is-active' : ''}`}
                    aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <button
                      type="button"
                      className="sv-th__btn"
                      onClick={() => handleSort(col.key)}
                    >
                      <span>{col.label}</span>
                      {isActive && <SortIcon direction={sortDirection} />}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => {
              const isTop = row.vendedor === topVendor && row.ventas > 0;
              return (
                <tr key={row.vendedor} className="sv-tr">
                  <td className="sv-td sv-td--left">
                    <div className="sv-vendor">
                      <span
                        className="sv-avatar"
                        style={{ backgroundColor: row.color }}
                        aria-hidden="true"
                      >
                        {initialsOf(row.vendedor)}
                      </span>
                      <span className="sv-vendor__name">{row.vendedor}</span>
                      {isTop && (
                        <span className="sv-trophy" title="Mayor vendedor del período" aria-label="Mayor vendedor del período">
                          🏆
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="sv-td sv-td--right sv-td--amount">{formatMoney(row.ventas)}</td>
                  <td className="sv-td sv-td--right">{formatInt(row.transacciones)}</td>
                  <td className="sv-td sv-td--right sv-td--amount">
                    {row.transacciones === 0 ? '—' : formatMoneyDecimal(row.ticket)}
                  </td>
                  <td className="sv-td sv-td--right">
                    {row.vsPrev == null ? (
                      <span className="sv-delta sv-delta--neutral sv-delta--inline">—</span>
                    ) : (
                      <span
                        className={`sv-delta sv-delta--inline ${row.vsPrev >= 0 ? 'sv-delta--up' : 'sv-delta--down'}`}
                      >
                        <span className="sv-delta__arrow" aria-hidden="true">
                          {row.vsPrev >= 0 ? '↑' : '↓'}
                        </span>
                        {formatPercentChange(row.vsPrev)}
                      </span>
                    )}
                  </td>
                  <td className="sv-td sv-td--left sv-td--share">
                    <div className="sv-share">
                      <span className="sv-share__value">{row.share.toFixed(1)}%</span>
                      <div className="sv-share__bar" aria-hidden="true">
                        <div
                          className="sv-share__fill"
                          style={{
                            width: `${Math.min(100, row.share)}%`,
                            backgroundColor: row.color,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="sv-tr sv-tr--total">
              <td className="sv-td sv-td--left">Total del equipo</td>
              <td className="sv-td sv-td--right sv-td--amount">{formatMoney(totals.ventas)}</td>
              <td className="sv-td sv-td--right">{formatInt(totals.transacciones)}</td>
              <td className="sv-td sv-td--right sv-td--amount">
                {totals.transacciones === 0 ? '—' : formatMoneyDecimal(totals.ticket)}
              </td>
              <td className="sv-td sv-td--right" aria-hidden="true">—</td>
              <td className="sv-td sv-td--left">
                <span className="sv-share__value sv-share__value--total">100.0%</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
