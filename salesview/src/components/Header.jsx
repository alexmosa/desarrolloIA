import styles from './Header.module.css';

export default function Header({ teamName }) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const capitalized = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.icon} aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="12" width="4" height="9" rx="1" fill="currentColor" opacity="0.6"/>
            <rect x="10" y="7" width="4" height="14" rx="1" fill="currentColor" opacity="0.8"/>
            <rect x="17" y="3" width="4" height="18" rx="1" fill="currentColor"/>
          </svg>
        </span>
        <span className={styles.appName}>SalesView</span>
      </div>
      <div className={styles.meta}>
        <span className={styles.teamName}>{teamName}</span>
        <span className={styles.date}>{capitalized}</span>
      </div>
    </header>
  );
}
