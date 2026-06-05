import { formatCurrency } from '../utils/salesUtils';

function ChangeIndicator({ value }) {
  const isPositive = value >= 0;
  const isNeutral = value === 0;

  return (
    <span
      className={`kpi-change${
        isNeutral
          ? ' kpi-change--neutral'
          : isPositive
            ? ' kpi-change--positive'
            : ' kpi-change--negative'
      }`}
    >
      {!isNeutral && (isPositive ? '↑ ' : '↓ ')}
      {isPositive && !isNeutral ? '+' : ''}
      {value}%
    </span>
  );
}

function KPICard({ icon, title, value, change, children }) {
  return (
    <article className="kpi-card">
      <span className="kpi-card__icon" aria-hidden="true">
        {icon}
      </span>
      <div className="kpi-card__content">
        <p className="kpi-card__title">{title}</p>
        {value !== null && <p className="kpi-card__value">{value}</p>}
        {change !== undefined ? <ChangeIndicator value={change} /> : children}
      </div>
    </article>
  );
}

export default function KPICards({ metrics, metaMensual, isThisMonth }) {
  const goalPercent =
    metaMensual > 0
      ? Math.min(Math.round((metrics.totalSales / metaMensual) * 1000) / 10, 100)
      : 0;

  const displayGoalPercent = isThisMonth
    ? goalPercent
    : Math.round((metrics.totalSales / metaMensual) * 1000) / 10;

  return (
    <section className="kpi-grid">
      <KPICard
        icon="💰"
        title="Ventas totales del mes"
        value={formatCurrency(metrics.totalSales)}
        change={metrics.salesChange}
      />
      <KPICard
        icon="🛒"
        title="Número de transacciones"
        value={metrics.transactionCount.toLocaleString('en-US')}
        change={metrics.transactionsChange}
      />
      <KPICard
        icon="📊"
        title="Ticket promedio"
        value={formatCurrency(metrics.avgTicket)}
        change={metrics.avgTicketChange}
      />
      <KPICard icon="🎯" title="Meta del mes" value={null}>
        <div className="kpi-goal">
          <p className="kpi-goal__text">
            {displayGoalPercent}% de {formatCurrency(metaMensual)}
          </p>
          <div className="kpi-goal__track">
            <div
              className="kpi-goal__fill"
              style={{ width: `${Math.min(displayGoalPercent, 100)}%` }}
            />
          </div>
        </div>
      </KPICard>
    </section>
  );
}
