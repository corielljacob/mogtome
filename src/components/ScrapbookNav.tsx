import { useLocation } from "react-router-dom";
import { useTabs } from "@/components/nav/tabs";
import { DesktopNav } from "@/components/nav/DesktopNav";
import { MobileNav } from "@/components/nav/MobileNav";

// whole-site nav as index tabs on the page edge.
// desktop (md+): vertical stack on the left. mobile (<md): horizontal strip along the bottom.
export function ScrapbookNav() {
  const { pathname } = useLocation();
  const tabs = useTabs();

  return (
    <>
      <DesktopNav tabs={tabs} currentPath={pathname} />
      <MobileNav tabs={tabs} currentPath={pathname} />
    </>
  );
}
