import { NookThread } from "./NookThread";
import "./nook-welcome-heading.css";

const heart =
  "M12 21C9 17 2 13 2 7C2 1 9 0 12 6C15 0 22 1 22 7C22 13 15 17 12 21Z";

/** Real text keeps the stitched greeting selectable and responsive. */
export function NookWelcomeHeading() {
  return (
    <h1 className="nook-embroidered-heading">
      <span className="nook-welcome-text">Welcome home, kupo.</span>
      <svg
        className="nook-welcome-heart"
        viewBox="-1 -2 26 27"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <NookThread
          d={heart}
          color="var(--scene-rose)"
          highlight="color-mix(in srgb, var(--scene-rose) 50%, var(--scene-paper))"
          shadow="var(--scene-book-rose)"
          width={2.3}
          relief={1.8}
        />
        <NookThread
          d={heart}
          color="color-mix(in srgb, var(--scene-rose) 65%, var(--scene-paper))"
          highlight="var(--scene-paper)"
          width={1.6}
          relief={1.2}
          dasharray="1.3 2.1"
        />
      </svg>
    </h1>
  );
}
