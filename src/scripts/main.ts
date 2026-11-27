/**
 * Interacciones de la tienda: selección de producto, carrito (localStorage), checkout por WhatsApp,
 * revelados al scroll y estado del header.
 * Sin dependencias. Todo el texto se inserta con textContent (sin innerHTML con datos).
 */
import { site, formatARS, whatsappHref, installments } from '../config/site';
import { models, colors, sizes, skuFor, type ColorId, type ModelId, type SizeId } from '../data/catalog';

type Item = { model: ModelId; color: ColorId; size: SizeId; qty: number };

const KEY = 'evhtian-cart-v1';
const MAX_QTY = 50;
const COLOR_CLASSES = colors.map((c) => `c-${c.id}`);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

/** Evento del Pixel de Meta (ver src/scripts/pixel.ts). No hace nada si el Pixel no está configurado. */
const track = (event: string, params?: Record<string, unknown>) => window.fbq?.('track', event, params);

const modelName = (id: ModelId) => models.find((m) => m.id === id)?.name ?? id;
const colorName = (id: ColorId) => colors.find((c) => c.id === id)?.name ?? id;
const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

function setColorClass(el: Element, color: string) {
  el.classList.remove(...COLOR_CLASSES);
  el.classList.add(`c-${color}`);
}

/* --------------------------------------------------------------------------
   Estado del carrito
   -------------------------------------------------------------------------- */
function isItem(x: unknown): x is Item {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return (
    colors.some((c) => c.id === o.color) &&
    // El talle tiene que ser uno de los que vende ese modelo (el Terra no viene en XS).
    models.some((m) => m.id === o.model && m.sizes.includes(o.size as SizeId)) &&
    Number.isInteger(o.qty) &&
    (o.qty as number) > 0
  );
}

function load(): Item[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter(isItem).map((i) => ({ ...i, qty: Math.min(i.qty, MAX_QTY) }));
  } catch {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(cart));
  } catch {
    /* almacenamiento no disponible: el carrito vive solo en esta pestaña */
  }
}

let cart: Item[] = load();

const sameItem = (a: Item, b: Omit<Item, 'qty'>) => a.model === b.model && a.color === b.color && a.size === b.size;

function totals() {
  const qty = cart.reduce((s, i) => s + i.qty, 0);
  return { qty, total: qty * site.price, saving: qty * (site.listPrice - site.price) };
}

function addItem(item: Item) {
  const found = cart.find((i) => sameItem(i, item));
  if (found) found.qty = Math.min(found.qty + item.qty, MAX_QTY);
  else cart.push({ ...item, qty: Math.min(item.qty, MAX_QTY) });
  save();
  renderCart();
  bumpBadge();
}

function setQty(index: number, qty: number) {
  const item = cart[index];
  if (!item) return;
  if (qty <= 0) cart.splice(index, 1);
  else item.qty = Math.min(qty, MAX_QTY);
  save();
  renderCart();
}

/* --------------------------------------------------------------------------
   Render del carrito
   -------------------------------------------------------------------------- */
const dialog = $<HTMLDialogElement>('[data-cart]');
const itemsList = $('[data-cart-items]');
const garmentTemplates: Record<string, HTMLTemplateElement | null> = {
  essential: $<HTMLTemplateElement>('#tpl-garment-essential'),
  terra: $<HTMLTemplateElement>('#tpl-garment-terra'),
};

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

function iconSvg(name: 'minus' | 'plus' | 'trash') {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.5');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('aria-hidden', 'true');
  const d = {
    minus: 'M5 12h14',
    plus: 'M12 5v14M5 12h14',
    trash: 'M4.5 7h15M9.5 7V4.5h5V7M6.5 7l.8 12.5h9.4L17.5 7',
  }[name];
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', d);
  svg.append(path);
  return svg;
}

function thumb(item: Item) {
  const wrap = el('span', `thumb c-${item.color}`);
  const photo = $<HTMLTemplateElement>(`#tpl-thumb-${item.model}-${item.color}`);
  const photoImg = photo?.content.firstElementChild?.cloneNode(true);
  if (photoImg) {
    wrap.classList.add('thumb--photo');
    wrap.append(photoImg);
    return wrap;
  }
  const tpl = garmentTemplates[item.model];
  const svg = tpl?.content.firstElementChild?.cloneNode(true) as SVGElement | undefined;
  if (svg) {
    svg.querySelectorAll('defs, .g-shade, .g-fold').forEach((n) => n.remove());
    wrap.append(svg);
  }
  return wrap;
}

