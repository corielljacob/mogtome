type StitchPoint = { x: number; y: number; tx: number; ty: number };

const coordinate = (value: number) => value.toFixed(2);
const point = (x: number, y: number) => `${coordinate(x)} ${coordinate(y)}`;

/** Walk clockwise around the cord so stitches remain perpendicular at corners. */
function roundedCord(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const horizontal = width - radius * 2;
  const vertical = height - radius * 2;
  const corner = (Math.PI * radius) / 2;
  const length = horizontal * 2 + vertical * 2 + corner * 4;

  const at = (distance: number): StitchPoint => {
    let offset = ((distance % length) + length) % length;
    const sides = [horizontal, vertical, horizontal, vertical];
    const centers = [
      [x + width - radius, y + radius],
      [x + width - radius, y + height - radius],
      [x + radius, y + height - radius],
      [x + radius, y + radius],
    ];

    for (let side = 0; side < 4; side++) {
      if (offset <= sides[side]) {
        if (side === 0) return { x: x + radius + offset, y, tx: 1, ty: 0 };
        if (side === 1)
          return { x: x + width, y: y + radius + offset, tx: 0, ty: 1 };
        if (side === 2)
          return {
            x: x + width - radius - offset,
            y: y + height,
            tx: -1,
            ty: 0,
          };
        return { x, y: y + height - radius - offset, tx: 0, ty: -1 };
      }
      offset -= sides[side];
      if (offset <= corner) {
        const angle = ((side - 1) * Math.PI) / 2 + offset / radius;
        const [cx, cy] = centers[side];
        return {
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          tx: -Math.sin(angle),
          ty: Math.cos(angle),
        };
      }
      offset -= corner;
    }
    return { x: x + radius, y, tx: 1, ty: 0 };
  };

  return { length, at };
}

function makeSatinStitches() {
  const cord = roundedCord(8, 8, 344, 224, 23);
  const count = Math.round(cord.length / 2.65);
  const paths = [[], [], [], []] as string[][];

  for (let index = 0; index < count; index++) {
    const { x, y, tx, ty } = cord.at((index * cord.length) / count);
    const nx = ty;
    const ny = -tx;
    // Deterministic variations keep the edge handmade without changing its outline.
    const variation = Math.sin(index * 2.39996);
    const reach = 4.65 + variation * 0.25;
    const lean = 0.7 + Math.cos(index * 1.71) * 0.25;
    const start = point(x + nx * reach - tx * lean, y + ny * reach - ty * lean);
    const middle = point(
      x + tx * (0.7 + variation * 0.2),
      y + ty * (0.7 + variation * 0.2),
    );
    const end = point(x - nx * reach + tx * lean, y - ny * reach + ty * lean);
    paths[index % paths.length].push(`M${start}Q${middle} ${end}`);
  }

  return paths.map((path) => path.join(""));
}

function makeRunningStitches() {
  const seam = roundedCord(18.5, 18.5, 322, 202, 15);
  const count = Math.round(seam.length / 7.3);
  const paths: string[] = [];

  for (let index = 0; index < count; index++) {
    const start = (index * seam.length) / count;
    const a = seam.at(start);
    const b = seam.at(start + 1.75);
    const c = seam.at(start + 3.5);
    paths.push(
      `M${point(a.x, a.y)}Q${point(b.x + b.ty * 0.22, b.y - b.tx * 0.22)} ${point(c.x, c.y)}`,
    );
  }

  return paths.join("");
}

// Batched once at module load: hundreds of strands, only a handful of SVG nodes.
const satinStitches = makeSatinStitches();
const allSatinStitches = satinStitches.join("");
const runningStitches = makeRunningStitches();

/** Two depth planes let the floss lift away from its soft contact shadow. */
export function MembershipPatchEmbroidery() {
  return (
    <>
      <svg
        className="membership-patch-thread-shadow"
        viewBox="0 0 360 240"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <g
          className="membership-patch-thread-contact"
          stroke="var(--patch-thread-dark)"
          strokeLinecap="round"
          style={{
            transform:
              "translate(var(--patch-thread-shadow-x, .8px), var(--patch-thread-shadow-y, 1.2px))",
          }}
        >
          <rect
            x="8"
            y="8"
            width="344"
            height="224"
            rx="23"
            strokeWidth="13"
            opacity=".2"
          />
          <path d={allSatinStitches} strokeWidth="2.1" opacity=".24" />
          <path d={runningStitches} strokeWidth="1.8" opacity=".3" />
        </g>
      </svg>
      <svg
        className="membership-patch-border"
        viewBox="0 0 360 240"
        preserveAspectRatio="none"
        fill="none"
        strokeLinecap="round"
        aria-hidden="true"
        focusable="false"
      >
        <g className="membership-patch-cord">
          <rect
            x="8"
            y="8"
            width="344"
            height="224"
            rx="23"
            stroke="var(--patch-thread-dark)"
            strokeWidth="11.8"
          />
          <rect
            x="8"
            y="8"
            width="344"
            height="224"
            rx="23"
            stroke="var(--patch-thread)"
            strokeWidth="10.4"
          />
          <rect
            x="8"
            y="8"
            width="344"
            height="224"
            rx="23"
            stroke="var(--patch-thread-light)"
            strokeWidth="6"
            opacity=".28"
          />
        </g>
        <path
          className="membership-patch-floss-grooves"
          d={allSatinStitches}
          stroke="var(--patch-thread-dark)"
          strokeWidth="2"
        />
        <g className="membership-patch-floss" strokeWidth="1.35">
          {satinStitches.map((d, index) => (
            <path
              key={index}
              d={d}
              stroke={
                index === 1
                  ? "var(--patch-thread-light)"
                  : "var(--patch-thread)"
              }
              opacity={index === 1 ? 0.65 : 1}
            />
          ))}
        </g>
        <path
          className="membership-patch-running-stitch-shadow"
          d={runningStitches}
          stroke="var(--patch-thread-dark)"
          strokeWidth="1.7"
        />
        <path
          className="membership-patch-running-stitch"
          d={runningStitches}
          stroke="var(--patch-thread-light)"
          strokeWidth="1"
        />
        <g
          className="membership-patch-thread-glints"
          stroke="var(--patch-cloth)"
          style={{
            transform:
              "translate(var(--patch-glint-x, -.4px), var(--patch-glint-y, -.5px))",
          }}
        >
          <path d={allSatinStitches} strokeWidth=".48" opacity=".66" />
          <path d={runningStitches} strokeWidth=".35" opacity=".65" />
        </g>
      </svg>
    </>
  );
}
