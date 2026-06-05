import { formatCurrency, formatNumber, formatChange } from '../utils/format.js'

// Indicador de cambio reutilizable: ↑ verde / ↓ rojo / — neutral.
function ChangeBadge({ value, className = 'kpi__change' }) {
  if (value === null || value === undefined) {
    return (
      <span className={`${className} ${className}--neutral`}>
        — <span className="kpi__change-note">sin comparación</span>
      </span>
    )
  }
  const isUp = value > 0
  const isDown = value < 0
  const dir = isUp ? 'up' : isDown ? 'down' : 'neutral'
  const arrow = isUp ? '↑' : isDown ? '↓' : '→'
  return (
    <span className={`${className} ${className}--${dir}`}>
      {arrow} {formatChange(value)}
      <span className="kpi__change-note">vs. período anterior</span>
    </span>
  )
}

// Cuatro tarjetas de resumen: ventas, transacciones, ticket promedio, meta.
export default function KPICards({ kpis }) {
  return (
    <section className="kpis" aria-label="Resumen de métricas">
      <article className="kpi">
        <span className="kpi__icon" aria-hidden="true">💰</span>
        <div className="kpi__body">
          <div className="kpi__label">Ventas totales</div>
          <div className="kpi__value">{formatCurrency(kpis.total)}</div>
          <ChangeBadge value={kpis.totalChange} />
        </div>
      </article>

      <article className="kpi">
        <span className="kpi__icon" aria-hidden="true">🛒</span>
        <div className="kpi__body">
          <div className="kpi__label">Transacciones</div>
          <div className="kpi__value">{formatNumber(kpis.count)}</div>
          <ChangeBadge value={kpis.countChange} />
        </div>
      </article>

      <article className="kpi">
        <span className="kpi__icon" aria-hidden="true">📊</span>
        <div className="kpi__body">
          <div className="kpi__label">Ticket promedio</div>
          <div className="kpi__value">
            {formatCurrency(kpis.avgTicket, { decimals: 2 })}
          </div>
          <ChangeBadge value={kpis.avgTicketChange} />
        </div>
      </article>

      <article className="kpi">
        <span className="kpi__icon" aria-hidden="true">🎯</span>
        <div className="kpi__body">
          <div className="kpi__label">Meta del mes</div>
          <div className="kpi__meta-text">
            {kpis.metaPct.toFixed(0)}%{' '}
            <span className="kpi__meta-sub">
              de {formatCurrency(kpis.metaMensual)}
            </span>
          </div>
          <div className="progress">
            <div
              className="progress__bar"
              style={{ width: `${Math.min(kpis.metaPct, 100)}%` }}
            />
          </div>
        </div>
      </article>
    </section>
  )
}
