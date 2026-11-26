/**
 * Sitemap: inicio y una ficha por modelo, con las fotos de cada color (Google Imágenes).
 * Se arma solo a partir del catálogo: al sumar un modelo aparece acá sin tocar nada.
 */
import type { APIRoute } from 'astro';
import { colors, models } from '../data/catalog';
import { photoFor } from '../data/photos';
import { shareImage } from '../lib/seo';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async ({ site }) => {
  const origin = site!;
  const pages = [
    { loc: new URL('/', origin).href, priority: '1.0', images: [] as string[] },
    ...(await Promise.all(
      models.map(async (m) => ({
        loc: new URL(`/ambos/${m.id}/`, origin).href,
        priority: '0.9',
        images: await Promise.all(
          colors.flatMap((c) => {
            const img = photoFor(m.id, c.id);
            return img ? [shareImage(img, origin).then((i) => i.url)] : [];
          }),
        ),
      })),
    )),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .map(
    (p) => `  <url>
    <loc>${esc(p.loc)}</loc>
    <changefreq>weekly</changefreq>
    <priority>${p.priority}</priority>
${p.images.map((src) => `    <image:image><image:loc>${esc(src)}</image:loc></image:image>`).join('\n')}
  </url>`,
  )
  .join('\n')}
</urlset>
`;
  return new Response(body.replace(/\n\n/g, '\n'), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
