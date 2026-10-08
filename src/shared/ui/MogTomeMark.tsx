import { memo, useId } from "react";

interface MogTomeMarkProps {
  className?: string;
}

// The same laid-floss construction as the home scene: each strand has a close
// shadow, colored body and a narrow highlight, with wrapped cords at the edges.
const cotton = { color: "#f2ead7", shade: "#c8b99d", light: "#fffcef" };
const sage = { color: "#687f5e", shade: "#3c513c", light: "#acb795" };
const plum = { color: "#9a778f", shade: "#695268", light: "#c7a9bf" };
const gold = { color: "#d2ab62", shade: "#9d783d", light: "#f5db94" };
const rose = { color: "#c79099", shade: "#9e6d7b", light: "#ebbac0" };
type Floss = typeof cotton;

function Thread({
  d,
  color,
  shade,
  light,
  width = 1.8,
  dash,
  opacity = 1,
}: Floss & {
  d: string;
  width?: number;
  dash?: string;
  opacity?: number;
}) {
  return (
    <g
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dash}
      opacity={opacity}
    >
      <path
        d={d}
        stroke={shade}
        strokeWidth={width + 0.5}
        opacity=".42"
        transform="translate(.25 .45)"
      />
      <path d={d} stroke={color} strokeWidth={width} />
      <path
        d={d}
        stroke={light}
        strokeWidth={width * 0.32}
        opacity=".68"
        transform="translate(-.16 -.2)"
      />
    </g>
  );
}

function Edge({
  d,
  color = cotton.color,
  shade = cotton.shade,
  light = cotton.light,
  width = 2.4,
}: Partial<Floss> & { d: string; width?: number }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={shade} strokeWidth={width + 1.3} opacity=".85" />
      <path d={d} stroke={color} strokeWidth={width} />
      <path
        d={d}
        stroke={shade}
        strokeWidth={width}
        strokeDasharray=".65 2.6"
        strokeLinecap="butt"
        opacity=".65"
      />
      <path
        d={d}
        stroke={light}
        strokeWidth={width * 0.48}
        strokeDasharray="1.3 1.95"
        transform="translate(-.35 -.45)"
        opacity=".9"
      />
    </g>
  );
}

const n = (value: number) => value.toFixed(1);
function cottonRows(
  left: number,
  top: number,
  columns: number,
  rows: number,
  center: number,
) {
  return Array.from({ length: columns }, (_, column) => {
    const x = left + column * 3.4;
    const bend = (x - center) * 0.04;
    return Array.from({ length: rows }, (_, row) => {
      const y =
        top + row * 11 + (column % 2) * 5.5 + Math.abs(x - center) * 0.045;
      return `M${n(x)} ${n(y)}q${n(bend)} 4.5 ${n(bend * 2)} 9`;
    }).join(" ");
  }).join(" ");
}
const faceThreads = cottonRows(29, 76, 43, 10, 100);
const pomThreads = Array.from({ length: 18 }, (_, i) => {
  const x = 108 + i * 2.25;
  const reach = Math.sqrt(Math.max(0, 21 ** 2 - (x - 127) ** 2));
  return `M${n(x)} ${n(27 - reach)}Q${n(x - 4)} 25 ${n(x)} ${n(27 + reach)}`;
}).join(" ");
const wingThreads = Array.from({ length: 17 }, (_, i) => {
  const t = i / 16;
  return `M${n(17 + t * 3)} ${n(115 + t * 35)}Q${n(31 + t * 10)} ${n(132 + t * 9)} ${n(56 - t * 15)} ${n(139 + t * 12)}M${n(184 - t * 2)} ${n(120 + t * 32)}Q${n(170 - t * 10)} ${n(136 + t * 8)} ${n(144 + t * 15)} ${n(140 + t * 13)}`;
}).join(" ");
const coverThreads = Array.from({ length: 29 }, (_, i) => {
  const y = 137 + i * 2.9;
  return `M12 ${n(y)}Q53 ${n(y - 2)} 100 ${n(y + 27)}M100 ${n(y + 27)}Q149 ${n(y - 3)} 188 ${n(y - 3)}`;
}).join(" ");
const pageThreads = Array.from({ length: 27 }, (_, i) => {
  const x = 23 + i * 2.9;
  return `M${n(x)} 130q-3 30 2 80M${n(200 - x)} 130q3 30-2 80`;
}).join(" ");
// Contours interpolate between the rear and front edges of each paper plane.
const pageContours = [0.22, 0.44, 0.66, 0.84]
  .map((t) => {
    const x = 28 - 4 * t;
    const y = 140 + 11 * t;
    const a = 55 - 7 * t;
    const b = 140 + 9 * t;
    const c = 79 - 3 * t;
    const d = 150 + 13 * t;
    const endX = 100 - 4 * t;
    const endY = 166 + 9 * t;
    return `M${n(x)} ${n(y)}C${n(a)} ${n(b)} ${n(c)} ${n(d)} ${n(endX)} ${n(endY)}M${n(200 - x)} ${n(y)}C${n(200 - a)} ${n(b)} ${n(200 - c)} ${n(d)} ${n(200 - endX)} ${n(endY)}`;
  })
  .join(" ");
