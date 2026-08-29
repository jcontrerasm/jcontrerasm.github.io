# Arquitectura técnica

Referencia técnica de cómo está construido el sitio. Ver [Constitution.md](./Constitution.md) para la visión y las restricciones del proyecto.

## Stack

- **Astro 7** (`--template minimal`, TypeScript strict).
- Integraciones: `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/rss` (helper para los feeds).
- CSS plano con custom properties (sin framework de utilidades) en `src/styles/global.css`.
- Tipografía self-hosted: `@fontsource-variable/space-grotesk` (encabezados/UI) y `@fontsource-variable/jetbrains-mono` (código, tags, nav, fechas). Cuerpo de texto en system-ui stack.

## i18n

`astro.config.mjs`:
```js
i18n: {
  defaultLocale: 'es',
  locales: ['es', 'en'],
  routing: { prefixDefaultLocale: true, redirectToDefaultLocale: true },
},
```
Ambos idiomas quedan explícitos (`/es/...`, `/en/...`). `src/pages/index.astro` es un archivo vacío que solo marca la ruta raíz — Astro genera automáticamente el redirect a `/es/` a partir de `redirectToDefaultLocale`; no se debe poner lógica de redirect manual ahí (genera conflicto de rutas).

Cada página vive por separado bajo `src/pages/es/` y `src/pages/en/` (sin ruta dinámica `[lang]`), porque la prosa de cada idioma es distinta, no una traducción mecánica de strings.

### Blog y traducción de posts

- Colección única `blog` en `src/content.config.ts`, con loader `glob()` sobre `src/content/blog/**`.
- Separación física `src/content/blog/es/` y `src/content/blog/en/`, más un campo `lang` en el frontmatter (redundante a propósito: si un post se coloca en la carpeta equivocada, falla la validación de build en vez de renderizar mal).
- **Convención de emparejamiento:** la versión ES y EN del mismo post usan el mismo nombre de archivo (ej. `es/copilot-agent-mode-dependabot.md` / `en/copilot-agent-mode-dependabot.md`). El selector de idioma (`LanguageSwitcher.astro`) usa esa coincidencia; si no existe traducción, cae al índice del blog del otro idioma en vez de un 404. La lógica de resolución vive en el `getStaticPaths` de `src/pages/{es,en}/blog/[...slug].astro`.

## Esquema de contenido (`src/content.config.ts`)

```ts
schema: ({ image }) => z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  lang: z.enum(['es', 'en']),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  heroImage: image().optional(),
})
```
`draft: true` se filtra en todo `getCollection('blog', ...)` (índice, RSS, sitemap, tags) para poder tener borradores sin publicarlos.

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Redirect automático de Astro a `/es/` |
| `/es/`, `/en/` | Inicio/Sobre mí — hero, 4 tarjetas de áreas de foco, bio, teaser de últimos posts |
| `/es/blog/`, `/en/blog/` | Índice del blog, ordenado por `pubDate` desc |
| `/es/blog/[slug]/`, `/en/blog/[slug]/` | Post individual |
| `/es/blog/tags/[tag]/`, `/en/blog/tags/[tag]/` | Filtro estático por tag — el `[tag]` de la URL es el **slug** del tag (ver `src/utils/slug.ts`), no el label original (evita espacios/acentos en la URL) |
| `/es/contacto/`, `/en/contact/` | Enlaces estáticos: LinkedIn (CTA principal) y GitHub |
| `/es/rss.xml`, `/en/rss.xml` | Feed RSS por idioma |

Nota: las rutas de contacto tienen slugs distintos por idioma (`contacto` vs `contact`) — la navegación y el `translationHref` de cada página lo reflejan explícitamente (ver `src/config.ts` → `NAV`).

## Componentes y layouts

- `Layout.astro` — shell HTML base (`<html lang>` dinámico, meta OG/canonical), envuelve `Header` + `slot` + `Footer`.
- `BlogPost.astro` — extiende `Layout`, agrega cabecera de artículo (título, fechas, tags como links a sus páginas de tag, imagen hero opcional).
- `Header.astro` — nav + `LanguageSwitcher.astro`.
- `Footer.astro` — enlaces sociales (LinkedIn, GitHub) desde `src/config.ts`.
- `BlogPostCard.astro`, `FocusAreaCard.astro` — tarjetas reutilizables.
- `src/config.ts` — única fuente de verdad para nombre del sitio, URLs de LinkedIn/GitHub, y estructura de navegación por idioma (`SITE`, `NAV`).
- `src/utils/slug.ts` — `slugify()` usado para las URLs de tags.

## Paleta y diseño

Custom properties en `src/styles/global.css`:
```css
--color-bg: #0a0e14;
--color-surface: #111722;
--color-surface-raised: #1a2230;
--color-border: #232b3a;
--color-text-primary: #e6edf3;
--color-text-secondary: #8b98a9;
--color-accent: #22d3ee;
--color-accent-warm: #ff9f1c;
--color-code-bg: #0d1117;
```
Contraste verificado: `--color-text-primary` y `--color-accent` sobre `--color-bg` ambos >7:1 (WCAG AA). No hay modo claro — es una decisión de diseño, no un pendiente.

## Despliegue

- `astro.config.mjs`: `site: 'https://jcontrerasm.github.io'`, sin `base` (patrón de repo raíz).
- `.github/workflows/deploy.yml`: build con `withastro/action@v3`, deploy con `actions/deploy-pages@v4`, trigger en push a `main` + `workflow_dispatch`.
- Pasos manuales en GitHub (no automatizables desde el repo local): crear el repo público `jcontrerasm.github.io`, push de `main`, y activar **Settings → Pages → Source → GitHub Actions**.

## Verificación

- `npx astro check` — valida tipos inferidos del schema Zod de content collections.
- `npm run build && npm run preview` — build de producción antes de cada deploy; confirma que `dist/sitemap-index.xml`, `dist/es/rss.xml` y `dist/en/rss.xml` se generan correctamente.
- `npm run dev` — verificación manual de ambos idiomas, índice/posts del blog, selector de idioma (incluyendo el caso de post sin traducción, que debe caer al índice del blog en vez de 404), y enlaces de Contacto.
