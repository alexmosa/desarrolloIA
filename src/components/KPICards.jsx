function formatCurrency(value) {
  return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatChange(current, previous) {
  if (previous === 0) return { text: 'N/A', className: 'neutral' };
  const pct = ((current - previous) / previous) * 100;
  const rounded = pct.toFixed(1);
  if (pct > 0) return { text: `+${rounded}%`, className: 'positive', arrow: '↑' };
  if (pct < 0) return { text: `${rounded}%`, className: 'negative', arrow: '↓' };
  return { text: '0.0%', className: 'neutral', arrow: '' };
}

export default function KPICards({ currentData, previousData, monthlyGoal }) {
  const totalSales = currentData.reduce((s, d) => s + d.monto, 0);
  const totalTransactions = currentData.length;
  const avgTicket = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  const prevSales = previousData.reduce((s, d) => s + d.monto, 0);
  const prevTransactions = previousData.length;
  const prevAvgTicket = prevTransactions > 0 ? prevSales / prevTransactions : 0;

  const goalPct = monthlyGoal > 0 ? (totalSales / monthlyGoal) * 100 : 0;

  const salesChange = formatChange(totalSales, prevSales);
  const transChange = formatChange(totalTransactions, prevTransactions);
  const ticketChange = formatChange(avgTicket, prevAvgTicket);

  const cards = [
    {
      icon: '💰',
      label: 'Ventas totales del mes',
      value: formatCurrency(totalSales),
      change: salesChange,
    },
    {
      icon: '🛒',
      label: 'Número de transacciones',
      value: totalTransactions.toLocaleString('en-US'),
      change: transChange,
    },
    {
      icon: '📊',
      label: 'Ticket promedio',
      value: formatCurrency(Math.round(avgTicket * 100) / 100),
      change: ticketChange,
    },
    {
      icon: '🎯',
      label: 'Meta del mes',
      isGoal: true,
      goalPct: Math.min(goalPct, 100),
      goalText: `${goalPct.toFixed(0)}% de ${formatCurrency(monthlyGoal)}`,
    },
  ];

  return (
    <div className="kpi-cards">
      {cards.map((card, i) => (
        <div className="kpi-card" key={i}>
          <span className="kpi-icon">{card.icon}</span>
          <div className="kpi-content">
            <span className="kpi-label">{card.label}</span>
            {card.isGoal ? (
              <>
                <span className="kpi-value">{card.goalText}</span>
                <div className="kpi-progress-bar">
                  <div
                    className="kpi-progress-fill"
                    style={{ width: `${card.goalPct}%` }}
                  />
                </div>
              </>
            ) : (
              <>
                <span className="kpi-value">{card.value}</span>
                <span className={`kpi-change ${card.change.className}`}>
                  {card.change.arrow && <span className="kpi-arrow">{card.change.arrow}</span>}
                  {card.change.text}
                  <span className="kpi-change-label"> vs. período anterior</span>
                </span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
