import { formatLongDate } from '../utils';

function Header({ teamName, referenceDate }) {
  return (
    <header className="app-header">
      <div className="brand-block">
        <div className="brand-icon" aria-hidden="true">
          📈
        </div>
        <div>
          <span className="brand-label">Dashboard ejecutivo</span>
          <h1>SalesView</h1>
          <p>{teamName}</p>
        </div>
      </div>

      <div className="header-date">
        <span>Fecha actual</span>
        <strong>{formatLongDate(referenceDate)}</strong>
      </div>
    </header>
  );
}

export default Header;
