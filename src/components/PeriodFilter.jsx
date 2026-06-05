import { PERIOD_OPTIONS } from '../utils';

function PeriodFilter({ selectedPeriod, onPeriodChange, rangeLabel }) {
  return (
    <section className="panel filter-panel">
      <div className="filter-actions">
        {PERIOD_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`filter-button ${selectedPeriod === option.id ? 'active' : ''}`}
            onClick={() => onPeriodChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <p className="filter-range">
        Mostrando datos de: <strong>{rangeLabel}</strong>
      </p>
    </section>
  );
}

export default PeriodFilter;
