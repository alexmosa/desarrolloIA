// Aggregations for KPIs, vendor table and category breakdown.

export function totalSales(transactions) {
  return transactions.reduce((sum, t) => sum + t.monto, 0);
}

export function transactionCount(transactions) {
  return transactions.length;
}

export function averageTicket(transactions) {
  if (transactions.length === 0) return 0;
  return Math.round((totalSales(transactions) / transactions.length) * 100) / 100;
}

// Percentage change current vs. previous.
// Returns null when previous is 0 (avoid divide-by-zero / Infinity in UI).
export function pctChange(current, previous) {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

// Aggregate per vendor for a given window, plus comparison vs. previous window.
// Each row: { vendedor, color, ventas, transacciones, ticket, share, vsPrev }
export function vendorBreakdown(currentTx, previousTx, team) {
  const teamByName = new Map(team.map((m) => [m.nombre, m]));
  const totalCurrent = totalSales(currentTx);

  // Initialize a row for every team member so the table always has full roster.
  const rows = new Map();
  team.forEach((m) => {
    rows.set(m.nombre, {
      vendedor: m.nombre,
      color: m.color,
      ventas: 0,
      transacciones: 0,
      ticket: 0,
      share: 0,
      vsPrev: null,
      _prevVentas: 0,
    });
  });

  for (const tx of currentTx) {
    const row = rows.get(tx.vendedor) ?? {
      vendedor: tx.vendedor,
      color: teamByName.get(tx.vendedor)?.color ?? '#64748B',
      ventas: 0,
      transacciones: 0,
      ticket: 0,
      share: 0,
      vsPrev: null,
      _prevVentas: 0,
    };
    row.ventas += tx.monto;
    row.transacciones += 1;
    rows.set(tx.vendedor, row);
  }

  for (const tx of previousTx) {
    const row = rows.get(tx.vendedor);
    if (row) row._prevVentas += tx.monto;
  }

  return Array.from(rows.values())
    .map((r) => ({
      vendedor: r.vendedor,
      color: r.color,
      ventas: Math.round(r.ventas * 100) / 100,
      transacciones: r.transacciones,
      ticket: r.transacciones === 0 ? 0 : Math.round((r.ventas / r.transacciones) * 100) / 100,
      share: totalCurrent === 0 ? 0 : (r.ventas / totalCurrent) * 100,
      vsPrev: pctChange(r.ventas, r._prevVentas),
    }))
    .sort((a, b) => b.ventas - a.ventas);
}

// Totals row for the vendor table.
export function vendorTotals(rows) {
  const totals = rows.reduce(
    (acc, r) => {
      acc.ventas += r.ventas;
      acc.transacciones += r.transacciones;
      return acc;
    },
    { ventas: 0, transacciones: 0 },
  );
  return {
    ventas: Math.round(totals.ventas * 100) / 100,
    transacciones: totals.transacciones,
    ticket: totals.transacciones === 0 ? 0 : Math.round((totals.ventas / totals.transacciones) * 100) / 100,
  };
}

// Aggregate per category. Rows: { categoria, ventas, share }
export function categoryBreakdown(transactions) {
  const total = totalSales(transactions);
  const map = new Map();
  for (const tx of transactions) {
    map.set(tx.categoria, (map.get(tx.categoria) ?? 0) + tx.monto);
  }
  return Array.from(map.entries())
    .map(([categoria, ventas]) => ({
      categoria,
      ventas: Math.round(ventas * 100) / 100,
      share: total === 0 ? 0 : (ventas / total) * 100,
    }))
    .sort((a, b) => b.ventas - a.ventas);
}

// Sort vendor rows by a column. Direction: 'asc' | 'desc'.
export function sortVendorRows(rows, column, direction) {
  const dir = direction === 'asc' ? 1 : -1;
  const get = {
    vendedor:      (r) => r.vendedor.toLowerCase(),
    ventas:        (r) => r.ventas,
    transacciones: (r) => r.transacciones,
    ticket:        (r) => r.ticket,
    vsPrev:        (r) => (r.vsPrev == null ? -Infinity : r.vsPrev),
    share:         (r) => r.share,
  }[column];
  if (!get) return rows;
  return [...rows].sort((a, b) => {
    const av = get(a);
    const bv = get(b);
    if (av < bv) return -1 * dir;
    if (av > bv) return  1 * dir;
    return 0;
  });
}
