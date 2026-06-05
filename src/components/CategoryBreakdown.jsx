import { formatCurrency } from '../utils/formatters';

export default function CategoryBreakdown({ categories, leader }) {
  return (
    <aside className="panel category-panel">
      <div className="panel__header">
        <div>
          <p className="panel__eyebrow">Mix comercial</p>
          <h2 className="panel__title">Ventas por categoría</h2>
        </div>
      </div>

      <div className="category-list">
        {categories.map((category) => (
          <article key={category.name} className="category-item">
            <div className="category-item__top">
              <div>
                <h3>{category.name}</h3>
                <p>{formatCurrency(category.total)}</p>
              </div>
              <strong>{category.percentage.toFixed(1)}%</strong>
            </div>

            <div className="category-bar" aria-hidden="true">
              <div
                className="category-bar__fill"
                style={{
                  width: `${category.percentage}%`,
                  backgroundColor: category.color,
                }}
              />
            </div>
          </article>
        ))}
      </div>

      {leader && (
        <div className="category-summary">
          <span className="category-summary__label">Categoría líder</span>
          <strong>
            {leader.name} con {leader.percentage.toFixed(1)}%
          </strong>
        </div>
      )}
    </aside>
  );
}
