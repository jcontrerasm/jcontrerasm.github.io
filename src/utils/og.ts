import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

// Imágenes para redes sociales (Open Graph). Satori convierte el texto en trazos
// dentro del SVG, así el resultado no depende de las fuentes instaladas en CI.

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const colors = {
  bg: '#101012',
  surface: '#18181b',
  ink: '#f4f4f2',
  ink2: '#bdbdb8',
  ink3: '#8e8e89',
  rule: '#2a2a2e',
  accent: '#86a9c4',
};

// Las fuentes se leen la primera vez que se genera una imagen, no al importar el módulo
let fonts: Parameters<typeof satori>[1]['fonts'] | undefined;
const loadFonts = () => {
  const fontDir = path.join(process.cwd(), 'node_modules/@fontsource/inter/files');
  return (fonts ??= ([400, 500, 700] as const).map((weight) => ({
    name: 'Inter',
    weight,
    style: 'normal' as const,
    data: fs.readFileSync(path.join(fontDir, `inter-latin-${weight}-normal.woff`)),
  })));
};

type Node = { type: string; props: { style?: Record<string, unknown>; children?: unknown } };
const h = (style: Record<string, unknown>, children?: unknown): Node => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children },
});

const truncate = (text: string, max: number) =>
  text.length <= max ? text : `${text.slice(0, max).replace(/\s+\S*$/, '')}…`;

export interface OgCard {
  /** Texto pequeño sobre el título, por ejemplo las etiquetas del artículo */
  eyebrow: string;
  title: string;
  description: string;
  /** Si se omite, el pie muestra solo el rol (la imagen general ya lleva el nombre como título) */
  author?: string;
  role: string;
  /** Texto a la derecha del pie, por ejemplo la fecha */
  meta: string;
}

export async function renderOgImage(card: OgCard): Promise<Buffer> {
  const titleSize = card.title.length > 70 ? 52 : card.title.length > 45 ? 60 : 68;

  const tree = h(
    {
      // Satori suma padding y borde al tamaño, así que se descuentan aquí
      width: OG_WIDTH - 72 * 2 - 10,
      height: OG_HEIGHT - 64 * 2,
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '64px 72px',
      backgroundColor: colors.bg,
      backgroundImage: `radial-gradient(circle at 1.5px 1.5px, ${colors.rule} 1.5px, transparent 0)`,
      backgroundSize: '30px 30px',
      borderLeft: `10px solid ${colors.accent}`,
      fontFamily: 'Inter',
      color: colors.ink,
    },
    [
      h({ justifyContent: 'space-between', fontSize: 22, letterSpacing: 2, fontWeight: 500 }, [
        h({ color: colors.accent }, card.eyebrow.toUpperCase()),
        h({ color: colors.ink3 }, 'jcontrerasm.github.io'),
      ]),
      h({ flexDirection: 'column', gap: 24 }, [
        h({ fontSize: titleSize, fontWeight: 700, lineHeight: 1.12, letterSpacing: -1 }, card.title),
        h({ fontSize: 26, lineHeight: 1.4, color: colors.ink2 }, truncate(card.description, 150)),
      ]),
      h(
        {
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingTop: 28,
          borderTop: `2px solid ${colors.rule}`,
          fontSize: 24,
        },
        [
          card.author
            ? h({ flexDirection: 'column', gap: 4 }, [
                h({ fontWeight: 700 }, card.author),
                h({ color: colors.ink3 }, card.role),
              ])
            : h({ fontWeight: 700 }, card.role),
          h({ color: colors.ink3 }, card.meta),
        ]
      ),
    ]
  );

  const svg = await satori(tree as never, { width: OG_WIDTH, height: OG_HEIGHT, fonts: loadFonts() });
  // Compresión PNG sin pérdida (ver AGENTS.md)
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
}
