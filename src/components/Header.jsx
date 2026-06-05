import { formatLongDate } from "../utils/format.js";

export default function Header({ teamName, todayISO }) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <path
              d="M3 19h18M5 17V9m4 8V5m4 12v-7m4 7V8"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <div>
          <h1 className="app-header__title">SalesView</h1>
          <p className="app-header__team">{teamName}</p>
        </div>
      </div>
      <div className="app-header__date">{formatLongDate(todayISO)}</div>
    </header>
  );
}
