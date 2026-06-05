# SalesView — Dashboard de Métricas de Ventas

Dashboard interno y ejecutivo para un equipo de ventas. Muestra las métricas
clave del mes de forma visual: ventas totales, ticket promedio, número de
transacciones, comparación con el período anterior, desglose por vendedor y por
categoría de producto.

Es **solo frontend** (React + Vite), de **solo lectura**, con **datos
mockeados**. No tiene backend, base de datos ni autenticación.

## Características

- **KPIs**: ventas totales, transacciones, ticket promedio y progreso de meta,
  cada uno con comparación contra el período anterior (↑ verde / ↓ rojo).
- **Tabla de vendedores** ordenable por cualquier columna (asc/desc), con avatar
  de iniciales, barra de participación, distintivo 🏆 al líder y fila de totales.
- **Desglose por categoría** con barras horizontales de color y categoría líder.
- **Filtro de período**: «Últimos 7 días», «Este mes», «Últimos 3 meses».
  Al cambiarlo se recalcula todo (KPIs, tabla y categorías).
- Diseño responsive (desktop / tablet / mobile).

## Cómo correrlo

```bash
npm install
npm run dev      # servidor de desarrollo (http://localhost:5173)
npm run build    # build de producción
npm run preview  # previsualizar el build
```

## Datos

Los datos viven en `data/` como JSON:

- `data/sales.json` — transacciones (`id`, `vendedor`, `categoria`, `monto`, `fecha`).
- `data/team.json` — vendedores (`nombre`, `color`).
- `data/config.json` — `meta_mensual`, `nombre_equipo`, `fecha_referencia`.

`sales.json` se genera de forma determinista (RNG con semilla) y el mes actual
representa exactamente el 78 % de la meta. Para regenerarlo:

```bash
npm run gen:data
```

Todas las fechas y cálculos se hacen respecto a `config.fecha_referencia`
(no al reloj del sistema), de modo que la demo siempre se ve igual.

## Estructura

```
data/                 # datos mockeados (JSON)
scripts/
  generate-data.js    # generador determinista de sales.json
src/
  components/         # un componente por archivo
    Header.jsx
    PeriodFilter.jsx
    KPICards.jsx
    SalesTable.jsx
    CategoryBreakdown.jsx
  utils/              # formateo, fechas y métricas
    format.js
    dates.js
    metrics.js
  constants.js        # colores de categoría
  App.jsx
  main.jsx
  index.css           # design system (variables CSS)
.cursorrules          # reglas del proyecto
```

Las reglas del proyecto (design system, convenciones y restricciones) están en
[`.cursorrules`](./.cursorrules).
