import { formatCurrency } from '../utils/metrics.js';

export default function CategoryBreakdown({ categories }) {
  const leader = categories[0];

  return (
    <aside className="panel category-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Mix de producto</p>
          <h2>Ventas por categoría</h2>
        </div>
      </div>

      <div className="category-list">
        {categories.map((category) => (
          <article className="category-item" key={category.category}>
            <div className="category-row">
              <div>
                <span
                  className="category-dot"
                  style={{ backgroundColor: category.color }}
                  aria-hidden="true"
                />
                <strong>{category.category}</strong>
              </div>
              <span>{formatCurrency(category.sales)}</span>
            </div>
            <div className="category-meta">
              <span>{category.share.toFixed(1)}% del total</span>
            </div>
            <div className="category-track" aria-hidden="true">
              <div
                className="category-fill"
                style={{
                  width: `${category.share}%`,
                  backgroundColor: category.color,
                }}
              />
            </div>
          </article>
        ))}
      </div>

      {leader && (
        <div className="category-summary">
          Categoría líder: <strong>{leader.category}</strong> con{' '}
          <strong>{leader.share.toFixed(1)}%</strong>
        </div>
      )}
    </aside>
  );
}
