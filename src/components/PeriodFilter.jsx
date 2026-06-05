import { formatShortRange } from "../utils/format.js";

const PERIODS = [
  { id: "last7", label: "Últimos 7 días" },
  { id: "thisMonth", label: "Este mes" },
  { id: "last3Months", label: "Últimos 3 meses" },
];

export default function PeriodFilter({ selectedId, onSelect, range }) {
  return (
    <section className="period-filter" aria-label="Filtro por período">
      <div className="period-filter__buttons" role="tablist">
        {PERIODS.map((p) => {
          const isActive = p.id === selectedId;
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`period-filter__btn${isActive ? " is-active" : ""}`}
              onClick={() => onSelect(p.id)}
            >
              {p.label}
            </button>
          );
        })}
      </div>
      <p className="period-filter__range">
        Mostrando datos de:{" "}
        <strong>{formatShortRange(range.startISO, range.endISO)}</strong>
      </p>
    </section>
  );
}
