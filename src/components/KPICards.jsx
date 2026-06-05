import ChangeBadge from './ChangeBadge.jsx';
import { formatCurrency, formatNumber } from '../utils/metrics.js';

export default function KPICards({
  currentSummary,
  changes,
  monthlyGoal,
  goalProgress,
}) {
  const cards = [
    {
      title: 'Ventas totales del mes',
      icon: '💰',
      value: formatCurrency(currentSummary.sales),
      change: changes.sales,
      meta: 'vs. mes anterior',
    },
    {
      title: 'Número de transacciones',
      icon: '🛒',
      value: formatNumber(currentSummary.transactions),
      change: changes.transactions,
      meta: 'vs. mes anterior',
    },
    {
      title: 'Ticket promedio',
      icon: '📊',
      value: formatCurrency(currentSummary.averageTicket, 2),
      change: changes.averageTicket,
      meta: 'vs. mes anterior',
    },
  ];

  return (
    <section className="kpi-grid" aria-label="Resumen de KPIs">
      {cards.map((card) => (
        <article className="kpi-card" key={card.title}>
          <span className="kpi-icon" aria-hidden="true">
            {card.icon}
          </span>
          <div className="kpi-content">
            <p>{card.title}</p>
            <strong>{card.value}</strong>
            <div className="kpi-meta">
              <ChangeBadge value={card.change} />
              <span>{card.meta}</span>
            </div>
          </div>
        </article>
      ))}

      <article className="kpi-card goal-card">
        <span className="kpi-icon" aria-hidden="true">
          🎯
        </span>
        <div className="kpi-content">
          <p>Meta del mes</p>
          <strong>{Math.round(goalProgress)}%</strong>
          <div className="goal-track" aria-hidden="true">
            <div
              className="goal-fill"
              style={{ width: `${Math.min(goalProgress, 100)}%` }}
            />
          </div>
          <span className="goal-copy">
            {Math.round(goalProgress)}% de {formatCurrency(monthlyGoal)}
          </span>
        </div>
      </article>
    </section>
  );
}
