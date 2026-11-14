import type { CollectionEntry } from 'astro:content';

export function isPublished(post: CollectionEntry<'blog'>): boolean {
  return post.data.status === 'published';
}

// Los borradores solo se muestran en `astro dev` para poder revisarlos;
// el build de producción publica únicamente los artículos con status "published".
export function isVisible(post: CollectionEntry<'blog'>): boolean {
  return isPublished(post) || import.meta.env.DEV;
}
