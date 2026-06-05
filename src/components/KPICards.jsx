function formatCurrency(value) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

function formatNumber(value) {
  return value.toLocaleString('en-US')
}

function formatPercent(value, decimals = 1) {
  return `${Math.round(value * 10 ** decimals) / 10 ** decimals}%`
}

function formatKpiValue(kpi) {
  if (kpi.valueType === 'currency') {
    return formatCurrency(kpi.value)
  }

  if (kpi.valueType === 'goal') {
    return `${formatPercent(kpi.value, 0)} de ${formatCurrency(kpi.goal)}`
  }

  return formatNumber(kpi.value)
}

function ChangeIndicator({ value }) {
  const isPositive = value >= 0

  return (
    <span className={`change-indicator ${isPositive ? 'positive' : 'negative'}`}>
      <span aria-hidden="true">{isPositive ? '↑' : '↓'}</span>
      {isPositive ? '+' : ''}
      {formatPercent(value)}
    </span>
  )
}

function KPICards({ kpis }) {
  return (
    <section className="kpi-grid" aria-label="Tarjetas de resumen">
      {kpis.map((kpi) => (
        <article className="kpi-card" key={kpi.id}>
          <div className="kpi-icon" aria-hidden="true">
            {kpi.icon}
          </div>

          <div className="kpi-content">
            <p className="kpi-title">{kpi.title}</p>
            <p className="kpi-value">{formatKpiValue(kpi)}</p>

            {kpi.valueType === 'goal' ? (
              <div className="goal-block">
                <div className="goal-track" aria-label={`Progreso de meta: ${formatPercent(kpi.value, 0)}`}>
                  <div className="goal-fill" style={{ width: `${Math.min(kpi.value, 100)}%` }} />
                </div>
                <span>{formatCurrency(kpi.sales)} vendidos</span>
              </div>
            ) : (
              <ChangeIndicator value={kpi.change} />
            )}
          </div>
        </article>
      ))}
    </section>
  )
}

export default KPICards
