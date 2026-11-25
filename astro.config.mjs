// @ts-check
import { defineConfig } from 'astro/config';

// URL pública del sitio (canonical, Open Graph). Se puede cambiar con SITE_URL al desplegar.
const site = process.env.SITE_URL ?? 'https://evhtian.com.ar';

export default defineConfig({
  site,
  output: 'static',
  compressHTML: true,
  build: {
    // Todo el CSS va en archivos propios: compatible con una CSP estricta.
    inlineStylesheets: 'never',
  },
  security: {
    // Astro genera la Content-Security-Policy con hashes de cada script/estilo propio.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        'upgrade-insecure-requests',
      ],
    },
  },
  markdown: { syntaxHighlight: false },
  devToolbar: { enabled: false },
});
