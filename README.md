# SalesView

Dashboard interno para un equipo de ventas. Muestra los KPIs del período
seleccionado (últimos 7 días, este mes, últimos 3 meses) con tabla de vendedores,
desglose por categoría y comparación contra el período anterior. Es una single
page, solo frontend, con datos mockeados en JSON.

## Stack

- React 19 + Vite
- CSS puro (sin Tailwind, sin librerías de UI, sin librerías de gráficos)
- Datos mockeados en `data/*.json`

## Cómo correrlo

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # bundle de producción en dist/
npm run preview      # sirve el bundle generado
npm run lint
```

## Estructura

```
data/
  config.json        meta mensual, nombre del equipo, fecha de referencia
  team.json          vendedores y colores de avatar
  sales.json         transacciones (104 mockeadas, 3 meses)
scripts/
  generate-sales.js  regenera sales.json determinísticamente
src/
  App.jsx
  main.jsx
  components/        Header, PeriodFilter, KPICards, SalesTable, CategoryBreakdown
  utils/             format, dates, calc (funciones puras)
  styles/global.css  design system + estilos
```

## Notas

- El demo usa `config.fecha_referencia` (`2026-03-22`) como "hoy" para que los
  cálculos de período y comparaciones sean reproducibles. Las cifras del mes
  actual están calibradas para llegar al 78% de la meta y reflejar un
  crecimiento ~+12% versus el mes anterior, igual que el ejemplo del spec.
- Para regenerar la data: `node scripts/generate-sales.js`.
- Las convenciones del proyecto y restricciones del spec viven en
  [`.cursorrules`](.cursorrules).
