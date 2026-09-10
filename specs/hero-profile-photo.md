# Foto de perfil y acento de color en el hero

Ver [architecture.md](./architecture.md) para el resto de componentes y layouts, y [devsecops-hero-animation.md](./devsecops-hero-animation.md) para la animación de fondo del mismo hero. Esta spec documenta los cambios al bloque de identidad del hero de Inicio (`/es/`, `/en/`): color del nombre y foto de perfil junto al texto.

## Objetivo

El hero original mostraba solo texto (eyebrow + título + lede + CTAs), centrado como bloque dentro de la banda oscura del hero. Se pidió: (1) destacar el nombre con color, y (2) agregar una foto de perfil real junto al texto, en blanco y negro, con todo el bloque alineado a la izquierda de la página en vez de centrado.

## Cambios

### 1. Color del nombre (`hero-title`)

El `<h1>` con `SITE.name` usaba `color: var(--hero-ink)` (blanco/gris del resto del texto del hero). Se cambió a `color: var(--palette-bright-blue)` (`#3b8eea`), token ya existente en la paleta ANSI de `src/styles/global.css` (pensada originalmente para la animación del pipeline y disponible como acento reutilizable) — se eligió por ser el que el usuario identificó explícitamente como "Bright Blue".

### 2. Foto de perfil

- Archivo servido como estático desde `public/images/profile.jpeg` (no pasa por el pipeline de optimización de imágenes de Astro — se optó por `public/` en vez de `src/assets/` por simplicidad, al ser una sola imagen de perfil que no cambia de tamaño en distintos contextos).
- Maquetado como `<img class="hero-photo" src="/images/profile.jpeg" alt={SITE.name} width="220" height="220" />`, primer hijo dentro de `.hero-inner`, seguido de un `<div class="hero-text">` que envuelve el eyebrow/título/lede/CTAs que antes eran hijos directos de `.hero-inner`.
- `.hero-inner` pasó de columna implícita (bloque de texto suelto) a `display: flex; align-items: center; gap: clamp(2rem, 5vw, 3.5rem)`, con `flex-direction: column` en `max-width: 640px` (mobile) para que la foto quede arriba del texto en vez de aplastada al lado.
- **Máscara blanco y negro:** `filter: grayscale(1) contrast(1.05)` sobre la imagen — un ligero aumento de contraste para compensar que el grayscale por sí solo suele verse "plano".
- **Forma:** primera iteración fue circular (`border-radius: 50%`); se cambió a cuadrada con esquinas suaves (`border-radius: 8px`, consistente con el radio usado en tarjetas del sitio — ver `global.css`) a pedido explícito ("debe ser cuadrada la imagen"). Se agregó `aspect-ratio: 1 / 1` junto al `border-radius` para blindar la proporción cuadrada aunque la imagen fuente no sea perfectamente cuadrada.
- Tamaño responsive: `width`/`height: clamp(120px, 16vw, 180px)`, `object-fit: cover`, borde de 1px en `--hero-rule` para separarla visualmente del fondo oscuro del hero.

### 3. Alineación a la izquierda

`.hero-inner` reutiliza la clase `.container` (`max-width: var(--page-width); margin: 0 auto`), pero además fija su propio `max-width: var(--content-width)` — el resultado no documentado hasta ahora es que ese `margin: 0 auto` heredado centraba el bloque completo (foto + texto) en el medio de la página en viewports anchos, en vez de pegarlo al borde izquierdo del contenido. Se sobreescribió con `margin: 0` en `.hero-inner` a pedido explícito ("la informacion de la imagen, nombre y descripcion... debe estar a la izquierda").

## Ubicación e integración

- `src/pages/es/index.astro` y `src/pages/en/index.astro` — mismo marcado y mismas reglas de estilo en ambos (duplicado intencional, seguía el patrón ya existente en estas páginas; no hay un componente compartido de hero).
- Imagen: `public/images/profile.jpeg`.

## Historial de iteraciones

| # | Cambio | Motivo |
|---|---|---|
| 1 | Color del `hero-title` de `--hero-ink` a `--palette-bright-blue` | Pedido explícito: "mi nombre esté con el color Bright Blue". |
| 2 | Foto agregada al lado izquierdo del texto, con `filter: grayscale(1)` | Pedido explícito de foto de perfil con "máscara" para que salga en blanco y negro. |
| 3 | `border-radius: 50%` → `8px` + `aspect-ratio: 1 / 1` | Pedido explícito: "debe ser cuadrada la imagen". |
| 4 | `src="/images/profile.jpg"` → `/images/profile.jpeg` | El archivo provisto por el usuario era `.jpeg`, no `.jpg`. |
| 5 | `margin: 0 auto` heredado de `.container` → `margin: 0` en `.hero-inner` | Pedido explícito: el bloque de foto+nombre+descripción debía quedar alineado a la izquierda, no centrado en la página. |

## Verificación realizada

- Foto servida correctamente: `curl -I http://localhost:4321/images/profile.jpeg` → `200`.
- Verificación visual pendiente de confirmación del usuario en `astro dev` tras cada iteración (no se corrió Playwright headless para este cambio).

## Mantenimiento futuro

- Si se reemplaza la foto, mantener el nombre de archivo `profile.jpeg` y las dimensiones aproximadas (mínimo ~360×360px reales para verse nítida en el tamaño máximo renderizado de `180px` a densidad 2x) para no tener que tocar el markup.
- El acento `--palette-bright-blue` ahora se usa en dos lugares con significados distintos: el nombre en el hero (identidad) y como color semántico dentro de `DevSecOpsPipeline.astro` si en el futuro se reutiliza esa paleta — no hay conflicto funcional, pero tenerlo en cuenta si se reconsidera la paleta de acentos del sitio (ver nota de "acento único" en [Constitution.md](./Constitution.md), que esta adición matiza: ya hay dos usos de acento fuera del acento principal — la animación y ahora el nombre).
