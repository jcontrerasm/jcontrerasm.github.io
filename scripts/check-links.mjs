// Verifica que los enlaces internos del sitio generado (dist/) apunten a archivos
// existentes y que los anclajes (#seccion) existan en la página de destino.
// Los enlaces absolutos al propio dominio (canonical, og:image) también se verifican.
// Uso: node scripts/check-links.mjs [dist]

import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(process.argv[2] ?? 'dist');
const SITE = 'https://jcontrerasm.github.io';

const htmlFiles = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
};
walk(dist);

const idCache = new Map();
const idsOf = (file) => {
  if (!idCache.has(file)) {
    const html = fs.readFileSync(file, 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\s(?:id|name)="([^"]+)"/g)].map((m) => m[1])));
  }
  return idCache.get(file);
};

// Convierte una ruta del sitio en el archivo que la sirve
const resolveTarget = (pathname) => {
  const candidate = path.join(dist, decodeURIComponent(pathname));
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  const index = path.join(candidate, 'index.html');
  if (fs.existsSync(index)) return index;
  return null;
};

const errors = [];
let checked = 0;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const page = '/' + path.relative(dist, file).split(path.sep).join('/');
  // En `content` (metatags) solo interesan las URLs del propio dominio, como og:image
  const refs = [
    ...[...html.matchAll(/\s(?:href|src)="([^"]*)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/\scontent="([^"]*)"/g)].map((m) => m[1]).filter((v) => v.startsWith(SITE)),
  ];

  for (let ref of refs) {
    if (ref.startsWith(SITE)) ref = ref.slice(SITE.length) || '/';
    else if (!ref.startsWith('/') && !ref.startsWith('#') && !ref.startsWith('.')) continue; // externo o no es URL
    if (ref.startsWith('//')) continue;

    const url = new URL(ref, `http://local${page}`);
    const target = url.pathname === page ? file : resolveTarget(url.pathname);
    checked++;

    if (!target) {
      errors.push(`${page} → ${ref} (no existe)`);
      continue;
    }
    const fragment = decodeURIComponent(url.hash.slice(1));
    if (fragment && target.endsWith('.html') && !idsOf(target).has(fragment)) {
      errors.push(`${page} → ${ref} (no existe el anclaje #${fragment})`);
    }
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} enlace(s) roto(s):`);
  for (const e of [...new Set(errors)]) console.error(`  ${e}`);
  process.exit(1);
}
console.log(`✓ ${checked} enlaces internos verificados en ${htmlFiles.length} páginas`);
