# Home scene artwork sources

The current Home combines custom SVG illustrations and CSS with one credited
Square Enix moogle illustration on the Members link. The SVG was authored with **AI coding assistance**.
No image-generation tools were used to create this SVG
artwork, and no image-generation model output is rendered in the Home scene.

## Active Home artwork

### Navigation identity

- `src/shared/ui/MogTomeMark.tsx` and `public/mogtome-mark.svg` — a code-authored
  moogle reading a small open book, used in the masthead and browser favicon.
- `src/shared/ui/MogTomeWordmark.tsx` and `public/mogtome-wordmark.svg` — original
  serif lettering drawn as SVG paths, independent of any installed or web font.
- `src/shared/ui/NavBotanical.tsx` — original SVG sprigs with sage leaves and
  rose buds, autumn leaves for All Saints' Wake, and evergreen for Starlight.
- Navigation uses self-hosted Lora under the SIL Open Font License;
  see [font sources and licenses](/fonts/SOURCES.md).

### Custom SVG room and seasonal decorations

- `src/features/home/components/NookEmbroidery.tsx` — a hand-authored SVG thread
  tile composited across the window and moogle while preserving the artwork's
  transparency. The embroidered finish uses vector filters and paths, with no
  generated bitmap.
- `src/features/home/components/NookIllustration.tsx` — the window, day and night
  scenery, ivy, recessed glass, and wood joinery, drawn as editable SVG geometry
  with shared material colors.
- `src/features/home/components/NookVines.tsx` — layered climbing ivy with curved
  stems, attached petioles and tendrils, varied mature and young leaves, fine veins,
  and gentle movement. Sparse crown growth leaves room for holiday garlands.
- `src/features/home/components/NookWindowSky.tsx` and `NookWindowView.tsx` —
  separate sun, moon, cloud, star, and landscape surfaces outside the room's
  embroidery filter. A reversible timeline moves the sun toward the horizon,
  passes through warm dusk, and brings up the moon, stars, and window lights.
  The landscape crossfades between fixed day and night palettes; individual SVG
  paint colours are not animated. Reduced motion selects the endpoint directly.
- `src/features/home/components/NookShiroganeView.tsx` — an authored SVG
  interpretation of the lane beside the FC house, based on the member's in-game
  screenshot supplied September 28, 2026. It retains the diagonal stone lane,
  cherry blossoms, tapered Shirogane lighthouse, garden greenery, and a small
  glimpse of the sea. People, player names, and game UI are omitted. The view is
  recomposed to fit the arched window; no screenshot pixels are embedded.
  The lighthouse and water share the landscape's reversible day/night fade.
- `src/features/home/components/NookNeighbourHouse.tsx` — the reference's pale
  stone house, gabled slate roof, chimneys, arched windows, balustrade, flowerbox,
  and trailing wisteria, drawn with the room's shared SVG materials.
- `src/features/home/components/NookNeighbourLandmarks.tsx` — the reference's
  red market board, paper notices, brass ornament, tiled canopy, tassels, and
  square stone garden lantern. Its night light fades with the scene palette.
- `src/features/home/components/NookProps.tsx` — bound books, a quilted cushion,
  and the arrangement of the shelf, fabric, ceramics, and candle lantern.
- `src/features/home/components/NookLedge.tsx` — a timber sill with a continuous
  top, rounded molding, recessed apron, fine grain, and fitted wooden corbels.
- `src/features/home/components/NookLantern.tsx` — a brass lantern with a ribbed
  cap, carrying loop, individual glass panes, hinged door, ring latch, and a
  melted candle. Warm light and flame movement respect reduced-motion settings.
- `src/features/home/components/NookCloth.tsx` — an authored fabric surface with
  gingham bands and seams that curve with the drape, compressed checks across the
  shelf edge, soft fold shading, and a sewn hem. All cloth details are SVG paths.
- `src/features/home/components/NookCoffee.tsx` — a glazed ceramic cup with a
  rounded open handle, recessed saucer, painted chamomile, a small foam heart,
  and gently rising steam. Materials and lighting use the shared scene palette.
