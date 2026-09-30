import { threadVariation } from "./nookNeedlework";

// Three separately sewn replacements. Their edge, stitch entry points and
// thread tension differ; they are never generated again during playback.
const sunShapes = [
  "M126 120C138 120 148 130 148 142C148 155 138 164 126 164C113 164 104 154 104 142C104 129 114 120 126 120Z",
  "M126 120C139 121 147 129 148 141C149 153 139 164 127 164C114 165 103 154 104 143C103 130 113 119 126 120Z",
  "M125 120C137 119 148 130 148 142C147 155 138 163 126 164C114 164 103 155 104 142C105 130 113 121 125 120Z",
];
const moonShapes = [
  "M252 103C230 114 231 145 254 152C229 157 213 137 219 117C224 102 241 97 252 103Z",
  "M252 103C231 112 230 145 254 152C231 158 213 138 219 118C222 103 240 97 252 103Z",
  "M252 103C229 114 233 145 254 152C228 156 214 138 218 117C225 101 240 98 252 103Z",
];
const cloudShapes = [
  [
    "M62 193Q72 182 83 186Q91 168 106 178Q111 180 113 186Q126 181 137 195Q105 199 62 193Z",
    "M201 126Q211 116 222 119Q233 104 245 118Q260 116 271 128Q236 132 201 126Z",
    "M276 240q10-8 17-4q9-12 19-3q11-1 19 8Z",
  ],
  [
    "M62 193Q71 181 84 185Q90 169 105 177Q112 180 113 187Q127 181 137 195Q105 200 62 193Z",
    "M201 126Q210 115 222 120Q233 105 245 117Q259 115 271 128Q235 133 201 126Z",
    "M276 240q9-9 18-4q8-13 18-3q12-2 19 8Z",
  ],
  [
    "M62 193Q73 183 82 186Q93 167 107 179Q111 181 114 186Q126 182 137 195Q106 198 62 193Z",
    "M201 126Q212 117 222 118Q234 103 246 119Q261 116 271 128Q237 131 201 126Z",
    "M276 240q10-7 17-5q10-11 20-2q10 0 18 8Z",
  ],
];

export const skySewnModels = sunShapes.map((sun, frame) => {
  const seed = 51 + frame * 97;
  const slant = [0, 3.3, -2.7][frame];
  const sunThreads = Array.from({ length: 18 }, (_, i) => {
    const x = 102 + i * 2.8 + threadVariation(i, seed) * 0.75;
    const bend = [1.7, -1.5, 3.2][frame] + threadVariation(i, seed + 1);
    return `M${x.toFixed(2)} 117Q${(x + bend).toFixed(2)} ${(142 + threadVariation(i, seed + 2) * 3).toFixed(2)} ${(x + slant).toFixed(2)} 167`;
  }).join(" ");
  const moonThreads = Array.from({ length: 21 }, (_, i) => {
    const y = 98 + i * 3 + threadVariation(i, seed + 3) * 0.9;
    const bend = [4, -2.2, 6.5][frame] + threadVariation(i, seed + 4) * 1.3;
    return `M212 ${y.toFixed(2)}q19 ${bend.toFixed(2)} 46 ${(slant + threadVariation(i, seed + 5)).toFixed(2)}`;
  }).join(" ");
  const harvestMoonThreads = Array.from({ length: 26 }, (_, i) => {
    const y = 88 + i * 3 + threadVariation(i, seed + 6) * 0.8;
    const bend = [6, -3, 8][frame] + threadVariation(i, seed + 7) * 1.5;
    return `M201 ${y.toFixed(2)}q36 ${bend.toFixed(2)} 74 ${(slant + threadVariation(i, seed + 8)).toFixed(2)}`;
  }).join(" ");
  const cloudThreads = [
    { x: 58, y: 168, count: 34, length: 34 },
    { x: 196, y: 101, count: 33, length: 34 },
    { x: 272, y: 222, count: 25, length: 23 },
  ]
    .map((cloud, cloudIndex) =>
      Array.from({ length: cloud.count }, (_, i) => {
        const stitch = cloudIndex * 40 + i;
        const x = cloud.x + i * 2.5 + threadVariation(stitch, seed + 9) * 0.7;
        const y = cloud.y + threadVariation(stitch, seed + 10) * 1.5;
        const bend = [-3, 1.8, -5][frame] + threadVariation(stitch, seed + 11);
        const length = cloud.length + threadVariation(stitch, seed + 12) * 1.7;
        return `M${x.toFixed(2)} ${y.toFixed(2)}q${bend.toFixed(2)} ${(length * 0.42).toFixed(2)} ${(slant + threadVariation(stitch, seed + 13)).toFixed(2)} ${length.toFixed(2)}`;
      }).join(" "),
    )
    .join(" ");
  return {
    sun,
    moon: moonShapes[frame],
    clouds: cloudShapes[frame].join(" "),
    sunThreads,
    moonThreads,
    harvestMoonThreads,
    cloudThreads,
    seam: ["2 1.3", "1.6 1.1 2.4 1.5", "2.4 1.2 1.7 1.3"][frame],
  };
});
