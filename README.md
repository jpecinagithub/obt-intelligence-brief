# OBT Intelligence Brief

Web app ejecutiva y responsive que presenta el dossier corporativo de **OBT Group** con foco especial en **Sierra Leona**. Data room editorial, no página promocional.

- **Stack:** Next.js 15 (App Router), TypeScript estricto, Tailwind CSS v4, Recharts, d3-geo (mapa SVG propio, sin APIs de pago).
- **Sin información financiera:** la sección de cuentas de OBT SHIPPING ApS se eliminó del proyecto por fiabilidad insuficiente.
- **Datos:** dataset local tipado en `data/` (`es.ts` / `en.ts` + `sources.ts`), fácilmente sustituible por CMS/API.
- **Idiomas:** español por defecto + selector ES/EN (dataset 100% bilingüe).
- **Temas:** claro y oscuro. **PWA:** manifest + service worker. **Analytics:** `@vercel/analytics` (activar en el dashboard de Vercel).

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
```

## Verificación

```bash
npm run typecheck  # tsc --noEmit
npm test           # vitest: 12 tests (filtros, integridad del dataset, referencias de fuentes)
npm run build      # build de producción
npm run test:e2e   # playwright: 7 tests de navegación (requiere servidor en :3110 -> npm run start -- -p 3110)
```

## Estructura

```
app/            # layout, page (10 secciones), methodology/
components/     # Header, providers (i18n/tema/vista), ui (badges, drawers), AfricaMap, sections/*
data/           # types.ts, es.ts, en.ts (diccionarios), sources.ts, countries
lib/            # filters.ts (evidencia, timeline, prensa, países, búsqueda)
public/data/    # africa-110m.json (GeoJSON simplificado, 49 KB, generado de world-atlas)
public/         # manifest.webmanifest, sw.js, icons/
tests/          # unitarios (vitest) + e2e (playwright)
```

## Decisiones

- **Mapa:** 34 países del dossier (el dossier dice 33; la lista contiene 34 — ver nota). Solo «entidad propia» con evidencia (Sierra Leona, Liberia, Guinea); Mauritania/Namibia/Togo/Benín como «anunciado»; resto «socio / por verificar» con DataGapCard.
- **Evidencia:** 5 niveles (verificado, autorreportado, fuente secundaria, inferencia, no divulgado) + toggle «Solo hechos verificados».
- **Impresión:** el botón «Imprimir informe Sierra Leona» imprime solo el informe en A4 (`print:`).
- **Deep links:** secciones por `#ancla`; idioma, país, año, verified y presentation en query params.

## Nota sobre el conteo de mercados

El dossier afirma «33 mercados» pero la lista de la sección 4 contiene **34** entradas. La app cuenta dinámicamente (`countries.length` = 34). Revisar el dossier: sobra una entrada o el «33» es erróneo.
