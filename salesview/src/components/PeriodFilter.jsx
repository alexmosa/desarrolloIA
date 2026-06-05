import styles from './PeriodFilter.module.css';

const PERIODS = [
  { key: '7d', label: 'Últimos 7 días' },
  { key: 'month', label: 'Este mes' },
  { key: '3m', label: 'Últimos 3 meses' },
];

function formatDate(date) {
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function PeriodFilter({ activePeriod, onChangePeriod, dateRange }) {
  const label = dateRange
    ? `Mostrando datos de: ${formatDate(dateRange.start)} — ${formatDate(dateRange.end)}`
    : '';

  return (
    <div className={styles.wrapper}>
      <div className={styles.buttons}>
        {PERIODS.map(p => (
          <button
            key={p.key}
            className={`${styles.btn} ${activePeriod === p.key ? styles.active : ''}`}
            onClick={() => onChangePeriod(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>
      {label && <span className={styles.rangeLabel}>{label}</span>}
    </div>
  );
}
