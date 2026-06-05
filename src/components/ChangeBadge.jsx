import { formatPercent } from '../utils/metrics.js';

export default function ChangeBadge({ value }) {
  const directionClass =
    value === null ? 'neutral' : value >= 0 ? 'positive' : 'negative';
  const arrow = value === null ? '→' : value >= 0 ? '↑' : '↓';

  return (
    <span className={`change-badge ${directionClass}`}>
      <span aria-hidden="true">{arrow}</span>
      {formatPercent(value)}
    </span>
  );
}
