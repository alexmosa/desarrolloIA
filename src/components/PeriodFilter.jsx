function PeriodFilter({ periods, selectedPeriod, onPeriodChange, rangeLabel }) {
  return (
    <section className="filter-card" aria-label="Filtro por período">
      <div className="period-buttons" role="group" aria-label="Períodos rápidos">
        {periods.map((period) => (
          <button
            className={`period-button ${selectedPeriod === period.key ? 'active' : ''}`}
            key={period.key}
            type="button"
            onClick={() => onPeriodChange(period.key)}
          >
            {period.label}
          </button>
        ))}
      </div>

      <p className="range-label">
        Mostrando datos de: <strong>{rangeLabel}</strong>
      </p>
    </section>
  )
}

export default PeriodFilter
