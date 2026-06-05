export default function Header({ teamName, currentDate }) {
  const formattedDate = currentDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__icon" aria-hidden="true">
          📈
        </span>
        <div>
          <h1 className="header__title">SalesView</h1>
          <p className="header__team">{teamName}</p>
        </div>
      </div>
      <time className="header__date" dateTime={currentDate.toISOString()}>
        {formattedDate}
      </time>
    </header>
  );
}