function renderCart() {
  const { qty, total, saving } = totals();

  // Badge del header
  $$('[data-cart-count]').forEach((badge) => {
    badge.textContent = String(qty);
    badge.hidden = qty === 0;
  });
  $$('[data-cart-label]').forEach((btn) =>
    btn.setAttribute('aria-label', `Abrir carrito, ${qty} ${plural(qty, 'ambo', 'ambos')}`),
  );

  const heading = $('[data-cart-heading-count]');
  if (heading) heading.textContent = qty ? `(${qty} ${plural(qty, 'ambo', 'ambos')})` : '';

  if (itemsList) {
    itemsList.replaceChildren(
      ...cart.map((item, index) => {
        const li = el('li', 'item');
        const info = el('div', 'it-info');
        info.append(
          el('p', 'it-name', `Ambo ${modelName(item.model)}`),
          el('p', 'it-meta', `${colorName(item.color)} · Talle ${item.size}`),
        );
        const controls = el('div', 'it-controls');
        const q = el('div', 'qty');
        const dec = el('button');
        dec.type = 'button';
        dec.setAttribute('aria-label', `Restar uno: Ambo ${modelName(item.model)} ${colorName(item.color)} talle ${item.size}`);
        dec.append(iconSvg('minus'));
        dec.addEventListener('click', () => setQty(index, item.qty - 1));
        const val = el('span', 'qty-value tnum', String(item.qty));
        const inc = el('button');
        inc.type = 'button';
        inc.disabled = item.qty >= MAX_QTY;
        inc.setAttribute('aria-label', `Sumar uno: Ambo ${modelName(item.model)} ${colorName(item.color)} talle ${item.size}`);
        inc.append(iconSvg('plus'));
        inc.addEventListener('click', () => setQty(index, item.qty + 1));
        q.append(dec, val, inc);
        const rm = el('button', 'it-remove');
        rm.type = 'button';
        rm.setAttribute('aria-label', `Quitar Ambo ${modelName(item.model)} ${colorName(item.color)} talle ${item.size}`);
        rm.append(iconSvg('trash'));
        rm.addEventListener('click', () => setQty(index, 0));
        controls.append(q, rm);
        info.append(controls);
        li.append(thumb(item), info, el('p', 'it-price tnum', formatARS(item.qty * site.price)));
        return li;
      }),
    );
  }

  const set = (sel: string, value: string) => {
    const node = $(sel);
    if (node) node.textContent = value;
  };
  set('[data-total]', formatARS(total));
  // Cuotas con débito (GOcuotas): monto fijo por ambo, siempre con el total en cuotas a la vista.
  set(
    '[data-cuotas-note]',
    `${installments.count} cuotas de ${formatARS(installments.amount * qty)} con tu tarjeta de débito, a través de ${installments.provider}. ` +
      `Total en cuotas: ${formatARS(installments.count * installments.amount * qty)}.`,
  );
  set('[data-saving]', formatARS(saving));
  const savingRow = $('[data-saving-row]');
  if (savingRow) savingRow.hidden = saving <= 0;

  dialog?.classList.toggle('has-items', qty > 0);
}

function bumpBadge() {
  $$('[data-cart-count]').forEach((badge) => {
    badge.classList.remove('bump');
    void badge.offsetWidth;
    badge.classList.add('bump');
  });
}

function openCart() {
  if (!dialog || dialog.open) return;
  dialog.showModal();
}
function closeCart() {
  dialog?.close();
}

$$('[data-cart-open]').forEach((b) => b.addEventListener('click', openCart));
$$('[data-cart-close]').forEach((b) => b.addEventListener('click', closeCart));
dialog?.addEventListener('click', (e) => {
  if (e.target === dialog) closeCart();
});

/* --------------------------------------------------------------------------
   Formularios de compra
   -------------------------------------------------------------------------- */
function selectedValue(form: HTMLFormElement, attr: string) {
  return $<HTMLInputElement>(`input[${attr}]:checked`, form)?.value;
}

