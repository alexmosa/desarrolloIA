import { PERIOD_PRESETS } from '../utils/salesUtils';

const PERIOD_OPTIONS = [
  { key: PERIOD_PRESETS.last7, label: 'Últimos 7 días' },
  { key: PERIOD_PRESETS.thisMonth, label: 'Este mes' },
  { key: PERIOD_PRESETS.last3Months, label: 'Últimos 3 meses' },
];

export default function PeriodFilter({
  activePeriod,
  onPeriodChange,
  periodLabel,
}) {
  return (
    <section className="period-filter">
      <div className="period-filter__buttons">
        {PERIOD_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className={`period-filter__btn${
              activePeriod === key ? ' period-filter__btn--active' : ''
            }`}
            onClick={() => onPeriodChange(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="period-filter__label">{periodLabel}</p>
    </section>
  );
}
