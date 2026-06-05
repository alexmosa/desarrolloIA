import { PERIOD_OPTIONS } from '../utils/periods.js';
import { formatShortDate, toISODate } from '../utils/format.js';

export default function PeriodFilter({ active, onChange, range }) {
  const rangeLabel = `${formatShortDate(toISODate(range.start))} – ${formatShortDate(toISODate(range.end))}`;

  return (
    <section className="sv-filter" aria-label="Filtro de período">
      <div className="sv-filter__buttons" role="tablist" aria-label="Período rápido">
        {PERIOD_OPTIONS.map((opt) => {
          const isActive = opt.key === active;
          return (
            <button
              key={opt.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`sv-filter__btn${isActive ? ' is-active' : ''}`}
              onClick={() => onChange(opt.key)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <p className="sv-filter__range">
        <span className="sv-filter__range-label">Mostrando datos de:</span>{' '}
        <span className="sv-filter__range-value">{rangeLabel}</span>
      </p>
    </section>
  );
}
