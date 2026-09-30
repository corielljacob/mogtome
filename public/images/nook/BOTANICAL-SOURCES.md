# Botanical decoration

## Ivy — `ivy.webp`

- Original work: *Hedera helix*, in Otto Wilhelm Thomé's *Flora von Deutschland,
  Österreich und der Schweiz* (1885, Gera, Germany).
- Source scan: `ivy-source.jpg`, 1462 × 2437 pixels.
- File page: https://commons.wikimedia.org/wiki/File:Illustration_Hedera_helix0.jpg
- Original file: https://upload.wikimedia.org/wikipedia/commons/3/32/Illustration_Hedera_helix0.jpg
- Rights: Wikimedia Commons identifies the original and mechanical scan as public
  domain (PD-scan / PD-old-100-expired / Public Domain Mark). The file history dates
  this scan's upload to October 29, 2004. Source and rights checked September 28,
  2026.
- Final delivery decoration: 600 × 700 pixels, WebP quality 90, alpha quality 100
  (129,060 bytes). The original scan remains unchanged.

No AI image generation, generative fill, learned segmentation, redrawing, or
reconstruction was used. The pixels retain the original historic illustration's
colors. Only deterministic masking, cropping, and resizing were applied with
Sharp.

### Exact extraction process

1. Decode the original JPEG to RGBA. For each pixel calculate
   `relative = (G - R) / max(G, 20)`. If `G > B * 1.17` and `relative > 0.035`, set
   alpha to `clamp((relative - 0.035) * 255 / 0.085, 0, 255)`; otherwise use zero.
   This removes the yellow paper while retaining green pigment.
2. Among pixels with alpha at least 30, retain only the largest component using
   four-neighbor connectivity. This removes detached scientific diagrams and text.
3. Restrict that component to the polygon below. Coordinates were selected from a
   1229 × 2048 inspection preview; multiply x by `1462/1229` and y by `2437/2048`
   to reproduce them on the source. This excludes the flower study above the leafy
   branch. Pixels outside the retained area receive transparent black RGBA.

   ```json
   [[0,704],[168,704],[260,736],[354,726],[505,823],[548,792],
    [636,681],[721,629],[805,592],[884,596],[934,614],[1005,606],
    [1066,613],[1066,794],[1219,794],[1219,1234],[1117,1276],
    [945,1320],[1080,1400],[1219,1400],[1219,1980],[250,1980],
    [250,1550],[315,1500],[315,1330],[365,1250],[333,1230],[0,1230]]
   ```

4. Crop to retained-pixel bounds: left 29, top 709, width 1400, height 1635, all in
   source pixels. Resize to height 1200 using Sharp's default Lanczos3 resampling.
   Encode an intermediate WebP with `lossless: true, effort: 6`.
5. Visually inspect an alpha-composited preview on dark plum (`#40243d`) using the
   image viewer. The paper, labels, and detached diagrams are absent; no source
   paper rectangle or isolated debris remains.
6. Resize the intermediate to width 600 using Sharp's default Lanczos3 resampling,
   then encode the final delivery WebP with `quality: 90, alphaQuality: 100,
   effort: 6`. Inspect the smaller version against the same dark matte.

Suggested attribution, although not required for public-domain reuse:
**Ivy: Otto Wilhelm Thomé, 1885 / Wikimedia Commons.**