/* Visores de producto: cambian modelo/color de fotos o ilustraciones sin recargar */
function setViewer(viewer: Element, opts: { model?: ModelId; color?: ColorId }) {
  const v = viewer as HTMLElement;
  const model = (opts.model ?? v.dataset.model) as ModelId;
  const color = (opts.color ?? v.dataset.color) as ColorId;
  if (!model || !color) return;
  v.dataset.model = model;
  v.dataset.color = color;
  setColorClass(v, color);
  $$('[data-model-view]', v).forEach((n) => n.classList.toggle('is-active', n.getAttribute('data-model-view') === model));
  const scope = $(`[data-model-view="${model}"]`, v) ?? v;
  $$('[data-color-view]', scope).forEach((n) => n.classList.toggle('is-active', n.getAttribute('data-color-view') === color));
  $$('[data-set-model]', v).forEach((n) => n.setAttribute('aria-pressed', String(n.getAttribute('data-set-model') === model)));
  $$('[data-set-color]', v).forEach((n) => n.setAttribute('aria-pressed', String(n.getAttribute('data-set-color') === color)));
  $$('[data-viewer-model-name]', v).forEach((n) => (n.textContent = modelName(model)));
  $$('[data-viewer-color-name]', v).forEach((n) => (n.textContent = colorName(color)));
  $$<HTMLAnchorElement>('[data-viewer-link]', v).forEach((a) => (a.href = `/ambos/${model}/?color=${color}`));
}

function syncForm(form: HTMLFormElement) {
  const container = form.closest('[data-product]') ?? form;
  const color = selectedValue(form, 'data-color-input') as ColorId | undefined;
  const model = form.dataset.model as ModelId;
  if (color) $$('[data-color-name]', form).forEach((n) => (n.textContent = colorName(color)));
  if (container.matches('[data-viewer]')) setViewer(container, { model, color });
  else if (color) setColorClass(container, color);
}

$$<HTMLFormElement>('form[data-buy]').forEach((form) => {
  let qty = 1;
  const qtyValue = $('[data-qty-value]', form);
  const dec = $<HTMLButtonElement>('[data-qty-dec]', form);
  const inc = $<HTMLButtonElement>('[data-qty-inc]', form);
  const hint = $('[data-size-hint]', form);
  const addBtn = $<HTMLButtonElement>('[data-add-btn]', form);

  const renderQty = () => {
    if (qtyValue) qtyValue.textContent = String(qty);
    if (dec) dec.disabled = qty <= 1;
    if (inc) inc.disabled = qty >= MAX_QTY;
  };
  dec?.addEventListener('click', () => {
    qty = Math.max(1, qty - 1);
    renderQty();
  });
  inc?.addEventListener('click', () => {
    qty = Math.min(MAX_QTY, qty + 1);
    renderQty();
  });

  form.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.matches('[data-size-input]') && hint) hint.textContent = '';
    syncForm(form);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const size = selectedValue(form, 'data-size-input') as SizeId | undefined;
    const color = selectedValue(form, 'data-color-input') as ColorId | undefined;
    const model = (selectedValue(form, 'data-model-input') ?? form.dataset.model) as ModelId;
    if (!size) {
      if (hint) hint.textContent = 'Elegí tu talle para agregar el ambo.';
      $<HTMLInputElement>('[data-size-input]', form)?.focus();
      return;
    }
    if (!color) return;
    addItem({ model, color, size, qty });
    track('AddToCart', {
      content_ids: [skuFor(model, color)],
      contents: [{ id: skuFor(model, color), quantity: qty }],
      content_name: `Ambo ${modelName(model)}`,
      content_type: 'product',
      value: site.price * qty,
      currency: 'ARS',
    });
    qty = 1;
    renderQty();
    if (addBtn) {
      addBtn.classList.add('is-done');
      window.setTimeout(() => addBtn.classList.remove('is-done'), 1800);
    }
    window.setTimeout(openCart, reducedMotion ? 0 : 420);
  });

  syncForm(form);
});

/* --------------------------------------------------------------------------
   Guía de talles (ficha de modelo con medidas)
   Se abre sola la primera vez que la clienta elige un talle, y siempre desde
   «Guía de talles». Tocar una fila de la tabla elige ese talle en el formulario.
   -------------------------------------------------------------------------- */
