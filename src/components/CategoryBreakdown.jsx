import { formatCurrency } from '../utils/format.js'

// Desglose por categoría, ya viene ordenado de mayor a menor venta.
export default function CategoryBreakdown({ categories }) {
  const leader = categories[0]

  return (
    <div className="panel">
      <h2 className="section-title">Ventas por categoría</h2>

      {categories.length === 0 ? (
        <div className="empty">No hay ventas en este período.</div>
      ) : (
        <>
          {categories.map((c) => (
            <div className="category" key={c.nombre}>
              <div className="category__head">
                <span className="category__name">{c.nombre}</span>
                <span className="category__amount">
                  {formatCurrency(c.monto)}
                  <span className="category__pct">{c.pct.toFixed(1)}%</span>
                </span>
              </div>
              <div className="category__bar">
                <div
                  className="category__bar-fill"
                  style={{
                    width: `${Math.min(c.pct, 100)}%`,
                    backgroundColor: c.color,
                  }}
                />
              </div>
            </div>
          ))}

          {leader && (
            <div className="category__leader">
              Categoría líder: <strong>{leader.nombre}</strong> con{' '}
              <strong>{leader.pct.toFixed(1)}%</strong>
            </div>
          )}
        </>
      )}
    </div>
  )
}
