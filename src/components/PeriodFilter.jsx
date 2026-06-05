import { PERIOD_OPTIONS } from '../utils/metrics'
import { formatRangeLabel } from '../utils/formatters'

function PeriodFilter({ selectedPeriod, onChangePeriod, range }) {
  return (
    <section className="panel period-filter">
      <div className="period-buttons">
        {PERIOD_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`period-btn ${selectedPeriod === option.id ? 'active' : ''}`}
            onClick={() => onChangePeriod(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="range-label">
        Mostrando datos de: {formatRangeLabel(range.startDate, range.endDate)}
      </p>
    </section>
  )
}

export default PeriodFilter