- `src/features/home/components/NookPlant.tsx` — a hand-painted bud vase with
  curved stems, folded and veined leaves, distinct daisy blooms, and small buds.
  The foliage sways from the vase opening while the ceramic base stays still.
- `src/features/home/components/NookSeasonalDecor.tsx` — matching SVG decorations
  for all nine holidays, including Starlight greenery and gifts, All Saints' Wake
  pumpkins and a ghost, and the other seasonal ornaments.
- `src/features/home/components/NookHalloweenDecor.tsx` — autumn leaves and berries,
  a fine window cobweb, a stitched linen ghost, and glowing carved pumpkins.
- `src/features/home/components/NookFairyLights.tsx` — warm string lights with
  hanging paper ornaments for every holiday, including pumpkin and ghost lanterns.
  The cord follows a flexible curve while separate SVG bulbs and charms retain
  their proportions, scaling with the room from mobile through 4K.
- `src/features/home/components/NookHolidayKeepsake.tsx` — folded ribbon and
  embossed wax seals with a different motif for each holiday.
- `src/features/home/components/NookMoogle.tsx` — a custom seated moogle, drawn as
  SVG paths with a golden pom, small dark wings, and paws. Its muted thread colours
  share the room's paper, timber, and rose palette. Each holiday has a fitted
  accessory; All Saints' Wake adds a crooked witch hat and lined capelet.
  This is code-authored fan art
  of the FINAL FANTASY character, not a traced or generated bitmap.
  Proportions and character details reference the official FFXIV moogle on the
  [Endwalker product page](https://jp.finalfantasyxiv.com/endwalker/product/)
  ([reference image](https://lds-img.finalfantasyxiv.com/promo/h/k/iujkbYhqbxGXUBbLFvCcZVeh3w.jpg));
  that image is not used as an asset in the SVG.
- `src/features/home/components/NookWallpaper.tsx` — a repeating botanical print
  with moon, snowflake, and heart patterns for the corresponding holidays.
- `src/features/home/components/NookPressedFlower.tsx` — a small dried stem tied
  with thread and tucked beneath the Chronicle note's paperclip.
- `src/features/home/HomePage.tsx` and `src/features/home/home-screen.css` — the
  paper treatments, coordinated seasonal palettes, layout, and animation.

The daytime materials use warm ivory, olive, honey wood, and muted rose; night
uses deep plum, walnut, lavender, and amber. These palettes interpret the
approved A/C concept reference without displaying any of its generated pixels.
Ambient motion includes candlelight, rising coffee steam, gently moving foliage,
the moogle's breathing and pom, gently swinging ornaments, softly glowing pumpkins,
and small variations in the night lights. The
system and in-app reduced-motion settings disable these animations.

These are code-authored illustrations, not downloaded art assets. The use of AI
coding assistance is distinct from the image-generation tools excluded above.

### `moogle-fishing.jpg`

- Active file: `public/images/moogle-fishing.jpg`.
- Also reused unchanged inside the Members view's header Polaroid, with a link
  to these credits in the Members footer.
- Subject: a moogle fishing, illustrated by **Toshiyuki Itahana** for the FINAL
  FANTASY TRADING CARD GAME.
- Publisher: Square Enix.
- [Publisher page and artist interview](https://na.finalfantasy.com/topics/40)
- [Original JPEG](https://cache-na.finalfantasy.com/uploads/content/file/2019/01/30/6272/190204_fftcg_topics_2.jpg)
- Original JPEG retained unchanged, including its white background and artist
  signature.
- Credit: **Illustration by Toshiyuki Itahana. © SQUARE ENIX CO., LTD. All Rights
  Reserved.**

This moogle illustration is the only externally sourced artwork rendered by the
current Home component. Its publisher-hosted provenance does not make it
public domain or Creative Commons artwork. See the broader
[moogle artwork source record](../SOURCES.md) for the original asset entries.

## Retained research assets — not rendered by the current Home

The earlier scene used the following downloaded artwork. These files remain in
the repository as research/reference material, with their original source,
license, and processing records preserved. The new SVG scene does not render
them, including during holiday themes.

### Previous window companion: `mog.webp`

- Retained file: `public/images/nook/mog.webp`; replaced on Home by `NookMoogle`.
- Subject: official illustrated Mog from FINAL FANTASY XIII-2, holding a clock
  staff and a pink crystal pom.
- Publisher: Square Enix.
- [Publisher page](https://www.jp.square-enix.com/itastDQFF30th/about/moogle.html)
- [Original PNG](https://www.jp.square-enix.com/itastDQFF30th/about/_img/set/moogle/2d/chara_pic.png)
- Credit: **© SQUARE ENIX CO., LTD. All Rights Reserved.**
- Original retained unchanged as `public/images/moogle-magic.png`.
- Delivery derivative: only fully transparent exterior margins were removed.
  Exact source alpha bounds: left 238, top 66, width 417, height 548. Every source
  pixel with nonzero alpha is preserved; no scaling, recoloring, retouching, or
  illustration edits were applied. Sharp encoded a lossless WebP, 417 × 548
  pixels, 75,484 bytes.
- [Full processing and inspection record](./ASSET-PROCESSING.md).

### Previous scene props

- [Glitch furniture, coffee, and pumpkin](./DECOR-SOURCES.md) — Tiny Speck artwork,
  released under CC0; SVG conversions by Bart and furniture cleanup by Anarres.
- [Day and night window scenery](./SCENERY-SOURCES.md) — official FINAL FANTASY XIV
  screenshots published by Square Enix. This record retains the original asset
  URLs, dimensions, official FFXIV materials policy links, and required credit.
- [Botanical ivy](./BOTANICAL-SOURCES.md) — Otto Wilhelm Thomé's 1885 illustration,
  from a public-domain Wikimedia Commons scan, with the exact deterministic
  extraction process documented.
- [Asset processing notes](./ASSET-PROCESSING.md) — also records the optimized
  `ivy.webp` derivative, now unused by Home.

Original publisher files are retained unless a linked source note describes a
technical change such as responsive SVG sizing, format conversion, or
non-generative botanical masking.

### Retained seasonal artwork

The following original publisher assets were downloaded on 28 September 2026
and retained unchanged. All remain **© SQUARE ENIX**; they are not public-domain
or Creative Commons artwork.

#### Starlight illustration

- Local file: `starlight-rubi-asami.jpg`
- Artist: **Rubi Asami**.
- Publisher: Square Enix.
- Published: **24 December 2020**.
- [Publisher page](https://na.finalfantasy.com/topics/246)
- [Original JPEG](https://cache-na.finalfantasy.com/uploads/content/file/2020/12/23/11480/201224_ddoff_1.jpg)

#### All Saints' Wake 2019

- Local file: `all-saints-2019.jpg`
- Publisher: Square Enix.
- [Official event page](https://na.finalfantasyxiv.com/lodestone/special/2019/All_Saints_Wake/)
- [Original JPEG](https://lds-img.finalfantasyxiv.com/h/W/YWiT1y9bJNDWKuI8ojztzRlY0o.jpg)

#### Starlight corner decorations

- Local files: `starlight-corner-left.png`, `starlight-corner-right.png`
- Publisher: Square Enix.
- [Official 2020 Starlight Celebration page](https://na.finalfantasyxiv.com/lodestone/special/2020/The_Starlight_Celebration/uho06l3k9d)
- [Original left PNG](https://lds-img.finalfantasyxiv.com/h/x/I796YcdovMOyesBwLgmArPYzLY.png)
- [Original right PNG](https://lds-img.finalfantasyxiv.com/h/D/Fj5nQX6z4EpydbLl3G0N-wxmV8.png)

## Credits and use

FINAL FANTASY artwork and screenshots: **© SQUARE ENIX**. The sourced moogle
illustration is used for this noncommercial fan Free Company website; ownership
remains with the publisher. The retained FFXIV screenshot records include the
applicable official FFXIV materials policy links and credit requirements; these
are separate from the provenance of the FINAL FANTASY XIII-2 Mog illustration.

Retained Glitch decorations: **Tiny Speck, CC0**. Retained ivy: **Otto Wilhelm
Thomé, 1885 / Wikimedia Commons, public domain**. Their individual source records
distinguish those licenses from the copyrighted Square Enix artwork. Retaining
these records does not mean those assets are still displayed in the Home scene.
