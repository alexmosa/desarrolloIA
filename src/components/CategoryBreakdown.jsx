import { formatMoney, formatPercent } from '../utils/format.js';

// Color palette from the design system.
const CATEGORY_COLORS = {
  'Electrónica': '#3B82F6',
  'Ropa':        '#8B5CF6',
  'Hogar':       '#F59E0B',
  'Alimentos':   '#10B981',
  'Deportes':    '#EF4444',
};

function colorFor(category) {
  return CATEGORY_COLORS[category] ?? '#64748B';
}

export default function CategoryBreakdown({ rows }) {
  const leader = rows[0];

  return (
    <section className="sv-card sv-category-card" aria-label="Ventas por categoría">
      <header className="sv-card__header">
        <h2 className="sv-card__title">Ventas por categoría</h2>
        <p className="sv-card__subtitle">Distribución del total del período por línea de producto.</p>
      </header>

      {rows.length === 0 ? (
        <p className="sv-empty">No hay ventas en el período seleccionado.</p>
      ) : (
        <ul className="sv-category-list">
          {rows.map((r) => (
            <li key={r.categoria} className="sv-category">
              <div className="sv-category__top">
                <div className="sv-category__name">
                  <span
                    className="sv-category__dot"
                    style={{ backgroundColor: colorFor(r.categoria) }}
                    aria-hidden="true"
                  />
                  {r.categoria}
                </div>
                <div className="sv-category__amount">{formatMoney(r.ventas)}</div>
              </div>
              <div className="sv-category__bar" aria-hidden="true">
                <div
                  className="sv-category__fill"
                  style={{
                    width: `${Math.min(100, r.share)}%`,
                    backgroundColor: colorFor(r.categoria),
                  }}
                />
              </div>
              <div className="sv-category__share">{formatPercent(r.share, 1)} del total</div>
            </li>
          ))}
        </ul>
      )}

      {leader && (
        <footer className="sv-category-summary">
          Categoría líder: <strong>{leader.categoria}</strong> con{' '}
          <strong>{formatPercent(leader.share, 1)}</strong>
        </footer>
      )}
    </section>
  );
}
