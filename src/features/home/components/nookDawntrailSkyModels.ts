import { threadVariation } from "./nookNeedlework";

const n = (value: number) => value.toFixed(2);
type Bounds = readonly [number, number, number, number];

// Three separate pieces of cotton, with different cut lobes and needle entries.
// Their broad footprints agree so a held replacement feels sewn, not teleported.
const clouds = [
  [
    "M82 147Q87 138 100 140Q100 130 111 132Q119 120 129 129Q137 124 142 136Q155 134 157 143Q162 142 166 147Q125 153 82 147Z",
    "M221 173Q229 164 240 166Q245 155 255 162Q265 152 276 164Q288 163 295 172Q262 179 221 173Z",
  ],
  [
    "M82 147Q87 136 98 139Q102 126 114 132Q126 119 134 132Q145 127 150 139Q161 138 166 147Q128 152 82 147Z",
    "M221 173Q230 161 242 167Q247 157 257 163Q269 154 277 166Q290 161 295 172Q260 180 221 173Z",
  ],
  [
    "M82 147Q90 139 100 141Q98 128 110 130Q120 123 128 130Q140 120 144 135Q153 135 154 141Q162 140 166 147Q123 155 82 147Z",
    "M221 173Q230 166 238 167Q242 153 254 161Q265 158 271 164Q283 158 288 168Q293 168 295 172Q263 178 221 173Z",
  ],
];
const suns = [
  "M0-18C10-18.8 18-10 18 0S10 18.5 0 18-18.2 10-18 0-10-17.5 0-18Z",
  "M0-18C10.5-17.4 17.4-9.2 18 0S9.5 18.7 0 18-18.7 9.4-18 0-9.7-18.6 0-18Z",
  "M0-18C9.6-18.8 18.4-10 18 0S10.2 17.4 0 18-17.5 10.4-18 0-10.5-17.5 0-18Z",
];
const moons = [
  "M6-19C-5-24-20-15-20-2C-21 12-8 21 5 20Q14 19 17 12Q-4 17-8-3Q-9-14 6-19Z",
  "M6-19C-7-23-21-13-20 0C-20 13-7 22 6 20Q13 19 17 12Q-3 16-7-2Q-10-12 6-19Z",
  "M6-19C-6-25-19-14-20-1C-21 12-9 20 4 20Q13 20 17 12Q-5 18-8-2Q-8-13 6-19Z",
];

/** Cloud cotton keeps its broad arched grain as each new piece is sewn. */
function cloudCourses(bounds: Bounds, frame: number, seed: number) {
  const [x, y, w, h] = bounds;
  const tones: string[][] = [[], [], []];
  const height = (at: number, course: number) =>
    course -
    Math.sin(((at - x) / w) * Math.PI) * (2.8 + frame * 0.12) -
    Math.sin(((at - x) / w) * Math.PI * 3) * 0.6;
  for (let row = 0; row < Math.ceil((h + 8) / 1.7); row++) {
    const cy = y - 2 + row * 1.7 + threadVariation(row, seed) * 0.23;
    let sx = x - 16 + threadVariation(row, seed + 1) * 7;
    for (let col = 0; sx < x + w + 3; col++) {
      const index = row * 17 + col;
      const length = 13.5 + threadVariation(index, seed + 2) * 3;
      const sy = height(sx, cy),
        ey = height(sx + length, cy);
      tones[(row + col) % 3].push(
        `M${n(sx)} ${n(sy)}Q${n(sx + length * 0.48)} ${n(height(sx + length * 0.48, cy) - 0.6 + threadVariation(index, seed + 3) * 0.3)} ${n(sx + length)} ${n(ey)}`,
      );
      sx += length + 0.85 + threadVariation(index, seed + 4) * 0.25;
    }
  }
  return tones.map((paths) => paths.join(" "));
}

