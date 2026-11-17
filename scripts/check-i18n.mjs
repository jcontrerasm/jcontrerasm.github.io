// Verifica la regla bilingüe de AGENTS.md para el blog: cada artículo existe en
// es/ y en/ con el mismo nombre de archivo, el `lang` correcto y los mismos valores
// en los campos que no se traducen (fecha, estado, serie, número de etiquetas).
// Uso: node scripts/check-i18n.mjs

import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const blogDir = path.resolve('src/content/blog');
const langs = ['es', 'en'];

const read = (lang) =>
  new Map(
    fs
      .readdirSync(path.join(blogDir, lang))
      .filter((f) => /\.mdx?$/.test(f))
      .map((f) => {
        const source = fs.readFileSync(path.join(blogDir, lang, f), 'utf8');
        const match = source.match(/^---\n([\s\S]*?)\n---/);
        return [f, match ? parse(match[1]) : {}];
      })
  );

const posts = Object.fromEntries(langs.map((lang) => [lang, read(lang)]));
const errors = [];

for (const lang of langs) {
  const other = langs.find((l) => l !== lang);
  for (const [file, data] of posts[lang]) {
    if (data.lang !== lang) errors.push(`${lang}/${file}: lang es "${data.lang}" y debería ser "${lang}"`);
    if (!posts[other].has(file)) errors.push(`${lang}/${file}: falta la versión ${other}/${file}`);
  }
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
for (const [file, es] of posts.es) {
  const en = posts.en.get(file);
  if (!en) continue;
  const fields = {
    pubDate: [es.pubDate, en.pubDate],
    updatedDate: [es.updatedDate, en.updatedDate],
    status: [es.status, en.status],
    'series.id': [es.series?.id, en.series?.id],
    'series.part': [es.series?.part, en.series?.part],
    'cantidad de tags': [es.tags?.length, en.tags?.length],
  };
  for (const [field, [a, b]] of Object.entries(fields)) {
    if (!same(a, b)) errors.push(`${file}: ${field} difiere (es: ${JSON.stringify(a)}, en: ${JSON.stringify(b)})`);
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} problema(s) de contenido bilingüe (ver AGENTS.md):`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log(`✓ ${posts.es.size} artículos con versión es/en consistente`);
