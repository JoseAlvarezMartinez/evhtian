// Genera todos los recursos de marca a partir del logo original (dorado sobre #111).
// Uso: node scripts/brand-assets.mjs
//  - brand/mark.png, brand/wordmark.png, brand/logo-full.png  (recortes con alfa, fuente de trabajo)
//  - public/brand/*-mask.webp  (máscaras livianas solo-alfa para CSS)
//  - public/favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png, og.png
import sharp from 'sharp';

const SRC = 'brand/evhtian-logo-original.png';
const NOIR = '#0f0e0c';
const BG = 17; // fondo #111111 del original

// 1) Alfa por luminancia y color des-premultiplicado
const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const rgba = Buffer.alloc(width * height * 4);
for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  let a = Math.max(0, Math.min(1, ((Math.max(r, g, b) - BG) / (255 - BG)) * 1.6));
  if (a < 0.04) a = 0;
  const un = (c) => (a > 0 ? Math.min(255, Math.round((c - BG * (1 - a)) / a)) : 0);
  rgba[j] = un(r); rgba[j + 1] = un(g); rgba[j + 2] = un(b); rgba[j + 3] = Math.round(a * 255);
}
const raw = { raw: { width, height, channels: 4 } };
async function cut(top, h, file) {
  const buf = await sharp(rgba, raw).extract({ left: 0, top, width, height: h }).png().toBuffer();
  await sharp(buf).trim({ threshold: 1 }).png({ compressionLevel: 9 }).toFile(file);
}
await cut(80, 100, 'brand/wordmark.png');
await cut(200, height - 200, 'brand/mark.png');
await cut(0, height, 'brand/logo-full.png');

// 2) Máscaras solo-alfa (RGB negro) para usar con mask-image
async function mask(src, w, out) {
  const a = await sharp(src).resize({ width: w }).extractChannel('alpha').toBuffer();
  const { width: mw, height: mh } = await sharp(a).metadata();
  const black = await sharp({ create: { width: mw, height: mh, channels: 3, background: '#000' } }).png().toBuffer();
  await sharp(black).joinChannel(a).webp({ lossless: true }).toFile(out);
}
await mask('brand/mark.png', 560, 'public/brand/mark-mask.webp');
await mask('brand/wordmark.png', 720, 'public/brand/wordmark-mask.webp');

// 3) Íconos: caduceo dorado sobre negro
async function icon(size, file, pad = 0.16) {
  const inner = Math.round(size * (1 - pad * 2));
  const m = await sharp('brand/mark.png').resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: NOIR } }).composite([{ input: m, gravity: 'center' }]).png({ compressionLevel: 9 }).toFile(`public/${file}`);
}
await icon(32, 'favicon-32.png', 0.08);
await icon(180, 'apple-touch-icon.png');
await icon(192, 'icon-192.png');
await icon(512, 'icon-512.png');

// 4) Open Graph 1200x630
const logo = await sharp('brand/logo-full.png').resize({ height: 500, fit: 'inside' }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: NOIR } }).composite([{ input: logo, gravity: 'center' }]).png({ compressionLevel: 9 }).toFile('public/og.png');

console.log('brand assets ok');
