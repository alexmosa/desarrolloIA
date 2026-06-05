# SalesView — Dashboard de Métricas de Ventas

Dashboard interno y ejecutivo para un equipo de ventas. Muestra de un vistazo
las métricas clave del período: ventas totales, ticket promedio, número de
transacciones, comparación contra el período anterior, desglose por vendedor y
desglose por categoría de producto.

Es **solo frontend** (React + Vite), de **solo lectura**, con **datos
mockeados** en JSON. No tiene backend, base de datos ni APIs externas.

## Características

- **KPIs:** ventas totales, transacciones, ticket promedio y progreso hacia la
  meta mensual, cada uno con comparación vs. el período anterior.
- **Tabla de vendedores:** ordenable por cualquier columna, con avatar de
  iniciales, barra de participación, 🏆 para el líder y fila de totales.
- **Desglose por categoría:** barras horizontales (CSS puro) ordenadas de mayor
  a menor, con la categoría líder destacada.
- **Filtro por período:** "Últimos 7 días", "Este mes", "Últimos 3 meses".
  Al cambiarlo se recalcula todo el dashboard.
- Diseño responsive (desktop / tablet / mobile), solo modo claro.

## Stack

- React 18 + Vite
- CSS puro (sin librerías de gráficas, sin frameworks de UI)

## Cómo correrlo

```bash
npm install
npm run dev
```

Luego abre la URL que imprime Vite (por defecto `http://localhost:5173`).

Para una build de producción:

```bash
npm run build
npm run preview
```

## Datos mockeados

Los datos viven en la carpeta `data/`:

- `data/sales.json` — transacciones (`id`, `vendedor`, `categoria`, `monto`, `fecha`)
- `data/team.json` — vendedores (`nombre`, `color`)
- `data/config.json` — `meta_mensual`, `nombre_equipo`, `fecha_referencia`

`sales.json` se genera de forma determinista. Para regenerarlo:

```bash
npm run generate-data
```

> La "fecha actual" del dashboard es `config.fecha_referencia` (no el reloj
> real del navegador), de modo que cada vista por período siempre tiene datos.

## Estructura

```
data/                     Datos mockeados (JSON)
scripts/generateData.js   Generador determinista de sales.json
src/
  components/             Un componente por archivo
    Header.jsx
    PeriodFilter.jsx
    KPICards.jsx
    SalesTable.jsx
    CategoryBreakdown.jsx
  utils/
    calculations.js       Rangos de período, filtrado y agregaciones
    format.js             Formateo de montos, porcentajes y fechas
  App.jsx
  index.css               Design system
```

Las convenciones y restricciones del proyecto están en `.cursorrules`.
