# Sitio de marca personal — Juan Carlos Contreras

El siguiente proyecto es un sitio web de marca personal para un Arquitecto DevSecOps que hoy además lidera cultura de ingeniería, métricas técnicas dentro de su compañía, e iniciativas de IA. El sitio funciona como punto de contacto profesional y como espacio de blog para compartir artículos con la comunidad.

# Definiciones
- Debe ser un proyecto basado en Astro, con contenido estático (sin backend).
- Los artículos del blog se gestionan como Markdown/MDX dentro del propio repositorio (Astro Content Collections), sin CMS externo.
- El sitio debe ser bilingüe (español/inglés), con selector de idioma y rutas explícitas `/es/` y `/en/`.
- El diseño debe ser oscuro/técnico: dark mode fijo (sin toggle de light mode), tipografía moderna, acento de color contenido — estética que encaje con un perfil DevSecOps/IA, no un template genérico.
- El sitio se despliega en GitHub Pages, en el repositorio raíz `jcontrerasm.github.io` (URL limpia, sin `base` path).
- Las secciones del sitio son: Inicio/Sobre mí (una sola página), Blog, Contacto. No se agregan páginas adicionales (Proyectos, Charlas, etc.) salvo que se solicite explícitamente.
- La página de Contacto usa enlaces estáticos (LinkedIn como canal principal, GitHub secundario) — no hay formulario de contacto ni email público, dado que no existe backend en GitHub Pages.

# Restricciones
- No usar frameworks CSS de utilidades (Tailwind) salvo que el proyecto crezca lo suficiente para justificarlo — el CSS es plano, con custom properties.
- No usar CDNs externos para tipografía en producción; las fuentes van self-hosted vía `@fontsource-variable`.
- Todo post del blog debe existir en Markdown dentro de `src/content/blog/{es,en}/`, con el mismo nombre de archivo en ambos idiomas para que el selector de idioma pueda emparejarlos.
- El detalle técnico completo (esquema de contenido, estructura de rutas, paleta de colores, tipografía, convención de i18n y despliegue) vive en [architecture.md](./architecture.md).
