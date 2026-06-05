function formatHeaderDate(date) {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function Header({ teamName, currentDate }) {
  return (
    <header className="app-header">
      <div className="brand-block">
        <div className="brand-icon" aria-hidden="true">
          📈
        </div>
        <div>
          <h1>SalesView</h1>
          <p>{teamName}</p>
        </div>
      </div>

      <time dateTime={currentDate.toISOString()}>{formatHeaderDate(currentDate)}</time>
    </header>
  )
}

export default Header
