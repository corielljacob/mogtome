import { Link, useLocation } from "react-router-dom";
import { useTabs } from "@/shared/nav/tabs";

const mainPaths = new Set([
  "/",
  "/members",
  "/chronicle",
  "/about",
  "/dashboard",
]);

export function ScrapbookNav() {
  const { pathname } = useLocation();
  const tabs = useTabs().filter(({ path }) => mainPaths.has(path));

  return (
    <nav className="storybook-nav" aria-label="Main navigation">
      {tabs.map(({ path, label }, index) => {
        const active =
          pathname === path ||
          (path !== "/" && pathname.startsWith(`${path}/`));
        return (
          <Link key={path} to={path} aria-current={active ? "page" : undefined}>
            <span className="nav-chapter" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
