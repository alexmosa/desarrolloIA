import { useMemo, useState } from "react";
import { sortRows } from "../utils/calc.js";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatPercentChange,
  getInitials,
} from "../utils/format.js";

const COLUMNS = [
  { id: "nombre", label: "Vendedor", numeric: false, align: "left" },
  { id: "total", label: "Ventas totales", numeric: true, align: "right" },
  { id: "count", label: "Transacciones", numeric: true, align: "right" },
  { id: "avg", label: "Ticket promedio", numeric: true, align: "right" },
  { id: "change", label: "vs. Mes anterior", numeric: true, align: "right" },
  { id: "share", label: "% del equipo", numeric: true, align: "left" },
];

function SortIcon({ direction }) {
  return (
    <span className="sales-table__sort" aria-hidden="true">
      {direction === "asc" ? "▲" : direction === "desc" ? "▼" : "↕"}
    </span>
  );
}

function ChangeCell({ value }) {
  if (value === null || !Number.isFinite(value)) {
    return <span className="change change--neutral">—</span>;
  }
  const positive = value >= 0;
  return (
    <span className={`change ${positive ? "change--up" : "change--down"}`}>
      <span aria-hidden="true">{positive ? "↑" : "↓"}</span>{" "}
      {formatPercentChange(value)}
    </span>
  );
}

export default function SalesTable({ rows }) {
  const [sortColumn, setSortColumn] = useState("total");
  const [sortDirection, setSortDirection] = useState("desc");

  const sorted = useMemo(
    () => sortRows(rows, sortColumn, sortDirection),
    [rows, sortColumn, sortDirection],
  );

  const topVendor = useMemo(() => {
    const ranked = [...rows].sort((a, b) => b.total - a.total);
    return ranked[0]?.nombre;
  }, [rows]);

  const totals = useMemo(() => {
    const total = rows.reduce((s, r) => s + r.total, 0);
    const count = rows.reduce((s, r) => s + r.count, 0);
    const avg = count > 0 ? total / count : 0;
    return { total, count, avg };
  }, [rows]);

  function handleSort(colId) {
    if (sortColumn === colId) {
      setSortDirection((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortColumn(colId);
      setSortDirection("desc");
    }
  }

  return (
    <section className="panel sales-table-panel">
      <header className="panel__header">
        <h2 className="panel__title">Ventas por vendedor</h2>
        <p className="panel__subtitle">{rows.length} vendedores activos</p>
      </header>
      <div className="sales-table__wrapper">
        <table className="sales-table">
          <thead>
            <tr>
              {COLUMNS.map((c) => (
                <th
                  key={c.id}
                  scope="col"
                  className={`sales-table__th sales-table__th--${c.align}`}
                  aria-sort={
                    sortColumn === c.id
                      ? sortDirection === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <button
                    type="button"
                    className="sales-table__sort-btn"
                    onClick={() => handleSort(c.id)}
                  >
                    <span>{c.label}</span>
                    <SortIcon
                      direction={sortColumn === c.id ? sortDirection : null}
                    />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const isTop = r.nombre === topVendor && r.total > 0;
              return (
                <tr key={r.nombre} className="sales-table__row">
                  <td className="sales-table__td">
                    <div className="vendor-cell">
                      <span
                        className="vendor-cell__avatar"
                        style={{ backgroundColor: r.color }}
                        aria-hidden="true"
                      >
                        {getInitials(r.nombre)}
                      </span>
                      <span className="vendor-cell__name">{r.nombre}</span>
                      {isTop && (
                        <span
                          className="vendor-cell__trophy"
                          title="Mejor vendedor del período"
                          aria-label="Mejor vendedor del período"
                        >
                          🏆
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="sales-table__td sales-table__td--right sales-table__td--money">
                    {formatCurrency(r.total)}
                  </td>
                  <td className="sales-table__td sales-table__td--right">
                    {formatNumber(r.count)}
                  </td>
                  <td className="sales-table__td sales-table__td--right sales-table__td--money">
                    {r.count > 0
                      ? formatCurrency(r.avg, { withDecimals: true })
                      : "—"}
                  </td>
                  <td className="sales-table__td sales-table__td--right">
                    <ChangeCell value={r.change} />
                  </td>
                  <td className="sales-table__td">
                    <div className="share-bar">
                      <div className="share-bar__track">
                        <div
                          className="share-bar__fill"
                          style={{
                            width: `${Math.min(r.share, 100)}%`,
                            backgroundColor: r.color,
                          }}
                        />
                      </div>
                      <span className="share-bar__label">
                        {formatPercent(r.share)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="sales-table__totals">
              <td className="sales-table__td">Total equipo</td>
              <td className="sales-table__td sales-table__td--right sales-table__td--money">
                {formatCurrency(totals.total)}
              </td>
              <td className="sales-table__td sales-table__td--right">
                {formatNumber(totals.count)}
              </td>
              <td className="sales-table__td sales-table__td--right sales-table__td--money">
                {totals.count > 0
                  ? formatCurrency(totals.avg, { withDecimals: true })
                  : "—"}
              </td>
              <td className="sales-table__td" colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
