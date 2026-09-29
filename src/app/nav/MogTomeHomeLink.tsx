import { Link, useLocation } from "react-router-dom";
import { MogTomeMark } from "@/shared/ui/MogTomeMark";
import { MogTomeWordmark } from "@/shared/ui/MogTomeWordmark";
import "./mogtome-home-link.css";

/** A cloth-bound bookplate with our little reader tucked into the cover. */
export function MogTomeHomeLink() {
  const { pathname } = useLocation();

  return (
    <Link
      to="/"
      className="storybook-brand"
      aria-label="MogTome home"
      aria-current={pathname === "/" ? "page" : undefined}
    >
      <span className="storybook-brand-cover" aria-hidden="true" />
      <span className="storybook-brand-reader" aria-hidden="true">
        <span className="storybook-brand-patch" />
        <svg
          className="storybook-brand-sprigs"
          viewBox="0 0 90 84"
          fill="none"
          focusable="false"
        >
          <g strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M30 77C13 72 6 60 8 43M63 77C77 69 83 59 81 43"
              stroke="var(--brand-leaf)"
              strokeWidth="1.6"
            />
            <path
              d="M10 57Q0 53 4 46Q12 48 10 57ZM15 66Q3 65 5 58Q13 57 15 66ZM22 73Q10 75 10 68Q17 65 22 73ZM79 57Q88 52 85 46Q77 48 79 57ZM74 66Q85 65 84 58Q76 57 74 66ZM67 73Q79 75 79 67Q71 66 67 73Z"
              fill="var(--brand-leaf)"
            />
            <path
              d="M9 52L12 61M11 62L19 70M79 52L77 60M79 62L71 70"
              stroke="var(--brand-linen)"
              strokeWidth=".7"
            />
            <path
              d="M9 15V23M5 19H13M76 7V15M72 11H80"
              stroke="var(--brand-gold)"
              strokeWidth="1.3"
            />
            <circle cx="18" cy="7" r="1.3" fill="var(--brand-rose)" />
            <circle cx="84" cy="29" r="1.5" fill="var(--brand-gold)" />
          </g>
        </svg>
        <MogTomeMark className="storybook-brand-mark" />
      </span>

      <span className="storybook-brand-type">
        <span className="storybook-brand-bookplate">
          <MogTomeWordmark className="storybook-wordmark" />
          <span className="nav-world">
            Kupo Life <i aria-hidden="true">✦</i> Zalera
          </span>
        </span>
        <span className="storybook-brand-bookmark" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" focusable="false">
            <path
              d="M8 12.5S2.5 9 2.5 5.8C2.5 2.6 6.3 2.4 8 5C9.7 2.4 13.5 2.6 13.5 5.8C13.5 9 8 12.5 8 12.5Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>

      <svg
        className="storybook-brand-charm"
        viewBox="0 0 24 52"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M11 2C18 12 4 18 12 29"
          stroke="var(--brand-gold)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <circle cx="11" cy="2" r="1.8" fill="var(--brand-gold)" />
        <circle cx="12" cy="29" r="2" stroke="var(--brand-gold)" />
        <path
          d="m12 31 2.8 5.6 6.2.9-4.5 4.4 1.1 6.1-5.6-2.9L6.4 48l1.1-6.1L3 37.5l6.2-.9Z"
          fill="var(--brand-star)"
          stroke="var(--brand-gold)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="m12 34 .8 5.4 4.6-1.1M12.8 39.4l-5 5"
          stroke="var(--brand-linen)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </Link>
  );
}
