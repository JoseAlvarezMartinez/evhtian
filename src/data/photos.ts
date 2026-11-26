/**
 * Fotos de producto opcionales en src/assets/products (ver LEEME.md en esa carpeta).
 * Si un modelo tiene su foto principal en los 5 colores, el sitio usa fotos; si no, la ilustración.
 */
import type { ImageMetadata } from 'astro';
import { colors, type ColorId, type ModelId } from './catalog';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/products/*.{jpg,jpeg,png,webp}', { eager: true });

const byName = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(files)) {
  // Un sufijo de versión opcional (essential-bordo.v2.jpg) cambia la URL de la foto para que el navegador no muestre la anterior guardada.
  const name = path.split('/').pop()!.replace(/\.(jpe?g|png|webp)$/i, '').replace(/\.v\d+$/i, '');
  byName.set(name, mod.default);
}

export const photoFor = (model: ModelId, color: ColorId) => byName.get(`${model}-${color}`);

export const hasAllPhotos = (model: ModelId) => colors.every((c) => byName.has(`${model}-${c.id}`));

const detailsWithPrefix = (prefix: string) =>
  [...byName.entries()]
    .filter(([name]) => name.startsWith(prefix))
    .sort(([a], [b]) => a.localeCompare(b, 'es', { numeric: true }))
    .map(([, img]) => img);

/** Detalles del modelo. Con color, usa los de ese color (essential-rosa-detalle-1.jpg) si existen; si no, los generales (essential-detalle-1.jpg). */
export const detailPhotos = (model: ModelId, color?: ColorId) => {
  const own = color ? detailsWithPrefix(`${model}-${color}-detalle-`) : [];
  return own.length ? own : detailsWithPrefix(`${model}-detalle-`);
};

/** true si cada color del modelo tiene sus propios detalles: la galería cambia junto con el color. */
export const hasColorDetails = (model: ModelId) =>
  colors.every((c) => detailsWithPrefix(`${model}-${c.id}-detalle-`).length > 0);
