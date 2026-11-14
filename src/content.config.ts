import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      lang: z.enum(['es', 'en']),
      tags: z.array(z.string()).default([]),
      status: z.enum(['draft', 'published']),
      // Artículos de una misma serie comparten `id` (igual en es y en); `name` va traducido
      series: z
        .object({
          id: z.string(),
          name: z.string(),
          part: z.number().int().positive(),
        })
        .optional(),
      heroImage: image().optional(),
    }),
});

export const collections = { blog };
