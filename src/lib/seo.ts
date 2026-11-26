/**
 * SEO: datos estructurados (schema.org en JSON-LD) e imágenes para compartir.
 * Google los usa para los resultados enriquecidos (precio, stock, envíos, cambios) y Meta para leer los productos
 * del catálogo y armar las vistas previas. Todo sale de src/config y src/data: no hay valores sueltos acá.
 */
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { site, instagramHref, homeDescription } from '../config/site';
import { returnsPolicy } from '../config/shipping';
import { colors, fabric, skuFor, type Model, type ColorId } from '../data/catalog';
import { photoFor } from '../data/photos';
import { faqs } from '../data/faq';

type Node = Record<string, unknown>;

/** Identificadores estables para enlazar los nodos entre sí y entre páginas. */
const ids = (origin: URL) => ({
  org: new URL('/#organizacion', origin).href,
  site: new URL('/#sitio', origin).href,
  returns: new URL('/#cambios', origin).href,
});

export { skuFor };

/** Foto de producto exportada en JPG (formato que aceptan todos los rastreadores) con URL absoluta. */
export async function shareImage(img: ImageMetadata, origin: URL, width = 1200) {
  const out = await getImage({ src: img, width: Math.min(width, img.width), format: 'jpg', quality: 82 });
  const w = Number(out.attributes.width ?? Math.min(width, img.width));
  const h = Number(out.attributes.height ?? Math.round((img.height * w) / img.width));
  return { url: new URL(out.src, origin).href, width: w, height: h };
}

/** Negocio + sitio: van en todas las páginas indexables. */
export function siteNodes(origin: URL, logo: URL): Node[] {
  const id = ids(origin);
  return [
    {
      '@type': 'OnlineStore',
      '@id': id.org,
      name: site.name,
      url: new URL('/', origin).href,
      logo: { '@type': 'ImageObject', url: logo.href, width: 512, height: 512 },
      image: logo.href,
      description: homeDescription,
      slogan: site.tagline,
      sameAs: [instagramHref],
      areaServed: { '@type': 'Country', name: 'Argentina' },
      currenciesAccepted: 'ARS',
      paymentAccepted: site.payments.map((p) => p.label).join(', '),
      hasMerchantReturnPolicy: { '@id': id.returns },
    },
    {
      '@type': 'WebSite',
      '@id': id.site,
      name: site.name,
      alternateName: `${site.name} · ${site.tagline}`,
      url: new URL('/', origin).href,
      inLanguage: 'es-AR',
      publisher: { '@id': id.org },
    },
    returnPolicyNode(origin),
  ];
}

/** Política de cambios: solo cambios (sin reembolso), 7 días corridos, el envío del cambio lo paga la clienta. */
function returnPolicyNode(origin: URL): Node {
  return {
    '@type': 'MerchantReturnPolicy',
    '@id': ids(origin).returns,
    url: new URL('/#cambios', origin).href,
    applicableCountry: 'AR',
    returnPolicyCountry: 'AR',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: returnsPolicy.exchangeDays,
    returnMethod: 'https://schema.org/ReturnByMail',
    returnFees: 'https://schema.org/ReturnShippingFees',
    refundType: 'https://schema.org/ExchangeRefund',
    itemCondition: 'https://schema.org/NewCondition',
  };
}

/** Oferta de una variante: precio de promo, precio de lista tachado y vencimiento de la promo. */
function offer(url: string, origin: URL): Node {
  return {
    '@type': 'Offer',
    url,
    price: site.price,
    priceCurrency: 'ARS',
    priceValidUntil: site.sale.endsOn,
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      priceType: 'https://schema.org/StrikethroughPrice',
      price: site.listPrice,
      priceCurrency: 'ARS',
    },
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: { '@id': ids(origin).org },
    // Sin shippingDetails: el costo del envío se cotiza por WhatsApp y Google exige una tarifa fija si se declara.
    hasMerchantReturnPolicy: { '@id': ids(origin).returns },
  };
}

/**
 * Un modelo como ProductGroup con una variante por color (cada una con su foto, SKU y link que preselecciona el color).
 * Los talles se declaran en el grupo: todos los colores vienen en los talles del modelo al mismo precio.
 */
export async function productGroupNode(model: Model, pageUrl: URL, origin: URL, description: string): Promise<Node> {
  const variants = await Promise.all(
    colors.map(async (c) => {
      const img = photoFor(model.id, c.id as ColorId);
      const url = `${pageUrl.href}?color=${c.id}`;
      return {
        '@type': 'Product',
        '@id': `${pageUrl.href}#${c.id}`,
        name: `Ambo ${model.name} ${c.name.toLowerCase()}`,
        sku: skuFor(model.id, c.id),
        color: c.name,
        url,
        ...(img && { image: (await shareImage(img, origin)).url }),
        offers: offer(url, origin),
      };
    }),
  );
  return {
    '@type': 'ProductGroup',
    '@id': `${pageUrl.href}#producto`,
    name: `Ambo ${model.name}`,
    description,
    url: pageUrl.href,
    productGroupID: model.id,
    brand: { '@type': 'Brand', name: site.name },
    category: 'Indumentaria > Uniformes > Ambos médicos',
    audience: { '@type': 'PeopleAudience', suggestedGender: 'https://schema.org/Female' },
    material: `${fabric.name}: ${fabric.composition.toLowerCase()}`,
    size: model.sizes.join(', '),
    variesBy: ['https://schema.org/color'],
    image: variants.map((v) => v.image).filter(Boolean),
    hasVariant: variants,
  };
}

/** Migas de pan de la ficha de producto. */
export function breadcrumbNode(items: { name: string; url: string }[]): Node {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}

/** Lista de modelos del inicio, cada uno enlazado a su ficha. */
export function itemListNode(models: Model[], origin: URL): Node {
  return {
    '@type': 'ItemList',
    name: 'Colección de ambos médicos para mujer',
    itemListElement: models.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `Ambo ${m.name}`,
      url: new URL(`/ambos/${m.id}/`, origin).href,
    })),
  };
}

/** Preguntas frecuentes del inicio. */
export function faqNode(pageUrl: URL): Node {
  return {
    '@type': 'FAQPage',
    '@id': `${pageUrl.href}#preguntas`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
