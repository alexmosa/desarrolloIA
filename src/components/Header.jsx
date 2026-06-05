import { formatDateLong } from '../utils/metrics.js';

export default function Header({ teamName, currentDate }) {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-icon" aria-hidden="true">
          📈
        </span>
        <div>
          <h1>SalesView</h1>
          <p>{teamName}</p>
        </div>
      </div>
      <div className="header-date">
        <span>Fecha actual</span>
        <strong>{formatDateLong(currentDate)}</strong>
      </div>
    </header>
  );
}
