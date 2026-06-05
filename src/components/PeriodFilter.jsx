import { PERIOD_OPTIONS } from '../utils/metrics'

function PeriodFilter({ selectedPeriod, onSelectPeriod, rangeLabel }) {
  return (
    <section className="period-filter card">
      <div className="period-buttons" role="group" aria-label="Filtrar por período">
        {PERIOD_OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            className={`period-button ${selectedPeriod === option.key ? 'active' : ''}`}
            onClick={() => onSelectPeriod(option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="period-range-label">Mostrando datos de: {rangeLabel}</p>
    </section>
  )
}

export default PeriodFilter