const pageLayers = [1.1, 2.35, 3.5]
  .map(
    (offset) =>
      `M24 ${n(151 + offset)}C48 ${n(149 + offset)} 76 ${n(163 + offset)} 96 ${n(175 + offset)}M104 ${n(175 + offset)}C124 ${n(163 + offset)} 152 ${n(149 + offset)} 176 ${n(151 + offset)}`,
  )
  .join(" ");
const pawThreads =
  cottonRows(43, 133, 35, 5, 100) + cottonRows(156, 108, 9, 5, 173);

// Deliberately asymmetric ears, tufted cheeks, and an open book give the mark
// its silhouette. All texture is SVG path geometry, including the satin fills.
const head =
  "M99 82C71 79 46 88 37 108C32 119 32 130 34 139L28 143L33 146L29 151L36 153C43 171 69 181 99 180C129 182 155 173 164 156L171 153L167 149L172 145L166 141C169 124 164 108 153 98C140 86 119 81 99 82Z";
const ears =
  "M48 108C38 95 36 75 44 61C60 64 77 80 80 95ZM124 95C132 79 148 66 160 67C165 81 159 101 148 112Z";
const wings =
  "M56 136C40 135 28 124 17 110C12 124 11 141 17 154C24 144 32 145 39 154C44 147 50 147 57 152ZM143 138C159 137 176 127 184 115C190 130 190 143 183 157C175 147 168 148 160 156C155 149 149 149 142 154Z";
// Paper and cover share these exact joints. The cover is painted in front of
// the paper, so its overhanging cloth lip encloses the page block.
const leftJoint = "C48 153 76 167 96 179";
const rightJoint = "C124 167 152 153 176 155";
const coverLip = `M18 156L24 155${leftJoint}Q100 181 104 179${rightJoint}L182 156`;
const cover = `${coverLip}L179 201C153 198 124 205 104 216Q100 221 96 216C76 205 47 198 21 201Z`;
const rightCover = `M104 179${rightJoint}L182 156L179 201C153 198 124 205 104 216Z`;
const pageBlock = `M24 155${leftJoint}V175C76 163 48 149 24 151ZM104 179${rightJoint}V151C152 149 124 163 104 175Z`;
const pages =
  "M28 140C55 140 79 150 100 166L96 175C76 163 48 149 24 151ZM172 140C145 140 121 150 100 166L104 175C124 163 152 149 176 151Z";
const pageContact = `M24 155${leftJoint}M104 179${rightJoint}`;
const paws =
  "M49 134C40 132 37 139 40 146L44 153C47 159 52 159 53 155C55 161 59 161 62 157C67 157 68 149 64 143C60 136 56 133 49 134ZM149 145C156 137 158 131 161 123L166 112C168 107 174 108 174 113L172 121C178 111 183 112 183 118L179 126C186 120 191 124 187 130L179 141C173 150 169 154 163 156Z";
const chest = "M74 137C63 149 62 166 74 181H128C140 165 137 150 122 137Z";

