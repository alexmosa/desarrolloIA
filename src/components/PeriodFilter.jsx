const PERIODS = [
  { key: 'last7', label: 'Últimos 7 días' },
  { key: 'thisMonth', label: 'Este mes' },
  { key: 'last3Months', label: 'Últimos 3 meses' },
];

function formatDateRange(start, end) {
  const opts = { day: 'numeric', month: 'short', year: 'numeric' };
  const s = start.toLocaleDateString('es-ES', opts);
  const e = end.toLocaleDateString('es-ES', opts);
  return `Mostrando datos de: ${s} – ${e}`;
}

export default function PeriodFilter({ activePeriod, dateRange, onPeriodChange }) {
  return (
    <div className="period-filter">
      <div className="period-buttons">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            className={`period-btn ${activePeriod === p.key ? 'active' : ''}`}
            onClick={() => onPeriodChange(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <span className="period-range-text">
        {formatDateRange(dateRange.start, dateRange.end)}
      </span>
    </div>
  );
}
