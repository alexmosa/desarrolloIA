const COLUMNS = [
  { key: 'name', label: 'Vendedor' },
  { key: 'sales', label: 'Ventas totales' },
  { key: 'transactions', label: 'Transacciones' },
  { key: 'averageTicket', label: 'Ticket promedio' },
  { key: 'change', label: 'vs. Mes anterior' },
  { key: 'share', label: 'Barra de progreso' },
]

function formatCurrency(value) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

function formatPercent(value) {
  return `${Math.round(value * 10) / 10}%`
}

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function SortHeader({ column, sortConfig, onSort }) {
  const isActive = sortConfig.column === column.key
  const arrow = isActive && sortConfig.direction === 'asc' ? '↑' : '↓'

  return (
    <button className={`sort-button ${isActive ? 'active' : ''}`} type="button" onClick={() => onSort(column.key)}>
      {column.label}
      <span aria-hidden="true">{arrow}</span>
    </button>
  )
}

function ChangeBadge({ value }) {
  const isPositive = value >= 0

  return (
    <span className={`change-pill ${isPositive ? 'positive' : 'negative'}`}>
      <span aria-hidden="true">{isPositive ? '↑' : '↓'}</span>
      {isPositive ? '+' : ''}
      {formatPercent(value)}
    </span>
  )
}

function SalesTable({ sellers, totals, sortConfig, onSort, topSellerName }) {
  return (
    <section className="panel sales-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Rendimiento del equipo</p>
          <h2>Ventas por vendedor</h2>
        </div>
        <span>{sellers.length} vendedores</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {COLUMNS.map((column) => (
                <th key={column.key} scope="col">
                  <SortHeader column={column} sortConfig={sortConfig} onSort={onSort} />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sellers.map((seller) => (
              <tr className={seller.name === topSellerName ? 'top-seller' : ''} key={seller.name}>
                <td>
                  <div className="seller-cell">
                    <span className="avatar" style={{ backgroundColor: seller.color }} aria-hidden="true">
                      {getInitials(seller.name)}
                    </span>
                    <span>
                      <strong>
                        {seller.name === topSellerName && (
                          <span className="trophy" aria-label="Mejor vendedor">
                            🏆
                          </span>
                        )}
                        {seller.name}
                      </strong>
                    </span>
                  </div>
                </td>
                <td className="amount">{formatCurrency(seller.sales)}</td>
                <td>{seller.transactions.toLocaleString('en-US')}</td>
                <td className="amount">{formatCurrency(seller.averageTicket)}</td>
                <td>
                  <ChangeBadge value={seller.change} />
                </td>
                <td>
                  <div className="seller-progress" aria-label={`${formatPercent(seller.share)} del total del equipo`}>
                    <div className="seller-progress-fill" style={{ width: `${seller.share}%` }} />
                  </div>
                  <span className="share-label">{formatPercent(seller.share)}</span>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td>Totales</td>
              <td className="amount">{formatCurrency(totals.sales)}</td>
              <td>{totals.transactions.toLocaleString('en-US')}</td>
              <td className="amount">{formatCurrency(totals.averageTicket)}</td>
              <td>—</td>
              <td>
                <div className="seller-progress total-progress" aria-label="100% del total del equipo">
                  <div className="seller-progress-fill" style={{ width: '100%' }} />
                </div>
                <span className="share-label">100%</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}

export default SalesTable
