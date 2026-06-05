import { formatCurrency, formatPercent } from "../utils/format.js";

export default function CategoryBreakdown({ rows }) {
  const leader = rows[0];
  return (
    <section className="panel category-panel">
      <header className="panel__header">
        <h2 className="panel__title">Ventas por categoría</h2>
        <p className="panel__subtitle">{rows.length} categorías</p>
      </header>
      {rows.length === 0 ? (
        <p className="category-panel__empty">Sin ventas en este período.</p>
      ) : (
        <ul className="category-list">
          {rows.map((r) => (
            <li key={r.nombre} className="category-row">
              <div className="category-row__head">
                <span className="category-row__name">
                  <span
                    className="category-row__dot"
                    style={{ backgroundColor: r.color }}
                    aria-hidden="true"
                  />
                  {r.nombre}
                </span>
                <span className="category-row__amount">
                  {formatCurrency(r.monto)}
                </span>
              </div>
              <div className="category-row__bar">
                <div
                  className="category-row__fill"
                  style={{
                    width: `${Math.max(r.pct, 1.5)}%`,
                    backgroundColor: r.color,
                  }}
                />
              </div>
              <p className="category-row__pct">{formatPercent(r.pct)}</p>
            </li>
          ))}
        </ul>
      )}
      {leader && (
        <p className="category-panel__leader">
          Categoría líder: <strong>{leader.nombre}</strong> con{" "}
          <strong>{formatPercent(leader.pct)}</strong>
        </p>
      )}
    </section>
  );
}
