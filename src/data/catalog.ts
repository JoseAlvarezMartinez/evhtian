/**
 * Catálogo de Evhtian: dos modelos de ambo (chaqueta + pantalón), misma tela, cinco colores.
 */
export type ModelId = 'essential' | 'terra';
export type ColorId = 'bordo' | 'rosa' | 'negro' | 'marino' | 'verde';
export type SizeId = 'XS' | 'S' | 'M' | 'L';

export interface Feature {
  title: string;
  text: string;
}

export interface Model {
  id: ModelId;
  name: string;
  tagline: string;
  /** Frase corta para la tarjeta de presentación del inicio. */
  teaser: string;
  /** Resumen de chaqueta y pantalón para la descripción en Google y Meta (minúscula, sin punto final). */
  summary: string;
  /** Texto largo del modelo: va en los datos estructurados para Google (en la ficha se muestran las características). */
  description: string;
  /** Características cortas de la chaqueta y del pantalón, debajo del precio en la ficha del modelo. */
  highlights: { jacket: string[]; pants: string[] };
  /** Talles en los que viene este modelo. */
  sizes: SizeId[];
  /** Calce del modelo: va en la ficha (debajo de las características), en la guía de talles y en la sección de talles. */
  fit: { name: string; text: string };
  jacket: Feature[];
  pants: Feature[];
}

export interface Color {
  id: ColorId;
  name: string;
  hex: string;
  line: string;
}

/** Tela de ambos modelos. */
export const fabric = {
  name: 'Bengalina elastizada',
  composition: 'Rayón, nylon (28%) y spandex (4%)',
  summary:
    'Elegimos una bengalina de tacto suave y calce firme que se adapta a tu cuerpo sin perder la forma. Tiene la estructura de una prenda sastrera y la comodidad que tu jornada exige, y resiste el ritmo de todos los días.',
  fibers: [
    { name: 'Rayón', role: 'suavidad al tacto' },
    { name: 'Nylon 28%', role: 'resistencia y durabilidad' },
    { name: 'Spandex 4%', role: 'elasticidad y ajuste' },
  ],
  points: [
    {
      image: 'tela-rodilla',
      title: 'Se estira con vos',
      text: 'Agacharte a la altura de un paciente, sentarte, levantarte, volver a empezar: la bengalina acompaña cada movimiento sin tirar ni marcar.',
      alt: 'Médica con ambo Essential bordó y estetoscopio, con una rodilla en el piso y la tela acompañando el movimiento',
    },
    {
      image: 'tela-brazos-arriba',
      title: 'Libertad de movimiento',
      text: 'Atarte el pelo, estirarte, alcanzar lo que necesitás: la chaqueta se queda en su lugar y no te aprieta en los hombros.',
      alt: 'Médica con ambo Terra azul marino atándose el pelo con los brazos en alto, con la chaqueta en su lugar',
    },
    {
      image: 'tela-textura-estudio',
      title: 'Suave y firme a la vez',
      text: 'Suave sobre la piel y con un calce firme que se adapta a tu cuerpo y recupera su forma.',
      alt: 'Manos estirando la bengalina bordó, con su textura fina, junto a la misma tela doblada en reposo',
    },
    {
      image: 'tela-caminando',
      title: 'Impecable hasta el final',
      text: 'Resistente y con presencia: terminás la guardia luciendo igual que cuando llegaste. Nadie diría cuántas horas llevás.',
      alt: 'Médica con ambo Essential verde militar y estetoscopio caminando con paso firme',
    },
  ],
};

