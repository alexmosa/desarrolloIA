import { formatLongDate } from '../utils/format.js';

export default function Header({ teamName, todayStr }) {
  return (
    <header className="sv-header">
      <div className="sv-header__brand">
        <span className="sv-header__logo" aria-hidden="true">
          {/* Inline SVG chart icon, intentionally no external dependency. */}
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18" />
            <path d="M7 15l3-4 4 3 5-7" />
          </svg>
        </span>
        <div>
          <h1 className="sv-header__title">SalesView</h1>
          <p className="sv-header__team">{teamName}</p>
        </div>
      </div>
      <div className="sv-header__date" aria-label="Fecha actual">
        {formatLongDate(todayStr)}
      </div>
    </header>
  );
}
