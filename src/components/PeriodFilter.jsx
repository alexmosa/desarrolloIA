export default function PeriodFilter({
  options,
  selectedPeriod,
  onChange,
  periodLabel,
}) {
  return (
    <section className="panel filter-panel">
      <div>
        <p className="panel__eyebrow">Período</p>
        <h2 className="panel__title">Filtro de análisis</h2>
      </div>

      <div className="filter-panel__actions">
        <div className="filter-buttons" role="tablist" aria-label="Períodos rápidos">
          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              className={`filter-button ${
                selectedPeriod === option.key ? 'filter-button--active' : ''
              }`}
              onClick={() => onChange(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <p className="filter-period-label">
          Mostrando datos de: <strong>{periodLabel}</strong>
        </p>
      </div>
    </section>
  );
}
