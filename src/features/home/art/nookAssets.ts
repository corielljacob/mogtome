// Vite fingerprints the exports; only the selected scene's images are fetched.
const assets = import.meta.glob<string>("./generated/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

export function nookAssetUrl(name: string): string {
  const url = assets[`./generated/${name}.webp`];
  if (!url) throw new Error(`Missing exported Home artwork: ${name}`);
  return url;
}
