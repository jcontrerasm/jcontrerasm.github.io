// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://jcontrerasm.github.io',
  integrations: [mdx(), sitemap()],
  markdown: {
    // Los bloques mermaid se renderizan en el cliente (ver Mermaid.astro)
    syntaxHighlight: { type: 'shiki', excludeLangs: ['math', 'mermaid'] },
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
});