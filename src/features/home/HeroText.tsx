import { type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { KawaiiStar } from "@/shared/ui/kawaiiMotifs";
import { useTheme } from "@/shared/contexts/ThemeContext";
import { THEME_META } from "@/shared/theme/themePalettes";
import { getTagline } from "@/features/home/homeData";

// brushed-gunmetal lettering for the Heavensward title - cool grey with just a
// faint blue lean (not white), like the silver logo on the dark sky.
const HW_SILVER =
  "linear-gradient(180deg, #b3bdc9 0%, #939eac 32%, #767f8d 50%, #a4aebb 62%, #828c9a 80%, #69727f 100%)";

// embossed-gold lettering for the Stormblood title (matches the gold logo)
const SB_GOLD =
  "linear-gradient(180deg, #fff8da 0%, #fde89c 26%, #f8dc83 48%, #fff2b8 60%, #f5da88 82%, #edcb6c 100%)";

const QUICK_LINKS = [
  { to: "/members", label: "Family", color: "var(--secondary)" },
  { to: "/chronicle", label: "Chronicle", color: "var(--accent)" },
  { to: "/about", label: "About", color: "#a886d6" },
];

export function HeroText() {
  const defaultTagline = getTagline();
  const { settings, isDarkMode } = useTheme();
  // themes can carry a display font (e.g. Heavensward -> Cinzel); when set, the
  // giant hero title takes it too, for a more dramatic themed home.
  const themeFont = THEME_META.find(
    (t) => t.id === settings.colorTheme,
  )?.displayFont;
  // metallic lettering for the dramatic dark themes - chrome for Heavensward,
  // embossed gold for Stormblood. Only on the dark skies (it would wash out on
  // the light backdrops, where the coloured title stays).
  const ct = settings.colorTheme;
  const metalGrad =
    isDarkMode && ct === "heavensward"
      ? HW_SILVER
      : isDarkMode && (ct === "stormblood" || ct === "shadowbringers")
        ? SB_GOLD
        : null;
  const metalStyle: CSSProperties | undefined = metalGrad
    ? {
        color: "transparent",
        backgroundImage: metalGrad,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        // override sticker-text's thick white outline. The gold themes glitch
        // under text-stroke + background-clip, so they drop the rim and lean on
        // the emboss shadow; only Heavensward's chrome keeps a thin steel rim.
        WebkitTextStroke:
          ct === "heavensward"
            ? "0.012em rgba(206,219,234,0.7)"
            : "0 transparent",
        textShadow:
          metalGrad === SB_GOLD
            ? "0 1px 0 rgba(90,55,10,0.5), 0 2px 5px rgba(0,0,0,0.45)"
            : "0 1px 3px rgba(0,0,0,0.45)",
      }
    : undefined;

  // these expansions match their all-caps logos - and caps dodge the lowercase
  // descender that clips under background-clip on the serif faces.
  const h1Style: CSSProperties = {};
  if (themeFont) h1Style.fontFamily = themeFont;
  if (ct === "stormblood" || ct === "shadowbringers")
    h1Style.textTransform = "uppercase";

  return (
    <div className="w-full lg:flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-20">
      <motion.div
        initial={{ opacity: 0, x: -40, rotate: -2 }}
        animate={{ opacity: 1, x: 0, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.4, duration: 1.2 }}
      >
        <p className="eyebrow-script text-2xl sm:text-3xl md:text-5xl text-[var(--secondary)] mb-2 md:mb-4 -rotate-3 ml-2 lg:ml-6 filter drop-shadow-md inline-flex items-center gap-2">
          Welcome to
          <KawaiiStar
            className="w-5 h-5 sm:w-7 sm:h-7 text-[var(--accent)] rotate-12"
            aria-hidden="true"
          />
        </p>
      </motion.div>

      <motion.h1
        className="font-title-latin font-black tracking-tighter leading-[0.8] mb-1 sm:mb-2"
        style={h1Style}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, staggerChildren: 0.1 }}
      >
        <span className="sticker-text block text-7xl sm:text-8xl md:text-[8rem] lg:text-[10rem] text-[var(--primary)] flex whitespace-nowrap">
          {Array.from("Mog").map((char, i) => (
            <motion.span
              key={`mog-${i}`}
              className="inline-block hover:text-[var(--primary)] transition-colors duration-200 cursor-default"
              whileHover={{
                y: -15,
                rotate: i % 2 === 0 ? -6 : 6,
                scale: 1.05,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 12 }}
            >
              {metalStyle ? (
                <span className="inline-block" style={metalStyle}>
                  {char}
                </span>
              ) : (
                char
              )}
            </motion.span>
          ))}
        </span>
        <span className="sticker-text block text-7xl sm:text-8xl md:text-[8rem] lg:text-[10rem] text-[var(--secondary)] ml-4 sm:ml-12 lg:ml-24 flex whitespace-nowrap">
          {Array.from("Tome").map((char, i) => (
            <motion.span
              key={`tome-${i}`}
              className="inline-block hover:text-[var(--secondary)] transition-colors duration-200 cursor-default"
              whileHover={{
                y: -15,
                rotate: i % 2 === 0 ? 6 : -6,
                scale: 1.05,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 12 }}
            >
              {metalStyle ? (
                <span className="inline-block" style={metalStyle}>
                  {char}
                </span>
              ) : (
                char
              )}
            </motion.span>
          ))}
        </span>
      </motion.h1>

      <motion.div
        className="flex flex-col items-center lg:items-start gap-3 mb-10 ml-4 sm:ml-12 lg:ml-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <p className="text-xl sm:text-2xl md:text-[1.75rem] text-[var(--text-subtle)] font-display italic tracking-wide">
          {defaultTagline.split("Kupo Life!").map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span className="text-[var(--primary)] font-bold">
                  Kupo Life!
                </span>
              )}
            </span>
          ))}
        </p>
      </motion.div>

      <motion.div
        className="relative hidden lg:block mt-9 ml-0 lg:ml-20"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {/* washi tape */}
        <span
          className="absolute -top-2.5 left-8 w-20 h-6 rotate-[-5deg] rounded-[2px] opacity-80 z-10"
          style={{
            background:
              "repeating-linear-gradient(45deg, color-mix(in srgb, var(--accent) 50%, transparent) 0 7px, color-mix(in srgb, var(--accent) 28%, transparent) 7px 14px)",
          }}
          aria-hidden="true"
        />
        <div className="surface inline-block -rotate-1 px-4 py-3">
          <p className="font-display font-bold text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
            <KawaiiStar
              className="w-3.5 h-3.5 text-[var(--accent)]"
              aria-hidden="true"
            />
            Take a peek, kupo
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {QUICK_LINKS.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="shrink-0 whitespace-nowrap px-3 py-1 rounded-full font-display font-bold text-sm hover-bounce"
                style={{
                  background: `color-mix(in srgb, ${c.color} 18%, var(--card))`,
                  color: c.color,
                }}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
