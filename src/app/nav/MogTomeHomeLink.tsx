import { Link, useLocation } from "react-router-dom";
import { MogTomeMark } from "@/shared/ui/MogTomeMark";
import { MogTomeWordmark } from "@/shared/ui/MogTomeWordmark";
import "./mogtome-home-link.css";

/** A compact reader and handmade wordmark share one quiet caption baseline. */
export function MogTomeHomeLink() {
  const { pathname } = useLocation();

  return (
    <Link
      to="/"
      className="storybook-brand"
      aria-label="MogTome home"
      aria-current={pathname === "/" ? "page" : undefined}
    >
      <span className="storybook-brand-reader" aria-hidden="true">
        <MogTomeMark className="storybook-brand-mark" />
      </span>

      <span className="storybook-brand-type">
        <MogTomeWordmark className="storybook-handlettering" />
        <span className="storybook-brand-name">
          <span>Mog</span>
          <span>Tome</span>
        </span>
        <span className="nav-world">
          Kupo Life <i aria-hidden="true">·</i> Zalera
        </span>
      </span>
    </Link>
  );
}
