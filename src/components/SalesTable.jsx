import {
  formatCurrency,
  formatNumber,
  formatPercent,
  getInitials,
  getTrendDirection,
} from '../utils/formatters';

const COLUMN_LABELS = {
  name: 'Vendedor',
  totalSales: 'Ventas totales',
  transactions: 'Transacciones',
  averageTicket: 'Ticket promedio',
  change: 'vs. mes anterior',
  share: 'Barra de progreso',
};

function SortIndicator({ column, sortConfig }) {
  if (sortConfig.column !== column) {
    return <span className="sort-indicator">↕</span>;
  }

  return (
    <span className="sort-indicator">
      {sortConfig.direction === 'desc' ? '↓' : '↑'}
    </span>
  );
}

function ChangeCell({ value }) {
  const direction = getTrendDirection(value);

  return (
    <span className={`trend trend--${direction}`}>
      <span aria-hidden="true">
        {direction === 'up' ? '↑' : direction === 'down' ? '↓' : '→'}
      </span>
      {formatPercent(value)}
    </span>
  );
}

function SalesShareBar({ value }) {
  return (
    <div className="share-bar">
      <div className="share-bar__track" aria-hidden="true">
        <div className="share-bar__fill" style={{ width: `${value}%` }} />
      </div>
      <span>{value.toFixed(1)}%</span>
    </div>
  );
}

export default function SalesTable({
  rows,
  totals,
  sortConfig,
  onSort,
  topSellerName,
}) {
  const sortableColumns = [
    'name',
    'totalSales',
    'transactions',
    'averageTicket',
    'change',
    'share',
  ];

  return (
    <section className="panel table-panel">
      <div className="panel__header">
        <div>
          <p className="panel__eyebrow">Equipo comercial</p>
          <h2 className="panel__title">Ventas por vendedor</h2>
        </div>
        <p className="panel__hint">Haz clic en cualquier encabezado para ordenar.</p>
      </div>

      <div className="table-wrapper">
        <table className="sales-table">
          <thead>
            <tr>
              {sortableColumns.map((column) => (
                <th key={column} scope="col">
                  <button
                    type="button"
                    className="table-sort-button"
                    onClick={() => onSort(column)}
                  >
                    {COLUMN_LABELS[column]}
                    <SortIndicator column={column} sortConfig={sortConfig} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.name}
                className={row.name === topSellerName ? 'sales-table__row--leader' : ''}
              >
                <td>
                  <div className="seller-cell">
                    <span
                      className="seller-avatar"
                      style={{ backgroundColor: row.color }}
                      aria-hidden="true"
                    >
                      {getInitials(row.name)}
                    </span>
                    <div>
                      <strong>{row.name}</strong>
                      {row.name === topSellerName && (
                        <span className="seller-badge">🏆 Líder</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="numeric-cell">{formatCurrency(row.totalSales)}</td>
                <td>{formatNumber(row.transactions)}</td>
                <td className="numeric-cell">
                  {formatCurrency(row.averageTicket, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td>
                  <ChangeCell value={row.change} />
                </td>
                <td>
                  <SalesShareBar value={row.share} />
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td>Total equipo</td>
              <td className="numeric-cell">{formatCurrency(totals.totalSales)}</td>
              <td>{formatNumber(totals.transactions)}</td>
              <td className="numeric-cell">
                {formatCurrency(totals.averageTicket, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td>—</td>
              <td>
                <SalesShareBar value={100} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