export const MogTomeMark = memo(function MogTomeMark({
  className = "",
}: MogTomeMarkProps) {
  const id = useId();
  const paint = (name: string) => `url(#${id}-${name})`;
  return (
    <svg
      className={className}
      viewBox="0 0 200 228"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${id}-fur`} cx=".3" cy=".24" r=".9">
          <stop stopColor={cotton.light} />
          <stop offset=".62" stopColor={cotton.color} />
          <stop offset="1" stopColor={cotton.shade} />
        </radialGradient>
        <radialGradient id={`${id}-pom`} cx=".32" cy=".24" r=".8">
          <stop stopColor={gold.light} />
          <stop offset=".65" stopColor={gold.color} />
          <stop offset="1" stopColor={gold.shade} />
        </radialGradient>
        <linearGradient id={`${id}-wing`} x1=".2" y1="0" x2=".7" y2="1">
          <stop stopColor={plum.light} />
          <stop offset="1" stopColor={plum.color} />
        </linearGradient>
        <linearGradient id={`${id}-cloth`} x1="0" y1="0" x2=".35" y2="1">
          <stop stopColor="#809272" />
          <stop offset=".55" stopColor={sage.color} />
          <stop offset="1" stopColor={sage.shade} />
        </linearGradient>
        <linearGradient id={`${id}-paper`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#fff8e5" />
          <stop offset=".65" stopColor="#eee0bf" />
          <stop offset="1" stopColor="#d4bd90" />
        </linearGradient>
        <radialGradient id={`${id}-nose`} cx=".3" cy=".2" r=".9">
          <stop stopColor={rose.light} />
          <stop offset=".65" stopColor={rose.color} />
          <stop offset="1" stopColor={rose.shade} />
        </radialGradient>
        <radialGradient id={`${id}-blush`}>
          <stop stopColor={rose.color} stopOpacity=".5" />
          <stop offset="1" stopColor={rose.color} stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-head-shape`}>
          <path d={head} />
        </clipPath>
        <clipPath id={`${id}-ears-shape`}>
          <path d={ears} />
        </clipPath>
        <clipPath id={`${id}-wing-shape`}>
          <path d={wings} />
        </clipPath>
        <clipPath id={`${id}-cover-shape`}>
          <path d={cover} />
        </clipPath>
        <clipPath id={`${id}-page-shape`}>
          <path d={pages} />
        </clipPath>
        <clipPath id={`${id}-page-edges`}>
          <path d={pageBlock} />
        </clipPath>
        <clipPath id={`${id}-paw-shape`}>
          <path d={paws} />
        </clipPath>
        <clipPath id={`${id}-chest-shape`}>
          <path d={chest} />
        </clipPath>
        <clipPath id={`${id}-nose-shape`}>
          <ellipse cx="100" cy="148" rx="12" ry="8.5" />
        </clipPath>
      </defs>

      {/* The wings are small fabric pieces tucked behind the cheek and book. */}
      <path d={wings} fill={paint("wing")} />
      <g clipPath={paint("wing-shape")}>
        <Thread d={wingThreads} {...plum} width={1.9} />
      </g>
      <Edge d={wings} {...plum} width={2} />
      <Thread
        d="M18 114Q27 135 53 143M18 114Q23 138 38 151M184 119Q177 137 146 145M184 119Q180 141 161 153"
        {...plum}
        color="#b69bad"
        width={1.2}
      />

      {/* This face uses the home moogle's tufted cheeks and laid cotton rows. */}
      <path d={chest} fill={paint("fur")} />
      <g clipPath={paint("chest-shape")}>
        <Thread d={pawThreads} {...cotton} width={2} />
      </g>
      <g transform="translate(0 -20)">
        <g transform="rotate(-9 100 142)">
          <path d={ears} fill={paint("fur")} />
          <g clipPath={paint("ears-shape")}>
            <Thread
              d={cottonRows(38, 58, 38, 6, 100)}
              {...cotton}
              width={1.9}
            />
          </g>
          <path
            d="M45 73Q43 91 54 102L72 95Q60 80 45 73ZM156 77Q157 93 145 105L132 96Q143 81 156 77Z"
            fill="#d9afb0"
          />
          <Thread
            d="M45 75q3 13 11 23M49 76q3 12 12 21M54 79q3 9 12 17M155 79q-3 14-11 23M150 82q-3 10-11 18M145 84l-9 12"
            {...rose}
            color="#e2bfc0"
            width={1.8}
          />
          <Edge d={ears} width={2.2} />
          <path d={head} fill={paint("fur")} />
          <g clipPath={paint("head-shape")}>
            <Thread d={faceThreads} {...cotton} width={2} />
          </g>
          <Edge d={head} width={2.8} />
          <g clipPath={paint("head-shape")}>
            <Thread
              d="m39 131 6-3m-6 9 7-3m-7 10 7-3m-5 10 7-4m-3 10 7-5m-1 10 7-5m1 9 6-5m3 8 6-6M156 122l6 3m-7 3 7 3m-7 3 7 3m-8 3 7 3m-8 3 7 3m-9 3 6 4m-9 2 5 4m-10 1 5 5"
              {...cotton}
              color="#ded2b9"
              width={1}
              opacity={0.7}
            />
          </g>
          <ellipse cx="54" cy="151" rx="19" ry="12" fill={paint("blush")} />
          <ellipse cx="147" cy="151" rx="19" ry="12" fill={paint("blush")} />
          {/* A bright eye and a wink stay expressive at navigation size. */}
          <ellipse cx="66" cy="132" rx="6.5" ry="8.5" fill="#665044" />
          <ellipse cx="64.5" cy="128.5" rx="2.1" ry="2.7" fill="#fffcef" />
          <Thread
            d="M124 134Q136 120 148 133M147 132l5-3"
            color="#665044"
            shade="#5a4537"
            light="#bdab8d"
            width={3.5}
          />
          <ellipse cx="100" cy="148" rx="12" ry="8.5" fill={paint("nose")} />
          <g clipPath={paint("nose-shape")}>
            <Thread
              d="M89 138q-2 9 2 21m1-21q-2 9 2 21m1-21q-2 9 2 21m1-21q-2 9 2 21m1-21q-2 9 2 21m1-21q-2 9 2 21m1-21q-2 9 2 21m1-21q-2 9 2 21"
              {...rose}
              width={1.8}
            />
          </g>
          <Edge
            d="M112 148A12 8.5 0 1 1 88 148A12 8.5 0 1 1 112 148Z"
            {...rose}
            width={0.85}
          />
          <path
            d="M89 158Q101 167 114 157Q111 175 101 175Q92 172 89 158Z"
            fill="#775448"
          />
          <path d="M96 171Q103 165 109 169Q103 175 96 171Z" fill="#d49a9e" />
          <Thread
            d="m48 150-1 3m6-2-1 3m95-3-1 3m6-4-1 3"
            {...rose}
            width={1}
            opacity={0.65}
          />
        </g>
      </g>

      <g className="brand-reader-pom">
        <g transform="translate(-5 -1)">
          <Thread
            d="M97 64C95 52 105 45 117 41Q127 37 127 29"
            color="#8c7859"
            shade="#655037"
            light="#c2ad88"
            width={2.4}
          />
          <circle cx="127" cy="27" r="21.5" fill={paint("pom")} />
          <g transform="rotate(-25 127 27)">
            <Thread d={pomThreads} {...gold} width={1.65} />
          </g>
          <Edge
            d="M148.5 27A21.5 21.5 0 1 1 105.5 27A21.5 21.5 0 1 1 148.5 27Z"
            {...gold}
            width={2.25}
          />
          <Thread
            d="M124 8C111 20 113 37 125 46"
            {...gold}
            color="#efd089"
            width={0.9}
            dash="2.2 2"
          />
        </g>
      </g>

      {/* Paper sits behind the boards. Fine, unbound foreedges are distinct
          from the thick wrapped cord used only on the cloth binding. */}
      <path d={pageBlock} fill="#dbc9a3" />
      <path d={pages} fill={paint("paper")} />
      <g clipPath={paint("page-shape")}>
        <Thread
          d={pageThreads}
          color="#eee2c6"
          shade="#c6b58f"
          light="#fff9e9"
          width={0.9}
          opacity={0.2}
        />
        <Thread
          d={pageContours}
          color="#e7dabb"
          shade="#bdaa81"
          light="#fff8e3"
          width={0.65}
          opacity={0.9}
        />
      </g>
      <g clipPath={paint("page-edges")}>
        <Thread
          d={pageLayers}
          color="#eadbb9"
          shade="#b8a27b"
          light="#fff5dd"
          width={0.65}
        />
      </g>
      <path
        d="M28 140C55 140 79 150 100 166C121 150 145 140 172 140"
        stroke="#fff8e5"
        strokeWidth={1.1}
        strokeLinecap="round"
      />
      <path
        d="M24 151C48 149 76 163 96 175M104 175C124 163 152 149 176 151"
        stroke="#bba57d"
        strokeWidth={0.65}
        strokeLinecap="round"
      />
      <path d="M100 166L104 175V179Q100 181 96 179V175Z" fill="#d4c39f" />
      <path
        d="M100 167Q99.3 173 100 179"
        stroke="#a18b61"
        strokeWidth=".8"
        strokeLinecap="round"
        opacity=".75"
      />
      {/* This contact shadow and the front lip follow the same paper edge. */}
      <path
        d={pageContact}
        stroke="#65573c"
        strokeWidth={2.3}
        strokeOpacity=".34"
        fill="none"
      />

      {/* A dog-eared page lifts from the book as our reader waves hello. */}
      <g className="brand-reader-page">
        <path
          d="M139 146Q154 135 172 140Q169 146 175 152Q158 145 145 152Z"
          fill="#fff3d6"
          stroke="#bba57d"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M172 140Q160 140 163 147M147 145l8-2"
          stroke="#d0bb94"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </g>

      <path d={cover} fill={paint("cloth")} />
      <g clipPath={paint("cover-shape")}>
        <Thread d={coverThreads} {...sage} width={1.85} />
        <path d={rightCover} fill="#293e31" opacity=".14" />
      </g>
      <Edge d={cover} {...sage} width={2.8} />
      <Thread d={coverLip} {...sage} color="#8b9a75" width={1.45} />
      <Thread
        d="M25 164L27 196C50 195 75 204 92 212M108 212C129 202 152 195 173 196L176 164"
        {...gold}
        color="#c7b27e"
        light="#eadbb3"
        width={1.1}
        dash="2.2 2.6"
      />
      {/* Gold sprigs are sewn into the cloth cover, like the home stationery. */}
      <Thread
        d="M43 174Q49 188 66 199M51 186Q41 185 39 179Q47 178 51 186M55 190Q51 180 56 177Q62 182 55 190M59 194Q63 186 68 188Q70 194 59 194M155 173Q151 188 134 198M148 186Q158 183 160 177Q152 177 148 186M142 191Q147 181 142 178Q136 184 142 191M139 195Q133 187 128 190Q127 195 139 195"
        {...gold}
        color="#c5b27e"
        light="#e6d6a8"
        width={1.5}
      />
      <path d="M96 179Q100 182 104 179V216Q100 220 96 216Z" fill="#566e50" />
      <Edge
        d="M96 179V216Q100 220 104 216V179"
        {...sage}
        color="#6e8564"
        width={1.1}
      />
      <Thread d="M100 181V216" {...sage} color="#566e50" width={2.4} />
      <Thread d="M96 179Q100 181 104 179" {...gold} color="#c3ad77" width={1} />
      <Thread
        d="M96 185Q100 187 104 185M96 210Q100 213 104 210M100 194L102.5 198L100 202L97.5 198Z"
        {...gold}
        width={1.15}
      />
      <path d="M144 147L151 145V159L144 161Z" fill="#d2a7ae" />
      <path
        d="M144 160L151 159Q149 177 151 195L147.5 191L143 197Q145 178 144 160Z"
        fill="#b98593"
      />
      <Edge
        d="M144 160Q145 178 143 197L147.5 191L151 195Q149 177 151 159"
        {...rose}
        width={1.25}
      />
      <Thread
        d="M147.5 162Q147 176 147 187"
        {...rose}
        light="#f0c7c5"
        width={1}
        dash="2 2.3"
      />
      <path d={paws} fill={paint("fur")} />
      <g clipPath={paint("paw-shape")}>
        <Thread d={pawThreads} {...cotton} width={2} />
      </g>
      <Edge d={paws} width={1.85} />
      <Thread
        d="M51 149Q51 154 53 155M60 151Q59 155 62 157M172 121l-3 7M179 126l-5 6M164 145q3-3 5-4"
        {...cotton}
        color="#beac8f"
        width={1}
      />
      <path
        d="M181 99l4-5M189 107l5-2"
        stroke="#c9a45f"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>
  );
});
