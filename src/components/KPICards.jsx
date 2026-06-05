import { formatCurrency, formatNumber, getChange } from '../utils/format.js'

function ChangeBadge({ change }) {
  if (!change.hasData) {
    return <span className="kpi__change kpi__change--neutral">vs. anterior: —</span>
  }
  const cls = change.isPositive
    ? 'kpi__change--up'
    : change.isNegative
      ? 'kpi__change--down'
      : 'kpi__change--neutral'
  return (
    <span className={`kpi__change ${cls}`}>
      {change.label} <span className="kpi__change-note">vs. anterior</span>
    </span>
  )
}

// Cuatro tarjetas de KPI: ventas, transacciones, ticket promedio y meta.
export default function KPICards({ kpis, prevKpis, meta }) {
  const totalChange = getChange(kpis.total, prevKpis.total)
  const countChange = getChange(kpis.count, prevKpis.count)
  const ticketChange = getChange(kpis.ticket, prevKpis.ticket)
  const metaPct = meta > 0 ? (kpis.total / meta) * 100 : 0
  const metaPctClamped = Math.min(metaPct, 100)

  return (
    <section className="kpis" aria-label="Indicadores clave">
      <article className="kpi">
        <span className="kpi__icon" aria-hidden="true">💰</span>
        <div className="kpi__body">
          <span className="kpi__label">Ventas totales del mes</span>
          <span className="kpi__value">{formatCurrency(kpis.total)}</span>
          <ChangeBadge change={totalChange} />
        </div>
      </article>

      <article className="kpi">
        <span className="kpi__icon" aria-hidden="true">🛒</span>
        <div className="kpi__body">
          <span className="kpi__label">Número de transacciones</span>
          <span className="kpi__value">{formatNumber(kpis.count)}</span>
          <ChangeBadge change={countChange} />
        </div>
      </article>

      <article className="kpi">
        <span className="kpi__icon" aria-hidden="true">📊</span>
        <div className="kpi__body">
          <span className="kpi__label">Ticket promedio</span>
          <span className="kpi__value">{formatCurrency(kpis.ticket, 2)}</span>
          <ChangeBadge change={ticketChange} />
        </div>
      </article>

      <article className="kpi">
        <span className="kpi__icon" aria-hidden="true">🎯</span>
        <div className="kpi__body">
          <span className="kpi__label">Meta del mes</span>
          <span className="kpi__value">{metaPct.toFixed(0)}%</span>
          <div className="kpi__progress" role="progressbar" aria-valuenow={Math.round(metaPct)} aria-valuemin={0} aria-valuemax={100}>
            <div className="kpi__progress-fill" style={{ width: `${metaPctClamped}%` }} />
          </div>
          <span className="kpi__change kpi__change--neutral">
            {formatCurrency(kpis.total)} de {formatCurrency(meta)}
          </span>
        </div>
      </article>
    </section>
  )
}