export const models: Model[] = [
  {
    id: 'essential',
    name: 'Essential',
    tagline: 'El clásico que impone.',
    teaser: 'Cuello V que estiliza, bolsillos para todo y un pantalón recto con cintura elastizada que no aprieta.',
    summary: 'chaqueta cuello V y pantalón recto con cintura elastizada',
    description:
      'El ambo que resuelve tu jornada con elegancia. La chaqueta cuello V estiliza la figura y sus bolsillos frontales amplios te dejan todo a mano. El pantalón recto, con cintura elastizada, bolsillos laterales y bolsillo cargo, acompaña sin apretar. Llegás impecable y terminás la guardia igual.',
    highlights: {
      jacket: ['Cuello en V que estiliza', 'Bolsillos frontales amplios', 'Bolsillo frontal doble: uno más chico sobre el grande'],
      pants: ['Bolsillo cargo', 'Bolsillos laterales', 'Cintura elastizada que no aprieta', 'Corte recto atemporal'],
    },
    sizes: ['XS', 'S', 'M', 'L'],
    fit: { name: 'Más entallado', text: 'sigue la línea de tu cuerpo, con una silueta prolija y definida.' },
    jacket: [
      { title: 'Cuello en V', text: 'Un diseño clásico y elegante que estiliza la figura.' },
      { title: 'Bolsillos frontales', text: 'Amplios y bien ubicados, para que tus herramientas de todos los días estén siempre a mano.' },
      { title: 'Bolsillo doble', text: 'Uno de los bolsillos frontales suma otro más chico encima del grande, para separar lo que usás a cada rato.' },
    ],
    pants: [
      { title: 'Cintura elastizada', text: 'Un ajuste cómodo que no aprieta, ni en la última hora de la guardia.' },
      { title: 'Corte recto', text: 'Atemporal y prolijo: una silueta limpia y profesional que favorece a todas.' },
      { title: 'Guardado extra', text: 'Bolsillos laterales y un bolsillo cargo para llevar todo lo que necesitás sin cargar la chaqueta.' },
    ],
  },
  {
    id: 'terra',
    name: 'Terra',
    tagline: 'El moderno que enamora.',
    teaser: 'Líneas limpias, cuello V y un pantalón con cordón interno que ajustás a tu medida.',
    summary: 'chaqueta cuello V de líneas limpias y pantalón cargo con cintura elastizada y cordón',
    description:
      'Para la que quiere verse actual sin resignar comodidad. La chaqueta cuello V, de líneas limpias, arma una silueta moderna y prolija y suma un bolsillo en el pecho izquierdo y bolsillos laterales. El pantalón, de cintura elastizada con cordón, se ajusta a tu medida y lleva doble bolsillo cargo y bolsillos laterales para tener lo esencial a mano. La misma bengalina suave y elástica, con una actitud que no pasa desapercibida.',
    highlights: {
      jacket: ['Cuello en V de líneas limpias', 'Bolsillo frontal en el pecho izquierdo', 'Bolsillos laterales'],
      pants: ['Cintura elastizada con cordón', 'Doble bolsillo cargo', 'Bolsillos laterales'],
    },
    sizes: ['S', 'M', 'L'],
    fit: { name: 'Más dinámico', text: 'más suelto y relajado, para moverte con total libertad.' },
    jacket: [
      { title: 'Cuello en V', text: 'Líneas limpias que estilizan la figura y enmarcan el rostro.' },
      { title: 'Bolsillo en el pecho y laterales', text: 'Un bolsillo en el pecho izquierdo y bolsillos a los costados, para tener lo esencial siempre a mano.' },
    ],
    pants: [
      { title: 'Cintura elastizada con cordón', text: 'La cintura elastizada acompaña cada movimiento y el cordón te deja ajustarla a tu medida.' },
      { title: 'Doble bolsillo cargo', text: 'Espacio extra para llevar todo lo que necesitás sin cargar la chaqueta.' },
      { title: 'Bolsillos laterales', text: 'Todo lo que necesitás a mano, sin perder la línea del pantalón.' },
    ],
  },
];

export const colors: Color[] = [
  { id: 'bordo', name: 'Bordó', hex: '#A9303C', line: 'Para la que entra al quirófano como si fuera una gala.' },
  { id: 'rosa', name: 'Rosa', hex: '#B98175', line: 'Dulce a la vista, firme en cada decisión.' },
  { id: 'negro', name: 'Negro', hex: '#111115', line: 'El clásico absoluto. Elegancia sin pedir permiso.' },
  { id: 'marino', name: 'Azul marino', hex: '#303B57', line: 'Autoridad serena. El color de la confianza.' },
  { id: 'verde', name: 'Verde militar', hex: '#7A8150', line: 'Carácter puro para las guardias más intensas.' },
];

/** Todos los talles de la tienda (cada modelo declara los suyos en `sizes`). */
export const sizes: SizeId[] = ['XS', 'S', 'M', 'L'];

export interface SizeRow {
  size: SizeId;
  busto: string;
  cintura: string;
  cadera: string;
}

/**
 * Margen que se suma a las medidas de cada talle por la elasticidad de la bengalina:
 * el mínimo baja 5 cm y el máximo sube 10 cm (pedido de la dueña, 2026-11-26).
 */
export const sizeStretch = { below: 5, above: 10 };

type Range = [min: number, max: number];
const stretched = ([min, max]: Range) => `${min - sizeStretch.below}–${max + sizeStretch.above}`;
const row = (size: SizeId, busto: Range, cintura: Range, cadera: Range): SizeRow => ({
  size,
  busto: stretched(busto),
  cintura: stretched(cintura),
  cadera: stretched(cadera),
});

/**
 * Medidas del cuerpo en cm, por modelo (se toman alrededor del cuerpo, como un cinturón).
 * Se cargan las medidas que pasó la dueña; la tabla publicada les suma `sizeStretch`.
 * Un modelo sin medidas no muestra guía de talles: la consulta de talle va por WhatsApp.
 */
export const sizeCharts: Partial<Record<ModelId, SizeRow[]>> = {
  essential: [
    row('XS', [86, 92], [66, 72], [94, 99]),
    row('S', [92, 97], [72, 78], [99, 104]),
    row('M', [97, 102], [78, 84], [104, 110]),
    row('L', [102, 108], [84, 90], [110, 116]),
  ],
  terra: [
    row('S', [84, 90], [72, 78], [88, 93]),
    row('M', [90, 96], [78, 84], [93, 99]),
    row('L', [96, 104], [84, 92], [99, 107]),
  ],
};

export const sizeChartFor = (model?: string): SizeRow[] => (model ? (sizeCharts[model as ModelId] ?? []) : []);

/** Talles de un modelo y su rango para los textos («XS a L», «S a L»). */
export const sizesFor = (model: string): SizeId[] => models.find((m) => m.id === model)?.sizes ?? sizes;
export const sizeRange = (model: string) => {
  const list = sizesFor(model);
  return `${list[0]} a ${list[list.length - 1]}`;
};

/** SKU de cada variante (modelo + color). Es el mismo ID en los datos estructurados, en Meta y en el Pixel. */
export const skuFor = (model: string, color: string) => `${model}-${color}`;

export const modelById = (id: string) => models.find((m) => m.id === id);
export const colorById = (id: string) => colors.find((c) => c.id === id);
