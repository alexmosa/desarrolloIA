import { isInRange } from "./dates.js";

export function filterSales(sales, startISO, endISO) {
  return sales.filter((s) => isInRange(s.fecha, startISO, endISO));
}

export function totals(sales) {
  const total = sales.reduce((s, t) => s + t.monto, 0);
  const count = sales.length;
  const avg = count > 0 ? total / count : 0;
  return { total, count, avg };
}

export function pctChange(current, previous) {
  if (!Number.isFinite(previous) || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export function buildVendorRows(currentSales, previousSales, team) {
  const teamTotal = currentSales.reduce((s, t) => s + t.monto, 0);

  const acc = new Map();
  for (const s of currentSales) {
    const e = acc.get(s.vendedor) ?? { total: 0, count: 0 };
    e.total += s.monto;
    e.count += 1;
    acc.set(s.vendedor, e);
  }

  const prevAcc = new Map();
  for (const s of previousSales) {
    const e = prevAcc.get(s.vendedor) ?? { total: 0, count: 0 };
    e.total += s.monto;
    e.count += 1;
    prevAcc.set(s.vendedor, e);
  }

  return team.map((member) => {
    const cur = acc.get(member.nombre) ?? { total: 0, count: 0 };
    const prev = prevAcc.get(member.nombre) ?? { total: 0, count: 0 };
    const avg = cur.count > 0 ? cur.total / cur.count : 0;
    const change = pctChange(cur.total, prev.total);
    const share = teamTotal > 0 ? (cur.total / teamTotal) * 100 : 0;
    return {
      nombre: member.nombre,
      color: member.color,
      total: cur.total,
      count: cur.count,
      avg,
      change,
      share,
    };
  });
}

export function buildCategoryRows(sales, palette) {
  const total = sales.reduce((s, t) => s + t.monto, 0);
  const acc = new Map();
  for (const s of sales) {
    acc.set(s.categoria, (acc.get(s.categoria) ?? 0) + s.monto);
  }
  const rows = [...acc.entries()].map(([nombre, monto]) => ({
    nombre,
    monto,
    pct: total > 0 ? (monto / total) * 100 : 0,
    color: palette[nombre] ?? "#1E3A5F",
  }));
  rows.sort((a, b) => b.monto - a.monto);
  return rows;
}

export function sortRows(rows, column, direction) {
  if (!column) return rows;
  const factor = direction === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const av = a[column];
    const bv = b[column];
    if (typeof av === "string") return av.localeCompare(bv) * factor;
    const an = Number.isFinite(av) ? av : -Infinity;
    const bn = Number.isFinite(bv) ? bv : -Infinity;
    if (an < bn) return -1 * factor;
    if (an > bn) return 1 * factor;
    return 0;
  });
}
