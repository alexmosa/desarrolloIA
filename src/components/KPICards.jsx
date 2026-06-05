import { formatCurrency, formatInteger, formatPercent, getDeltaDirection } from '../utils';

function DeltaBadge({ value }) {
  const direction = getDeltaDirection(value);

  return (
    <span className={`delta-badge ${direction}`}>
      <span aria-hidden="true">{direction === 'positive' ? '↑' : '↓'}</span>
      {formatPercent(value)}
    </span>
  );
}

function KPICards({ cards, goalProgress, goalTarget, goalValue }) {
  return (
    <section className="kpi-grid">
      {cards.map((card) => (
        <article key={card.label} className="panel kpi-card">
          <div className="kpi-topline">
            <div className="kpi-icon" aria-hidden="true">
              {card.icon}
            </div>
            <div>
              <p className="kpi-label">{card.label}</p>
              <h2 className="kpi-value">{card.type === 'count' ? formatInteger(card.value) : card.value}</h2>
            </div>
          </div>

          <div className="kpi-footer">
            <DeltaBadge value={card.delta} />
            <span>vs. período anterior</span>
          </div>
        </article>
      ))}

      <article className="panel kpi-card goal-card">
        <div className="kpi-topline">
          <div className="kpi-icon" aria-hidden="true">
            🎯
          </div>
          <div>
            <p className="kpi-label">Meta del mes</p>
            <h2 className="kpi-value">{Math.round(goalProgress)}%</h2>
          </div>
        </div>

        <div className="goal-progress-track" aria-hidden="true">
          <div
            className="goal-progress-fill"
            style={{ width: `${Math.min(goalProgress, 100)}%` }}
          />
        </div>

        <div className="goal-summary">
          <strong>
            {Math.round(goalProgress)}% de {formatCurrency(goalTarget)}
          </strong>
          <span>Acumulado visible: {formatCurrency(goalValue)}</span>
        </div>
      </article>
    </section>
  );
}

export default KPICards;
