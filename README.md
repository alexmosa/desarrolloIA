# SalesView

Dashboard ejecutivo de métricas de ventas, construido con **React + Vite**.
Es una herramienta interna de visualización: **frontend puro, sin backend,
sin login, sin APIs externas**. Todos los datos están mockeados en
`data/*.json`.

![Stack](https://img.shields.io/badge/stack-React%2018%20%2B%20Vite-1E3A5F)
![Datos](https://img.shields.io/badge/datos-JSON%20mockeado-64748B)

## ¿Qué muestra?

- **KPIs del mes:** ventas totales, número de transacciones, ticket promedio
  y avance vs. la meta mensual, cada uno con su comparación contra el
  período anterior.
- **Tabla de vendedores:** ranking ordenable por cualquier columna, con
  avatar, ventas, transacciones, ticket, % de cambio vs. el período
  anterior, y barra de participación del equipo. La fila con mayor venta se
  marca con 🏆 y al final hay una fila de totales.
- **Desglose por categoría:** lista ordenada con monto, % del total y barra
  horizontal coloreada, más el resumen de la categoría líder.
- **Filtro de período:** "Últimos 7 días" / "Este mes" / "Últimos 3 meses".
  Al cambiarlo se recalculan KPIs, tabla y categorías.

## Estructura

```
data/
  sales.json        # 80+ transacciones mockeadas (Abr–Jun 2026)
  team.json         # 6 vendedores con color de avatar
  config.json       # meta_mensual, nombre_equipo, fecha_referencia
scripts/
  generate-data.mjs # regenera los JSON de forma determinista
src/
  App.jsx
  main.jsx
  styles.css
  components/
    Header.jsx
    PeriodFilter.jsx
    KPICards.jsx
    SalesTable.jsx
    CategoryBreakdown.jsx
  utils/
    format.js       # formateo de moneda, %, fechas, iniciales
    periods.js      # rangos de fechas en UTC, filtrado por rango
    calculations.js # totales, ticket, % cambio, agregaciones, sort
.cursorrules        # reglas del proyecto (design system + qué NO incluir)
```

## Cómo correrlo

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # bundle de producción a dist/
npm run preview   # sirve el build
```

Para regenerar los datos mockeados (semilla fija → mismos números cada vez):

```bash
npm run generate-data
```

## Notas

- La fecha "actual" del dashboard se toma de `config.fecha_referencia`
  (`2026-06-05`) para que la demo sea determinista, independientemente del
  reloj del navegador.
- Todas las restricciones de diseño y producto (paleta, tipografía, qué
  NO incluir) están documentadas en [`.cursorrules`](./.cursorrules).
