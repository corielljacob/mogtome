import { useId } from "react";
import { NookReadingCorner } from "./NookReadingCorner";
import { NookThread } from "./NookThread";
import "./nook-room-decor.css";

const star = "m0-12 3.6 8 8.9 1-6.6 6 1.9 9L0 7.5-7.8 12l1.5-9-6.2-6 8.8-1Z";
const moon = "M4-19C-7-9-6 10 10 14C-14 29-29-6 4-19Z";
const leaf = "M0 0C-18-3-27-19-24-33C-7-28 3-18 0 0Z";
const petal = "M0 1C-13-2-13-17-6-19C1-22 7-7 0 1Z";
const hangingLeft = "M31-10v130m44-130v62m47-52v29M6 0q27 52 145 17M49 77v119";
const hangingRight = "M124-8v104M78-8v37M37-8v160M9 3q93 45 157 3";
const stems =
  "M-10 324C69 251 48 102 97 36M10 310C110 258 123 184 165 143M19 314C72 305 139 266 215 287M4 292C22 214 4 160 18 111";
const leafFloss =
  "M-24-31Q-20-29-18-25M-19-30Q-17-28-18-25M-25-27Q-20-25-16-22M-15-28Q-13-25-16-22M-25-23Q-20-21-14-19M-11-25Q-9-22-14-19M-23-19Q-18-17-12-16M-7-22Q-6-18-12-16M-20-15Q-15-14-10-13M-4-18Q-3-15-10-13M-17-11Q-12-10-8-10M-1-14Q0-10-8-10M-13-8Q-9-6-5-6M1-9Q0-6-5-6M-8-4Q-4-2-1-1M1-5Q1-2-1-1";
const moonFloss = Array.from(
  { length: 14 },
  (_, i) => `M-24 ${-19 + i * 3}q15 7 38-1`,
).join(" ");

