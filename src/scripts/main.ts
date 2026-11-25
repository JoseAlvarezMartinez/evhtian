/**
 * Interacciones de la tienda: selección de producto, carrito (localStorage), checkout por WhatsApp,
 * calculadora de la promo de equipo, revelados al scroll y estado del header.
 * Sin dependencias. Todo el texto se inserta con textContent (sin innerHTML con datos).
 */
import { site, formatARS, whatsappHref } from '../config/site';
import { models, colors, sizes, type ColorId, type ModelId, type SizeId } from '../data/catalog';

type Item = { model: ModelId; color: ColorId; size: SizeId; qty: number };

const KEY = 'evhtian-cart-v1';
const MAX_QTY = 50;
const COLOR_CLASSES = colors.map((c) => `c-${c.id}`);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

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
    models.some((m) => m.id === o.model) &&
    colors.some((c) => c.id === o.color) &&
    sizes.includes(o.size as SizeId) &&
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
  const subtotal = qty * site.price;
  const promoOn = qty >= site.promo.minItems;
  const discount = promoOn ? Math.round((subtotal * site.promo.percent) / 100) : 0;
  return { qty, subtotal, discount, total: subtotal - discount, promoOn };
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

function renderPromoMeter(qty: number, promoOn: boolean, discount: number) {
  const meter = $('[data-promo-meter]');
  const text = $('[data-promo-text]');
  const fill = $('[data-promo-fill]');
  if (!meter || !text || !fill) return;
  const min = site.promo.minItems;
  text.replaceChildren();
  if (promoOn) {
    text.append(el('strong', '', 'Promo equipo activada: '), `se ahorran ${formatARS(discount)} en este pedido.`);
  } else if (qty === 0) {
    text.append(`Sumá ${min} ambos o más y activá `, el('strong', '', `${site.promo.percent}% off`), ' en todo el pedido.');
  } else {
    const left = min - qty;
    text.append(
      `${plural(left, 'Te falta', 'Te faltan')} `,
      el('strong', '', `${left} ${plural(left, 'ambo', 'ambos')}`),
      ` para el ${site.promo.percent}% off de equipo.`,
    );
  }
  fill.style.width = `${Math.min(qty / min, 1) * 100}%`;
  meter.classList.toggle('is-on', promoOn);
}

function renderCart() {
  const { qty, subtotal, discount, total, promoOn } = totals();

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

  renderPromoMeter(qty, promoOn, discount);

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
  set('[data-subtotal]', formatARS(subtotal));
  set('[data-discount]', `−${formatARS(discount)}`);
  set('[data-total]', formatARS(total));
  const discountRow = $('[data-discount-row]');
  if (discountRow) discountRow.hidden = !promoOn;

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
})();

/* --------------------------------------------------------------------------
   Checkout por WhatsApp
   -------------------------------------------------------------------------- */
const checkout = $<HTMLFormElement>('[data-checkout]');
checkout?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!cart.length) return;
  const data = new FormData(checkout);
  const clean = (v: FormDataEntryValue | null) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, 60);
  const nombre = clean(data.get('nombre'));
  const localidad = clean(data.get('localidad'));
  const pago = clean(data.get('pago'));
  const { qty, subtotal, discount, total, promoOn } = totals();

  const lines: (string | null)[] = [
    '¡Hola Evhtian! Quiero hacer este pedido:',
    '',
    ...cart.map((i) => `• ${i.qty} × Ambo ${modelName(i.model)} · ${colorName(i.color)} · Talle ${i.size}`),
    '',
    `Ambos: ${qty}`,
    `Subtotal: ${formatARS(subtotal)}`,
    promoOn ? `Promo equipo −${site.promo.percent}%: −${formatARS(discount)}` : null,
    `Total: ${formatARS(total)}`,
    pago ? `Forma de pago: ${pago}` : null,
    nombre ? `Nombre: ${nombre}` : null,
    localidad ? `Localidad: ${localidad}` : null,
    '',
    '¿Me confirman disponibilidad y entrega? ¡Gracias!',
  ];
  const href = whatsappHref(lines.filter((l): l is string => l !== null).join('\n'));
  const link = el('a');
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.append(link);
  link.click();
  link.remove();
});

/* Compartir la promo con el equipo */
$$<HTMLAnchorElement>('[data-share-team]').forEach((a) =>
  a.addEventListener('click', async (e) => {
    if (!navigator.share) return;
    e.preventDefault();
    try {
      await navigator.share({ title: 'Evhtian · Promo equipo', text: a.dataset.shareText ?? '', url: location.origin + location.pathname });
    } catch {
      /* la usuaria canceló */
    }
  }),
);

/* --------------------------------------------------------------------------
   Calculadora de la promo de equipo
   -------------------------------------------------------------------------- */
(() => {
  const calc = $('[data-calc]');
  if (!calc) return;
  const nEl = $('[data-calc-n]', calc);
  const dec = $<HTMLButtonElement>('[data-calc-dec]', calc);
  const inc = $<HTMLButtonElement>('[data-calc-inc]', calc);
  const out = (sel: string, v: string) => {
    const node = $(sel, calc);
    if (node) node.textContent = v;
  };
  let n = site.promo.minItems;
  const render = () => {
    const full = n * site.price;
    const on = n >= site.promo.minItems;
    const promo = on ? full * (1 - site.promo.percent / 100) : full;
    if (nEl) nEl.textContent = String(n);
    out('[data-calc-full]', formatARS(full));
    out('[data-calc-total]', formatARS(promo));
    out('[data-calc-each]', formatARS(promo / n));
    out('[data-calc-save]', formatARS(full - promo));
    const left = site.promo.minItems - n;
    out(
      '[data-calc-note]',
      on
        ? `Promo activada: el ${site.promo.percent}% off va en todo el pedido.`
        : `Sumen ${left} ${plural(left, 'ambo', 'ambos')} más y activan el ${site.promo.percent}% off en todo.`,
    );
    calc.classList.toggle('is-locked', !on);
    if (dec) dec.disabled = n <= 1;
    if (inc) inc.disabled = n >= 30;
  };
  dec?.addEventListener('click', () => {
    n = Math.max(1, n - 1);
    render();
  });
  inc?.addEventListener('click', () => {
    n = Math.min(30, n + 1);
    render();
  });
})();

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
