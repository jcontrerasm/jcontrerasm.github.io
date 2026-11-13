## Desarrollo

Al iniciar el servidor de desarrollo, usa el modo en segundo plano:

```
astro dev --background
```

Administra el servidor en segundo plano con `astro dev stop`, `astro dev status` y `astro dev logs`.

## Contenido bilingüe (es / en)

Este sitio es bilingüe. **Todo contenido nuevo o modificado que el usuario pueda ver debe entregarse en español (`es`) e inglés (`en`) en el mismo cambio.** Nunca agregues un idioma y dejes el otro para después.

- **Páginas:** una página en `src/pages/es/` necesita su equivalente en `src/pages/en/` (por ejemplo `contacto.astro` ↔ `contact.astro`). Pasa `translationHref` a `Layout` para que el selector de idioma apunte a la página equivalente.
- **Artículos del blog:** agrega `src/content/blog/es/<slug>.md` y `src/content/blog/en/<slug>.md` con el **mismo nombre de archivo**, `lang: es` / `lang: en` en el frontmatter y la misma `pubDate`. Traduce `title`, `description` y `tags`. Las imágenes compartidas van en `public/images/blog/<slug>/`.
- **Secciones y terminales:** arreglos como `softSkills` y `techSkills` viven por separado en `src/pages/es/index.astro` y `src/pages/en/index.astro`. Actualiza ambos, incluidos los comandos de las terminales (`ls plataforma/` ↔ `ls platform/`). Los nombres de tecnologías no se traducen.
- **Navegación, footer, etiquetas y metadatos:** actualiza ambos idiomas en `src/config.ts`, `Header.astro`, `Footer.astro` y en cualquier prop `title` / `description`.
- **Componentes:** nunca dejes texto escrito en un solo idioma; recibe una prop `lang` o recibe ambos textos desde la página.
- **Etiquetas y filtros:** el índice del blog arma el filtro de temas por idioma, así que las etiquetas deben estar traducidas en cada versión.
- **Estilo de traducción:** traduce el sentido, no palabra por palabra, y mantén una longitud similar para no romper las líneas de las terminales. Conserva nombres propios y siglas. Las fechas, URLs y números deben ser idénticos en ambas versiones.
- **Antes de terminar:** ejecuta `npx astro build`, confirma que se generan las rutas `/es/...` y `/en/...`, y lista qué archivos cambiaron en cada idioma. Si algo no pudo traducirse, indícalo de forma explícita.

## Imágenes

Toda imagen nueva o modificada en `public/images/` debe optimizarse **sin pérdida de calidad** antes de terminar el cambio.

- **Código:** no uses capturas de código en los artículos; escribe el código como bloque de código en el markdown (por ejemplo ```` ```jsx ````).
- **JPEG:** usa `jpegtran`, que optimiza la codificación sin recomprimir los píxeles y elimina los metadatos EXIF:

  ```
  jpegtran -copy none -optimize -progressive entrada.jpeg > salida.jpeg
  ```

- **PNG:** recomprime con `sharp` (ya está en `node_modules`) al nivel máximo, sin paleta reducida:

  ```js
  await sharp(entrada).png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true }).toFile(salida);
  ```

- **Verificación:** genera los archivos optimizados en un directorio temporal, compara los píxeles con `sharp(...).raw().toBuffer()` y reemplaza el original solo si los píxeles son idénticos y el archivo es más liviano. Conserva el nombre, el formato y las dimensiones para no tener que tocar el markdown.
- **Optimización con pérdida:** convertir a WebP, bajar la calidad del JPEG, reducir la paleta del PNG o cambiar las dimensiones solo se hace si el usuario lo aprueba explícitamente.
- **Antes de terminar:** informa el peso antes y después de cada imagen.

## Documentación

Documentación completa: https://docs.astro.build

Consulta estas guías antes de trabajar en tareas relacionadas:

- [Agregar páginas, rutas dinámicas o middleware](https://docs.astro.build/en/guides/routing/)
- [Trabajar con componentes de Astro](https://docs.astro.build/en/basics/astro-components/)
- [Usar componentes de React, Vue, Svelte u otros frameworks](https://docs.astro.build/en/guides/framework-components/)
- [Agregar o administrar contenido](https://docs.astro.build/en/guides/content-collections/)
- [Agregar estilos o usar Tailwind](https://docs.astro.build/en/guides/styling/)
- [Soporte para múltiples idiomas](https://docs.astro.build/en/guides/internationalization/)
