# Animación del hero — pipeline DevSecOps

Ver [architecture.md](./architecture.md) para el resto de componentes y layouts. Esta spec documenta la animación de canvas del hero de Inicio (`/es/`, `/en/`), agregada para reforzar visualmente el posicionamiento "Arquitecto DevSecOps" sin depender de una imagen de stock ni de una librería externa.

## Objetivo

El hero original era solo texto (eyebrow + título + lede + CTAs) sobre el fondo oscuro fijo (`--hero-bg`). Se pidió una animación en Inicio que "impacte" y esté relacionada al concepto DevSecOps — es decir, que comunique la idea sin texto adicional, no solo decore.

## Concepto visual

Una cinta de pipeline CI/CD en la franja inferior del hero, representando las etapas `SPEC → CODE → BUILD → TEST → SCAN → DEPLOY`:

`SPEC` es intencional como primera etapa, no `CODE`: en la era de los agentes el ciclo de desarrollo no arranca en la codificación, arranca en la especificación (ver la práctica de este mismo repo — [Constitution.md](./Constitution.md) y esta carpeta `specs/` existen por esa misma razón). La animación refleja el mismo principio que rige cómo se construye el propio sitio.

- Un haz de "escaneo" en cian recorre la línea de izquierda a derecha en loop continuo.
- Cada nodo pasa de un estado pendiente (punto ámbar, "vulnerable/sin escanear") a "asegurado" (punto verde + glow + ícono de check dentro de un círculo) en el instante en que el haz lo cruza — el shift-left de seguridad integrado en cada etapa del pipeline, no un paso aparte al final.
- Partículas pequeñas en cian fluyen entre nodos de forma continua, sugiriendo entrega continua (mismo tono que el haz de escaneo, distinto del estado de los nodos).
- Al completar un ciclo, todos los nodos vuelven a estado pendiente (ámbar) y el haz reinicia desde la izquierda.

### Paleta de la animación

Tres acentos de color con significado, definidos como constantes al inicio del `<script>` del componente (no leen custom properties de CSS — ver nota en Mantenimiento):

| Estado | Color | Significado |
|---|---|---|
| Pendiente / sin escanear | ámbar `rgb(224,150,80)` | nodo aún no verificado por el pipeline |
| Haz de escaneo + partículas de flujo | cian `rgb(96,200,214)` | el escaneo en curso / datos moviéndose por el pipeline |
| Asegurado | verde `rgb(95,199,146)` | la etapa pasó el escaneo de seguridad |

Es la única parte del sitio con más de un acento de color (el resto del diseño usa un acento único y restringido, ver [Constitution.md](./Constitution.md)) — se justifica porque el color aquí es semántico (cuenta una historia: vulnerable → escaneando → asegurado), no decorativo.

## Ubicación e integración

- Componente: `src/components/DevSecOpsPipeline.astro` (un único `<canvas>` + su `<script>` de animación; sin dependencias externas).
- Se importa e incluye una sola vez, como primer hijo de `<section class="hero">`, en `src/pages/es/index.astro` y `src/pages/en/index.astro` (mismo componente para ambos idiomas — la animación no tiene texto que traducir salvo las etiquetas `SPEC/CODE/BUILD/...`, que se mantienen en inglés en ambos idiomas por ser terminología de pipeline estándar).
- Requiere que `.hero` tenga `position: relative; overflow: hidden;` (ya agregado en el `<style>` de ambas páginas) para que el canvas absoluto quede contenido dentro de la banda oscura.

## Diseño: por qué es una cinta inferior y no un fondo completo

La primera versión cubría todo el hero como fondo (canvas `inset: 0`, nodos distribuidos en el eje vertical medio, con una máscara CSS horizontal para atenuar el lado del texto). Al verificarla con capturas de pantalla (desktop y mobile), la línea del pipeline y las etiquetas de las etapas quedaban cruzando el título y el párrafo (`lede`), compitiendo con el texto principal — especialmente en mobile, donde el hero es más angosto y el bloque de texto ocupa casi todo el ancho.

Se rediseñó como una **franja fija en la parte inferior del hero** (`position: absolute; left/right: 0; bottom: 0; height: 100px` desktop, `72px` en `max-width: 640px`), con `mask-image` en gradiente vertical para que el borde superior de la cinta se difumine en vez de cortar en seco. Esto:
- Elimina cualquier colisión con el texto en cualquier ancho de viewport, sin depender de calcular el ancho del bloque de texto.
- Funciona igual en desktop y mobile sin lógica condicional de layout adicional.
- Se apoya en el padding-bottom que el hero ya reservaba (`.hero-inner { padding: ... 80px }`), que resultó suficiente como colchón entre los CTA y la cinta.

