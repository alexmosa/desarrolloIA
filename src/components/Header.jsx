import { formatHeaderDate } from '../utils/formatters'

function Header({ teamName, date }) {
  return (
    <header className="app-header">
      <div className="brand-block">
        <div className="brand-title">
          <span className="brand-icon" aria-hidden="true">
            📈
          </span>
          <h1>SalesView</h1>
        </div>
        <p className="team-name">{teamName}</p>
      </div>
      <p className="current-date">{formatHeaderDate(date)}</p>
    </header>
  )
}

export default Header
