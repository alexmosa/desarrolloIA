# SalesView

Dashboard interno de métricas de ventas para equipos comerciales. Visualización ejecutiva con KPIs, tabla por vendedor y desglose por categoría. Los datos son mockeados en JSON local — sin backend ni APIs.

## Requisitos

- Node.js 18+

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Estructura

```
data/           # sales.json, team.json, config.json
src/
  components/   # Header, PeriodFilter, KPICards, SalesTable, CategoryBreakdown
  utils/        # Cálculos y formateo
```

## Períodos

- **Últimos 7 días**, **Este mes** (por defecto), **Últimos 3 meses**
- La comparación "vs. mes anterior" usa el mismo rango de días del período previo.
