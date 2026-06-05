import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters'

const changeClassName = (value) => {
  if (value > 0) return 'metric-change positive'
  if (value < 0) return 'metric-change negative'
  return 'metric-change neutral'
}

const arrowForChange = (value) => {
  if (value > 0) return '↑'
  if (value < 0) return '↓'
  return '→'
}

function KPICards({ summary, config }) {
  const cards = [
    {
      id: 'totalSales',
      title: 'Ventas totales del mes',
      icon: '💰',
      value: formatCurrency(summary.current.totalSales, 0),
      change: summary.comparison.totalSales,
    },
    {
      id: 'transactions',
      title: 'Número de transacciones',
      icon: '🛒',
      value: formatNumber(summary.current.transactions),
      change: summary.comparison.transactions,
    },
    {
      id: 'avgTicket',
      title: 'Ticket promedio',
      icon: '📊',
      value: formatCurrency(summary.current.avgTicket, 2),
      change: summary.comparison.avgTicket,
    },
  ]

  return (
    <section className="kpi-grid">
      {cards.map((card) => (
        <article className="panel kpi-card" key={card.id}>
          <div className="kpi-head">
            <span className="kpi-icon" aria-hidden="true">
              {card.icon}
            </span>
            <p className="kpi-title">{card.title}</p>
          </div>
          <p className="kpi-value">{card.value}</p>
          <p className={changeClassName(card.change)}>
            <span aria-hidden="true">{arrowForChange(card.change)} </span>
            {formatPercent(card.change)}
            <span className="metric-subtext"> vs. mes anterior</span>
          </p>
        </article>
      ))}

      <article className="panel kpi-card">
        <div className="kpi-head">
          <span className="kpi-icon" aria-hidden="true">
            🎯
          </span>
          <p className="kpi-title">Meta del mes</p>
        </div>
        <p className="kpi-value">{Math.round(summary.goalPercent)}%</p>
        <div className="goal-track">
          <div
            className="goal-fill"
            style={{ width: `${Math.min(summary.goalPercent, 100)}%` }}
          />
        </div>
        <p className="metric-subtext">
          {Math.round(summary.goalPercent)}% de {formatCurrency(config.meta_mensual, 0)}
        </p>
      </article>
    </section>
  )
}

export default KPICards
