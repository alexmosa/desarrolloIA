import styles from './KPICards.module.css';

function formatMoney(value) {
  return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatChange(pct) {
  if (pct === null || isNaN(pct)) return null;
  const sign = pct >= 0 ? '+' : '';
  return { text: `${sign}${pct.toFixed(1)}%`, positive: pct >= 0 };
}

function ChangeTag({ pct }) {
  const change = formatChange(pct);
  if (!change) return null;
  return (
    <span className={`${styles.changeTag} ${change.positive ? styles.positive : styles.negative}`}>
      {change.positive ? '↑' : '↓'} {change.text}
    </span>
  );
}

function ProgressBar({ value, max }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={styles.progressWrapper}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <span className={styles.progressLabel}>{pct}% de {formatMoney(max)}</span>
    </div>
  );
}

export default function KPICards({ kpis, metaMensual }) {
  const { totalVentas, totalTransacciones, ticketPromedio,
          prevVentas, prevTransacciones, prevTicket } = kpis;

  const ventasPct = prevVentas ? ((totalVentas - prevVentas) / prevVentas) * 100 : null;
  const txPct = prevTransacciones ? ((totalTransacciones - prevTransacciones) / prevTransacciones) * 100 : null;
  const ticketPct = prevTicket ? ((ticketPromedio - prevTicket) / prevTicket) * 100 : null;

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.cardLeft}>
          <span className={styles.cardIcon}>💰</span>
        </div>
        <div className={styles.cardBody}>
          <span className={styles.cardLabel}>Ventas totales del mes</span>
          <span className={styles.cardValue}>{formatMoney(totalVentas)}</span>
          <ChangeTag pct={ventasPct} />
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardLeft}>
          <span className={styles.cardIcon}>🛒</span>
        </div>
        <div className={styles.cardBody}>
          <span className={styles.cardLabel}>Transacciones</span>
          <span className={styles.cardValue}>{totalTransacciones.toLocaleString('en-US')}</span>
          <ChangeTag pct={txPct} />
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardLeft}>
          <span className={styles.cardIcon}>📊</span>
        </div>
        <div className={styles.cardBody}>
          <span className={styles.cardLabel}>Ticket promedio</span>
          <span className={styles.cardValue}>{formatMoney(ticketPromedio)}</span>
          <ChangeTag pct={ticketPct} />
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardLeft}>
          <span className={styles.cardIcon}>🎯</span>
        </div>
        <div className={styles.cardBody}>
          <span className={styles.cardLabel}>Meta del mes</span>
          <span className={styles.cardValue}>{formatMoney(totalVentas)}</span>
          <ProgressBar value={totalVentas} max={metaMensual} />
        </div>
      </div>
    </div>
  );
}
