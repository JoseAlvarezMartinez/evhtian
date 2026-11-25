# Fotos de producto con IA: plan y prompts

Las fotos se generan a partir de las fotos de referencia de esta carpeta (`essential.jpg`, `terra.webp`) para que el diseño de cada ambo sea fiel. Al terminar, se guardan en `src/assets/products/` con los nombres indicados y el sitio las usa automáticamente.

**Modelo sugerido:** GPT Image 2.6, vertical 2:3, calidad media o alta, con la foto de referencia del modelo como imagen de referencia.
**Total:** 15 imágenes (10 colores + 4 detalles + 1 grupal). Con Higgsfield: ~7,5 créditos en calidad media (0,5 c/u) o ~3,75 en baja (0,25 c/u).
**Método para que los 5 colores sean consistentes:** primero se genera la foto base de cada modelo y después se recolorea esa misma foto (misma persona, pose y luz).

## Essential (referencia: `essential.jpg`)

**1. Base, bordó → `essential-bordo.jpg`**

> Photorealistic e-commerce fashion photograph, full body, front view, of a confident Latina woman in her early 30s who is a doctor, hair in a sleek low ponytail, natural makeup, standing relaxed. She wears the women's medical scrub set exactly as in the reference image: fitted short-sleeve V-neck scrub top with a large patch pocket with inner compartments on the lower front, a small dark label tab on one sleeve hem, curved hem with small side slits; straight-leg scrub pants with a wide black elastic waistband, slanted side pockets and a cargo pocket on the thigh. Color: deep crimson red (#A9303C), soft stretchy matte fabric. Clean white sneakers. Seamless warm off-white studio backdrop (#EFEBE4), soft diffused light, gentle floor shadow, premium scrubs catalog look. No text, no logos, no watermark.

**2–5. Recolores** (con la imagen 1 como referencia):

> Same photo, same woman, same pose, framing and lighting. Change only the scrub top and pants color to {COLOR}. Keep the elastic waistband black. No text.

- `essential-rosa.jpg`: muted dusty rosewood pink (#B98175)
- `essential-negro.jpg`: deep jet black (#111115)
- `essential-marino.jpg`: dark slate navy blue (#303B57)
- `essential-verde.jpg`: muted olive green (#7A8150)

**Detalles (bordó):**

- `essential-detalle-1.jpg`: close-up of the V-neck and the large front patch pocket with inner compartments, with a pen in the pocket and a hand resting near it.
- `essential-detalle-2.jpg`: close-up of the black elastic waistband, slanted side pocket and thigh cargo pocket of the burgundy pants.

## Terra (referencia: `terra.webp`)

**1. Base, azul marino → `terra-marino.jpg`**

> Photorealistic e-commerce fashion photograph, full body, front view, of an elegant Latina woman in her late 20s who is a doctor, dark hair in a sleek low ponytail, natural makeup, confident pose. She wears the women's medical scrub set exactly as in the reference image: fitted short-sleeve V-neck scrub top without pockets; wide-leg scrub pants with a same-color elastic waistband with internal drawstring and flap cargo pockets on the outer side of both thighs. Color: dark slate navy blue (#303B57), soft stretchy matte fabric. Clean white clogs. Seamless warm off-white studio backdrop (#EFEBE4), soft diffused light, gentle floor shadow, premium scrubs catalog look. No text, no logos, no watermark.

**2–5. Recolores:** el mismo prompt de recolor que en Essential, pero el pantalón va todo del mismo color.

- `terra-bordo.jpg`: deep crimson red (#A9303C)
- `terra-rosa.jpg`: muted dusty rosewood pink (#B98175)
- `terra-negro.jpg`: deep jet black (#111115)
- `terra-verde.jpg`: muted olive green (#7A8150)

**Detalles (azul marino):**

- `terra-detalle-1.jpg`: close-up of the waistband with internal drawstring.
- `terra-detalle-2.jpg`: close-up of the flap cargo side pocket on the wide-leg pants.

## Foto grupal → `equipo.jpg` (horizontal 4:3)

> Photorealistic photograph of four women healthcare professionals standing together and smiling in a bright, softly blurred modern hospital corridor. Each wears a fitted V-neck scrub set in a different color: burgundy, navy blue, military olive green and black, matching the reference designs. Warm natural light, editorial, premium and aspirational. No text, no logos.

## Nota

Son imágenes generadas con IA y representan el diseño de los ambos. Antes de publicar, conviene revisar que colores, bolsillos y calce coincidan con las prendas reales.

## Paleta actual (18/11/2026)

Las 14 fotos de producto se recolorearon a: rojo #A9303C, azul #303B57, negro #111115, rosa #B98175, verde #7A8150. Las versiones anteriores quedaron en `brand/generadas/paleta-anterior/`.