## Comportamiento técnico

- Canvas 2D nativo, sin librerías. Escala por `devicePixelRatio` (tope en 2x) para verse nítido en pantallas retina.
- `ResizeObserver`-equivalente simple: recalcula layout de nodos en el evento `resize` de window.
- Pausa el loop de animación (`cancelAnimationFrame`) cuando:
  - la pestaña no está visible (`visibilitychange`), o
  - el hero sale del viewport (`IntersectionObserver`, threshold 0.05),
  
  para no gastar CPU/batería con la animación fuera de vista.
- Respeta `prefers-reduced-motion: reduce`: en vez de animar, dibuja un único frame estático con todos los nodos ya "asegurados" (todos los checks visibles, sin haz de escaneo ni partículas en movimiento).
- Etiquetas de etapa (`SPEC`, `CODE`, `BUILD`, ...) solo se dibujan si el ancho del canvas es mayor a 460px, para evitar texto apretado en pantallas muy angostas (el punto + check siguen visibles igual).
- La línea que conecta los nodos y las etiquetas de etapa siguen en gris neutro (`--hero-ink-2` ≈ `rgba(189,189,184,*)`) para no competir con los tres acentos de estado (ámbar/cian/verde) descritos arriba.

## Verificación realizada

- `npx astro check` — 0 errores.
- `npx astro build` — build de producción completa sin errores nuevos (el warning preexistente de la ruta `/` es anterior a este cambio, no relacionado).
- Verificación visual con Playwright headless (Chromium) contra `astro dev`:
  - Desktop (1440×900) y mobile (390×800), ambos idiomas.
  - `reducedMotion: 'reduce'` → confirma el frame estático.
  - `console --errors` / `pageerror` → sin errores en consola en ningún caso.

## Historial de iteraciones

Registro de cómo evolucionó esta animación después de la primera versión, con el porqué de cada cambio — para que quede trazable sin tener que reconstruirlo desde el historial de git.

| # | Cambio | Motivo |
|---|---|---|
| 1 | De fondo completo del hero a cinta fija inferior | La versión de fondo completo cruzaba la línea del pipeline y las etiquetas por encima del título y el lede, compitiendo con el texto (ver sección de diseño arriba). |
| 2 | Ícono de nodo asegurado: candado → check dentro de un círculo | Feedback directo: "el icono de candado no me convence". Un check comunica mejor "pasó el escaneo/validado" que "bloqueado", que es semánticamente más preciso para lo que representa el evento (una etapa que superó el scan, no un secreto guardado bajo llave). |
| 3 | Paleta monocromática (grises + un acento azul) → paleta semántica de 3 colores | Pedido explícito de "dale algo de color a la animación". Se optó por color con significado (ámbar=pendiente, cian=escaneo/flujo, verde=asegurado) en vez de color puramente decorativo, para mantener coherencia con el resto del sitio (acento único y restringido) sin perder la nueva expresividad. |
| 4 | Etapa `SPEC` agregada antes de `CODE` | Surgió de una reflexión en la conversación: "según las fases en la era de los agentes no empieza en la codificación" — el ciclo de desarrollo agentic-first arranca en la especificación, no en el código. Se pidió explícitamente reflejar esa idea en la animación (`"refleja eso en la animación"`), así que el pipeline visual ahora empieza en `SPEC`, alineado con la práctica real de este repo (`Constitution.md` + `specs/`). |

Cada iteración se verificó de nuevo con el mismo procedimiento que la sección de Verificación (Playwright headless en desktop/mobile/reduced-motion/ambos idiomas + `astro check`) antes de darse por cerrada.

## Mantenimiento futuro

- Si se agrega una tercera página con el mismo hero (poco probable dado que Inicio es única por diseño, ver [Constitution.md](./Constitution.md)), reusar `DevSecOpsPipeline.astro` tal cual — no tiene props ni estado dependiente del idioma.
- Los tres colores de estado (`PENDING`, `SCAN`, `SECURE`) están centralizados como constantes al inicio del `<script>` del componente — ese es el único lugar a tocar para ajustar la paleta de la animación (no leen custom properties de CSS porque `canvas` no puede consumir `var()` directamente en JS).
