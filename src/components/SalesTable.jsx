import { useMemo, useState } from 'react'
import { formatCurrency, formatNumber, formatChange } from '../utils/format.js'
import { computeTeamTotals, getInitials } from '../utils/calculations.js'

const COLUMNS = [
  { key: 'nombre', label: 'Vendedor', numeric: false },
  { key: 'total', label: 'Ventas totales', numeric: true },
  { key: 'count', label: 'Transacciones', numeric: true },
  { key: 'avgTicket', label: 'Ticket prom.', numeric: true },
  { key: 'change', label: 'vs. anterior', numeric: true },
  { key: 'share', label: '% del equipo', numeric: true },
]

function SortArrow({ active, direction }) {
  if (!active) return <span className="sort-arrow sort-arrow--inactive">↓</span>
  return <span className="sort-arrow">{direction === 'asc' ? '↑' : '↓'}</span>
}

function ChangeText({ value }) {
  if (value === null || value === undefined) {
    return <span className="change change--neutral">—</span>
  }
  const dir = value > 0 ? 'up' : value < 0 ? 'down' : 'neutral'
  const arrow = value > 0 ? '↑' : value < 0 ? '↓' : '→'
  return (
    <span className={`change change--${dir}`}>
      {arrow} {formatChange(value)}
    </span>
  )
}

export default function SalesTable({ vendors }) {
  // Por defecto, ordenado por ventas totales de mayor a menor.
  const [sortColumn, setSortColumn] = useState('total')
  const [sortDirection, setSortDirection] = useState('desc')

  // El líder (🏆) se calcula sobre las ventas totales, sin importar el orden.
  const leaderName = useMemo(() => {
    let best = null
    for (const v of vendors) {
      if (v.total > 0 && (!best || v.total > best.total)) best = v
    }
    return best ? best.nombre : null
  }, [vendors])

  const sorted = useMemo(() => {
    const rows = [...vendors]
    const factor = sortDirection === 'asc' ? 1 : -1
    rows.sort((a, b) => {
      let av = a[sortColumn]
      let bv = b[sortColumn]
      if (sortColumn === 'nombre') {
        return av.localeCompare(bv) * factor
      }
      // null (sin comparación) se trata como el valor más bajo.
      av = av === null ? -Infinity : av
      bv = bv === null ? -Infinity : bv
      return (av - bv) * factor
    })
    return rows
  }, [vendors, sortColumn, sortDirection])

  const totals = useMemo(() => computeTeamTotals(vendors), [vendors])

  function handleSort(key) {
    if (key === sortColumn) {
      setSortDirection((d) => (d === 'desc' ? 'asc' : 'desc'))
    } else {
      setSortColumn(key)
      // Nombre arranca ascendente; las métricas, descendente.
      setSortDirection(key === 'nombre' ? 'asc' : 'desc')
    }
  }

  return (
    <div className="panel">
      <h2 className="section-title">Ventas por vendedor</h2>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`is-sortable${col.numeric ? ' num' : ''}`}
                  onClick={() => handleSort(col.key)}
                  aria-sort={
                    sortColumn === col.key
                      ? sortDirection === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  <span className="th-content">
                    {col.label}
                    <SortArrow
                      active={sortColumn === col.key}
                      direction={sortDirection}
                    />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((v) => (
              <tr key={v.nombre}>
                <td>
                  <div className="vendor-cell">
                    <span className="avatar" style={{ backgroundColor: v.color }}>
                      {getInitials(v.nombre)}
                    </span>
                    <span className="vendor-name">
                      {v.nombre}
                      {v.nombre === leaderName && (
                        <span className="trophy" aria-label="Líder de ventas">
                          🏆
                        </span>
                      )}
                    </span>
                  </div>
                </td>
                <td className="num td-amount">{formatCurrency(v.total)}</td>
                <td className="num">{formatNumber(v.count)}</td>
                <td className="num td-amount">
                  {formatCurrency(v.avgTicket, { decimals: 2 })}
                </td>
                <td className="num">
                  <ChangeText value={v.change} />
                </td>
                <td className="num share-cell">
                  <div className="share-bar">
                    <div
                      className="share-bar__fill"
                      style={{
                        width: `${Math.min(v.share, 100)}%`,
                        backgroundColor: v.color,
                      }}
                    />
                  </div>
                  <div className="share-pct">{v.share.toFixed(1)}%</div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total equipo</td>
              <td className="num">{formatCurrency(totals.total)}</td>
              <td className="num">{formatNumber(totals.count)}</td>
              <td className="num">
                {formatCurrency(totals.avgTicket, { decimals: 2 })}
              </td>
              <td className="num">—</td>
              <td className="num">100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
