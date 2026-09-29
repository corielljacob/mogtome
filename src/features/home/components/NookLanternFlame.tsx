import { useId, type CSSProperties } from "react";
import { NookThread } from "./NookThread";

// Eight replacement patches, all pinned to the same wick. Each exposure has
// its own silhouette and needlework; the thread never stretches between poses.
const flameFrames = [
  {
    outline: "M0 0C-6.5-1-7-7-3.5-12Q.5-16-1-20C5-16 8-4 0 0Z",
    heart: "M0-.8C-4.5-2-4-6.5-1.8-10Q.4-13 .2-15C4.8-10 5-3 0-.8Z",
    satin:
      "M-1-19q2 4 .6 7M-2.6-13.6q1.8 3.6-2 7M.7-15.8q2 5-2.5 11.7M2.6-12.7q1.4 5.5-3.8 11M4.3-9.7q.5 4-3 7.6M-4.8-7.3q-.8 3.1 2.5 5.4M5-6q-.2 2.5-2.5 4.5",
    ties: "M-2.8-11.8l1.6.8M.7-11l1.6.7M-3.4-6.4l1.5.9M1.7-6l1.4.6",
    core: "M-.5-1.5q-2.4-2.1.4-6.2M.6-1.8q1.7-2.2.7-4.2",
  },
  {
    outline: "M0 0C-6.5-1.5-6-7.2-2.5-12Q2.3-16 2.8-21C5.4-16.4 7.5-5 0 0Z",
    heart: "M0-.8C-4-2.5-3.7-6.4-.7-10.5Q1.7-13 2-16C5-10.4 4.6-3.8 0-.8Z",
    satin:
      "M2.8-20q.3 4-1.5 7M.4-14.7q1 3-3.9 8.6M2.9-15.8q1 5.4-4.6 12M4.1-12.6q.8 6-4.3 11M-3.3-9.4q.6 4-1.2 5M-4.3-6.8q-.4 2.8 2.2 4.8M4.7-8.5q-.3 4-2.9 6.6",
    ties: "M-.4-12.4l1.6.7M2-10.1l1.5.5M-3.3-5.7l1.5.9M.8-4.8l1.6.6",
    core: "M-.5-1.4q-2-2.5 1.1-6.9M.8-1.8q1.8-2.2 1.2-4.7",
  },
  {
    outline:
      "M0 0C-6.2-1-6.6-7-2.3-11.4Q1.7-14.5 5-18.7C4.3-14.4 7.3-11 5.6-6C4.8-3 2.7-1 0 0Z",
    heart: "M0-.8C-4-2.2-3.6-6.5-.5-9.4Q2.4-12 3.4-14.5C4.4-10.6 4.7-4 0-.8Z",
    satin:
      "M4.5-17.6q-1.8 4-3.8 5.1M2.8-13.8q-.1 3.4-6 8M4.1-13.1q1 5-4.9 10.9M4.9-9.7q-.5 5-3.8 8M-1.6-10.6q.7 2.9-2.6 5.5M-4.5-7q-.6 3.4 2.4 5M4.8-6.4q-.6 2.4-2.2 3.6",
    ties: "M.5-11.6l1.6.8M2.2-8.9l1.5.6M-3.4-5.4l1.5.9M.5-4.3l1.6.6",
    core: "M-.6-1.5q-2-2.1 1.6-6M.7-1.7q1.8-1.6 1.5-4.1",
  },
  {
    outline:
      "M0 0C-6.8-1-7.5-6.2-4-10.2Q.1-13.3 2.4-17C2-13.4 7.3-11.8 6.1-6.8C5.3-2.9 2.6-1 0 0Z",
    heart: "M0-.8C-4.2-2-4.4-6-1.2-9Q1-10.6 1.4-13C4.2-10 5-4.2 0-.8Z",
    satin:
      "M2-15.9q-.8 3.3-3.9 5.6M.2-11.4q.8 3-4.1 6.1M2.1-12q1.6 4-3.5 9.8M3.7-10.5q1.3 4-3.6 8.9M5.3-8.5q.1 3.8-3.4 6.5M-3.6-9q-.1 2-1.6 3.8M-5.1-5.6q.4 2.1 2.6 3.7",
    ties: "M-1.7-9.6l1.6.9M1.8-8l1.7.6M-3.4-4.7l1.4.9M1-4.2l1.4.7",
    core: "M-.7-1.5q-2.5-2 .6-5.4M.6-1.6q1.9-1.8 1-3.5",
  },
  {
    outline:
      "M0 0C-6.7-1-8-6.8-4.7-11Q-1.8-14.2-2.5-18.4C.4-15.6 6.1-12.3 6-7.1C5.9-3.6 2.9-1.1 0 0Z",
    heart: "M0-.8C-4.3-2-4.8-6.1-2.8-9.5Q-.9-12-1-14C3-10.6 4.9-4.1 0-.8Z",
    satin:
      "M-2.2-17.3q1.7 3.4.4 5.7M-3.5-11.8q1.3 3.1-1.5 6.5M-.4-13.6q1.9 5-3 10.4M1.7-11.5q2.1 5-2.7 9.8M3.4-9.6q1.3 4.5-2.4 8M-5.3-7.5q-.6 3.4 2.6 5.6M4.9-6.9q-.2 2.5-2.6 4.8",
    ties: "M-3.6-10.2l1.7.7M-.3-10l1.7.7M-3.5-5.4l1.6.9M1.1-5l1.6.5",
    core: "M-.6-1.4q-2.3-2.2-.3-6.1M.7-1.7q1.8-2.1.4-4.2",
  },
  {
    outline:
      "M0 0C-6.4-1.3-7.2-6.8-4.8-11.4Q-2.3-15-5-21C.1-18 5.9-10.5 5.5-6.5C5.1-3 2.2-1 0 0Z",
    heart:
      "M0-.8C-4-2.1-4.5-6-3.1-9.4Q-1.6-12.3-2.8-15.5C1.8-11.8 4.8-4.7 0-.8Z",
    satin:
      "M-4.3-19.8q2.8 4.1 2.1 7.3M-3.4-13.4q1.5 3.5-1.4 7.6M-1.5-14.5q2.8 5.3-1.6 11.7M.7-11.8q3.1 5-1.8 10M2.8-9.7q2 4-1.8 7.9M-5.2-7.6q-.3 3.4 2.8 5.7M4.4-6.8q-.1 2.3-2 4.6",
    ties: "M-3.5-11.2l1.6.6M-.4-10.3l1.7.6M-3.3-5.5l1.4.7M.9-5.2l1.6.6",
    core: "M-.7-1.5q-2.2-2.1-.7-6.4M.6-1.6q1.8-2.4-.1-4.5",
  },
  {
    outline:
      "M0 0C-6.2-1.1-6.6-7-3.6-12.1Q-.9-16-3.2-22C1.8-18.3 5.5-12.2 5.5-7C5.5-3.6 2.6-1.1 0 0Z",
    heart:
      "M0-.8C-4-2.3-3.8-6.8-1.9-10.3Q-.3-13.2-1.5-16.4C2.4-12.4 4.3-4.7 0-.8Z",
    satin:
      "M-2.7-20.8q2.3 4.2 1.7 7.5M-2.2-14q1.2 4.3-2.4 8.2M-.3-15.4q2.4 5.7-2.6 12.7M1.6-12.5q2.1 6-2.6 10.7M3.3-10.2q1.5 4.7-2.1 8.2M-4.7-7.8q-.3 3.7 2.3 5.6M4.4-6.9q-.2 2.7-2.2 4.7",
    ties: "M-2.9-11.7l1.6.8M.2-10.9l1.7.6M-3.1-6l1.5.8M1.1-5.8l1.5.6",
    core: "M-.6-1.5q-2.2-2.4-.1-6.9M.6-1.8q1.7-2.2.1-4.8",
  },
  {
    outline:
      "M0 0C-6.5-1.2-6.6-7-3.2-12Q.4-16.5 0-21C3.9-17.3 6.4-10.7 5.7-6.6C5-3.2 2.3-1 0 0Z",
    heart: "M0-.8C-4.1-2.2-3.7-6.7-1.6-10Q.6-13 .7-16C3.5-11.6 4.6-4.6 0-.8Z",
    satin:
      "M.1-19.8q1.1 3.4-.6 7M-1.9-13.4q1.4 3.5-2.5 7.3M1.3-15.4q1.6 5.4-3.8 12.4M3-12.3q1.4 5.4-3.7 10.6M4.3-9.3q.5 4.4-2.9 7.4M-4.6-7.7q-.4 3.5 2.4 5.6M4.9-6.1q-.4 2.1-2.1 3.9",
    ties: "M-2.4-11.4l1.5.8M1-10.2l1.6.6M-3-5.6l1.4.8M1.5-5.5l1.4.6",
    core: "M-.5-1.4q-2.2-2.5.5-6.5M.8-1.8q1.7-2.3.7-4.5",
  },
];

