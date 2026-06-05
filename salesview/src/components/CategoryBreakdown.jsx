import styles from './CategoryBreakdown.module.css';

const CATEGORY_COLORS = {
  'Electrónica': '#3B82F6',
  'Ropa': '#8B5CF6',
  'Hogar': '#F59E0B',
  'Alimentos': '#10B981',
  'Deportes': '#EF4444',
};

function formatMoney(value) {
  return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function CategoryBreakdown({ categorias }) {
  if (!categorias || categorias.length === 0) {
    return (
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Ventas por categoría</h2>
        <p className={styles.empty}>Sin datos para el período seleccionado</p>
      </div>
    );
  }

  const sorted = [...categorias].sort((a, b) => b.ventas - a.ventas);
  const top = sorted[0];
  const totalVentas = sorted.reduce((s, c) => s + c.ventas, 0);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Ventas por categoría</h2>

      <div className={styles.list}>
        {sorted.map(cat => {
          const color = CATEGORY_COLORS[cat.nombre] || '#94A3B8';
          const pct = totalVentas > 0 ? (cat.ventas / totalVentas) * 100 : 0;
          return (
            <div key={cat.nombre} className={styles.item}>
              <div className={styles.itemHeader}>
                <div className={styles.itemNameRow}>
                  <span className={styles.colorDot} style={{ backgroundColor: color }} />
                  <span className={styles.catName}>{cat.nombre}</span>
                </div>
                <span className={styles.catAmount}>{formatMoney(cat.ventas)}</span>
              </div>
              <div className={styles.barRow}>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
                <span className={styles.catPct}>{pct.toFixed(1)}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {top && (
        <div className={styles.summary}>
          <span className={styles.summaryIcon}>🥇</span>
          <span className={styles.summaryText}>
            Categoría líder:{' '}
            <strong>{top.nombre}</strong>{' '}
            con <strong>{((top.ventas / totalVentas) * 100).toFixed(1)}%</strong> del total
          </span>
        </div>
      )}
    </div>
  );
}
