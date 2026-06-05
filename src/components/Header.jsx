import { formatDateLong } from '../utils/format.js'

// Header de una sola vista: marca a la izquierda, fecha y equipo a la derecha.
export default function Header({ teamName, currentDate }) {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand">
          <span className="header__logo" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="12" width="3.2" height="7" rx="1" fill="#93C5FD" />
              <rect x="10.4" y="8" width="3.2" height="11" rx="1" fill="#34D399" />
              <rect x="16.8" y="5" width="3.2" height="14" rx="1" fill="#FBBF24" />
            </svg>
          </span>
          <div>
            <div className="header__title">SalesView</div>
            <div className="header__team">{teamName}</div>
          </div>
        </div>
        <div className="header__meta">
          <div className="header__date-label">Fecha actual</div>
          <div className="header__date">{formatDateLong(currentDate)}</div>
        </div>
      </div>
    </header>
  )
}
