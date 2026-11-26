# Fotos de producto

Colocá acá las fotos y el sitio las usa automáticamente en lugar de las ilustraciones.

Nombres esperados (JPG, PNG o WebP; vertical 2:3, idealmente 1600×2400 o más):

- Vista principal por color: `essential-bordo.jpg`, `essential-rosa.jpg`, `essential-negro.jpg`, `essential-marino.jpg`, `essential-verde.jpg`, y lo mismo con `terra-…`.
- Detalles (opcionales, se muestran en la galería de la página del modelo): `essential-detalle-1.jpg`, `essential-detalle-2.jpg`, … / `terra-detalle-1.jpg`, …
- Detalles por color (opcionales): `essential-rosa-detalle-1.jpg`, … Si los 5 colores tienen los suyos, la galería cambia junto con el color elegido; si no, se usan los detalles generales.

Un modelo pasa a fotos cuando tiene su vista principal en los 5 colores. Las fotos se optimizan solas al compilar (AVIF/WebP en varios tamaños).

Estado actual (25-nov): los dos modelos usan las 4 fotos que pasó la dueña, en bordó las originales (`brand/fotos/essential-bordo/` y `brand/fotos/terra-bordo/`) y en rosa, negro, azul marino y verde esas mismas fotos recoloreadas con `scripts/recolor.py essential|terra` (solo cambia el color de la tela; copias en `brand/generadas/essential-colores/` y `brand/generadas/terra-colores/`). Las fotos anteriores generadas con IA quedaron en `brand/generadas/reemplazadas/essential-v2/` y `…/terra-v2/`. Cada archivo lleva su procedencia embebida (comentario JPEG). Para reemplazarlas por fotos reales, usá el mismo nombre. Al reemplazar una foto, conviene subirle el número de versión (`essential-bordo.v2.jpg` → `essential-bordo.v3.jpg`): así el navegador no sigue mostrando la anterior guardada. El sufijo `.vN` es opcional y el sitio lo ignora al reconocer la foto.
