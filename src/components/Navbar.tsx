import { useState, useEffect, useRef, type CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { LogOut, ChevronDown, FileText } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { DiscordIcon } from "./DiscordIcon";
import { LogoIcon } from "./LogoIcon";

function UserMenu() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // close on outside click / Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  if (isLoading || !user) return null;

  const avatarUrl = user.memberPortraitUrl;
  const displayName = user.memberName;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group flex items-center gap-2 px-1.5 py-1 rounded-full hover-bounce
          cursor-pointer transition-[background-color] duration-200
          focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none
          ${isOpen ? "bg-[color:color-mix(in_srgb,var(--primary)_10%,transparent)]" : "hover:bg-[color:color-mix(in_srgb,var(--primary)_9%,transparent)]"}
        `}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`User menu for ${displayName}`}
      >
        <img
          src={avatarUrl}
          alt=""
          className="w-8 h-8 rounded-full object-cover transition-all"
          style={{
            boxShadow:
              "0 0 0 2px var(--card), 0 0 0 4px color-mix(in srgb, var(--primary) 45%, var(--card))",
          }}
        />
        <span className="hidden lg:block font-display text-sm font-bold text-[var(--text)] max-w-[90px] truncate">
          {displayName}
        </span>
        <div
          className="transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        >
          <ChevronDown className="w-4 h-4 text-[var(--primary)]" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-full mt-2 z-50 min-w-[180px]"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            role="menu"
            aria-label="User menu"
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "var(--card)",
                border:
                  "2px solid color-mix(in srgb, var(--primary) 28%, var(--card))",
                boxShadow:
                  "0 0 0 3px var(--card), 4px 5px 0 0 color-mix(in srgb, var(--primary) 22%, transparent), 0 10px 24px -8px var(--shadow)",
              }}
            >
              <div
                className="px-3 py-2.5"
                style={{
                  background:
                    "color-mix(in srgb, var(--primary) 12%, var(--card))",
                  borderBottom:
                    "2px dashed color-mix(in srgb, var(--primary) 28%, transparent)",
                }}
              >
                <p className="font-display font-bold text-sm text-[var(--text)] truncate">
                  {displayName}
                </p>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  {user.memberRank}
                </p>
              </div>

              <div className="p-1.5">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-display font-bold text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[color:color-mix(in_srgb,var(--primary)_9%,transparent)] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none"
                  role="menuitem"
                >
                  <span
                    className="flex items-center justify-center w-7 h-7 rounded-full shrink-0"
                    style={{
                      background:
                        "color-mix(in srgb, var(--secondary) 16%, var(--card))",
                      color: "var(--secondary)",
                    }}
                  >
                    <FileText className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm">My Profile</span>
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/auth/logout");
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-display font-bold text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[color:color-mix(in_srgb,var(--primary)_9%,transparent)] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none"
                  role="menuitem"
                >
                  <span
                    className="flex items-center justify-center w-7 h-7 rounded-full shrink-0"
                    style={{
                      background:
                        "color-mix(in srgb, var(--primary) 16%, var(--card))",
                      color: "var(--primary)",
                    }}
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LoginButton() {
  const { login, isLoading, isAuthenticated } = useAuth();

  if (isLoading || isAuthenticated) return null;

  return (
    <button
      onClick={login}
      className="gel flex items-center gap-2 px-3.5 py-2.5 md:px-3 md:py-1.5 text-white font-display text-sm font-bold cursor-pointer hover-bounce focus-visible:ring-2 focus-visible:ring-[#5865F2] focus-visible:ring-offset-2 focus-visible:outline-none touch-manipulation"
      style={{ "--gel-color": "#5865F2" } as CSSProperties}
      aria-label="Login with Discord"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/10 border border-white/12 md:h-6 md:w-6">
        <DiscordIcon className="w-4 h-4 md:w-3.5 md:h-3.5" aria-hidden="true" />
      </span>
      <span className="md:hidden">Login</span>
      <span className="hidden lg:inline">Login</span>
    </button>
  );
}

// floating account chrome only - the page nav lives in ScrapbookNav
export function Navbar() {
  return (
    <>
      {/* mobile: top header, logo left + account controls right */}
      <nav
        className="md:hidden fixed top-0 left-0 right-0 z-50 pt-[calc(env(safe-area-inset-top)+0.5rem)] px-3 pointer-events-none"
        aria-label="Mobile header"
      >
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="pointer-events-auto flex items-center gap-2 p-2 rounded-2xl surface hover-bounce focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none touch-manipulation"
            aria-label="MogTome - Go to home page"
          >
            <LogoIcon hovered={false} />
          </Link>

          <div
            className="pointer-events-auto relative flex items-center gap-2 p-2 surface rounded-2xl"
            style={{
              border:
                "2px solid color-mix(in srgb, var(--primary) 30%, var(--card))",
              boxShadow:
                "0 0 0 3px var(--card), 4px 5px 0 0 color-mix(in srgb, var(--primary) 24%, transparent), 0 6px 16px -8px var(--shadow)",
            }}
          >
            {/* taped on with two washi strips */}
            <span
              className="absolute -top-2 left-2 w-10 h-4 -rotate-[10deg] rounded-[2px] opacity-85 z-10"
              style={{
                background:
                  "repeating-linear-gradient(45deg, color-mix(in srgb, var(--primary) 48%, transparent) 0 5px, color-mix(in srgb, var(--primary) 26%, transparent) 5px 10px)",
              }}
              aria-hidden="true"
            />
            <span
              className="absolute -top-2 right-2 w-10 h-4 rotate-[10deg] rounded-[2px] opacity-85 z-10"
              style={{
                background:
                  "repeating-linear-gradient(45deg, color-mix(in srgb, var(--secondary) 48%, transparent) 0 5px, color-mix(in srgb, var(--secondary) 26%, transparent) 5px 10px)",
              }}
              aria-hidden="true"
            />
            <LoginButton />
            <UserMenu />
          </div>
        </div>
      </nav>

      {/* desktop: top-right floating pill */}
      <header
        className="hidden md:block fixed top-0 right-0 z-50 pt-4 pb-4 pr-4 lg:pr-5 pointer-events-none"
        aria-label="User controls"
      >
        <div
          className="pointer-events-auto relative flex items-center gap-2 py-2.5 px-3 surface rounded-2xl"
          style={{
            border:
              "2px solid color-mix(in srgb, var(--primary) 30%, var(--card))",
            boxShadow:
              "0 0 0 3px var(--card), 4px 5px 0 0 color-mix(in srgb, var(--primary) 24%, transparent), 0 6px 16px -8px var(--shadow)",
          }}
        >
          {/* taped on with two washi strips */}
          <span
            className="absolute -top-2.5 left-2 w-12 h-5 -rotate-[10deg] rounded-[2px] opacity-85 z-10"
            style={{
              background:
                "repeating-linear-gradient(45deg, color-mix(in srgb, var(--primary) 48%, transparent) 0 6px, color-mix(in srgb, var(--primary) 26%, transparent) 6px 12px)",
            }}
            aria-hidden="true"
          />
          <span
            className="absolute -top-2.5 right-2 w-12 h-5 rotate-[10deg] rounded-[2px] opacity-85 z-10"
            style={{
              background:
                "repeating-linear-gradient(45deg, color-mix(in srgb, var(--secondary) 48%, transparent) 0 6px, color-mix(in srgb, var(--secondary) 26%, transparent) 6px 12px)",
            }}
            aria-hidden="true"
          />
          <LoginButton />
          <UserMenu />
        </div>
      </header>
    </>
  );
}
