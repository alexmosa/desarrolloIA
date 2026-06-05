import { formatCurrency } from '../utils/metrics'

function CategoryBreakdown({ categories, leader }) {
  return (
    <section className="category-breakdown card">
      <h2 className="panel-title">Ventas por categoría</h2>
      <ul className="category-list">
        {categories.map((category) => (
          <li key={category.name} className="category-item">
            <div className="category-top">
              <span className="category-name">{category.name}</span>
              <span className="category-value">{formatCurrency(category.sales)}</span>
            </div>
            <div className="category-meta">
              <span>{category.percent.toFixed(1)}%</span>
            </div>
            <div className="category-track" aria-hidden="true">
              <div
                className="category-fill"
                style={{ width: `${category.percent}%`, backgroundColor: category.color }}
              />
            </div>
          </li>
        ))}
      </ul>

      <p className="leader-summary">
        Categoría líder:{' '}
        <strong>
          {leader ? `${leader.name} con ${leader.percent.toFixed(1)}%` : 'Sin datos'}
        </strong>
      </p>
    </section>
  )
}

export default CategoryBreakdown
