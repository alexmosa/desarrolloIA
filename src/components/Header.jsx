export default function Header({ teamName }) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="header">
      <div className="header-left">
        <span className="header-icon">📈</span>
        <h1 className="header-title">SalesView</h1>
      </div>
      <div className="header-right">
        <span className="header-team">{teamName}</span>
        <span className="header-date">{formattedDate}</span>
      </div>
    </header>
  );
}
