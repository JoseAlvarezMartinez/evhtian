---
name: Evhtian
description: Tienda de ambos médicos de mujer. El estándar premium de la categoría sobre papel claro, con la firma dorada del logo.
colors:
  gold-700: "#7c5f30"
  gold-600: "#9b7b40"
  gold-400: "#c8a766"
  gold-200: "#e6d29a"
  gold-50: "#f7edc6"
  ink: "#15130f"
  ink-2: "#48433b"
  ink-3: "#6b6458"
  paper: "#fbfaf7"
  paper-2: "#f4f1eb"
  paper-3: "#ebe6dc"
  line: "#e2dbcf"
  line-strong: "#cfc5b4"
  noir: "#0f0e0c"
  noir-2: "#1a1814"
  noir-line: "#3a3226"
  on-noir: "#f3ede1"
  on-noir-2: "#bdb3a1"
  ok: "#3d6b45"
  danger: "#9b2c2c"
  garment-bordo: "#6b1f2e"
  garment-rosa: "#d7a3ae"
  garment-negro: "#222120"
  garment-marino: "#1f2b47"
  garment-verde: "#4d5532"
  garment-band: "#1d1c1b"
  sheen-highlight: "#f6e8b4"
  sheen-champagne: "#dcc283"
  sheen-brass: "#b08c4f"
  sheen-bronze: "#8a6a3b"
  mark-gold: "#b9975a"
  mark-glint: "#fffae6"
  overlay-light: "#ffffff"
  overlay-shade: "#000000"
  rosa-shade: "#783c46"
typography:
  display:
    fontFamily: "Montserrat Variable, Montserrat, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 1rem + 3vw, 3.6rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Montserrat Variable, Montserrat, system-ui, sans-serif"
    fontSize: "clamp(1.85rem, 1.35rem + 2.1vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Montserrat Variable, Montserrat, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.25rem + 1.1vw, 2.15rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  subtitle:
    fontFamily: "Montserrat Variable, Montserrat, system-ui, sans-serif"
    fontSize: "clamp(1.2rem, 1.08rem + 0.55vw, 1.5rem)"
    fontWeight: 600
    lineHeight: 1.1
  lead:
    fontFamily: "Montserrat Variable, Montserrat, system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 1rem + 0.3vw, 1.2rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Montserrat Variable, Montserrat, system-ui, sans-serif"
    fontSize: "clamp(0.95rem, 0.92rem + 0.15vw, 1rem)"
    fontWeight: 400
    lineHeight: 1.65
  small:
    fontFamily: "Montserrat Variable, Montserrat, system-ui, sans-serif"
    fontSize: "clamp(0.82rem, 0.8rem + 0.1vw, 0.875rem)"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Montserrat Variable, Montserrat, system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    letterSpacing: "0.12em"
  caption:
    fontFamily: "Montserrat Variable, Montserrat, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    letterSpacing: "0.14em"
  numeral:
    fontFamily: "Montserrat Variable, Montserrat, system-ui, sans-serif"
    fontSize: "clamp(3rem, 2.2rem + 2.6vw, 4.25rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "tnum, lnum"
  display-compact:
    fontFamily: "Montserrat Variable, Montserrat, system-ui, sans-serif"
    fontSize: "clamp(1.85rem, 1.2rem + 3.4vw, 2.3rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  tile-name:
    fontFamily: "Montserrat Variable, Montserrat, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1rem + 1.7vw, 2.6rem)"
    fontWeight: 600
    lineHeight: 1
  step-numeral:
    fontFamily: "Montserrat Variable, Montserrat, system-ui, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 600
    lineHeight: 0.85
  menu:
    fontFamily: "Montserrat Variable, Montserrat, system-ui, sans-serif"
    fontSize: "1.6rem"
    fontWeight: 600
  price-hero:
    fontFamily: "Montserrat Variable, Montserrat, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    fontFeature: "tnum, lnum"
  item-title:
    fontFamily: "Montserrat Variable, Montserrat, system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 600
    lineHeight: 1.2
rounded:
  sm: "2px"
  lg: "4px"
  pill-sm: "1rem"
  pill: "2rem"
  scrollbar: "10px"
  round: "50%"