function sunSatin(seed: number) {
  const tones: string[][] = [[], [], []];
  for (let col = 0; col < 26; col++) {
    const x = -20 + col * 1.6 + threadVariation(col, seed) * 0.18;
    const span = Math.sqrt(Math.max(0, 22 ** 2 - x * x));
    const at = (y: number) =>
      x +
      Math.sin(((y + span) / (span * 2)) * Math.PI) *
        (x * 0.085 + threadVariation(col, seed + 1) * 0.35);
    let y = -span - (col % 3) * 2.7;
    for (let row = 0; y < span; row++) {
      const index = col * 9 + row;
      const length = 9.8 + threadVariation(index, seed + 2) * 1.4;
      tones[(col + row) % 3].push(
        `M${n(at(y))} ${n(y)}Q${n(at(y + length * 0.48))} ${n(y + length * 0.48)} ${n(at(y + length))} ${n(y + length)}`,
      );
      y += length + 0.8 + threadVariation(index, seed + 3) * 0.3;
    }
  }
  return tones.map((paths) => paths.join(" "));
}

/** Crescent silk bends around the moon's curved hem in every replacement. */
function moonSatin(seed: number) {
  const tones: string[][] = [[], [], []];
  for (let course = 0; course < 16; course++) {
    const radius = 1.3 + course * 1.6;
    const point = (angle: number) => [
      Math.cos(angle) * radius - 0.5,
      Math.sin(angle) * radius,
    ];
    let angle = threadVariation(course, seed) * 0.35;
    for (let stitch = 0; angle < Math.PI * 2 + 0.35; stitch++) {
      const index = course * 29 + stitch;
      const sweep = Math.min(
        0.85,
        (8.4 + threadVariation(index, seed + 1) * 1.3) / radius,
      );
      const a = point(angle),
        b = point(angle + sweep),
        mid = point(angle + sweep * 0.5);
      tones[(course + stitch) % 3].push(
        `M${n(a[0])} ${n(a[1])}Q${n(mid[0] * 2 - (a[0] + b[0]) * 0.5)} ${n(mid[1] * 2 - (a[1] + b[1]) * 0.5)} ${n(b[0])} ${n(b[1])}`,
      );
      angle += sweep + (0.7 + threadVariation(index, seed + 2) * 0.2) / radius;
    }
  }
  return tones.map((paths) => paths.join(" "));
}

function sunRays(frame: number) {
  return Array.from({ length: 8 }, (_, ray) => {
    const angle =
      (ray * Math.PI) / 4 + threadVariation(ray, 1030 + frame) * 0.025;
    const inner = 23.5 + threadVariation(ray, 1033 + frame) * 0.4;
    const outer = 28 + threadVariation(ray, 1036 + frame) * 0.7;
    return `M${n(Math.cos(angle) * inner)} ${n(Math.sin(angle) * inner)}Q${n(Math.cos(angle + 0.025) * (inner + 2))} ${n(Math.sin(angle + 0.025) * (inner + 2))} ${n(Math.cos(angle) * outer)} ${n(Math.sin(angle) * outer)}`;
  }).join(" ");
}

export const dawntrailSkyModels = [0, 1, 2].map((frame) => ({
  sun: suns[frame],
  rays: sunRays(frame),
  sunThreads: sunSatin(1071 + frame * 29),
  sunShine: ["M-11-6Q-6-14 4-12", "M-12-4Q-8-13 2-13", "M-10-7Q-4-14 6-11"][
    frame
  ],
  moon: moons[frame],
  moonThreads: moonSatin(1183 + frame * 31),
  seam: ["1.3 .8", "1.1 1", "1.5 .7"][frame],
  clouds: clouds[frame].map((shape, cloud) => ({
    shape,
    threads: cloudCourses(
      cloud ? [218, 152, 82, 30] : [79, 118, 92, 39],
      frame,
      1251 + frame * 47 + cloud * 89,
    ),
    fold: (cloud
      ? [
          "M228 170Q237 166 246 170M254 164Q263 160 270 166",
          "M233 169Q242 167 248 171M259 165Q267 160 275 169",
          "M229 172Q239 167 248 171M250 164Q260 160 267 167",
        ]
      : [
          "M89 144Q102 140 111 144M109 135Q119 128 129 136M134 139Q145 135 152 144",
          "M92 144Q104 138 115 144M112 135Q123 127 134 136M137 140Q148 136 156 145",
          "M89 145Q102 141 114 145M107 134Q118 128 128 135M132 137Q145 130 151 143",
        ])[frame],
  })),
}));