(() => {
  const guide = $<HTMLDialogElement>('[data-size-guide]');
  const form = guide && $<HTMLFormElement>(`form[data-buy][data-model="${guide.dataset.model}"]`);
  if (!guide || !form) return;
  const body = $('[data-size-guide-body]', guide);
  const confirm = $<HTMLButtonElement>('[data-size-guide-confirm]', guide);
  let shown = false;

  const sync = () => {
    const size = selectedValue(form, 'data-size-input');
    $$<HTMLElement>('[data-size-row]', guide).forEach((row) => {
      const on = row.dataset.sizeRow === size;
      row.classList.toggle('is-picked', on);
      $('[data-size-pick]', row)?.setAttribute('aria-pressed', String(on));
    });
    if (confirm) confirm.textContent = size ? `Confirmar talle ${size}` : 'Entendido';
  };
  const open = () => {
    if (guide.open) return;
    shown = true;
    sync();
    if (body) body.scrollTop = 0;
    guide.showModal();
  };

  form.addEventListener('change', (e) => {
    if (!(e.target as Element).matches('[data-size-input]')) return;
    sync();
    // Solo cuando la elige la clienta (no la preselección por URL ni la fila de la tabla).
    if (!shown && e.isTrusted) open();
  });
  $$('[data-size-guide-open]').forEach((b) => b.addEventListener('click', open));
  $$('[data-size-guide-close], [data-size-guide-confirm]', guide).forEach((b) => b.addEventListener('click', () => guide.close()));
  guide.addEventListener('click', (e) => {
    if (e.target === guide) return guide.close();
    const row = (e.target as Element).closest<HTMLElement>('[data-size-row]');
    const input = row && $<HTMLInputElement>(`input[data-size-input][value="${row.dataset.sizeRow}"]`, form);
    if (!input || input.checked) return;
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
})();

/* Botones de modelo/color dentro de un visor (inicio y tarjetas) */
let stopHeroCycle = () => {};
document.addEventListener('click', (e) => {
  const t = (e.target as Element).closest('[data-set-color], [data-set-model]');
  const viewer = t?.closest('[data-viewer]');
  if (!t || !viewer || t.closest('form')) return;
  if (t.hasAttribute('data-set-color')) setViewer(viewer, { color: t.getAttribute('data-set-color') as ColorId });
  else setViewer(viewer, { model: t.getAttribute('data-set-model') as ModelId });
  if (viewer.matches('[data-hero]')) stopHeroCycle();
});

/* Franjas de color del inicio: muestran los dos modelos en ese color */
$$('[data-pick-color]').forEach((btn) =>
  btn.addEventListener('click', () => {
    const color = btn.getAttribute('data-pick-color') as ColorId;
    $$('[data-card]').forEach((card) => setViewer(card, { color }));
    $('#coleccion')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  }),
);

/* Página de modelo: ?color=bordo&talle=S preselecciona */
(() => {
  const page = $('[data-product-page]');
  const form = page && $<HTMLFormElement>('form[data-buy]', page);
  if (!form) return;
  const params = new URLSearchParams(location.search);
  const color = params.get('color');
  const size = params.get('talle')?.toUpperCase();
  if (color && colors.some((c) => c.id === color)) {
    const input = $<HTMLInputElement>(`input[data-color-input][value="${color}"]`, form);
    if (input) input.checked = true;
  }
  if (size && sizes.includes(size as SizeId)) {
    const input = $<HTMLInputElement>(`input[data-size-input][value="${size}"]`, form);
    if (input) input.checked = true;
  }
  syncForm(form);
  const model = form.dataset.model as ModelId;
  const shown = (selectedValue(form, 'data-color-input') ?? page?.getAttribute('data-color')) as ColorId;
  track('ViewContent', {
    content_ids: [skuFor(model, shown)],
    content_name: `Ambo ${modelName(model)}`,
    content_type: 'product',
    value: site.price,
    currency: 'ARS',
  });
})();

/* --------------------------------------------------------------------------
   Checkout por WhatsApp
   -------------------------------------------------------------------------- */
const checkout = $<HTMLFormElement>('[data-checkout]');
checkout?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!cart.length) return;
  const data = new FormData(checkout);
  // Texto libre de la clienta: sin caracteres de control ni invisibles (saltos de línea, cambio de dirección del
  // texto, ancho cero) que puedan alterar cómo se lee el pedido, y como máximo 60 caracteres.
  const clean = (v: FormDataEntryValue | null) =>
    [...String(v ?? '').replace(/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/gu, ' ').replace(/\s+/g, ' ').trim()].slice(0, 60).join('');
  const nombre = clean(data.get('nombre'));
  const localidad = clean(data.get('localidad'));
  const pago = clean(data.get('pago'));
  const enCuotas = checkout.querySelector<HTMLInputElement>('input[data-pay="gocuotas"]')?.checked;
  const { qty, total } = totals();

  const lines: (string | null)[] = [
    '¡Hola Evhtian! Quiero hacer este pedido:',
    '',
    ...cart.map((i) => `• ${i.qty} × Ambo ${modelName(i.model)} · ${colorName(i.color)} · Talle ${i.size}`),
    '',
    `Ambos: ${qty}`,
    `Total: ${formatARS(total)} (sin envío)`,
    pago ? `Forma de pago: ${pago}` : null,
    enCuotas
      ? `En cuotas: ${installments.count} × ${formatARS(installments.amount * qty)} = ${formatARS(installments.count * installments.amount * qty)}`
      : null,
    nombre ? `Nombre: ${nombre}` : null,
    localidad ? `Localidad: ${localidad}` : null,
    '',
    '¿Me confirman disponibilidad y el costo del envío? ¡Gracias!',
    '',
    '(Pedido sujeto a verificación de precios y disponibilidad)',
  ];
  const href = whatsappHref(lines.filter((l): l is string => l !== null).join('\n'));
  track('InitiateCheckout', {
    content_ids: cart.map((i) => skuFor(i.model, i.color)),
    contents: cart.map((i) => ({ id: skuFor(i.model, i.color), quantity: i.qty })),
    content_type: 'product',
    num_items: qty,
    value: total,
    currency: 'ARS',
  });
  const link = el('a');
  link.dataset.noTrack = '';
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.append(link);
  link.click();
  link.remove();
});

