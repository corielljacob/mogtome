import { useLocation } from "react-router-dom";
import { useTabs } from "@/shared/nav/tabs";
import { DesktopNav } from "@/app/nav/DesktopNav";
import { MobileNav } from "@/app/nav/MobileNav";

// whole-site nav as index tabs on the page edge.
// desktop (md+): vertical stack on the left. mobile (<md): horizontal strip along the bottom.
export function ScrapbookNav() {
  const { pathname } = useLocation();
  const tabs = useTabs();

  // On phones the home screen IS the navigation (the dashboard shows every
  // destination as a card), so the floating bottom pill is hidden there. Desktop
  // keeps its sidebar on every page.
  const isHome = pathname === "/";

  return (
    <>
      <DesktopNav tabs={tabs} currentPath={pathname} />
      {!isHome && <MobileNav tabs={tabs} currentPath={pathname} />}
    </>
  );
}
