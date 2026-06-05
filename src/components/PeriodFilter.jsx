import { PERIODS } from '../utils/calculations.js'
import { formatDateShort } from '../utils/format.js'

// Botones de período rápido + texto del rango mostrado.
export default function PeriodFilter({ activePeriod, onChange, range }) {
  return (
    <div className="period">
      <div className="period__buttons" role="tablist" aria-label="Período">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={activePeriod === p.id}
            className={
              'period__btn' +
              (activePeriod === p.id ? ' period__btn--active' : '')
            }
            onClick={() => onChange(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="period__range">
        Mostrando datos de:{' '}
        <strong>
          {formatDateShort(range.start)} – {formatDateShort(range.end)}
        </strong>
      </div>
    </div>
  )
}
