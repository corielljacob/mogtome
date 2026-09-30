import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  ChevronDown,
  UserCircle,
  Sun,
  Moon,
  Crown,
  Settings,
} from "lucide-react";
import { useAuth } from "@/shared/contexts/AuthContext";
import { DiscordIcon } from "@/shared/ui/DiscordIcon";
import { MogTomeHomeLink } from "./nav/MogTomeHomeLink";
import { useTheme } from "@/shared/contexts/ThemeContext";
import { ScrapbookNav } from "./ScrapbookNav";

function UserMenu() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const menu = menuRef.current;
    menu?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();

    function handleClickOutside(event: MouseEvent) {
      if (menu && !menu.contains(event.target as Node)) setIsOpen(false);
    }
    function handleKeys(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      const items = Array.from(
        menu?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [],
      );
      const current = items.indexOf(
        document.activeElement as HTMLButtonElement,
      );
      if (current === -1) return;
      event.preventDefault();
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? items.length - 1
            : (current + (event.key === "ArrowDown" ? 1 : -1) + items.length) %
              items.length;
      items[next]?.focus();
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeys);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeys);
    };
  }, [isOpen]);

  if (isLoading || !user) return null;
  function visit(path: string) {
    setIsOpen(false);
    navigate(path);
  }

  return (
    <div
      className="account-menu"
      ref={menuRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setIsOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        onClick={() => setIsOpen((open) => !open)}
        className="account-toggle"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`User menu for ${user.memberName}`}
      >
        <img src={user.memberPortraitUrl} alt="" />
        <span>{user.memberName.split(" ")[0]}</span>
        <ChevronDown aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="account-dropdown" role="menu" aria-label="User menu">
          <div className="account-identity">
            <strong>{user.memberName}</strong>
            <span>{user.memberRank}</span>
          </div>
          {(user.hasKnighthood || user.hasTemporaryKnighthood) && (
            <button onClick={() => visit("/dashboard")} role="menuitem">
              <Crown aria-hidden="true" /> Knight Dashboard
            </button>
          )}
          <button onClick={() => visit("/profile")} role="menuitem">
            <UserCircle aria-hidden="true" /> My Profile
          </button>
          <button onClick={() => visit("/auth/logout")} role="menuitem">
            <LogOut aria-hidden="true" /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

function LoginButton() {
  const { login, isLoading, isAuthenticated } = useAuth();
  if (isAuthenticated) return null;
  return (
    <button
      onClick={login}
      disabled={isLoading}
      className="cozy-login"
      aria-label={isLoading ? "Loading account" : "Sign in with Discord"}
    >
      <DiscordIcon />
      <span>{isLoading ? "One moment…" : "Sign in"}</span>
    </button>
  );
}

export function Navbar() {
  const { pathname } = useLocation();
  const { isDarkMode, setColorMode, activeEvent, isEventThemeActive } =
    useTheme();
  const event = isEventThemeActive ? activeEvent : null;

  return (
    <header
      className="cozy-topbar"
      data-mode={isDarkMode ? "dark" : "light"}
      data-holiday={event?.id}
    >
      <div className="storybook-header">
        <MogTomeHomeLink />
        <ScrapbookNav />
        <div className="topbar-controls">
          <div className="nav-utilities">
            <Link
              to="/settings"
              className="nav-icon-button"
              aria-label="Settings"
              title="Settings"
              aria-current={pathname === "/settings" ? "page" : undefined}
            >
              <Settings aria-hidden="true" />
            </Link>
            <button
              className="nav-icon-button theme-toggle"
              onClick={() => setColorMode(isDarkMode ? "light" : "dark")}
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <Sun aria-hidden="true" />
              ) : (
                <Moon aria-hidden="true" />
              )}
            </button>
          </div>
          <LoginButton />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
