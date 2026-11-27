// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import { site as store } from './src/config/site.ts';

// URL pública del sitio (canonical, Open Graph, sitemap). Se puede cambiar con SITE_URL al desplegar.
const site = process.env.SITE_URL ?? 'https://evhtian.com.ar';

// Con un Pixel de Meta configurado, la CSP habilita solo los dominios que usa el Pixel.
const pixel = Boolean(store.meta.pixelId);
const meta = pixel ? ' https://www.facebook.com https://connect.facebook.net' : '';

export default defineConfig({
  site,
  // Todas las páginas siguen siendo estáticas. El adapter solo agrega la función de /api/evento/
  // (API de Conversiones de Meta), que se marca con `prerender = false`.
  output: 'static',
  adapter: vercel({ maxDuration: 10 }),
  // Una sola URL por página (/ambos/essential/): evita contenido duplicado. Vercel redirige la versión sin barra.
  trailingSlash: 'always',
  compressHTML: true,
  build: {
    format: 'directory',
    // Todo el CSS va en archivos propios: compatible con una CSP estricta.
    inlineStylesheets: 'never',
  },
  security: {
    // Astro genera la Content-Security-Policy con hashes de cada script/estilo propio.
    csp: {
      directives: [
        "default-src 'self'",
        `img-src 'self' data:${meta}`,
        "font-src 'self'",
        `connect-src 'self'${meta}`,
        "object-src 'none'",
        "base-uri 'self'",
        // El Pixel a veces manda los eventos con un formulario oculto dentro de un iframe a facebook.com/tr.
        `form-action 'self'${pixel ? ' https://www.facebook.com' : ''}`,
        ...(pixel ? ['frame-src https://www.facebook.com'] : []),
        'upgrade-insecure-requests',
      ],
      ...(pixel && { scriptDirective: { resources: ["'self'", 'https://connect.facebook.net'] } }),
    },
  },
  markdown: { syntaxHighlight: false },
  devToolbar: { enabled: false },
});
