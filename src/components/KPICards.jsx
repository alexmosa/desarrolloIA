import {
  formatMoney,
  formatMoneyDecimal,
  formatInt,
  formatPercentChange,
  formatPercent,
} from '../utils/format.js';

function DeltaPill({ value }) {
  if (value == null) {
    return <span className="sv-delta sv-delta--neutral">—</span>;
  }
  const positive = value >= 0;
  const arrow = positive ? '↑' : '↓';
  return (
    <span className={`sv-delta ${positive ? 'sv-delta--up' : 'sv-delta--down'}`}>
      <span className="sv-delta__arrow" aria-hidden="true">{arrow}</span>
      <span>{formatPercentChange(value)}</span>
      <span className="sv-delta__caption">vs. mes anterior</span>
    </span>
  );
}

function Card({ icon, label, value, children }) {
  return (
    <article className="sv-kpi">
      <div className="sv-kpi__icon" aria-hidden="true">{icon}</div>
      <div className="sv-kpi__body">
        <p className="sv-kpi__label">{label}</p>
        <p className="sv-kpi__value">{value}</p>
        {children}
      </div>
    </article>
  );
}

export default function KPICards({
  totalCurrent,
  totalPrevious,
  countCurrent,
  countPrevious,
  ticketCurrent,
  ticketPrevious,
  metaMensual,
  monthToDateTotal,
  deltaTotal,
  deltaCount,
  deltaTicket,
}) {
  const metaPct = Math.min(100, Math.max(0, (monthToDateTotal / metaMensual) * 100));

  return (
    <section className="sv-kpis" aria-label="Indicadores clave">
      <Card icon="💰" label="Ventas totales del mes" value={formatMoney(totalCurrent)}>
        <DeltaPill value={deltaTotal} />
      </Card>

      <Card icon="🛒" label="Número de transacciones" value={formatInt(countCurrent)}>
        <DeltaPill value={deltaCount} />
      </Card>

      <Card icon="📊" label="Ticket promedio" value={formatMoneyDecimal(ticketCurrent)}>
        <DeltaPill value={deltaTicket} />
      </Card>

      <Card icon="🎯" label="Meta del mes" value={`${formatPercent(metaPct, 0)} de ${formatMoney(metaMensual)}`}>
        <div
          className="sv-meta-bar"
          role="progressbar"
          aria-valuenow={Math.round(metaPct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${Math.round(metaPct)} por ciento de la meta mensual`}
        >
          <div className="sv-meta-bar__fill" style={{ width: `${metaPct}%` }} />
        </div>
        <p className="sv-kpi__meta-caption">
          {formatMoney(monthToDateTotal)} alcanzados de {formatMoney(metaMensual)}
        </p>
      </Card>
    </section>
  );
}
