// Las fechas del frontmatter (2025-11-13) se leen como medianoche UTC. Se formatean
// en UTC para que no se muestre el día anterior en zonas horarias como America/Lima.
export function formatDate(date: Date, lang: 'es' | 'en'): string {
  return date.toLocaleDateString(lang === 'es' ? 'es-PE' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
