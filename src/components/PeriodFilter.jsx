import { PERIODS } from '../utils/dates.js'
import { formatDateLabel } from '../utils/format.js'

// Barra de filtros de período. Botones rápidos + texto del rango activo.
export default function PeriodFilter({ active, onChange, range }) {
  return (
    <div className="period-filter">
      <div className="period-filter__buttons">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`period-btn${active === p.id ? ' period-btn--active' : ''}`}
            onClick={() => onChange(p.id)}
            aria-pressed={active === p.id}
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="period-filter__range">
        Mostrando datos de:{' '}
        <strong>
          {formatDateLabel(range.start)} – {formatDateLabel(range.end)}
        </strong>
      </p>
    </div>
  )
}