/** Sewn room accents use the same floss and padded outlines as the window. */
export function NookRoomDecor({
  isDark,
  includeFloor = true,
}: {
  isDark: boolean;
  includeFloor?: boolean;
}) {
  const id = useId().replace(/:/g, "");

  return (
    <div className="nook-room-decor" aria-hidden="true">
      <div className="nook-room-lamplight" />
      <svg
        className="nook-room-charms nook-room-charms--left"
        viewBox="0 0 160 260"
        fill="none"
        focusable="false"
      >
        <defs>
          <radialGradient id={`${id}-glow`}>
            <stop stopColor="var(--scene-glow)" stopOpacity=".28" />
            <stop offset="1" stopColor="var(--scene-glow)" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${id}-star-clip`}>
            <path d={star} />
          </clipPath>
          <clipPath id={`${id}-moon-clip`}>
            <path d={moon} />
          </clipPath>
          <g id={`${id}-star`} strokeLinejoin="round">
            <circle r="27" fill={`url(#${id}-glow)`} />
            <path d={star} fill="var(--scene-gold)" />
            <g clipPath={`url(#${id}-star-clip)`}>
              {[0, 72, 144, 216, 288].map((angle) => (
                <g key={angle} transform={`rotate(${angle})`}>
                  <NookThread
                    d="M-3 1Q-2-5 0-12M0 3Q1-3 1-9M3 3Q4-1 3-6"
                    color="var(--scene-glow)"
                    shadow="var(--scene-wood-dark)"
                    highlight="var(--scene-paper)"
                    width={2.7}
                    relief={2}
                  />
                </g>
              ))}
            </g>
            <NookThread
              d={star}
              color="var(--scene-gold)"
              highlight="var(--scene-glow)"
              width={2.3}
              relief={1.8}
              dasharray="1.6 .9"
            />
          </g>
        </defs>
        <NookThread
          d={hangingLeft}
          color="var(--scene-gold)"
          highlight="var(--scene-glow)"
          width={1.8}
          relief={1.8}
        />
        <path
          d={hangingLeft}
          stroke="var(--scene-paper)"
          strokeWidth="1.4"
          strokeDasharray="1.2 3.2"
          opacity=".6"
        />
        <g className="nook-room-star">
          <use
            href={`#${id}-star`}
            transform="translate(31 134) rotate(-12) scale(1.08)"
          />
        </g>
        <use
          href={`#${id}-star`}
          transform="translate(75 65) rotate(9) scale(.78)"
        />
        <use
          href={`#${id}-star`}
          transform="translate(122 32) rotate(-6) scale(.52)"
        />
        <use href={`#${id}-star`} transform="translate(49 204) scale(.76)" />
        <NookThread
          d="M47 179q-1-3 2-3q4 1 1 4q-2 1-3-1"
          color="var(--scene-gold)"
          highlight="var(--scene-glow)"
          width={1.7}
          relief={1.8}
        />
      </svg>

      <svg
        className="nook-room-charms nook-room-charms--right"
        viewBox="0 0 160 250"
        fill="none"
        focusable="false"
      >
        <NookThread
          d={hangingRight}
          color="var(--scene-gold)"
          highlight="var(--scene-glow)"
          width={1.8}
          relief={1.8}
        />
        <path
          d={hangingRight}
          stroke="var(--scene-paper)"
          strokeWidth="1.4"
          strokeDasharray="1.2 3.2"
          opacity=".6"
        />
        <NookThread
          d="M35 141q-1-3 2-3q4 1 1 4q-2 1-3-1"
          color="var(--scene-gold)"
          highlight="var(--scene-glow)"
          width={1.7}
          relief={1.8}
        />
        <use
          href={`#${id}-star`}
          transform="translate(124 108) rotate(12) scale(.85)"
        />
        <use
          href={`#${id}-star`}
          transform="translate(78 42) rotate(-9) scale(.62)"
        />
        <g className="nook-room-moon" transform="translate(37 177) rotate(-16)">
          <circle r="39" fill={`url(#${id}-glow)`} />
          <path d={moon} fill="var(--scene-gold)" />
          <g clipPath={`url(#${id}-moon-clip)`}>
            <NookThread
              d={moonFloss}
              color="var(--scene-glow)"
              shadow="var(--scene-wood-dark)"
              highlight="var(--scene-paper)"
              width={2.8}
              relief={2}
            />
          </g>
          <NookThread
            d={moon}
            color="var(--scene-gold)"
            highlight="var(--scene-glow)"
            width={2.4}
            relief={2}
            dasharray="1.8 1"
          />
        </g>
      </svg>

      {includeFloor && <NookFloorDecor isDark={isDark} />}
    </div>
  );
}

/** Floor accents can share the footer's edge instead of a fixed screen offset. */
export function NookFloorDecor({
  isDark,
  includeReadingCorner = true,
}: {
  isDark: boolean;
  includeReadingCorner?: boolean;
}) {
  const id = useId().replace(/:/g, "");

  return (
    <>
      <svg
        className="nook-room-botanical"
        viewBox="0 0 230 320"
        fill="none"
        focusable="false"
      >
        <defs>
          <clipPath id={`${id}-leaf-clip`}>
            <path d={leaf} />
          </clipPath>
          <clipPath id={`${id}-petal-clip`}>
            <path d={petal} />
          </clipPath>
          <g id={`${id}-leaf-shape`}>
            <path
              d={leaf}
              fill="color-mix(in srgb, var(--scene-leaf) 75%, var(--scene-wood-dark))"
            />
            <g clipPath={`url(#${id}-leaf-clip)`}>
              <NookThread
                d={leafFloss}
                color="var(--scene-leaf-light)"
                highlight="color-mix(in srgb, var(--scene-leaf-light) 75%, var(--scene-paper))"
                shadow="var(--scene-wood-dark)"
                width={3.1}
                relief={2.2}
              />
            </g>
            <NookThread
              d={leaf}
              color="var(--scene-leaf)"
              highlight="var(--scene-leaf-light)"
              width={2.2}
              relief={2}
              dasharray="2.3 1"
            />
            <NookThread
              d="M-1-1Q-12-16-22-30"
              color="var(--scene-leaf)"
              highlight="var(--scene-leaf-light)"
              width={2.4}
              relief={1.8}
            />
          </g>
          <g id={`${id}-flower`}>
            {[0, 73, 145, 217, 290].map((angle) => (
              <g key={angle} transform={`rotate(${angle})`}>
                <path d={petal} fill="var(--scene-rose)" />
                <g clipPath={`url(#${id}-petal-clip)`}>
                  <NookThread
                    d="M-10-19Q-13-9-1 2M-7-20Q-10-10 0 2M-4-21Q-6-9 0 2M-1-20Q-2-10 0 2M2-19Q3-9 0 2"
                    color="var(--scene-dried-flower)"
                    shadow="var(--scene-book-rose)"
                    highlight="var(--scene-paper)"
                    width={2.7}
                    relief={2}
                  />
                </g>
                <NookThread
                  d={petal}
                  color="var(--scene-dried-flower)"
                  highlight="var(--scene-paper)"
                  shadow="var(--scene-book-rose)"
                  width={1.9}
                  relief={1.8}
                />
              </g>
            ))}
            <circle r="4.8" fill="var(--scene-wood-dark)" />
            <NookThread
              d="M-3-1q-1-3 2-3q3 1 0 3q-1 1-2 0M1-1q-1-3 2-2q3 1 0 3q-1 0-2-1M-1 3q-2-3 1-3q3 1 1 3q-1 1-2 0"
              color="var(--scene-gold)"
              highlight="var(--scene-glow)"
              width={2.3}
              relief={1.8}
            />
          </g>
          <g id={`${id}-bud`}>
            <path d="M0 6C-7 2-5-8 0-8C5-7 5 2 0 6Z" fill="var(--scene-rose)" />
            <NookThread
              d="M0 5C-5 2-4-7 0-7C4-6 4 2 0 5M0-5v8"
              color="var(--scene-dried-flower)"
              highlight="var(--scene-paper)"
              width={2.6}
              relief={2}
            />
          </g>
        </defs>
        <NookThread
          d={stems}
          color="var(--scene-leaf)"
          highlight="var(--scene-leaf-light)"
          width={3.2}
          relief={2}
        />
        <path
          d={stems}
          stroke="var(--scene-leaf-light)"
          strokeWidth="2.8"
          strokeDasharray="1.5 3.7"
          opacity=".8"
        />
        <g>
          {[
            [48, 256, -26],
            [58, 213, 52],
            [61, 182, -27],
            [70, 139, 51],
            [78, 101, -15],
            [89, 63, 38],
            [99, 243, 86],
            [117, 213, -3],
            [145, 173, 58],
            [59, 301, 28],
            [110, 282, 69],
            [153, 279, 125],
            [184, 282, 52],
            [17, 238, 12],
            [16, 188, 59],
            [16, 144, -15],
          ].map(([x, y, angle], index) => (
            <use
              key={index}
              href={`#${id}-leaf-shape`}
              transform={`translate(${x} ${y}) rotate(${angle}) scale(${index % 3 === 0 ? 0.78 : 1})`}
            />
          ))}
        </g>
        <NookThread
          d="M56 259q-20-56-5-109m66 72q-4-32 15-54M19 296q41-15 56-40"
          color="var(--scene-wood)"
          highlight="var(--scene-wood-light)"
          width={2.5}
          relief={1.8}
        />
        <use
          href={`#${id}-flower`}
          transform="translate(51 158) rotate(-22) scale(.58)"
        />
        <use
          href={`#${id}-flower`}
          transform="translate(132 170) rotate(16) scale(.68)"
        />
        <use
          href={`#${id}-flower`}
          transform="translate(77 257) rotate(-10) scale(.9)"
        />
        <use href={`#${id}-bud`} transform="translate(94 41) rotate(30)" />
        <use
          href={`#${id}-bud`}
          transform="translate(101 30) rotate(28) scale(.8)"
        />
        <use href={`#${id}-bud`} transform="translate(163 144) rotate(45)" />
        <use
          href={`#${id}-bud`}
          transform="translate(171 137) rotate(45) scale(.75)"
        />
      </svg>

      {includeReadingCorner && <NookReadingCorner isDark={isDark} />}
    </>
  );
}
