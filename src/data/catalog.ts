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
  description: string;
  details: string[];
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
    'Elegimos una bengalina de tacto suave y calce firme que se adapta a tu cuerpo sin perder la forma. Resiste el ritmo de todos los días y combina la estructura de una prenda sastrera con la comodidad que tu jornada exige.',
  fibers: [
    { name: 'Rayón', role: 'suavidad al tacto' },
    { name: 'Nylon 28%', role: 'resistencia y durabilidad' },
    { name: 'Spandex 4%', role: 'elasticidad y ajuste' },
  ],
  points: [
    {
      image: 'tela-rodilla',
      title: 'Se estira con vos',
      text: 'Agacharte a la altura de un paciente, sentarte, levantarte: la bengalina acompaña cada movimiento sin tirar ni marcar.',
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
      text: 'Resistente y con presencia: terminás la guardia luciendo igual que cuando llegaste.',
      alt: 'Médica con ambo Essential verde militar y estetoscopio caminando con paso firme',
    },
  ],
};

export const models: Model[] = [
  {
    id: 'essential',
    name: 'Essential',
    tagline: 'El clásico que impone.',
    teaser: 'Cuello V que estiliza, bolsillos para todo y pantalón recto con cintura elastizada.',
    description:
      'El ambo que resuelve tu jornada con elegancia. Chaqueta cuello V que estiliza la figura, bolsillos frontales pensados para tener todo a mano y un pantalón recto con cintura elastizada que no oprime. Terminás la guardia y se sigue viendo impecable.',
    details: [
      'Cuello en V que estiliza',
      'Bolsillos frontales amplios',
      'Cintura elastizada que no oprime',
      'Corte recto atemporal',
      'Bolsillos laterales tradicionales',
      'Bolsillo tipo cargo',
    ],
    jacket: [
      { title: 'Cuello en V', text: 'Un diseño clásico y elegante que estiliza la figura.' },
      { title: 'Bolsillos frontales', text: 'Amplios y ubicados estratégicamente para que tus herramientas esenciales estén siempre a mano.' },
    ],
    pants: [
      { title: 'Cintura elastizada', text: 'Un ajuste perfecto y cómodo que no oprime, ideal para las jornadas más intensas.' },
      { title: 'Corte recto', text: 'Un estilo atemporal que brinda una silueta limpia y profesional.' },
      { title: 'Capacidad de guardado extra', text: 'Bolsillos laterales tradicionales y un bolsillo tipo cargo para llevar todo lo que necesitás.' },
    ],
  },
  {
    id: 'terra',
    name: 'Terra',
    tagline: 'El moderno que enamora.',
    teaser: 'Cuello V de líneas limpias y pantalón con cordón interno y bolsillos laterales.',
    description:
      'Para la que quiere verse actual sin resignar comodidad. Chaqueta cuello V de líneas limpias y un pantalón con cordón interno para ajustar la cintura a tu medida y bolsillos laterales. La misma bengalina suave y elástica, con una silueta moderna que no pasa desapercibida.',
    details: ['Cuello en V', 'Ajuste con cordón interno', 'Bolsillos laterales', 'Tela suave y elástica'],
    jacket: [{ title: 'Cuello en V', text: 'Un diseño clásico y elegante que estiliza la figura.' }],
    pants: [
      { title: 'Ajuste con cordón interno', text: 'Regulás la cintura a tu medida y te queda perfecto de principio a fin de la jornada.' },
      { title: 'Bolsillos laterales', text: 'Todo lo que necesitás a mano, sin perder la línea del pantalón.' },
    ],
  },
];

export const colors: Color[] = [
  { id: 'bordo', name: 'Rojo', hex: '#A9303C', line: 'Para la que entra al quirófano como si fuera una gala.' },
  { id: 'rosa', name: 'Rosa', hex: '#B98175', line: 'Dulce a la vista, firme en cada decisión.' },
  { id: 'negro', name: 'Negro', hex: '#111115', line: 'El clásico absoluto. Elegancia sin pedir permiso.' },
  { id: 'marino', name: 'Azul marino', hex: '#303B57', line: 'Autoridad serena. El color de la confianza.' },
  { id: 'verde', name: 'Verde militar', hex: '#7A8150', line: 'Carácter puro para las guardias más intensas.' },
];

export const sizes: SizeId[] = ['XS', 'S', 'M', 'L'];

/**
 * Tabla de medidas en cm. Vacía = el sitio ofrece asesoramiento por WhatsApp en su lugar.
 * TODO: completar con las medidas reales, por ejemplo: { size: 'XS', busto: '82–86', cintura: '62–66', cadera: '88–92' }
 */
export const sizeChart: { size: SizeId; busto: string; cintura: string; cadera: string }[] = [];

export const modelById = (id: string) => models.find((m) => m.id === id);
export const colorById = (id: string) => colors.find((c) => c.id === id);
