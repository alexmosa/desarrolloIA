import { formatDateLong } from '../utils/format.js'

// Header de la app: logo + nombre, equipo y fecha actual (de referencia).
export default function Header({ nombreEquipo, fechaActual }) {
  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__logo" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="12" width="3.4" height="7" rx="1" fill="#3B82F6" />
            <rect x="10.3" y="8" width="3.4" height="11" rx="1" fill="#10B981" />
            <rect x="16.6" y="5" width="3.4" height="14" rx="1" fill="#F59E0B" />
          </svg>
        </span>
        <div className="header__titles">
          <h1 className="header__name">SalesView</h1>
          <span className="header__team">{nombreEquipo}</span>
        </div>
      </div>
      <div className="header__date">
        <span className="header__date-label">Fecha actual</span>
        <span className="header__date-value">{formatDateLong(fechaActual)}</span>
      </div>
    </header>
  )
}
