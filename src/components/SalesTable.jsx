import { useMemo, useState } from 'react';
import { formatCurrency, formatInteger, formatPercent, getDeltaDirection } from '../utils';

const COLUMN_LABELS = {
  name: 'Vendedor',
  totalSales: 'Ventas totales',
  transactions: 'Transacciones',
  averageTicket: 'Ticket promedio',
  change: 'vs. mes anterior',
  share: 'Barra de progreso',
};

function SortableHeader({ column, activeColumn, direction, onSort }) {
  const isActive = activeColumn === column;

  return (
    <th scope="col">
      <button type="button" className="table-sort-button" onClick={() => onSort(column)}>
        <span>{COLUMN_LABELS[column]}</span>
        <span className={`sort-indicator ${isActive ? 'active' : ''}`} aria-hidden="true">
          {isActive ? (direction === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </button>
    </th>
  );
}

function SalesTable({ rows, totals }) {
  const [sortColumn, setSortColumn] = useState('totalSales');
  const [sortDirection, setSortDirection] = useState('desc');

  const topSellerName = useMemo(() => {
    if (rows.length === 0) {
      return null;
    }

    return [...rows].sort((left, right) => right.totalSales - left.totalSales)[0].name;
  }, [rows]);

  const sortedRows = useMemo(() => {
    const sorted = [...rows].sort((left, right) => {
      if (sortColumn === 'name') {
        return left.name.localeCompare(right.name, 'es');
      }

      return left[sortColumn] - right[sortColumn];
    });

    return sortDirection === 'asc' ? sorted : sorted.reverse();
  }, [rows, sortColumn, sortDirection]);

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection((currentDirection) => (currentDirection === 'desc' ? 'asc' : 'desc'));
      return;
    }

    setSortColumn(column);
    setSortDirection('desc');
  };

  return (
    <section className="panel table-panel">
      <div className="section-heading">
        <div>
          <span className="section-kicker">Performance comercial</span>
          <h3>Ventas por vendedor</h3>
        </div>
        <p>Ordena cada columna para revisar desempeño, volumen y aporte al total del equipo.</p>
      </div>

      <div className="table-wrapper">
        <table className="sales-table">
          <thead>
            <tr>
              <SortableHeader
                column="name"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                column="totalSales"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                column="transactions"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                column="averageTicket"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                column="change"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                column="share"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
              />
            </tr>
          </thead>

          <tbody>
            {sortedRows.map((row) => {
              const direction = getDeltaDirection(row.change);
              return (
                <tr key={row.name} className={row.name === topSellerName ? 'top-performer' : ''}>
                  <td>
                    <div className="seller-cell">
                      <div className="seller-avatar" style={{ backgroundColor: row.color }}>
                        {row.initials}
                      </div>
                      <div>
                        <div className="seller-name">
                          {row.name}
                          {row.name === topSellerName && (
                            <span className="seller-badge" aria-label="Primer lugar">
                              🏆
                            </span>
                          )}
                        </div>
                        <span className="seller-meta">Participación {row.share.toFixed(1)}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="emphasis-cell">{formatCurrency(row.totalSales)}</td>
                  <td>{formatInteger(row.transactions)}</td>
                  <td>{formatCurrency(row.averageTicket, { minimumFractionDigits: 2 })}</td>
                  <td>
                    <span className={`delta-badge ${direction}`}>
                      <span aria-hidden="true">{direction === 'positive' ? '↑' : '↓'}</span>
                      {formatPercent(row.change)}
                    </span>
                  </td>
                  <td>
                    <div className="share-cell">
                      <div className="share-track" aria-hidden="true">
                        <div className="share-fill" style={{ width: `${row.share}%` }} />
                      </div>
                      <span>{row.share.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr>
              <td>Totales</td>
              <td className="emphasis-cell">{formatCurrency(totals.totalSales)}</td>
              <td>{formatInteger(totals.transactions)}</td>
              <td>{formatCurrency(totals.averageTicket, { minimumFractionDigits: 2 })}</td>
              <td>
                <span className={`delta-badge ${getDeltaDirection(totals.change)}`}>
                  <span aria-hidden="true">{totals.change >= 0 ? '↑' : '↓'}</span>
                  {formatPercent(totals.change)}
                </span>
              </td>
              <td>
                <div className="share-cell total-share">
                  <div className="share-track" aria-hidden="true">
                    <div className="share-fill" style={{ width: '100%' }} />
                  </div>
                  <span>100%</span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

export default SalesTable;