spacing:
  s-1: "0.25rem"
  s-2: "0.5rem"
  s-3: "0.75rem"
  s-4: "1rem"
  s-5: "1.5rem"
  s-6: "2rem"
  s-7: "3rem"
  s-8: "4rem"
  s-9: "6rem"
  s-10: "8rem"
  section: "clamp(4.5rem, 3rem + 6vw, 9rem)"
  gutter: "clamp(1rem, 0.5rem + 2.4vw, 3rem)"
  max: "82rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.85rem 1.6rem"
    height: "3.25rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.85rem 1.6rem"
    height: "3.25rem"
  button-ghost-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-gold:
    backgroundColor: "{colors.gold-400}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.85rem 1.6rem"
    height: "3.25rem"
  button-on-noir:
    backgroundColor: "transparent"
    textColor: "{colors.on-noir}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.85rem 1.6rem"
    height: "3.25rem"
  button-on-noir-hover:
    backgroundColor: "{colors.gold-200}"
    textColor: "{colors.ink}"
  size-option:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "2.75rem"
  size-option-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  swatch:
    rounded: "{rounded.round}"
    size: "2.5rem"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 0.75rem"
    height: "2.75rem"
  product-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
  media-chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-2}"
    typography: "{typography.caption}"
    rounded: "{rounded.sm}"
    padding: "0.35rem 0.7rem"
  fiber-chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-2}"
    typography: "{typography.small}"
    rounded: "{rounded.sm}"
    padding: "0.45rem 0.8rem"
  fabric-moment:
    backgroundColor: "{colors.paper-3}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
  promo-bar:
    backgroundColor: "{colors.noir}"
    textColor: "{colors.on-noir}"
    height: "2.5rem"
  cart-count:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.gold-200}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill-sm}"
    height: "1.15rem"
  cart-dialog:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    width: "min(100vw, 30rem)"
  whatsapp-fab:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.gold-200}"
    rounded: "{rounded.pill}"
    height: "3.5rem"
---

# Design System: Evhtian

## Overview

**Creative North Star: "La Vitrina Dorada"**

Evhtian es una tienda de ambos de mujer que sigue el canon de la categoría, con FIGS y Jaanuu como vara de calidad. Fondo marfil apenas cálido, tinta casi negra y el dorado del logo en dos registros: un gradiente para las piezas grandes y un oro profundo legible para el texto. La página se lee como una vitrina ordenada: secciones amplias, filetes finos, ningún adorno que no sea el producto. Las bandas negras con oro (barra de promo, promo de equipo, franja de equipo en la página de modelo, pie) son el único contraste fuerte.

Toda la tipografía es Montserrat Variable, alojada en el propio sitio. Esta decisión reemplaza a la pareja Bodoni Moda + Jost del contrato de dirección: el usuario rechazó la serif de alto contraste por fina y confusa, sobre todo en los números. Los titulares van en 600. La frase dorada de cada titular (`.accent`) va en 500 y derecha, nunca en itálica. Los números van en negrita, con cifras tabulares y un solo color por conjunto.

El color de las prendas vive solo en el producto. Hay cinco colores: bordó, rosa, negro, azul marino y verde militar. Recolorean la foto o la ilustración, las muestras y las franjas de color, y no se usan en la interfaz. En el inicio, cada modelo aparece solo como tarjeta de presentación, y la compra ocurre en la página de detalle (`/ambos/essential/`, `/ambos/terra/`). Las prendas se muestran con fotos reales generadas con IA; la ilustración SVG queda solo como respaldo. La tela se cuenta con cuatro fotos de situaciones de la jornada, también generadas con IA, sin diagramas ni íconos técnicos.

**Key Characteristics:**
- Papel marfil, tinta negra cálida y dorado del logo. Las bandas negras con oro marcan los momentos de promo y el pie.
- Una sola familia, Montserrat Variable, con jerarquía por peso (400 / 500 / 600 / 700) y escala fluida.
- Formas casi rectas (radios de 2px y 4px). Los círculos quedan para las muestras, los botones de ícono y el botón de WhatsApp.
- El producto es la única fuente de color. Los visores cambian de modelo y color sin recargar la página.
- Movimiento suave con curva `ease-out` de cola larga, siempre con respaldo para `prefers-reduced-motion`.
- CSP estricta: sin atributos `style` en el marcado. El estado visual se maneja con clases o con CSSOM desde el script.

## Colors

Una paleta cálida de tres familias (papel, tinta, dorado), con las bandas negras como contrapunto y los colores de prenda reservados al producto.

### Primary
- **Oro Profundo** (gold-700): el único dorado para texto chico sobre papel (5.5:1). Se usa en la frase `.accent` de los titulares, los taglines de modelo, los íconos de prueba y de pago, la etiqueta del pago destacado (Mercado Pago), el aviso de efectivo del carrito (`.pay-note`), el anillo de foco, el cursor de texto y los links secundarios.
- **Bronce del Caduceo** (gold-600): subrayado animado de la navegación, punto del indicador de scroll, números grandes de «Cómo comprar» y borde del stepper de la calculadora.
- **Oro Medio** (gold-400): punto separador de la barra de promo, borde del botón sobre negro e íconos del pie.
- **Champagne** (gold-200): el oro sobre negro. Se usa en el texto destacado de las bandas, el porcentaje de la promo, el contador del carrito, el ícono del botón de WhatsApp, el hover del botón sobre negro y la selección de texto.
- **Champagne Pálido** (gold-50): halo de foco de 3px en los campos de texto.
- **Brillo Dorado** (gradiente `--gold-sheen`, 112deg): solo en piezas grandes. Es el fondo del botón dorado y el relleno del medidor de promo. No es un color plano, así que el gradiente completo vive en el sidecar. Sus paradas son tokens propios:
  - **Luz de Brillo** (sheen-highlight): primera parada del brillo y de la marca clara. Al 35% es el barrido de luz que cruza los botones al pasar.
  - **Champagne de Brillo** (sheen-champagne): segunda parada del brillo y de la marca clara.
  - **Latón** (sheen-brass): tercera parada, y el borde de 1px del botón dorado.
  - **Bronce de Brillo** (sheen-bronze): última parada de la marca clara. El brillo de los botones cierra en un tono que coincide con gold-700.
