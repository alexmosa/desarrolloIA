import { formatCurrency } from '../utils/salesUtils';

export default function CategoryBreakdown({ categories }) {
  const leader = categories[0];

  return (
    <section className="category-breakdown">
      <h2 className="section-title">Ventas por categoría</h2>
      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat.nombre} className="category-item">
            <div className="category-item__header">
              <span className="category-item__name">{cat.nombre}</span>
              <span className="category-item__amount">
                {formatCurrency(cat.monto)}
              </span>
            </div>
            <div className="category-item__meta">
              <span className="category-item__percent">{cat.percent}%</span>
              <div className="category-item__track">
                <div
                  className="category-item__fill"
                  style={{
                    width: `${cat.percent}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      {leader && (
        <p className="category-leader">
          Categoría líder: <strong>{leader.nombre}</strong> con{' '}
          <strong>{leader.percent}%</strong>
        </p>
      )}
    </section>
  );
}
