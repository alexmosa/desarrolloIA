import { useMemo } from 'react';

const CATEGORY_COLORS = {
  'Electrónica': '#3B82F6',
  'Ropa': '#8B5CF6',
  'Hogar': '#F59E0B',
  'Alimentos': '#10B981',
  'Deportes': '#EF4444',
};

function formatCurrency(value) {
  return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function CategoryBreakdown({ data }) {
  const categories = useMemo(() => {
    const map = {};
    const total = data.reduce((s, d) => s + d.monto, 0);

    data.forEach((d) => {
      if (!map[d.categoria]) map[d.categoria] = 0;
      map[d.categoria] += d.monto;
    });

    return Object.entries(map)
      .map(([name, amount]) => ({
        name,
        amount,
        pct: total > 0 ? (amount / total) * 100 : 0,
        color: CATEGORY_COLORS[name] || '#94A3B8',
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [data]);

  const leader = categories.length > 0 ? categories[0] : null;

  return (
    <div className="category-breakdown">
      <h2 className="section-title">Ventas por categoría</h2>
      <div className="category-list">
        {categories.map((cat) => (
          <div className="category-item" key={cat.name}>
            <div className="category-header">
              <span className="category-name">{cat.name}</span>
              <span className="category-amount">{formatCurrency(cat.amount)}</span>
            </div>
            <div className="category-bar-container">
              <div
                className="category-bar-fill"
                style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
              />
            </div>
            <span className="category-pct">{cat.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
      {leader && (
        <div className="category-leader">
          Categoría líder: <strong>{leader.name}</strong> con <strong>{leader.pct.toFixed(1)}%</strong>
        </div>
      )}
    </div>
  );
}
