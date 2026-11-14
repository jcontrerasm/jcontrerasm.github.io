import type { CollectionEntry } from 'astro:content';

export function isPublished(post: CollectionEntry<'blog'>): boolean {
  return post.data.status === 'published';
}

// Los borradores solo se muestran en `astro dev` para poder revisarlos;
// el build de producción publica únicamente los artículos con status "published".
export function isVisible(post: CollectionEntry<'blog'>): boolean {
  return isPublished(post) || import.meta.env.DEV;
}

// Minutos de lectura a ~200 palabras por minuto. Los diagramas Mermaid no se leen como texto.
export function readingTime(post: CollectionEntry<'blog'>): number {
  const text = (post.body ?? '').replace(/```mermaid[\s\S]*?```/g, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// Artículos del mismo idioma con más etiquetas en común; excluye los de la misma serie,
// que ya aparecen en la navegación de la serie.
export function relatedPosts(post: CollectionEntry<'blog'>, all: CollectionEntry<'blog'>[], limit = 3) {
  const tags = new Set(post.data.tags);
  return all
    .filter(
      (p) =>
        p.id !== post.id &&
        p.data.lang === post.data.lang &&
        (!post.data.series || p.data.series?.id !== post.data.series.id)
    )
    .map((p) => ({ post: p, shared: p.data.tags.filter((t) => tags.has(t)).length }))
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared || b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf())
    .slice(0, limit)
    .map(({ post }) => post);
}
