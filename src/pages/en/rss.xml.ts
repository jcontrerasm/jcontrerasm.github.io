import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { isVisible } from '../../utils/posts';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', (p) => p.data.lang === 'en' && isVisible(p));

  return rss({
    title: 'Juan Carlos Contreras — Blog',
    description: 'Articles on DevSecOps, engineering culture, metrics, and applied AI.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/en/blog/${post.id.replace(/^en\//, '')}/`,
    })),
  });
}