/* Cualquier link a WhatsApp (consultas, talles, cambios): evento Contact del Pixel. */
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="https://wa.me/"]');
  if (a && !a.hasAttribute('data-no-track')) track('Contact');
});

/* --------------------------------------------------------------------------
   Header, menú móvil y revelados
   -------------------------------------------------------------------------- */
const header = $('[data-header]');
let ticking = false;
const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    header?.classList.toggle('is-scrolled', y > 8);
    document.documentElement.classList.toggle('has-scrolled', y > 140);
    ticking = false;
  });
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const menu = $('#menu');
$$('[data-menu-link]').forEach((a) =>
  a.addEventListener('click', () => {
    if (menu && 'hidePopover' in menu && menu.matches(':popover-open')) (menu as HTMLElement).hidePopover();
  }),
);

(() => {
  const nodes = $$('[data-reveal]');
  if (reducedMotion || !('IntersectionObserver' in window)) return;
  const vh = window.innerHeight;
  nodes.forEach((n) => {
    if (n.getBoundingClientRect().top < vh * 0.92) n.classList.add('is-in');
  });
  document.documentElement.classList.add('js');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -4% 0px', threshold: 0.05 },
  );
  nodes.filter((n) => !n.classList.contains('is-in')).forEach((n) => io.observe(n));
})();

/* Hero: el ambo recorre los cinco colores hasta que la visitante interactúa */
(() => {
  const hero = $('[data-hero]');
  if (!hero || reducedMotion) return;
  const order = colors.map((c) => c.id);
  let timer = 0;
  let stopped = false;
  const step = () => {
    const current = (hero.dataset.color ?? order[0]) as ColorId;
    setViewer(hero, { color: order[(order.indexOf(current) + 1) % order.length] });
  };
  const start = () => {
    window.clearInterval(timer);
    if (!stopped) timer = window.setInterval(step, 2800);
  };
  stopHeroCycle = () => {
    stopped = true;
    window.clearInterval(timer);
  };
  ['pointerdown', 'focusin', 'keydown'].forEach((ev) => hero.addEventListener(ev, stopHeroCycle, { passive: true }));
  hero.addEventListener('pointerenter', () => window.clearInterval(timer));
  hero.addEventListener('pointerleave', start);
  const io = new IntersectionObserver(([entry]) => (entry?.isIntersecting ? start() : window.clearInterval(timer)));
  window.setTimeout(() => io.observe(hero), 2400);
})();

renderCart();
