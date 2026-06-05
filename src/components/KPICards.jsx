import {
  formatCurrency,
  formatNumber,
  formatPercent,
  getTrendDirection,
} from '../utils/formatters';

function TrendBadge({ value }) {
  const direction = getTrendDirection(value);
  const arrow = direction === 'up' ? '↑' : direction === 'down' ? '↓' : '→';

  return (
    <span className={`trend trend--${direction}`}>
      <span aria-hidden="true">{arrow}</span>
      {formatPercent(value)}
    </span>
  );
}

export default function KPICards({ kpis }) {
  const cards = [
    {
      key: 'totalSales',
      icon: '💰',
      title: 'Ventas totales del mes',
      value: formatCurrency(kpis.totalSales.value),
      change: kpis.totalSales.change,
      subtitle: 'Comparado con el período anterior',
    },
    {
      key: 'transactions',
      icon: '🛒',
      title: 'Número de transacciones',
      value: formatNumber(kpis.transactions.value),
      change: kpis.transactions.change,
      subtitle: 'Cantidad de ventas cerradas',
    },
    {
      key: 'averageTicket',
      icon: '📊',
      title: 'Ticket promedio',
      value: formatCurrency(kpis.averageTicket.value, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      change: kpis.averageTicket.change,
      subtitle: 'Promedio por transacción',
    },
  ];

  return (
    <section className="kpi-grid">
      {cards.map((card) => (
        <article key={card.key} className="panel kpi-card">
          <div className="kpi-card__header">
            <span className="kpi-card__icon" aria-hidden="true">
              {card.icon}
            </span>
            <div>
              <p className="kpi-card__title">{card.title}</p>
              <strong className="kpi-card__value">{card.value}</strong>
            </div>
          </div>

          <div className="kpi-card__footer">
            <TrendBadge value={card.change} />
            <span>{card.subtitle}</span>
          </div>
        </article>
      ))}

      <article className="panel kpi-card">
        <div className="kpi-card__header">
          <span className="kpi-card__icon" aria-hidden="true">
            🎯
          </span>
          <div>
            <p className="kpi-card__title">Meta del mes</p>
            <strong className="kpi-card__value">
              {Math.min(kpis.goal.value, 999).toFixed(0)}%
            </strong>
          </div>
        </div>

        <div className="goal-card">
          <div className="goal-card__bar" aria-hidden="true">
            <div
              className="goal-card__bar-fill"
              style={{ width: `${Math.min(kpis.goal.value, 100)}%` }}
            />
          </div>
          <p className="goal-card__meta">
            {Math.min(kpis.goal.value, 999).toFixed(0)}% de{' '}
            {formatCurrency(kpis.goal.targetSales)}
          </p>
          <p className="goal-card__current">
            Acumulado actual: {formatCurrency(kpis.goal.currentSales)}
          </p>
        </div>
      </article>
    </section>
  );
}
