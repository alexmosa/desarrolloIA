import { formatCurrency } from '../utils/formatters'

function CategoryBreakdown({ categories }) {
  const leader = categories[0]

  return (
    <aside className="panel categories-panel">
      <h2>Ventas por categoría</h2>
      <ul className="category-list">
        {categories.map((category) => (
          <li key={category.name} className="category-item">
            <div className="category-header">
              <span>{category.name}</span>
              <strong>{formatCurrency(category.amount, 0)}</strong>
            </div>
            <div className="category-meta">
              <span>{category.percent.toFixed(1)}%</span>
            </div>
            <div className="category-track">
              <div
                className="category-fill"
                style={{
                  width: `${category.percent}%`,
                  backgroundColor: category.color,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
      {leader && (
        <p className="leader-summary">
          Categoría líder: <strong>{leader.name}</strong> con{' '}
          <strong>{leader.percent.toFixed(1)}%</strong>
        </p>
      )}
    </aside>
  )
}

export default CategoryBreakdown
