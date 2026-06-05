import { formatHeaderDate } from '../utils/formatters';

export default function Header({ teamName, currentDate }) {
  return (
    <header className="app-header">
      <div>
        <div className="brand">
          <span className="brand__icon" aria-hidden="true">
            📈
          </span>
          <div>
            <p className="eyebrow">Dashboard ejecutivo</p>
            <h1>SalesView</h1>
          </div>
        </div>
        <p className="team-name">{teamName}</p>
      </div>

      <div className="header-date">
        <span>Fecha de referencia</span>
        <strong>{formatHeaderDate(currentDate)}</strong>
      </div>
    </header>
  );
}
