// Auditoría de dependencias con lista blanca. Equivale a
// `npm audit --audit-level=high`, pero ignora los advisories listados en
// scripts/audit-allowlist.json (cada excepción lleva motivo y fecha de vencimiento).
// Uso: node scripts/check-audit.mjs

import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const LEVELS = { info: 0, low: 1, moderate: 2, high: 3, critical: 4 };
const MIN_LEVEL = LEVELS.high;

const allowlist = JSON.parse(fs.readFileSync(new URL('./audit-allowlist.json', import.meta.url), 'utf8'));
const today = new Date().toISOString().slice(0, 10);
const errors = [];

const exceptions = new Map();
for (const ex of allowlist.exceptions ?? []) {
  if (!ex.id || !ex.reason || !/^\d{4}-\d{2}-\d{2}$/.test(ex.expires ?? '')) {
    errors.push(`Excepción inválida (requiere id, reason y expires AAAA-MM-DD): ${JSON.stringify(ex)}`);
    continue;
  }
  exceptions.set(ex.id, ex);
}

// npm audit sale con código distinto de 0 cuando hay hallazgos; el JSON va igual por stdout
const run = spawnSync('npm', ['audit', '--json'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
let report;
try {
  report = JSON.parse(run.stdout);
} catch {
  console.error(`No se pudo leer la salida de npm audit.\n${run.stdout}${run.stderr}`);
  process.exit(1);
}
if (report.error) {
  console.error(`npm audit falló: ${report.error.summary ?? JSON.stringify(report.error)}`);
  process.exit(1);
}

// Cada advisory aparece como objeto en `via` del paquete afectado; las cadenas son dependientes
const advisories = new Map();
for (const vuln of Object.values(report.vulnerabilities ?? {})) {
  for (const via of vuln.via) {
    if (typeof via !== 'object' || LEVELS[via.severity] < MIN_LEVEL) continue;
    const id = via.url?.split('/').pop() ?? String(via.source);
    advisories.set(id, via);
  }
}

const used = new Set();
for (const [id, adv] of advisories) {
  const ex = exceptions.get(id);
  if (ex && ex.expires >= today) {
    used.add(id);
    console.log(`Permitido ${id} (${adv.name}, ${adv.severity}) hasta ${ex.expires}: ${ex.reason}`);
  } else if (ex) {
    errors.push(`La excepción de ${id} (${adv.name}) venció el ${ex.expires}. Revísala: ${adv.url}`);
  } else {
    errors.push(`${adv.name} [${adv.severity}] ${adv.title} - ${adv.url}`);
  }
}

for (const id of exceptions.keys()) {
  if (!advisories.has(id)) console.warn(`Aviso: la excepción ${id} ya no aplica; puedes quitarla de la lista blanca.`);
}

if (errors.length) {
  console.error(`\nAuditoría fallida (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`Auditoría OK: ${advisories.size - used.size} hallazgos sin excepción, ${used.size} permitidos.`);
