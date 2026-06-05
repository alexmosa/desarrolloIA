import { PERIODS } from '../utils/metrics.js';

export default function PeriodFilter({
  selectedPeriod,
  onPeriodChange,
  periodLabel,
}) {
  return (
    <section className="period-filter" aria-label="Filtro por periodo">
      <div className="period-buttons" role="group" aria-label="Periodos rápidos">
        {PERIODS.map((period) => (
          <button
            className={period.key === selectedPeriod ? 'active' : ''}
            key={period.key}
            onClick={() => onPeriodChange(period.key)}
            type="button"
          >
            {period.label}
          </button>
        ))}
      </div>
      <p>
        Mostrando datos de: <strong>{periodLabel}</strong>
      </p>
    </section>
  );
}
