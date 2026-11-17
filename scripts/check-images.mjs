// Verifica la regla de imágenes de AGENTS.md sobre public/images:
// - JPEG: sin metadatos EXIF, XMP ni IPTC (pueden incluir GPS o datos del dispositivo).
//   El perfil de color ICC se permite: quitarlo cambia los colores de fotos en Display P3.
// - PNG: que recomprimir sin pérdida con sharp no lo reduzca de forma significativa.
// Uso: node scripts/check-images.mjs [directorio]

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(process.argv[2] ?? 'public/images');
// Ahorro a partir del cual se considera que el PNG no está optimizado
const MIN_SAVING_BYTES = 2048;
const MIN_SAVING_RATIO = 0.02;

const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(jpe?g|png)$/i.test(entry.name)) files.push(full);
  }
};
walk(root);

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
const errors = [];

for (const file of files) {
  const rel = path.relative(process.cwd(), file);
  const size = fs.statSync(file).size;
  const meta = await sharp(file).metadata();

  if (meta.format === 'jpeg') {
    const extra = ['exif', 'xmp', 'iptc'].filter((key) => meta[key]);
    const copy = meta.icc ? 'icc' : 'none';
    if (extra.length) errors.push(`${rel}: tiene metadatos (${extra.join(', ')}); usa jpegtran -copy ${copy}`);
  } else if (meta.format === 'png') {
    const optimized = await sharp(file).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
    const saving = size - optimized.length;
    if (saving > MIN_SAVING_BYTES && saving / size > MIN_SAVING_RATIO) {
      const [a, b] = await Promise.all([
        sharp(file).ensureAlpha().raw().toBuffer(),
        sharp(optimized).ensureAlpha().raw().toBuffer(),
      ]);
      // Solo se exige si la versión recomprimida es idéntica en píxeles
      if (a.equals(b)) errors.push(`${rel}: ${kb(size)} → ${kb(optimized.length)} sin pérdida; recomprímelo`);
    }
  } else {
    errors.push(`${rel}: la extensión no coincide con el formato real (${meta.format})`);
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} imagen(es) sin optimizar (ver "Imágenes" en AGENTS.md):`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log(`✓ ${files.length} imágenes optimizadas en ${path.relative(process.cwd(), root)}`);