- **Oro de Marca** (mark-gold): primera parada del gradiente oscuro de la marca (`.bm--gold`, 118deg, hacia gold-600 y un bronce profundo). **Destello de Marca** (mark-glint, al 95%) es la franja de luz que cruza el caduceo cada 7s.

### Neutral
- **Papel** (paper): fondo de página, tarjetas, carrito y campos.
- **Papel Lino** (paper-2): fondo de las secciones alternas (colección, la tela, talles, especificaciones), del medidor de promo y del segmentado de modelo, y hover de los botones de ícono.
- **Papel Arena** (paper-3): fondo de los escenarios de producto (tarjeta, página de modelo, miniaturas del carrito), con un brillo radial #fffdf9 arriba, y fondo de carga de las fotos de la tela.
- **Filete** (line) y **Filete Marcado** (line-strong): divisores y bordes de controles en reposo.
- **Tinta** (ink): texto principal, botón primario, talle elegido y filete fuerte de 1px sobre listas y tablas. **Tinta Media** (ink-2) para bajadas y párrafos secundarios, **Tinta Suave** (ink-3) para metadatos, notas y encabezados de tabla.
- **Negro Vitrina** (noir) y **Negro Tarjeta** (noir-2): bandas oscuras y la tarjeta de la calculadora. **Filete Nocturno** (noir-line) divide dentro de ellas. **Marfil sobre Negro** (on-noir) y **Marfil Velado** (on-noir-2) son el texto sobre negro.
- **Verde Confirmado** (ok): estado «Agregado» del botón y fila de descuento del carrito. **Rojo Aviso** (danger): aviso de talle faltante y hover de quitar ítem.

### Overlay tints
Tintes que solo aparecen con transparencia, encima de un color de prenda o de una foto. Nunca se usan opacos como fondo o texto de interfaz.
- **Luz de Pliegue** (overlay-light): brillo diagonal al 30% sobre las franjas de color claras (Rosa).
- **Sombra Neutra** (overlay-shade): piso al 22% en las franjas de color oscuras, filete interno al 12% en los puntos de color y sombra al 80% de la calculadora sobre negro.
- **Sombra Rosada** (rosa-shade): piso al 18% en la franja Rosa. Reemplaza al negro para que el rosa no se ensucie.
- Los velos sobre foto se hacen con un color de la paleta al que se le baja la opacidad: Papel al 85–96% (chips sobre foto, panel rápido del hero, header al 86%).

