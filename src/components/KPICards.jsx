import { formatCurrency, formatPercent } from '../utils/metrics'

function ChangeIndicator({ value }) {
  if (value === null) {
    return <span className="change neutral">Sin base comparativa</span>
  }

  const isPositive = value >= 0
  return (
    <span className={`change ${isPositive ? 'positive' : 'negative'}`}>
      {isPositive ? '↑' : '↓'} {formatPercent(value)}
    </span>
  )
}

function KPICards({ summary, monthlyGoal }) {
  const goalProgress = monthlyGoal === 0 ? 0 : (summary.totalSales / monthlyGoal) * 100

  const cards = [
    {
      key: 'sales',
      icon: '💰',
      label: 'Ventas totales del mes',
      value: formatCurrency(summary.totalSales),
      change: summary.salesChange,
    },
    {
      key: 'transactions',
      icon: '🛒',
      label: 'Número de transacciones',
      value: summary.totalTransactions.toLocaleString('en-US'),
      change: summary.transactionsChange,
    },
    {
      key: 'ticket',
      icon: '📊',
      label: 'Ticket promedio',
      value: formatCurrency(summary.avgTicket),
      change: summary.ticketChange,
    },
  ]

  return (
    <section className="kpi-grid">
      {cards.map((card) => (
        <article key={card.key} className="kpi-card card">
          <div className="kpi-head">
            <span className="kpi-icon" aria-hidden="true">
              {card.icon}
            </span>
            <p className="kpi-label">{card.label}</p>
          </div>
          <p className="kpi-value">{card.value}</p>
          <ChangeIndicator value={card.change} />
        </article>
      ))}

      <article className="kpi-card card">
        <div className="kpi-head">
          <span className="kpi-icon" aria-hidden="true">
            🎯
          </span>
          <p className="kpi-label">Meta del mes</p>
        </div>
        <p className="kpi-value">{Math.round(goalProgress)}%</p>
        <p className="goal-caption">
          {Math.round(goalProgress)}% de {formatCurrency(monthlyGoal)}
        </p>
        <div className="goal-track" aria-hidden="true">
          <div className="goal-fill" style={{ width: `${Math.min(goalProgress, 100)}%` }} />
        </div>
      </article>
    </section>
  )
}

export default KPICards
