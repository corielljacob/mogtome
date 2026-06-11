import {
  useState,
  useEffect,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useTheme } from "@/shared/contexts/ThemeContext";
import { useTabs } from "@/shared/nav/tabs";
import { KawaiiStar } from "@/shared/ui/kawaiiMotifs";
import {
  DEFAULT_KUPO_QUOTES,
  getTimeGreeting,
  getEventDaysLeft,
  eventCountdownLabel,
} from "@/features/home/homeData";

import welcomingMoogle from "@/assets/moogles/mooglef fly transparent.webp";

// little flavour line under each destination card
const CARD_SUB: Record<string, string> = {
  "/members": "Meet the crew",
  "/chronicle": "Our story so far",
  "/about": "Who we are",
  "/profile": "Your page",
  "/dashboard": "Knightly duties",
  "/settings": "Make it yours",
};

const cardBase =
  "group min-h-0 overflow-hidden rounded-3xl p-3.5 flex flex-col justify-between gap-2 active:scale-[0.97] transition-transform touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]";

function cardStyle(color: string): CSSProperties {
  return {
    background: `color-mix(in srgb, ${color} 7%, var(--card))`,
    border: `2px solid color-mix(in srgb, ${color} 22%, var(--card))`,
    boxShadow: "0 6px 16px -10px var(--shadow)",
  };
}

function CardBody({
  color,
  icon,
  label,
  sub,
}: {
  color: string;
  icon: ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <>
      <span
        className="flex items-center justify-center w-11 h-11 rounded-2xl shrink-0"
        style={{
          background: `color-mix(in srgb, ${color} 16%, var(--card))`,
          color,
        }}
      >
        {icon}
      </span>
      <span className="block">
        <span className="block font-display font-bold text-[var(--text)] leading-tight">
          {label}
        </span>
        <span className="block font-soft text-xs text-[var(--text-muted)] leading-snug">
          {sub}
        </span>
      </span>
    </>
  );
}

/**
 * Phones-only home: a cozy app dashboard sized to fit one screen (no scroll).
 * On home the bottom nav pill is hidden (ScrapbookNav), so this IS the nav - it
 * shows every destination as a card. The desktop hero lives in HomePage.
 */
export function MobileHome() {
  const { user } = useAuth();
  const { activeEvent, isEventThemeActive } = useTheme();
  const tabs = useTabs();
  const event = isEventThemeActive && activeEvent ? activeEvent : null;

  // rotating kupo greeting (taps on the moogle advance it too)
  const quotes = useMemo(
    () => (event ? event.kupoQuotes : DEFAULT_KUPO_QUOTES),
    [event],
  );
  const [quoteIndex, setQuoteIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setQuoteIndex((i) => (i + 1) % quotes.length),
      4500,
    );
    return () => clearInterval(id);
  }, [quotes]);
  const quote = quotes[quoteIndex % quotes.length];

  const timeGreeting = useMemo(() => getTimeGreeting(), []);
  const greeting = user
    ? `Welcome home, ${user.memberName.split(" ")[0]}!`
    : timeGreeting;

  // every destination except Home itself becomes a card
  const navTabs = tabs.filter((t) => t.path !== "/");
  // span the last card full-width on odd counts so the grid never leaves a gap.
  const lastSpansFull = navTabs.length % 2 === 1;

  const EventIcon = event?.icon;

  return (
    <div className="md:hidden flex-1 min-h-0 relative z-10 flex flex-col px-4 pt-[calc(env(safe-area-inset-top)+5rem)] pb-[calc(env(safe-area-inset-bottom)+1rem)] animate-[fadeIn_0.4s_ease-out]">
      {/* greeting: tappable moogle + rotating kupo line */}
      <header className="shrink-0 flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => setQuoteIndex((i) => (i + 1) % quotes.length)}
          className="shrink-0 cursor-pointer active:scale-95 transition-transform"
          aria-label="New kupo greeting"
        >
          <img
            src={welcomingMoogle}
            alt="A friendly mogtome moogle"
            className="w-[4.5rem] h-[4.5rem] object-contain drop-shadow-[0_8px_10px_rgba(0,0,0,0.18)] select-none"
            style={{ animation: "home-moogle-idle 5s ease-in-out infinite" }}
            loading="eager"
            fetchPriority="high"
          />
        </button>
        <div className="min-w-0 flex-1">
          <p className="eyebrow-script text-lg text-[var(--secondary)] leading-tight flex items-center gap-1.5">
            {greeting}
            <KawaiiStar
              className="w-4 h-4 text-[var(--accent)] rotate-12 shrink-0"
              aria-hidden="true"
            />
          </p>
          <p
            key={quote}
            className="font-accent font-bold text-[var(--primary)] leading-snug animate-[home-quote-in_0.28s_cubic-bezier(0.4,0,0.2,1)]"
            aria-live="polite"
            aria-atomic="true"
          >
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      </header>

      {/* event ribbon (only while a seasonal event is live) */}
      {event && EventIcon && (
        <div
          className="shrink-0 mb-4 flex items-center gap-2.5 rounded-2xl px-3 py-2"
          role="status"
          aria-label={`Now celebrating ${event.name}. ${eventCountdownLabel(getEventDaysLeft(event.dateRange))}.`}
          style={{
            background: "color-mix(in srgb, var(--primary) 12%, var(--card))",
            border:
              "2px solid color-mix(in srgb, var(--primary) 30%, var(--card))",
          }}
        >
          <span
            className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full"
            style={{
              background: "color-mix(in srgb, var(--primary) 18%, var(--card))",
              color: "var(--primary)",
            }}
          >
            <EventIcon className="w-4 h-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="eyebrow-script text-xs text-[var(--secondary)] leading-none">
              Now celebrating
            </p>
            <p className="font-display font-bold text-sm text-[var(--text)] leading-tight truncate">
              {event.name}
            </p>
          </div>
          <span className="shrink-0 font-accent text-xs font-bold text-[var(--primary)]">
            {eventCountdownLabel(getEventDaysLeft(event.dateRange))}
          </span>
        </div>
      )}

      {/* every destination as a card - this is the nav on home. Rows stretch to
          fill the screen (auto-rows-fr) so it always grows to use the space. */}
      <nav
        className="flex-1 min-h-0 grid grid-cols-2 auto-rows-fr gap-3"
        aria-label="Explore MogTome"
      >
        {navTabs.map((tab, i) => {
          const Icon = tab.icon;
          const spanFull = lastSpansFull && i === navTabs.length - 1;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`${cardBase}${spanFull ? " col-span-2" : ""}`}
              style={cardStyle(tab.color)}
            >
              <CardBody
                color={tab.color}
                icon={<Icon className="w-6 h-6" aria-hidden="true" />}
                label={tab.label}
                sub={CARD_SUB[tab.path] ?? ""}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
