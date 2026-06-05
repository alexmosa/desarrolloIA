function formatCurrency(value) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

function formatPercent(value) {
  return `${Math.round(value * 10) / 10}%`
}

function CategoryBreakdown({ categories }) {
  const leader = categories[0]

  return (
    <aside className="panel category-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Mix de productos</p>
          <h2>Ventas por categoría</h2>
        </div>
      </div>

      <div className="category-list">
        {categories.map((category) => (
          <article className="category-item" key={category.name}>
            <div className="category-row">
              <span className="category-name">
                <span className="category-dot" style={{ backgroundColor: category.color }} aria-hidden="true" />
                {category.name}
              </span>
              <strong>{formatCurrency(category.sales)}</strong>
            </div>

            <div className="category-meta">
              <span>{formatPercent(category.percentage)} del total</span>
            </div>

            <div className="category-track" aria-label={`${category.name}: ${formatPercent(category.percentage)}`}>
              <div
                className="category-fill"
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
        <div className="leader-card">
          <span>Categoría líder</span>
          <strong>
            {leader.name} con {formatPercent(leader.percentage)}
          </strong>
        </div>
      )}
    </aside>
  )
}

export default CategoryBreakdown
