function Header({ teamName, currentDateLabel }) {
  return (
    <header className="app-header card">
      <div className="header-left">
        <h1 className="brand">
          <span className="brand-icon" aria-hidden="true">
            📈
          </span>
          SalesView
        </h1>
        <p className="team-name">{teamName}</p>
      </div>
      <p className="current-date">{currentDateLabel}</p>
    </header>
  )
}

export default Header
