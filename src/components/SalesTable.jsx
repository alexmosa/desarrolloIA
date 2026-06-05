import { useState, useMemo } from 'react'
import { formatCurrency, formatNumber, getChange, getInitials } from '../utils/format.js'

// Definición de columnas ordenables. `value` extrae el valor a comparar.
const COLUMNS = [
  { id: 'nombre', label: 'Vendedor', align: 'left', value: (r) => r.nombre.toLowerCase() },
  { id: 'total', label: 'Ventas totales', align: 'right', value: (r) => r.total },
  { id: 'count', label: 'Transacciones', align: 'right', value: (r) => r.count },
  { id: 'ticket', label: 'Ticket promedio', align: 'right', value: (r) => r.ticket },
  { id: 'change', label: 'vs. Mes anterior', align: 'right', value: (r) => getChange(r.total, r.previousTotal).value ?? -Infinity },
  { id: 'share', label: 'Participación', align: 'left', value: (r) => r.share },
]

export default function SalesTable({ data }) {
  const { rows, teamTotal, teamCount } = data
  const [sortColumn, setSortColumn] = useState('total')
  const [sortDirection, setSortDirection] = useState('desc')

  function handleSort(columnId) {
    if (columnId === sortColumn) {
      setSortDirection((d) => (d === 'desc' ? 'asc' : 'desc'))
    } else {
      setSortColumn(columnId)
      setSortDirection('desc')
    }
  }

  // El líder (🏆) es siempre quien más vendió, sin importar el orden de la tabla.
  const topSeller = useMemo(() => {
    let top = null
    for (const r of rows) {
      if (r.total > 0 && (!top || r.total > top.total)) top = r
    }
    return top ? top.nombre : null
  }, [rows])

  const sortedRows = useMemo(() => {
    const col = COLUMNS.find((c) => c.id === sortColumn)
    const dir = sortDirection === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => {
      const va = col.value(a)
      const vb = col.value(b)
      if (va < vb) return -1 * dir
      if (va > vb) return 1 * dir
      return 0
    })
  }, [rows, sortColumn, sortDirection])

  const teamTicket = teamCount > 0 ? teamTotal / teamCount : 0

  return (
    <section className="panel sales-panel" aria-label="Ventas por vendedor">
      <h2 className="panel__title">Ventas por vendedor</h2>
      <div className="table-wrap">
        <table className="sales-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => {
                const isActive = sortColumn === col.id
                return (
                  <th
                    key={col.id}
                    className={`th th--${col.align}${isActive ? ' th--active' : ''}`}
                    onClick={() => handleSort(col.id)}
                    aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <span className="th__inner">
                      {col.label}
                      <span className={`th__arrow${isActive ? ' th__arrow--active' : ''}`}>
                        {isActive ? (sortDirection === 'asc' ? '▲' : '▼') : '↕'}
                      </span>
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((r) => {
              const change = getChange(r.total, r.previousTotal)
              const isTop = r.nombre === topSeller
              return (
                <tr key={r.nombre} className="sales-row">
                  <td className="td td--left">
                    <div className="seller">
                      <span className="avatar" style={{ backgroundColor: r.color }}>
                        {getInitials(r.nombre)}
                      </span>
                      <span className="seller__name">{r.nombre}</span>
                      {isTop && <span className="seller__trophy" title="Mejor vendedor">🏆</span>}
                    </div>
                  </td>
                  <td className="td td--right td--amount">{formatCurrency(r.total)}</td>
                  <td className="td td--right">{formatNumber(r.count)}</td>
                  <td className="td td--right td--amount">{formatCurrency(r.ticket, 2)}</td>
                  <td className="td td--right">
                    <span
                      className={
                        'change ' +
                        (change.isPositive
                          ? 'change--up'
                          : change.isNegative
                            ? 'change--down'
                            : 'change--neutral')
                      }
                    >
                      {change.label}
                    </span>
                  </td>
                  <td className="td td--left td--share">
                    <div className="share">
                      <div className="share__bar">
                        <div
                          className="share__fill"
                          style={{ width: `${Math.min(r.share, 100)}%`, backgroundColor: r.color }}
                        />
                      </div>
                      <span className="share__pct">{r.share.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="sales-row sales-row--total">
              <td className="td td--left">Total equipo</td>
              <td className="td td--right td--amount">{formatCurrency(teamTotal)}</td>
              <td className="td td--right">{formatNumber(teamCount)}</td>
              <td className="td td--right td--amount">{formatCurrency(teamTicket, 2)}</td>
              <td className="td td--right">—</td>
              <td className="td td--left">100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}
