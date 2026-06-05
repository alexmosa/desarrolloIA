import { formatCurrency, formatPercent, getInitials, SORTABLE_COLUMNS } from '../utils/metrics'

const HEADER_CONFIG = [
  { key: 'seller', label: 'Vendedor' },
  { key: 'sales', label: 'Ventas totales' },
  { key: 'transactions', label: 'Transacciones' },
  { key: 'avgTicket', label: 'Ticket promedio' },
  { key: 'change', label: 'vs. Mes anterior' },
  { key: 'share', label: 'Barra de progreso' },
]

function SortArrow({ column, sortColumn, sortDirection }) {
  if (column !== sortColumn) return <span className="sort-arrow muted">↕</span>
  return <span className="sort-arrow">{sortDirection === 'asc' ? '↑' : '↓'}</span>
}

function SalesTable({ rows, totals, sortColumn, sortDirection, onSort, topSeller }) {
  return (
    <section className="sales-table card">
      <h2 className="panel-title">Ventas por vendedor</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {HEADER_CONFIG.map((header) => (
                <th key={header.key}>
                  <button
                    type="button"
                    className="sort-button"
                    onClick={() => onSort(header.key)}
                    disabled={!SORTABLE_COLUMNS.includes(header.key)}
                  >
                    {header.label}
                    <SortArrow
                      column={header.key}
                      sortColumn={sortColumn}
                      sortDirection={sortDirection}
                    />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.seller} className="seller-row">
                <td>
                  <div className="seller-cell">
                    <span className="avatar" style={{ backgroundColor: row.color }}>
                      {getInitials(row.seller)}
                    </span>
                    <span className="seller-name">
                      {row.seller}
                      {row.seller === topSeller && <span className="trophy">🏆</span>}
                    </span>
                  </div>
                </td>
                <td className="amount">{formatCurrency(row.sales)}</td>
                <td>{row.transactions.toLocaleString('en-US')}</td>
                <td className="amount">{formatCurrency(row.avgTicket)}</td>
                <td>
                  <span className={`change ${row.change === null ? 'neutral' : row.change >= 0 ? 'positive' : 'negative'}`}>
                    {row.change === null ? '—' : `${row.change >= 0 ? '↑' : '↓'} ${formatPercent(row.change)}`}
                  </span>
                </td>
                <td>
                  <div className="share-cell">
                    <span className="share-label">{row.share.toFixed(1)}%</span>
                    <div className="share-track" aria-hidden="true">
                      <div className="share-fill" style={{ width: `${row.share}%` }} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="totals-row">
              <td>TOTAL</td>
              <td className="amount">{formatCurrency(totals.sales)}</td>
              <td>{totals.transactions.toLocaleString('en-US')}</td>
              <td className="amount">{formatCurrency(totals.avgTicket)}</td>
              <td>{totals.change === null ? '—' : formatPercent(totals.change)}</td>
              <td>100.0%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}

export default SalesTable
