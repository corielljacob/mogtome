// The React logo components are the source of truth for every brand asset.
// Run `npm run brand:generate` after editing either logo component.

import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compileFunction } from "node:vm";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assets = [
  { component: "MogTomeMark", filename: "mogtome-mark" },
  { component: "MogTomeWordmark", filename: "mogtome-wordmark" },
];

// Standalone SVG renderers do not inherit the site's custom properties. Resolve
// each fallback, including nested var() calls and colors with parentheses.
function resolveFallbacks(value) {
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
  if (depth || comma === -1) {
    throw new Error(
      "Every exported brand CSS variable needs a static fallback.",
    );
  }
  return resolveFallbacks(
    value.slice(0, start) +
      resolveFallbacks(value.slice(comma + 1, end - 1).trim()) +
      value.slice(end),
  );
}

function standaloneSvg(markup, prefix) {
  if (!/^<svg\b/.test(markup) || /<(?:image|foreignObject)\b/.test(markup)) {
    throw new Error(`${prefix} must render standalone SVG vector artwork.`);
  }
  // Replace React's generated IDs with deterministic, asset-scoped XML IDs.
  const ids = new Map(
    [...markup.matchAll(/\bid="([^"]+)"/g)].map(([_, id], index) => [
      id,
      `${prefix}-${index + 1}`,
    ]),
  );
  const svg = markup.replace(
    /\bid="([^"]+)"|href="#([^"]+)"|url\(#([^)]+)\)/g,
    (match, id, href, url) => {
      const replacement = ids.get(id ?? href ?? url);
      if (!replacement) throw new Error(`Unresolved SVG reference: ${match}`);
      if (id) return `id="${replacement}"`;
      if (href) return `href="#${replacement}"`;
      return `url(#${replacement})`;
    },
  );
  return (
    resolveFallbacks(svg).replace(/^<svg\b[^>]*>/, (tag) =>
      tag
        .replace(/\s(?:aria-hidden|role|aria-label|xmlns)="[^"]*"/g, "")
        .replace(' class=""', "")
        .replace(
          "<svg",
          '<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="MogTome"',
        ),
    ) + "\n"
  );
}

const rendered = await Promise.all(
  assets.map(async ({ component, filename }) => {
    const sourcePath = path.join(
      root,
      "src",
      "shared",
      "ui",
      `${component}.tsx`,
    );
    const { outputText, diagnostics = [] } = ts.transpileModule(
      await readFile(sourcePath, "utf8"),
      {
        fileName: sourcePath,
        reportDiagnostics: true,
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.CommonJS,
          jsx: ts.JsxEmit.ReactJSX,
        },
      },
    );
    const errors = diagnostics.filter(
      ({ category }) => category === ts.DiagnosticCategory.Error,
    );
    if (errors.length) {
      throw new Error(
        errors
          .map(({ messageText }) =>
            ts.flattenDiagnosticMessageText(messageText, "\n"),
          )
          .join("\n"),
      );
    }
    // Evaluate the repository's self-contained logo module using its own Node
    // package resolution, without a temporary build or extra runtime dependency.
    const module = { exports: {} };
    compileFunction(outputText, ["require", "module", "exports"], {
      filename: sourcePath,
    })(createRequire(sourcePath), module, module.exports);
    const markup = renderToStaticMarkup(
      createElement(module.exports[component]),
    );
    return { filename, svg: standaloneSvg(markup, filename) };
  }),
);

for (const { filename, svg } of rendered) {
  await writeFile(path.join(root, "public", `${filename}.svg`), svg);
  console.log("wrote", `public/${filename}.svg`);
}

// A portable transparent lockup uses the same artwork and asset-scoped IDs.
function placeSvg(svg, x, y, width, height) {
  return svg
    .trim()
    .replace(/^<svg\b[^>]*>/, (tag) =>
      tag
        .replace(/\s(?:role|aria-label)="[^"]*"/g, "")
        .replace(
          "<svg",
          `<svg x="${x}" y="${y}" width="${width}" height="${height}" aria-hidden="true"`,
        ),
    );
}

const mark = rendered.find(({ filename }) => filename === "mogtome-mark").svg;
const wordmark = rendered.find(
  ({ filename }) => filename === "mogtome-wordmark",
).svg;
await writeFile(
  path.join(root, "public", "mogtome-logo.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 200" role="img" aria-label="MogTome" fill="none">${placeSvg(mark, 16, 16, 146, 166.44)}${placeSvg(wordmark, 180, 46, 360, 90)}</svg>\n`,
);
console.log("wrote", "public/mogtome-logo.svg");

await import("./generate-pwa-icons.js");
