import { useId } from "react";
import { NookThread } from "./NookThread";

const bat =
  "M0 2C-6-10-16-18-28-17C-23-10-24-3-28 2C-19-2-14 2-13 7C-7 3-4 7 0 12C4 7 7 3 13 7C14 2 19-2 28 2C24-3 23-10 28-17C16-18 6-10 0 2Z";
const wingFloss = Array.from(
  { length: 19 },
  (_, i) =>
    "M" +
    (-30 + i * 1.55) +
    " -20Q" +
    (-21 + i * 0.98) +
    " -4 " +
    (-7 + i * 0.42) +
    " 12",
).join(" ");
const bodyFloss = Array.from(
  { length: 6 },
  (_, i) =>
    "M" +
    (-4 + i * 1.6) +
    " -7Q" +
    (-5 + i * 2) +
    " 1 " +
    (-2 + i * 0.8) +
    " 11",
).join(" ");

/** Small sewn wall pieces share the window's raised floss and close contact shadow. */
export function NookHalloweenRoom() {
  const id = useId().replace(/:/g, "");
  return (
    <div className="nook-halloween-room" aria-hidden="true">
      <svg
        className="nook-halloween-web nook-halloween-web--left"
        viewBox="0 0 150 150"
        fill="none"
        focusable="false"
      >
        <Cobweb />
      </svg>
      <svg
        className="nook-halloween-web nook-halloween-web--right"
        viewBox="0 0 150 150"
        fill="none"
        focusable="false"
      >
        <Cobweb />
        <g className="nook-halloween-spider">
          <NookThread d="M91 41v56" color="var(--scene-gold)" width={1.1} />
          <NookThread
            d="m87 100-7-5m7 8-8-1m8 5-7 4m15-11 7-5m-7 8 8-1m-8 6 7 4"
            color="var(--season-ribbon)"
            highlight="#b194ad"
            width={1.6}
          />
          <ellipse cx="91" cy="104" rx="5" ry="6" fill="var(--season-ribbon)" />
          <NookThread
            d="M89 99q-3 5 0 10M91 98v12M93 99q3 5 0 10"
            color="#82627e"
            shadow="#3b2e43"
            highlight="#c0a7bb"
            width={1.7}
          />
          <path
            d="M89.5 103h.2m2.8 0h.2"
            stroke="var(--scene-paper)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </g>
      </svg>
      <svg
        className="nook-halloween-wall-bats"
        viewBox="0 0 180 150"
        fill="none"
        focusable="false"
      >
        <defs>
          <clipPath id={id + "-bat"}>
            <path d={bat} />
          </clipPath>
          <g id={id + "-sewn-bat"}>
            <path
              d={bat}
              fill="#644e6b"
              stroke="#453548"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <g clipPath={"url(#" + id + "-bat)"}>
              <NookThread
                d={wingFloss}
                color="#92738f"
                shadow="#453548"
                highlight="#c1a1b5"
                width={1.8}
                relief={1.4}
              />
              <g transform="scale(-1 1)">
                <NookThread
                  d={wingFloss}
                  color="#81617f"
                  shadow="#453548"
                  highlight="#b89bb2"
                  width={1.8}
                  relief={1.4}
                />
              </g>
            </g>
            <NookThread
              d={bat}
              color="#ad8eaa"
              shadow="#4c3b50"
              highlight="#d3b7c7"
              width={1.65}
              relief={1.4}
            />
            <NookThread
              d={bat}
              color="#d0b0bd"
              shadow="#67475f"
              width={0.85}
              dasharray=".65 1.8"
            />
            <path d="M-4 3-5-5-1-2 2-3 6-6 5 4 0 9Z" fill="#5e4563" />
            <NookThread
              d={bodyFloss}
              color="#73577a"
              shadow="#453548"
              highlight="#bfa0b8"
              width={1.4}
            />
            <NookThread
              d="M-4-3-1 0 2-1 5-4M-4 3 0 9 4 3"
              color="#987594"
              width={1.15}
            />
            <path
              d="M-1.8 2h.15m4.3 0h.15"
              stroke="#f5dfb1"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </g>
        </defs>
        {[
          [49, 88, -22, 1],
          [124, 44, 24, 0.72],
          [156, 99, -16, 0.48],
        ].map(([x, y, tilt, scale], index) => (
          <g
            key={x}
            transform={
              "translate(" +
              x +
              " " +
              y +
              ") rotate(" +
              tilt +
              ") scale(" +
              scale +
              ")"
            }
          >
            <g
              className={
                "nook-halloween-wall-bat nook-halloween-wall-bat--" + index
              }
            >
              <use href={"#" + id + "-sewn-bat"} />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}

function Cobweb() {
  return (
    <g>
      <NookThread
        d="M3 3H143M3 3V143M3 3 129 73M3 3 73 129M3 3 108 108"
        color="var(--scene-gold)"
        shadow="var(--scene-wood-dark)"
        highlight="var(--scene-paper)"
        width={1.1}
        relief={1.3}
      />
      {[0.26, 0.5, 0.75, 1].map((scale) => (
        <g key={scale} transform={"translate(3 3) scale(" + scale + ")"}>
          <NookThread
            d="M0 140Q19 107 70 126Q65 96 105 105Q96 65 126 70Q107 19 140 0"
            color="var(--scene-gold)"
            shadow="var(--scene-wood-dark)"
            highlight="var(--scene-paper)"
            width={1.1 / scale}
          />
        </g>
      ))}
      {[
        [38, 38],
        [73, 129],
        [108, 108],
        [129, 73],
      ].map(([x, y]) => (
        <g key={x} transform={"translate(" + x + " " + y + ")"}>
          <path
            d="M-1-.7q2-1 2 1q-2 1-2-1Z"
            fill="var(--scene-gold)"
            stroke="var(--scene-paper)"
            strokeWidth=".6"
          />
        </g>
      ))}
    </g>
  );
}