### Garment colors
Cada color de prenda se aplica con una clase `c-<color>` sobre un ancestro. La clase define `--g` (relleno), `--g-edge` (borde), `--g-seam` (costura) y `--g-hi` (brillo del pliegue). Muestras, puntos, franjas e ilustración leen esas variables, y `setViewer` cambia la clase.
- **Bordó** (garment-bordo), **Rosa** (garment-rosa), **Negro** (garment-negro), **Azul Marino** (garment-marino), **Verde Militar** (garment-verde).
- **Cintura Elastizada** (garment-band): la cintura del pantalón Essential es negra en los cinco colores (#1d1c1b, borde #0b0b0a, pespuntes #3a3836). No se recolorea.

### Named Rules
**The Product-Only Color Rule.** Los cinco colores de prenda aparecen solo en el producto: fotos, ilustración, muestras, puntos y franjas. Ningún botón, fondo ni texto de interfaz los usa.

**The Two-Gold Rule.** Sobre papel, el texto dorado es siempre gold-700. Sobre negro, siempre gold-200. El gradiente y sus paradas (sheen-*, mark-*) quedan para superficies grandes y para la marca, nunca para texto.

**The Noir Band Rule.** El negro de pantalla completa solo aparece en las bandas de promo y equipo y en el pie, siempre acompañado de oro. Una sección común nunca se oscurece por decoración.

## Typography

**Display Font:** Montserrat Variable (con Montserrat, system-ui, sans-serif)
**Body Font:** Montserrat Variable (misma familia; `--font-display` y `--font-ui` apuntan a la misma pila)

**Character:** Una sans geométrica nítida, de lectura clara, en el tono de una tienda premium convencional. La jerarquía sale del peso y del tamaño, no del contraste entre familias. La fuente se aloja en el sitio (`@fontsource-variable/montserrat`) y el corte latino se precarga.

### Hierarchy
- **Display** (600, escala step-5, interlineado 1.08, tracking -0.03em): solo el H1 del inicio. En móvil (600px o menos) pasa a **Display Compact** (display-compact) y sus dos líneas fluyen en línea.
- **Headline** (600, step-4, 1.12, -0.02em): H2 de sección y H1 de la página de modelo.
- **Title** (600, step-3): nombre del modelo en la tarjeta, titular de la franja de equipo, titular de «Comprar es así de simple» y precio en la página de modelo.
- **Subtitle** (600, step-2, 1.1): encabezados de chaqueta y pantalón, filas de pago, pasos y título del carrito. Los títulos de cada momento de la tela van en 600 de step-1.
- **Lead** (400, step-1, 1.55, ink-2): bajadas de sección. Ancho de unos 34 a 38rem.
- **Body** (400, step-0, 1.65): texto corrido. Las respuestas del FAQ llegan como máximo a 60ch.
- **Small** (400, step--1): metadatos, notas, migas de pan, chips de fibra y textos de los momentos de la tela (interlineado 1.6).
- **Label** (600, 0.78rem, 0.12em, mayúsculas): texto de botón. La navegación usa 500, 0.8125rem y 0.14em.
- **Caption** (caption, mayúsculas): la letra más chica del sistema. Chips sobre imagen, contador del carrito (500, sin mayúsculas) e indicador de scroll (500, 0.22em).
- **Numeral** (700, cifras tabulares y lining): el contador de la calculadora de equipo. Los totales usan 600 a 700 en step-3.
- **Tamaños fijos de rol:** **Tile Name** (tile-name) es el nombre de cada franja de color; **Step Numeral** (step-numeral, gold-600) son los números grandes de «Cómo comprar»; **Menu** (menu) son los links del menú móvil; **Price Hero** (price-hero) es el precio del hero; **Item Title** (item-title) es el nombre del ítem en el carrito y el precio del panel rápido. Son fijos a propósito: viven en contenedores de ancho conocido.

### Named Rules
**The One-Family Rule.** Todo es Montserrat Variable. No hay serif, itálica ni segunda familia. La frase dorada de un titular se marca con `.accent`: peso 500, derecha y color gold-700 (gold-200 sobre negro). En el titular de la tela, el `.accent` pasa a bloque y ocupa su propia línea.

**The Clean Numbers Rule.** Los precios, cantidades y totales van en negrita, con `font-variant-numeric: tabular-nums lining-nums` (clase `.tnum`) y un solo color por conjunto. Nunca se mezclan colores ni pesos dentro de una misma cifra.

## Layout

El contenedor `.wrap` es `min(100% - 2 × gutter, 82rem)`, con un gutter fluido de 1rem a 3rem. Las secciones respiran con `--section`, entre 4.5rem y 9rem de padding vertical. El espaciado sigue la escala s-1 a s-10 sobre una base de 8, con pasos de 0.25 y 0.75rem para ajustes finos. El header es fijo y mide 4.5rem (`--header-h`). El scroll con ancla deja ese alto más 1rem libre.

El patrón dominante es la grilla asimétrica de dos columnas (por ejemplo 0.8fr / 1.2fr o 1.15fr / 0.85fr), con un gap fluido `clamp(2rem, 1rem + 4vw, 6rem)`. Se apila a una columna entre 760px y 960px, según la sección. Los cortes observados son 1100, 960, 900, 860, 820, 760, 700, 640, 600, 560, 480 y 420px. Las secciones alternan Papel y Papel Lino, y la colección funde Papel con Lino mediante un degradé vertical.

- **Colección del inicio:** encabezado centrado (`.section-head--center`) y dos tarjetas en una grilla con un máximo de 56rem, centrada. Por debajo de 760px pasa a una columna de 28rem como máximo. Las tarjetas son de presentación, no protagonistas.

- **Hero del inicio:** texto a la izquierda (titular, bajada, CTAs, precio, línea de pruebas) y visor a la derecha. Por debajo de 960px el orden pasa a titular, visor y acciones.
- **Página de modelo (PDP):** migas de pan, galería de 1.15fr con foto principal 4:5 y dos fotos de detalle en dos columnas, y una columna de compra de 0.85fr fija (`sticky`) bajo el header. Debajo del precio no va una descripción: van las características del modelo en dos listas, Chaqueta y Pantalón (etiqueta en mayúsculas de 0.75rem ink-3 y tildes gold-700, desde `highlights` del catálogo), que se apilan por debajo de 420px, y una fila de ancho completo «Calce» con ícono de percha y el calce del modelo (`fit`). Después siguen chaqueta y pantalón, la tela (`FabricStory`), la guía de talles si hay medidas, la franja de equipo y la tarjeta del otro modelo, en una columna de 26rem como máximo junto a su titular. Por debajo de 960px se apila y la columna deja de ser fija.
- **La tela:** encabezado de dos columnas iguales alineadas abajo (titular a la izquierda, bajada y chips de fibra a la derecha), que se apila por debajo de 860px. Debajo, cuatro momentos en cuatro columnas, dos por debajo de 1100px y, por debajo de 600px, un carrusel horizontal con `scroll-snap` donde cada tarjeta ocupa el 78% del ancho y el carril sangra hasta el borde de la pantalla.
- **Guía de talles:** se renderiza por modelo, solo si ese modelo tiene medidas (`sizeCharts` en el catálogo; hoy los dos). Sin medidas no hay sección ni modal, y las dudas de talle van a WhatsApp desde la ficha del modelo.

## Elevation & Depth

Es un sistema híbrido: plano en reposo, con sombras cálidas tintadas de tinta (rgb 21 19 15) que aparecen con la interacción o en lo que flota. La profundidad del producto la dan el piso radial bajo la prenda y el `drop-shadow` de la ilustración.

### Shadow Vocabulary
- **Reposo** (`--shadow-1`: `0 1px 2px rgb(21 19 15 / 0.06), 0 2px 8px rgb(21 19 15 / 0.05)`): la opción elegida en los segmentados.
- **Hover** (`--shadow-2`: `0 10px 30px -12px rgb(21 19 15 / 0.22), 0 4px 10px -6px rgb(21 19 15 / 0.12)`): botones al pasar.
- **Flotante** (`--shadow-3`: `0 30px 60px -24px rgb(21 19 15 / 0.35), 0 12px 24px -12px rgb(21 19 15 / 0.18)`): tarjeta de producto al pasar, panel rápido del hero, carrito y botón de WhatsApp.
- **Calculadora sobre negro** (`0 40px 80px -40px rgb(0 0 0 / 0.8)`): solo la tarjeta de la calculadora de equipo.
- **Prenda** (`drop-shadow(0 22px 26px rgb(21 19 15 / 0.2)) drop-shadow(0 4px 6px rgb(21 19 15 / 0.12))`): ilustración del ambo.

### Named Rules
**The Lift-On-Intent Rule.** Las superficies están planas en reposo. La sombra crece con la intención: la tarjeta sube 4px y pasa a shadow-3, y el botón gana shadow-2. Solo lo que flota sobre la página (carrito, panel rápido, botón de WhatsApp) tiene sombra permanente. Las fotos de la tela no llevan sombra: al pasar, solo la imagen se acerca.

## Shapes

El lenguaje es casi recto: 2px (`--radius`) en botones, talles, chips (también los de fibra), campos y opciones de pago, y 4px (`--radius-lg`) en tarjetas, escenarios, fotos de la tela, segmentados y la calculadora. El círculo queda para las muestras de color y los puntos, los botones de ícono, el stepper de la calculadora y los íconos de pago. Hay dos píldoras: 2rem (pill) solo para el botón de WhatsApp y 1rem (pill-sm) solo para el contador del carrito. La barra de scroll del navegador usa un pulgar redondeado de 10px (scrollbar), en line-strong con borde papel. Los bordes son filetes de 1px. Un filete fuerte de tinta encabeza las listas (FAQ, pagos, tabla de talles, encabezados de chaqueta y pantalón) y filetes suaves separan cada fila.

## Components

### Buttons
Botones firmes y rectos, en mayúsculas espaciadas.
- **Shape:** casi recto (2px). Alto mínimo de 3.25rem y padding de 0.85rem × 1.6rem. Si llevan ícono, el SVG mide 1.15em.
- **Default:** fondo tinta, texto papel. Al pasar, un barrido de luz dorada (`linear-gradient` a rgb 246 232 180 / 0.35, 900ms) cruza el botón y aparece shadow-2. Al presionar baja 1px. Deshabilitado: opacidad 0.45.
- **Ghost:** transparente con borde y texto tinta. Al pasar se llena de tinta.
- **Gold:** fondo Brillo Dorado al 140% de ancho, borde #b08c4f y texto tinta. Al pasar, el gradiente se desplaza en 700ms. Es el botón de las bandas negras y del envío por WhatsApp.
- **On-noir:** transparente, borde gold-400 y texto on-noir. Al pasar se llena de gold-200 con texto tinta. Solo va sobre negro.
- **Link-arrow:** link en mayúsculas con subrayado de 1px. La flecha se corre 4px al pasar.
- **Agregar al carrito:** al confirmar pasa a verde ok, y la etiqueta «Agregado» sube desde abajo durante 1.8s.

### Swatches and dots
- **Swatch** (en el formulario de compra): un radio nativo invisible sobre un círculo de 2.5rem con un punto de 1.85rem en `--g`, con filete interno y brillo superior. Al pasar, el punto crece a 1.08. La opción elegida muestra un anillo de tinta que escala de 0.85 a 1. El foco es un contorno gold-700.
- **Dot** (en los visores): un botón con `aria-pressed`. Mide 2.5rem con punto de 1.85rem en el hero y 2rem con punto de 1.35rem en la tarjeta. La opción elegida lleva un borde de tinta.

### Sizes and quantity
- **Talles:** grilla de una columna por talle del modelo (Essential XS, S, M, L; Terra S, M, L). Cada celda mide 2.75rem, con borde line-strong, peso 500 y tracking 0.08em. Al pasar el borde se vuelve tinta. La opción elegida es fondo tinta con texto papel. Sin talle, aparece un aviso en danger bajo la grilla.
- **Cantidad:** un grupo bordeado con − y + de 2.75rem (2.25rem en el carrito) y el valor en tabulares.

### BuyForm
El formulario de compra solo vive en la página de modelo. Lleva una etiqueta de opción con el nombre del color elegido, las muestras, los talles con el link a la guía en gold-700 y una fila con la cantidad y «Agregar al carrito». Tiene una variante compacta en grilla de dos columnas y un segmentado de modelo opcional, pero ningún uso actual las activa.

### ProductCard
Una tarjeta de presentación que lleva a la página del modelo. No incluye formulario de compra.
- **Estructura:** borde line de 1px, radio de 4px y fondo papel. El escenario mide 4:5 sobre Papel Arena con brillo radial, y lleva arriba a la izquierda un chip «Chaqueta + pantalón» (papel al 85%, mayúsculas de 0.6875rem). El cuerpo tiene 1.5rem de padding, nombre en title y precio en tabulares 600, tagline en gold-700 y teaser en small ink-2. El pie, separado por un filete, junta los puntos de color y «Ver el modelo →».
- **Estados:** al pasar, la tarjeta sube 4px, gana shadow-3 y borde line-strong (700ms), la imagen escala a 1.03 (1.2s) y la flecha se corre 4px. El link estirado cubre toda la tarjeta, los puntos quedan por encima (z-index 2) y el foco dibuja un contorno gold-700 sobre la tarjeta entera.

### ProductVisual and the viewer pattern
`ProductVisual` tiene dos estados:
- **Fotos** (`pv--photo`): es el estado que se publica hoy. Los dos modelos tienen sus cinco fotos de color generadas con IA en `src/assets/products` (`<modelo>-<color>.jpg`), más dos fotos de detalle por modelo para la galería de la página y una foto de equipo. Las cinco `<Picture>` (AVIF/WebP, de 480 a 1600w) se apilan en `object-fit: cover`, con el foco en `--pv-pos` (50% 6% por defecto). Solo la foto `.is-active` tiene opacidad 1, con un fundido de 700ms. Solo la foto activa del hero y de la página carga con `eager` y `fetchpriority=high`.
- **Ilustración** (`pv--art`): solo de respaldo, si a un modelo le falta alguna foto. `Garment` dibuja un flat-lay SVG de chaqueta cuello V y pantalón, que lee las variables `--g*`, cambia de color en 600ms y lleva la cintura negra fija en Essential.

El patrón visor (`data-viewer` con `data-model`/`data-color`) se repite en el hero, la tarjeta y la página de modelo. Los botones `data-set-model`/`data-set-color` llaman a `setViewer`, que cambia la clase `c-*`, la vista de modelo y de foto activa, el `aria-pressed`, los nombres en vivo y el `href` de «Ver el modelo» (`/ambos/<modelo>/?color=<color>`). Las franjas de color del inicio aplican su color a las dos tarjetas a la vez.

### Hero viewer
Un escenario cuadrado sobre degradé Lino a Arena, con un piso radial, el caduceo dorado con brillo arriba a la derecha y un pie de foto en vivo («Ambo Essential · Bordó»). Debajo, un panel rápido flota encima del escenario (−4.5rem, papel al 96%, shadow-3) con el segmentado Essential/Terra, los puntos, el precio y «Ver el modelo». El modelo inactivo queda en `display: none`, así que sus fotos no se descargan hasta elegirlo.

### Cart dialog
Un `<dialog>` lateral de `min(100vw, 30rem)` que entra desde la derecha en 520ms, con `@starting-style` y un fondo de tinta al 45% con desenfoque de 3px.
- **Medidor de promo:** franja Lino con el texto y una barra de 4px rellena con Brillo Dorado (700ms). Al alcanzar el mínimo de la promo, la franja pasa a negro con texto gold-200 y la barra a noir-line.
- **Contenido:** ítems con miniatura (foto o ilustración) y el resto del pedido en tabulares: subtotal, descuento en ok y total en 600 de step-3. Siguen las opciones de pago en una grilla de dos columnas de tarjetas radio con borde doble de tinta al elegir, cada una con ícono y la etiqueta corta del medio (`short`: Transferencia, Mercado Pago, Efectivo (solo Tigre), 3 cuotas con débito). Al elegir efectivo aparece, solo con CSS (`.pay:has(input[data-pay=efectivo]:checked)`), un aviso `.pay-note` en gold-700 de 0.8125rem que limita el pago a la zona de Tigre; al elegir cuotas, el mismo aviso muestra las cuotas y el total en cuotas según la cantidad de ambos. Después vienen los campos opcionales y una barra de envío fija abajo con el botón dorado de WhatsApp.

### Size guide
Ya no hay formulario de asesor de talle. Las medidas son por modelo (`sizeCharts`); hoy las tienen los dos.
- **Modal (`SizeGuide`):** un `<dialog>` centrado de hasta 66rem (en celular, hoja que sube desde abajo), con cabecera y pie fijos y el cuerpo con scroll. Se abre solo la primera vez que la clienta elige un talle en la ficha, y siempre desde «Guía de talles» (botón-link gold-700 con ícono de regla). A la izquierda enseña a medirse: «Medite como si te pusieras un cinturón», un «así sí / así no» con dos maniquíes de costura dibujados en SVG (cinta gold-600 con el tramo de la espalda punteado; la medida «solo de frente» en danger) y «Dónde pasar la cinta» con busto, cintura y cadera. A la derecha, la tabla fija (`sticky`): tocar una fila elige ese talle en el formulario y la fila elegida va en tinta con texto papel, como el talle elegido. Sobre la tabla va el calce del modelo (ícono de percha gold-700: «Calce más entallado» o «más dinámico») y debajo un aviso en Papel Lino, radio de 4px y small ink-2, que aclara que la tabla es un estimado y enlaza a la política de cambios (`/#cambios`). El pie lleva «Cambio de talle en N días» y el botón primario «Confirmar talle X» («Entendido» sin talle). Entra con fundido y 1.25rem de subida (520ms) y el mismo fondo velado del carrito.
- **Sección `#talles`:** solo en la ficha de un modelo con medidas. Copia a la izquierda con «Cómo medirte» (abre el modal) y «Consultar mi talle» (ghost, WhatsApp), y a la derecha una tabla con encabezado en mayúsculas de 0.75rem ink-3, filete de tinta bajo el encabezado y filas separadas por line, con cifras tabulares.
- **Sin medidas** (un modelo nuevo, por ejemplo), el link de la ficha («¿Dudás con el talle? Te asesoramos») y el FAQ llevan la consulta a WhatsApp.

### FAQ
Un `<details name="faq">` exclusivo, con la primera pregunta abierta. La lista arranca con un filete de tinta y separa filas con line. La pregunta va en 500 de step-1 y se vuelve gold-700 al pasar. El ícono + en gold-700 gira 45° y la altura se anima con `interpolate-size` y `::details-content` (500ms).

### Breadcrumbs
Una lista en small ink-3 con separadores «/» en line-strong. Los links van en ink-2 y se subrayan al pasar. La página actual va en tinta 500 con `aria-current`.

### Navigation
El header es fijo, en papel al 86% con desenfoque de 14px. Al hacer scroll gana un filete y una sombra suave. Los links (Colección, Colores, Promo equipo, La tela, Pagos, Preguntas) van en mayúsculas de 0.8125rem con tracking 0.14em, y un subrayado gold-600 se dibuja de izquierda a derecha al pasar. Los botones de ícono son círculos de 2.75rem. El contador del carrito es una píldora tinta con número gold-200 que rebota al sumar. En móvil, el menú es un popover.

### Payments
La sección `#pagos` muestra un libro de filas bajo un filete de tinta: ícono circular de 3rem en gold-700 con borde line-strong, etiqueta en subtitle y detalle en ink-2. Los medios son transferencia, Mercado Pago, efectivo al recibir (solo en la zona de Tigre) y 3 cuotas con débito vía GOcuotas. Las cuotas aparecen también bajo el precio de la ficha y del hero (ícono de tarjeta gold-700), siempre con el total en cuotas. La fila destacada es Mercado Pago: ícono tinta lleno con trazo gold-200 y etiqueta en gold-700. Cada medio tiene una etiqueta larga (`label`) para el libro y una corta (`short`) para el pie, la ficha de modelo y el carrito.

### FabricStory (la tela)
La tela vive en `#tela`, en el inicio (después de la colección) y en cada página de modelo (después de chaqueta y pantalón). Cuenta la bengalina con situaciones reales de la jornada, no con especificaciones.
- **Sección:** banda Papel Lino de ancho completo.
- **Encabezado:** a la izquierda, un H2 en headline cuyo `.accent` pasa a bloque, en su propia línea gold-700. A la derecha, la bajada en lead ink-2 y una fila de chips de fibra: papel, borde line-strong, radio de 2px, padding 0.45rem × 0.8rem, small ink-2 con el nombre de la fibra en 600 tinta.
- **Momentos:** cuatro `<figure>`, cada uno con una foto 4:5 generada con IA (`src/assets/fabric/tela-*.jpg`, AVIF/WebP de 360 a 960w, carga diferida) en radio de 4px sobre Papel Arena, y un pie con el título en 600 de step-1 y el texto en small ink-2. Sin borde, sin tarjeta y sin sombra: la foto es la superficie.
- **Estados:** al pasar sobre el momento, la imagen escala a 1.04 en 1.2s con `ease-out`, dentro de su recorte. Los momentos entran con `data-reveal`, escalonados con `--i`.

### Black-and-gold bands
Las bandas son la barra de promo (2.5rem, texto on-noir y destacados gold-200), la promo de equipo del inicio (calculadora sobre noir-2 y caduceo de fondo al 7%), la franja de equipo de la página de modelo y el pie. El caduceo y el logotipo se pintan con máscaras sobre los gradientes de marca: oscuro (mark-gold a gold-600) sobre papel, claro (las paradas sheen-*) sobre negro, con el destello mark-glint. Todas usan noir con un halo radial dorado (rgb 200 167 102 / 0.14 a 0.16), texto on-noir y on-noir-2, divisores noir-line, y botones gold u on-noir.

### Motion
- **Entrada del hero:** bajada, CTAs, precio, pruebas y panel rápido suben 18px con desenfoque de 6px, escalonados de 0.45s a 0.95s. El escenario se abre con un `clip-path` y la prenda sube. Todo usa `animation-fill-mode: backwards`, así que el estado de reposo es visible y no hay `opacity: 0` en el CSS de base. **El H1 no se anima, porque es el elemento LCP.** Donde el navegador soporta `animation-timeline`, la prenda se desplaza un 7% con el scroll.
- **Ciclo del hero:** pasados 2.4s, si el hero está a la vista, la prenda recorre los cinco colores cada 2.8s. La pausa llega al pasar el puntero, y el ciclo se corta para siempre con cualquier `pointerdown`, foco, tecla o clic en un control.
- **Revelados al scroll:** `data-reveal` sube 28px (900ms). La variante `fade` solo funde y `rise-blur` agrega un desenfoque de 10px. El escalonado es `--i × 90ms`. Solo se activa con JS (clase `.js`) y sin reduced-motion, así que sin JS todo queda visible.
- **Hover de tarjeta:** sube 4px, la imagen escala a 1.03 y la flecha se corre 4px. En los momentos de la tela solo la foto escala, a 1.04.
- **Otros:** el caduceo tiene un brillo cada 7s, el indicador de scroll un punto que cae, el botón de WhatsApp entra a los 2s y el contador del carrito rebota. Con `prefers-reduced-motion: reduce`, todas las duraciones bajan a 0.01ms y no hay ciclo ni revelados.

## Do's and Don'ts

### Do:
- **Do** usar Montserrat Variable en todo: titulares en 600, `.accent` en 500 derecha, números en negrita con `.tnum`.
- **Do** escribir el texto dorado sobre papel en gold-700 y sobre negro en gold-200. El gradiente queda para el botón dorado y el medidor de promo.
- **Do** aplicar el color de prenda con una clase `c-<color>` y leer `--g`, `--g-edge`, `--g-seam` y `--g-hi`. La cintura del Essential queda negra.
- **Do** construir cada vista de producto nueva con `ProductVisual` y el patrón visor (`data-viewer` + `setViewer`), para que las fotos y el respaldo ilustrado se elijan solos.
- **Do** contar la tela con fotos de uso real en 4:5 (`src/assets/fabric`) y textos cortos. Cada momento nuevo suma una foto y un título, no un ícono.
- **Do** dar a cada medio de pago una etiqueta larga y una corta, y avisar las restricciones de un medio en el lugar donde se elige, como el `.pay-note` del efectivo.
- **Do** usar los tintes de overlay (overlay-light, overlay-shade, rosa-shade) solo con transparencia, sobre producto o foto.
- **Do** dejar visibles por defecto las entradas animadas (`backwards`, o la clase `.js` con `.is-in`) y mantener el H1 sin animar.
- **Do** cambiar estados visuales con clases o con CSSOM desde `main.ts`, como el ancho del medidor de promo.
- **Do** encabezar listas y tablas con un filete de tinta de 1px y separar filas con line.

### Don't:
- **Don't** escribir atributos `style` en el marcado ni scripts en línea sin hash: Astro `security.csp` genera los hashes de scripts y el CSS sale en archivos propios (`inlineStylesheets: 'never'`).
- **Don't** usar serif, itálica ni una segunda familia. Bodoni Moda y Jost quedaron reemplazadas.
- **Don't** mezclar colores o pesos dentro de una misma cifra ni pintar números con gradiente.
- **Don't** usar los colores de prenda en botones, fondos o texto de interfaz.
- **Don't** poner un formulario de compra en el inicio. Ahí, los modelos son tarjetas de presentación que llevan a su página.
- **Don't** oscurecer secciones comunes. El negro es solo de las bandas de promo y equipo y del pie.
- **Don't** redondear más allá de 4px en superficies rectangulares. Las píldoras son solo del botón de WhatsApp y del contador del carrito.
- **Don't** mostrar cuotas sin su total en cuotas ni llamarlas «sin interés». La única financiación es GOcuotas (3 cuotas con débito, desde `installments` en site.ts).