/** A little replacement-animation loop made from raised, individually sewn flames. */
export function NookLanternFlame() {
  const id = useId().replace(/:/g, "");

  return (
    <g
      className="nook-candle-flame"
      transform="translate(374 410)"
      stroke="none"
    >
      <defs>
        {flameFrames.map((frame, index) => (
          <clipPath id={`${id}-flame-${index}`} key={index}>
            <path d={frame.outline} />
          </clipPath>
        ))}
      </defs>
      {flameFrames.map((frame, index) => (
        <g
          key={index}
          className="nook-candle-flame-frame"
          data-frame={index}
          style={{ "--flame-frame": index } as CSSProperties}
        >
          <path d={frame.outline} fill="var(--scene-gold)" />
          <path d={frame.heart} fill="var(--scene-glow)" />
          <g clipPath={`url(#${id}-flame-${index})`}>
            <NookThread
              d={frame.satin}
              color="var(--scene-glow)"
              shadow="var(--scene-brass)"
              width={1.15}
              relief={1.35}
            />
            <NookThread
              d={frame.ties}
              color="var(--scene-gold)"
              shadow="var(--scene-brass)"
              width={0.65}
              opacity={0.8}
            />
          </g>
          <NookThread
            d={frame.outline}
            color="var(--scene-gold)"
            shadow="var(--scene-brass)"
            width={0.8}
            relief={1.2}
          />
          <NookThread
            d={frame.core}
            color="var(--scene-paper)"
            shadow="var(--scene-gold)"
            width={1.1}
            relief={1.25}
          />
        </g>
      ))}
    </g>
  );
}
