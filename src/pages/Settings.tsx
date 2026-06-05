import { type CSSProperties } from "react";
import { PageLayout } from "@/components/PageShell";
import {
  KawaiiSparkle,
  KawaiiBow,
  KawaiiHeart,
} from "@/components/kawaiiMotifs";
import { ThemeSection } from "@/components/settings/ThemeSection";
import { SeasonalEventSection } from "@/components/settings/SeasonalEventSection";
import { AccessibilitySection } from "@/components/settings/AccessibilitySection";
import { AccountSection } from "@/components/settings/AccountSection";

import gamingMoogle from "@/assets/moogles/gaming moogle.webp";
import musicMoogle from "@/assets/moogles/moogle playing music.webp";
import lilGuyMoogle from "@/assets/moogles/lil guy moogle.webp";

export function Settings() {
  return (
    <PageLayout
      moogles={{ primary: gamingMoogle, secondary: musicMoogle }}
      maxWidth="max-w-2xl"
    >
      <div className="corkboard relative px-3.5 py-7 sm:px-6 sm:py-9 md:px-8 md:py-10">
        <span
          className="pushpin absolute top-3 left-3 sm:top-4 sm:left-4 z-20"
          aria-hidden="true"
        />
        <span
          className="pushpin absolute top-3 right-3 sm:top-4 sm:right-4 z-20"
          style={{ "--pin": "var(--secondary)" } as CSSProperties}
          aria-hidden="true"
        />
        <span
          className="pushpin absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20"
          style={{ "--pin": "var(--accent)" } as CSSProperties}
          aria-hidden="true"
        />
        <span
          className="pushpin absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20"
          style={{ "--pin": "var(--secondary)" } as CSSProperties}
          aria-hidden="true"
        />

        <img
          src={lilGuyMoogle}
          alt=""
          aria-hidden="true"
          className="hidden lg:block absolute -top-7 -right-4 w-20 rotate-[10deg] animate-[float-gentle_4s_ease-in-out_infinite] pointer-events-none select-none z-20"
        />

        <header className="relative w-fit mx-auto mb-7 sm:mb-9 text-center animate-[fadeSlideIn_0.4s_ease-out]">
          <span
            className="pushpin absolute -top-2 left-1/2 -translate-x-1/2 z-10"
            aria-hidden="true"
          />
          <div className="surface paper -rotate-1 px-8 sm:px-12 py-5 sm:py-6">
            <div
              className="flex items-center justify-center gap-1.5 mb-1.5"
              aria-hidden="true"
            >
              <KawaiiSparkle className="w-3.5 h-3.5 text-[var(--accent)]" />
              <KawaiiBow className="w-6 h-6 text-[var(--primary)]" />
              <KawaiiSparkle className="w-3.5 h-3.5 text-[var(--secondary)]" />
            </div>
            <p className="eyebrow-script text-lg sm:text-2xl text-[var(--secondary)]/90 mb-1">
              ~ make it yours, kupo ~
            </p>
            <h1 className="editorial-title text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[var(--text)]">
              <span className="text-highlight">Settings</span>
            </h1>
          </div>
        </header>

        <div className="space-y-7 sm:space-y-9">
          <ThemeSection />
          <SeasonalEventSection />
          <AccessibilitySection />
          <AccountSection />
        </div>

        <p className="flex items-center justify-center gap-1.5 text-center font-soft text-xs text-[var(--text-subtle)] mt-9">
          <KawaiiHeart className="w-3.5 h-3.5 text-[var(--primary)]" />
          Everything saves to your browser automatically, kupo~
        </p>
      </div>
    </PageLayout>
  );
}
