// Cálculos de métricas a partir de las transacciones filtradas.

function sumMontos(txs) {
  return txs.reduce((acc, t) => acc + t.monto, 0)
}

// KPIs globales del período: ventas totales, # transacciones y ticket promedio.
export function computeKPIs(currentTxs) {
  const total = sumMontos(currentTxs)
  const count = currentTxs.length
  const ticket = count > 0 ? Math.round((total / count) * 100) / 100 : 0
  return { total, count, ticket }
}

// Desglose por vendedor para el período actual y el anterior.
// Devuelve filas con ventas, transacciones, ticket, % de participación y
// el total del vendedor en el período anterior (para la comparación).
export function computeVendorRows(currentTxs, previousTxs, team) {
  const teamTotal = sumMontos(currentTxs)

  const byVendorPrev = new Map()
  for (const t of previousTxs) {
    byVendorPrev.set(t.vendedor, (byVendorPrev.get(t.vendedor) || 0) + t.monto)
  }

  const byVendorCur = new Map()
  for (const t of currentTxs) {
    const entry = byVendorCur.get(t.vendedor) || { total: 0, count: 0 }
    entry.total += t.monto
    entry.count += 1
    byVendorCur.set(t.vendedor, entry)
  }

  const rows = team.map((member) => {
    const cur = byVendorCur.get(member.nombre) || { total: 0, count: 0 }
    const prev = byVendorPrev.get(member.nombre) || 0
    const ticket = cur.count > 0 ? Math.round((cur.total / cur.count) * 100) / 100 : 0
    const share = teamTotal > 0 ? (cur.total / teamTotal) * 100 : 0
    return {
      nombre: member.nombre,
      color: member.color,
      total: cur.total,
      count: cur.count,
      ticket,
      share,
      previousTotal: prev,
    }
  })

  return { rows, teamTotal, teamCount: currentTxs.length }
}

// Desglose por categoría, ordenado de mayor a menor venta.
export function computeCategoryBreakdown(currentTxs, categoryColors) {
  const total = sumMontos(currentTxs)
  const byCat = new Map()
  for (const t of currentTxs) {
    byCat.set(t.categoria, (byCat.get(t.categoria) || 0) + t.monto)
  }

  const rows = Array.from(byCat.entries())
    .map(([nombre, monto]) => ({
      nombre,
      monto,
      pct: total > 0 ? (monto / total) * 100 : 0,
      color: categoryColors[nombre] || '#64748B',
    }))
    .sort((a, b) => b.monto - a.monto)

  return { rows, total, leader: rows[0] || null }
}
