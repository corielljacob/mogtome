// Editable React SVGs remain the source of truth. Run `npm run nook:generate`
// after changing landscape/sky geometry or room palettes. --skies refreshes only
// fixed sky surfaces; --check-skies compares their exports with the authored SVGs.
import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compileFunction } from "node:vm";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import sharp from "sharp";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "src/features/home/art/generated");
const modules = new Map();
const args = new Set(process.argv.slice(2));
for (const arg of args) {
  if (arg !== "--skies" && arg !== "--check-skies")
    throw new Error(`Unknown artwork exporter option: ${arg}`);
}
const checkSkies = args.has("--check-skies");
const skiesOnly = args.has("--skies") || checkSkies;
const skyStyles = readFileSync(
  path.join(
    root,
    "src/features/home/components/nook-shadowbringers-window.css",
  ),
  "utf8",
);

// Render the authored JSX in Node without starting a server or browser. CSS
// imports are deliberately excluded: these surfaces already have frozen paint.
function loadSource(filename) {
  if (modules.has(filename)) return modules.get(filename).exports;
  const module = { exports: {} };
  modules.set(filename, module);
  const source = ts.transpileModule(readFileSync(filename, "utf8"), {
    fileName: filename,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  const require = createRequire(filename);
  function sourceRequire(specifier) {
    if (specifier.endsWith(".css")) return {};
    if (!specifier.startsWith(".") && !specifier.startsWith("@/")) {
      return require(specifier);
    }
    const base = specifier.startsWith("@/")
      ? path.join(root, "src", specifier.slice(2))
      : path.resolve(path.dirname(filename), specifier);
    const resolved = [base, `${base}.tsx`, `${base}.ts`].find(existsSync);
    if (!resolved)
      throw new Error(`Cannot resolve ${specifier} from ${filename}`);
    return loadSource(resolved);
  }
  compileFunction(source, ["require", "module", "exports"], {
    filename,
  })(sourceRequire, module, module.exports);
  return module.exports;
}

function component(name) {
  return loadSource(
    path.join(root, "src/features/home/components", `${name}.tsx`),
  )[name];
}

const { toSvgPaint } = loadSource(
  path.join(root, "src/features/home/art/nookSvgPaint.ts"),
);

const palettes = [
  "nook",
  "arr",
  "heavensward",
  "stormblood",
  "shadowbringers",
  "endwalker",
  "dawntrail",
  "evercold",
]
  .map((name) =>
    readFileSync(
      path.join(root, `src/shared/styles/${name}-palette.css`),
      "utf8",
    ),
  )
  .join("\n");
const paletteDom = new JSDOM(`<style>${palettes}</style>`);
const doc = paletteDom.window.document;
const colorProbe = doc.createElement("span");
doc.body.append(colorProbe);
const colorCache = new Map();

function sceneVariables(scene, dark) {
  const target = doc.createElement("div");
  target.className = "nook-theme";
  target.dataset.scene = scene;
  target.dataset.mode = dark ? "dark" : "light";
  const variables = {};
  for (const rule of doc.styleSheets[0].cssRules) {
    if (!rule.selectorText || !target.matches(rule.selectorText)) continue;
    for (const property of rule.style) {
      if (property.startsWith("--")) {
        variables[property] = rule.style.getPropertyValue(property).trim();
      }
    }
  }
  return variables;
}

function resolveVariables(value, variables) {
  const start = value.indexOf("var(");
  if (start === -1) return value;
  let depth = 1;
  let comma = -1;
  let end = start + 4;
  for (; end < value.length && depth; end++) {
    if (value[end] === "(") depth++;
    if (value[end] === ")") depth--;
    if (value[end] === "," && depth === 1 && comma === -1) comma = end;
  }
  if (depth) throw new Error(`Unclosed CSS variable: ${value}`);
  const name = value.slice(start + 4, comma === -1 ? end - 1 : comma).trim();
  const replacement =
    variables[name] ??
    (comma === -1 ? undefined : value.slice(comma + 1, end - 1).trim());
  if (replacement === undefined)
    throw new Error(`Missing artwork palette token ${name}`);
  return resolveVariables(
    value.slice(0, start) +
      resolveVariables(replacement, variables) +
      value.slice(end),
    variables,
  );
}

function resolvePaint(value, variables) {
  const resolved = resolveVariables(value, variables);
  if (!resolved.includes("color-mix(")) return toSvgPaint(resolved);
  if (!colorCache.has(resolved)) {
    colorProbe.style.color = "";
    colorProbe.style.color = resolved;
    if (!colorProbe.style.color)
      throw new Error(`Invalid artwork color ${resolved}`);
    colorCache.set(
      resolved,
      toSvgPaint(paletteDom.window.getComputedStyle(colorProbe).color),
    );
  }
  return colorCache.get(resolved);
}

function standaloneSvg(
  markup,
  variables,
  width,
  height,
  viewBox,
  { nightSky = false, skyLayer } = {},
) {
  // Shadowbringers' fixed ribbon and star exposure is authored in CSS. Bake its
  // exact cascade alongside the palette, including the night wrapper selector.
  const dom = new JSDOM(
    `<style>${skyStyles}</style><div class="${nightSky ? "nook-cycle-sky--night" : ""}">${markup}</div>`,
  );
  const svg = dom.window.document.querySelector("svg");
  if (!svg) throw new Error("Artwork must have an SVG root");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("viewBox", viewBox);
  if (skyLayer) {
    // Evercold's live clouds sit beneath the glass lace and ribs. Split at the
    // source component's actual children slot so the occlusion order survives.
    const slot = svg.querySelector("[data-export-weather-slot]");
    if (!slot || slot.parentElement !== svg)
      throw new Error("Evercold weather must remain a direct sky layer");
    let afterSlot = false;
    for (const child of Array.from(svg.children)) {
      if (child === slot) {
        afterSlot = true;
        child.remove();
      } else if (
        child.tagName !== "defs" &&
        (skyLayer === "background" ? afterSlot : !afterSlot)
      ) {
        child.remove();
      }
    }
  }
  function bake(element, inherited) {
    const tokens = { ...inherited };
    const opacity = dom.window.getComputedStyle(element).opacity;
    if (opacity) element.setAttribute("opacity", opacity);
    for (const property of element.style) {
      if (property.startsWith("--"))
        tokens[property] = element.style.getPropertyValue(property);
    }
    for (const attribute of Array.from(element.attributes)) {
      if (attribute.name === "style") continue;
      if (/var\(|color(?:-mix)?\(/.test(attribute.value)) {
        element.setAttribute(
          attribute.name,
          resolvePaint(attribute.value, tokens),
        );
      }
    }
    for (const property of Array.from(element.style)) {
      if (property.startsWith("--")) element.style.removeProperty(property);
      else if (
        /var\(|color(?:-mix)?\(/.test(element.style.getPropertyValue(property))
      ) {
        element.style.setProperty(
          property,
          resolvePaint(element.style.getPropertyValue(property), tokens),
        );
      }
    }
    for (const child of element.children) bake(child, tokens);
  }
  bake(svg, variables);
  const result = svg.outerHTML;
  if (/var\(|color(?:-mix)?\(/.test(result)) {
    throw new Error("Artwork export contains unresolved or unsupported paint");
  }
  dom.window.close();
  return Buffer.from(result);
}

if (!checkSkies) await mkdir(output, { recursive: true });
const themes = [
  "pom-pom",
  "heavensward",
  "stormblood",
  "shadowbringers",
  "dawntrail",
  "evercold",
];
const events = [
  "heavensturn",
  "valentiones",
  "little-ladies",
  "hatching-tide",
  "make-it-rain",
  "moonfire-faire",
  "the-rising",
  "all-saints-wake",
  "starlight",
];
if (!skiesOnly) {
  const views = Object.fromEntries(
    [
      "Shirogane",
      "Heavensward",
      "Stormblood",
      "Shadowbringers",
      "Dawntrail",
      "Evercold",
      "Endwalker",
    ].map((name) => [name.toLowerCase(), component(`Nook${name}View`)]),
  );

  for (const scene of [...themes, ...events, "endwalker"]) {
    for (const dark of scene === "endwalker" ? [false] : [false, true]) {
      const View = views[scene] ?? views.shirogane;
      const markup = renderToStaticMarkup(
        createElement(
          "svg",
          { fill: "none" },
          createElement(View, { isDark: dark }),
        ),
      );
      const svg = standaloneSvg(
        markup,
        sceneVariables(scene, dark),
        262,
        373,
        "70 58 262 373",
      );
      const name = `landscape-${scene}-${dark ? "night" : "day"}`;
      for (const density of [2, 4]) {
        await sharp(svg, { density: 72 * density })
          .webp({ quality: 90, alphaQuality: 100, effort: 6 })
          .toFile(path.join(output, `${name}@${density}x.webp`));
      }
      console.log(`wrote ${name} (2x, 4x)`);
    }
  }
}

const skies = Object.fromEntries(
  [
    "Heavensward",
    "Stormblood",
    "Shadowbringers",
    "Dawntrail",
    "Evercold",
    "Endwalker",
  ].map((name) => [name.toLowerCase(), component(`Nook${name}SkyEmbroidery`)]),
);
const defaultSky = component("NookSkyEmbroidery");
function compareSkyPixels(source, exported, file) {
  let total = 0;
  let max = 0;
  // Compare premultiplied channels, so invisible foreground RGB does not count
  // as a visual difference. Alpha remains lossless.
  for (let pixel = 0; pixel < source.length; pixel += 4) {
    if (source[pixel + 3] !== exported[pixel + 3])
      throw new Error(`Sky export changed source alpha: ${file}`);
    for (let channel = 0; channel < 3; channel++) {
      const error =
        (Math.abs(source[pixel + channel] - exported[pixel + channel]) *
          source[pixel + 3]) /
        255;
      total += error;
      max = Math.max(max, error);
    }
  }
  return { mean: total / ((source.length / 4) * 3), max };
}

let worstMeanError = 0;
let worstChannelError = 0;
let skyCount = 0;
for (const scene of [...themes, ...events, "endwalker"]) {
  const exposures =
    scene === "endwalker"
      ? ["day"]
      : scene === "evercold"
        ? ["day", "night", "dusk-day", "dusk-night"]
        : ["day", "night", "dusk"];
  for (const exposure of exposures) {
    const dark = exposure === "night" || exposure === "dusk-night";
    const markup = renderToStaticMarkup(
      createElement(
        skies[scene] ?? defaultSky,
        { dusk: exposure.startsWith("dusk") },
        scene === "evercold"
          ? createElement("g", { "data-export-weather-slot": "" })
          : undefined,
      ),
    );
    for (const skyLayer of scene === "evercold"
      ? ["background", "foreground"]
      : [undefined]) {
      const svg = standaloneSvg(
        markup,
        sceneVariables(scene, dark),
        262,
        373,
        "70 58 262 373",
        { nightSky: exposure === "night", skyLayer },
      );
      const name = `sky-${scene}-${exposure}${skyLayer ? `-${skyLayer}` : ""}`;
      for (const density of [2, 4]) {
        const file = path.join(output, `${name}@${density}x.webp`);
        const source = await sharp(svg, { density: 72 * density })
          .ensureAlpha()
          .raw()
          .toBuffer();
        if (checkSkies) {
          const { data: exported, info } = await sharp(file)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });
          if (info.width !== 262 * density || info.height !== 373 * density)
            throw new Error(`Wrong sky dimensions: ${file}`);
          const { mean, max } = compareSkyPixels(source, exported, file);
          if (mean > 2.5)
            throw new Error(
              `Sky differs from source (${mean.toFixed(3)}): ${file}`,
            );
          worstMeanError = Math.max(worstMeanError, mean);
          worstChannelError = Math.max(worstChannelError, max);
        } else {
          // Render once, then find the smallest quality setting that preserves
          // the same source comparison used by --check-skies. Delicate glazing
          // can need more detail than a broad sky wash.
          let encoded;
          for (const quality of [80, 85, 90]) {
            encoded = await sharp(source, {
              raw: {
                width: 262 * density,
                height: 373 * density,
                channels: 4,
              },
            })
              .webp({ quality, alphaQuality: 100, effort: 6 })
              .toBuffer();
            const exported = await sharp(encoded)
              .ensureAlpha()
              .raw()
              .toBuffer();
            const { mean } = compareSkyPixels(source, exported, file);
            if (mean <= 2.5) break;
            if (quality === 90)
              throw new Error(`Sky cannot preserve source detail: ${file}`);
          }
          await writeFile(file, encoded);
        }
        skyCount++;
      }
      if (!checkSkies) console.log(`wrote ${name} (2x, 4x)`);
    }
  }
}
if (checkSkies)
  console.log(
    `Verified ${skyCount} skies against their source SVGs; worst mean RGB error ${worstMeanError.toFixed(3)}/255, maximum channel error ${worstChannelError.toFixed(3)}/255; alpha unchanged.`,
  );

paletteDom.window.close();
