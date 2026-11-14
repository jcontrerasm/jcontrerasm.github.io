import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { isVisible } from '../../utils/posts';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', (p) => p.data.lang === 'es' && isVisible(p));

  return rss({
    title: 'Juan Carlos Contreras — Blog',
    description: 'Artículos sobre DevSecOps, cultura de ingeniería, métricas e IA aplicada.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/es/blog/${post.id.replace(/^es\//, '')}/`,
    })),
  });
}
