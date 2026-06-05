import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters'

const columnConfig = [
  { key: 'seller', label: 'Vendedor', sortable: true, align: 'left' },
  { key: 'totalSales', label: 'Ventas totales', sortable: true },
  { key: 'transactions', label: 'Transacciones', sortable: true },
  { key: 'avgTicket', label: 'Ticket promedio', sortable: true },
  { key: 'changePct', label: 'vs. Mes anterior', sortable: true },
  { key: 'sharePct', label: 'Barra de progreso', sortable: true },
]

const sortArrow = (isActive, direction) => {
  if (!isActive) return '↕'
  return direction === 'asc' ? '↑' : '↓'
}

const initials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

function SalesTable({
  rows,
  totals,
  topSeller,
  sortColumn,
  sortDirection,
  onSort,
}) {
  return (
    <section className="panel table-panel">
      <h2>Ventas por vendedor</h2>
      <div className="table-scroll">
        <table className="sales-table">
          <thead>
            <tr>
              {columnConfig.map((column) => (
                <th key={column.key} className={column.align === 'left' ? 'align-left' : ''}>
                  {column.sortable ? (
                    <button
                      type="button"
                      className="sort-button"
                      onClick={() => onSort(column.key)}
                    >
                      <span>{column.label}</span>
                      <span className="sort-arrow">
                        {sortArrow(sortColumn === column.key, sortDirection)}
                      </span>
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.seller}>
                <td className="seller-cell">
                  <div
                    className="avatar"
                    style={{ backgroundColor: row.color }}
                    aria-hidden="true"
                  >
                    {initials(row.seller)}
                  </div>
                  <div>
                    <p className="seller-name">
                      {row.seller}
                      {row.seller === topSeller && <span className="trophy">🏆</span>}
                    </p>
                  </div>
                </td>
                <td className="money-cell">{formatCurrency(row.totalSales, 0)}</td>
                <td>{formatNumber(row.transactions)}</td>
                <td className="money-cell">{formatCurrency(row.avgTicket, 2)}</td>
                <td>
                  <span
                    className={
                      row.changePct > 0
                        ? 'metric-change positive'
                        : row.changePct < 0
                          ? 'metric-change negative'
                          : 'metric-change neutral'
                    }
                  >
                    {formatPercent(row.changePct)}
                  </span>
                </td>
                <td>
                  <div className="share-cell">
                    <div className="share-track">
                      <div
                        className="share-fill"
                        style={{ width: `${Math.max(row.sharePct, 1)}%` }}
                      />
                    </div>
                    <span>{row.sharePct.toFixed(1)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td className="money-cell">{formatCurrency(totals.totalSales, 0)}</td>
              <td>{formatNumber(totals.transactions)}</td>
              <td className="money-cell">{formatCurrency(totals.avgTicket, 2)}</td>
              <td>—</td>
              <td>100.0%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}

export default SalesTable
