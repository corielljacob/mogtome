import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

// The desktop nav has two shapes: the slim edge rail (default) and a pinned,
// full-height sidebar that the page content makes room for. That "expanded" bit
// is shared between the nav (which renders the panel) and the app shell (which
// grows the content gutter), so it lives in a tiny context. Persisted so the
// chosen shape sticks across visits, like the theme.

const STORAGE_KEY = "mogtome-nav-expanded";

interface NavExpandedContextType {
  expanded: boolean;
  toggle: () => void;
  setExpanded: (value: boolean) => void;
}

const NavExpandedContext = createContext<NavExpandedContextType | null>(null);

function readStored(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function persist(value: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // storage might be full or disabled - the mode just won't be remembered
  }
}

export function NavExpandedProvider({ children }: { children: ReactNode }) {
  const [expanded, setExpandedState] = useState<boolean>(readStored);

  const setExpanded = useCallback((value: boolean) => {
    setExpandedState(value);
    persist(value);
  }, []);

  const toggle = useCallback(() => {
    setExpandedState((prev) => {
      const next = !prev;
      persist(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ expanded, toggle, setExpanded }),
    [expanded, toggle, setExpanded],
  );

  return (
    <NavExpandedContext.Provider value={value}>
      {children}
    </NavExpandedContext.Provider>
  );
}

export function useNavExpanded() {
  const context = useContext(NavExpandedContext);
  if (!context) {
    throw new Error("useNavExpanded must be used within a NavExpandedProvider");
  }
  return context;
}
