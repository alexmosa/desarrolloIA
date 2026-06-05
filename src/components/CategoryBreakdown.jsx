import { formatCurrency } from '../utils/format.js'

// Desglose por categoría: barras horizontales de color + resumen del líder.
export default function CategoryBreakdown({ data }) {
  const { rows, leader } = data

  return (
    <section className="panel category-panel" aria-label="Ventas por categoría">
      <h2 className="panel__title">Ventas por categoría</h2>

      {rows.length === 0 ? (
        <p className="category-empty">Sin datos en este período.</p>
      ) : (
        <ul className="category-list">
          {rows.map((c) => (
            <li key={c.nombre} className="category-item">
              <div className="category-item__head">
                <span className="category-item__name">
                  <span className="category-dot" style={{ backgroundColor: c.color }} />
                  {c.nombre}
                </span>
                <span className="category-item__amount">{formatCurrency(c.monto)}</span>
              </div>
              <div className="category-item__bar">
                <div
                  className="category-item__fill"
                  style={{ width: `${Math.min(c.pct, 100)}%`, backgroundColor: c.color }}
                />
              </div>
              <span className="category-item__pct">{c.pct.toFixed(1)}% del total</span>
            </li>
          ))}
        </ul>
      )}

      {leader && (
        <p className="category-leader">
          Categoría líder: <strong>{leader.nombre}</strong> con {leader.pct.toFixed(1)}%
        </p>
      )}
    </section>
  )
}
