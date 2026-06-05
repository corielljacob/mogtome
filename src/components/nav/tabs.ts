import {
  Home,
  Users,
  Scroll,
  Info,
  Settings,
  UserCircle,
  Crown,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export interface Tab {
  path: string;
  label: string;
  icon: LucideIcon;
  /** theme token or hex */
  color: string;
}

const MAIN_TABS: Tab[] = [
  { path: "/", label: "Home", icon: Home, color: "var(--primary)" },
  { path: "/members", label: "Family", icon: Users, color: "var(--secondary)" },
  {
    path: "/chronicle",
    label: "Chronicle",
    icon: Scroll,
    color: "var(--accent)",
  },
  { path: "/about", label: "About", icon: Info, color: "#a886d6" },
];

export function useTabs(): Tab[] {
  const { isAuthenticated, user } = useAuth();
  const hasKnighthood = user?.hasKnighthood || user?.hasTemporaryKnighthood;
  return [
    ...MAIN_TABS,
    ...(isAuthenticated
      ? [
          {
            path: "/profile",
            label: "Profile",
            icon: UserCircle,
            color: "var(--secondary)",
          } as Tab,
        ]
      : []),
    ...(isAuthenticated && hasKnighthood
      ? [
          {
            path: "/dashboard",
            label: "Dashboard",
            icon: Crown,
            color: "#eaa53a",
          } as Tab,
        ]
      : []),
    { path: "/settings", label: "Settings", icon: Settings, color: "#7fb1cc" },
  ];
}
