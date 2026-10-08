# Exported Home artwork

Run `npm run nook:generate` after editing the landscape/sky SVGs or the room palettes
in `src/shared/styles/*-palette.css`.
Use `npm run nook:generate -- --skies` to refresh only the fixed sky surfaces.
Run `node scripts/generate-nook-assets.js --check-skies` to compare every sky
export with its resolved source SVG, including lossless alpha and RGB error.
Sky compression starts at quality 80 and raises it only if the mean source RGB
error exceeds 2.5/255. Each surface is rendered once for this comparison.

The editable React components remain the source artwork. The exporter renders
them in Node, resolves inherited palette tokens and color mixes, and uses Sharp
to create transparent WebP files in `generated/`. No screenshot or external image
pixels are used.

- Landscapes retain the `70 58 262 373` window coordinates and have separate day
  and night exports at 2x and 4x. The weather, celestial models, and reversible lighting
  wrappers still animate. ARR's moving crystal remains vector artwork; Endwalker's
  landscape retains its fixed light.
- Fixed sky embroidery has day, night, and dusk exports in the same coordinates
  and densities. Shadowbringers' CSS star/ribbon opacities are baked from the
  authored stylesheet. Evercold has separate background and transparent glazing
  exports, with its live clouds retained between them; its dusk glazing keeps
  distinct light/dark palette exports. Endwalker's space cloth retains fixed light.
  The selected exposure receives high fetch priority; inactive and dusk surfaces
  receive low priority.
- The moogle retains its original live SVG so its breathing, bobble, pom sway,
  outfits, and boop gestures preserve their individual movement.
- Vite imports and fingerprints the generated files. The URL table includes all
  variants, but only images used by the selected scene are downloaded.

Keep generated exports in Git so ordinary development and production builds do
not need to regenerate the artwork. The asset tests check scene coverage,
dimensions, transparency, day/night paint differences, weather layering, and
runtime image selection.
