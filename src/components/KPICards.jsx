import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatPercentChange,
} from "../utils/format.js";

function ChangeBadge({ value }) {
  if (value === null || !Number.isFinite(value)) {
    return <span className="kpi-card__change kpi-card__change--neutral">— sin datos</span>;
  }
  const positive = value >= 0;
  const arrow = positive ? "↑" : "↓";
  return (
    <span
      className={`kpi-card__change ${
        positive ? "kpi-card__change--up" : "kpi-card__change--down"
      }`}
    >
      <span aria-hidden="true">{arrow}</span> {formatPercentChange(value)} vs. mes anterior
    </span>
  );
}

function KPICard({ icon, label, value, change }) {
  return (
    <article className="kpi-card">
      <div className="kpi-card__icon" aria-hidden="true">
        {icon}
      </div>
      <div className="kpi-card__body">
        <p className="kpi-card__label">{label}</p>
        <p className="kpi-card__value">{value}</p>
        <ChangeBadge value={change} />
      </div>
    </article>
  );
}

function GoalCard({ icon, label, current, goal }) {
  const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const rawPct = goal > 0 ? (current / goal) * 100 : 0;
  return (
    <article className="kpi-card kpi-card--goal">
      <div className="kpi-card__icon" aria-hidden="true">
        {icon}
      </div>
      <div className="kpi-card__body">
        <p className="kpi-card__label">{label}</p>
        <p className="kpi-card__value">{formatPercent(rawPct, 0)}</p>
        <p className="kpi-card__sublabel">
          de <strong>{formatCurrency(goal)}</strong>
        </p>
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={Math.round(rawPct)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </article>
  );
}

export default function KPICards({ kpis }) {
  return (
    <section className="kpi-grid" aria-label="Indicadores clave">
      <KPICard
        icon="💰"
        label="Ventas totales"
        value={formatCurrency(kpis.totalSales)}
        change={kpis.salesChange}
      />
      <KPICard
        icon="🛒"
        label="Transacciones"
        value={formatNumber(kpis.txCount)}
        change={kpis.txChange}
      />
      <KPICard
        icon="📊"
        label="Ticket promedio"
        value={formatCurrency(kpis.avgTicket, { withDecimals: true })}
        change={kpis.avgChange}
      />
      <GoalCard
        icon="🎯"
        label="Meta del mes"
        current={kpis.totalSales}
        goal={kpis.goal}
      />
    </section>
  );
}
