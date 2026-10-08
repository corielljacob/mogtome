import { Link, useLocation } from "react-router-dom";
import { useTabs } from "@/shared/nav/tabs";
import { NavChapterIcon, type NavChapterIconName } from "./nav/NavChapterIcon";

const chapterIcons = new Map<string, NavChapterIconName>([
  ["/", "home"],
  ["/members", "members"],
  ["/chronicle", "chronicle"],
  ["/about", "about"],
  ["/dashboard", "dashboard"],
]);

export function ScrapbookNav() {
  const { pathname } = useLocation();
  const tabs = useTabs().filter(({ path }) => chapterIcons.has(path));

  return (
    <nav className="storybook-nav" aria-label="Main navigation">
      {tabs.map(({ path, label }) => {
        const active =
          pathname === path ||
          (path !== "/" && pathname.startsWith(`${path}/`));
        return (
          <Link
            key={path}
            to={path}
            data-chapter={path === "/" ? "home" : path.slice(1)}
            aria-current={active ? "page" : undefined}
          >
            <span className="nav-chapter-icon" aria-hidden="true">
              <NavChapterIcon name={chapterIcons.get(path)!} />
            </span>
            <span className="nav-chapter-label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
