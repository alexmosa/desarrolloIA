import { formatCurrency } from '../utils';

function CategoryBreakdown({ categories }) {
  const leader = categories[0];

  return (
    <aside className="panel category-panel">
      <div className="section-heading compact">
        <div>
          <span className="section-kicker">Mix comercial</span>
          <h3>Ventas por categoría</h3>
        </div>
        <p>Las categorías se ordenan automáticamente de mayor a menor venta.</p>
      </div>

      <div className="category-list">
        {categories.map((category) => (
          <div key={category.category} className="category-item">
            <div className="category-header">
              <div className="category-name">
                <span
                  className="category-dot"
                  style={{ backgroundColor: category.color }}
                  aria-hidden="true"
                />
                <strong>{category.category}</strong>
              </div>
              <span>{category.percentage.toFixed(1)}%</span>
            </div>

            <div className="category-values">
              <span>{formatCurrency(category.totalSales)}</span>
              <span>del total</span>
            </div>

            <div className="category-track" aria-hidden="true">
              <div
                className="category-fill"
                style={{
                  width: `${category.percentage}%`,
                  backgroundColor: category.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="leader-summary">
        <span>Categoría líder</span>
        <strong>
          {leader.category} con {leader.percentage.toFixed(1)}%
        </strong>
      </div>
    </aside>
  );
}

export default CategoryBreakdown;
