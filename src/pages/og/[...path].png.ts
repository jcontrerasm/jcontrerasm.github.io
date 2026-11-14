import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { isVisible } from '../../utils/posts';
import { renderOgImage, type OgCard } from '../../utils/og';
import { SITE } from '../../config';
import { formatDate } from '../../utils/date';

// Genera en el build /og/<lang>.png (imagen general del sitio) y
// /og/<lang>/<slug>.png (una por artículo) para las vistas previas en redes.

const siteText = {
  es: {
    eyebrow: 'Sitio personal',
    description: 'Artículos sobre DevSecOps, cultura de ingeniería, métricas e IA aplicada.',
    meta: 'Español',
  },
  en: {
    eyebrow: 'Personal site',
    description: 'Articles on DevSecOps, engineering culture, metrics and applied AI.',
    meta: 'English',
  },
} as const;

export const getStaticPaths = (async () => {
  const posts = await getCollection('blog', isVisible);

  const postCards = posts.map((post) => {
    const { lang, title, description, tags, pubDate } = post.data;
    const card: OgCard = {
      eyebrow: tags.slice(0, 3).join(' · '),
      title,
      description,
      author: SITE.name,
      role: SITE.role[lang],
      meta: formatDate(pubDate, lang),
    };
    return { params: { path: post.id }, props: { card } };
  });

  const siteCards = (['es', 'en'] as const).map((lang) => {
    const card: OgCard = {
      eyebrow: siteText[lang].eyebrow,
      title: SITE.name,
      description: siteText[lang].description,
      role: SITE.role[lang],
      meta: siteText[lang].meta,
    };
    return { params: { path: lang }, props: { card } };
  });

  return [...siteCards, ...postCards];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage(props.card as OgCard);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
