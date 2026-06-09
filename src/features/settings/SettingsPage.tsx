import { type CSSProperties } from "react";
import { PageLayout, PageHeader } from "@/shared/ui/PageShell";
import {
  KawaiiHeart,
  KawaiiBow,
  KawaiiSparkle,
} from "@/shared/ui/kawaiiMotifs";
import {
  Sticker,
  BubbleSticker,
  MoogleSticker,
  Dot,
} from "@/shared/ui/stickers";
import { AppearanceSection } from "@/features/settings/AppearanceSection";
import { AccessibilitySection } from "@/features/settings/AccessibilitySection";
import { AccountSection } from "@/features/settings/AccountSection";

import gamingMoogle from "@/assets/moogles/gaming moogle.webp";
import musicMoogle from "@/assets/moogles/moogle playing music.webp";

export function Settings() {
  return (
    <PageLayout bleed moogles={{ primary: gamingMoogle, secondary: musicMoogle }}>
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

        <PageHeader
          opener="~ make it yours, kupo ~"
          title="Settings"
          stickers={
            <>
              <Sticker
                className="hidden sm:flex left-[5%] top-1/2 -translate-y-1/2 h-12 w-12 -rotate-[12deg]"
                color="var(--primary)"
              >
                <KawaiiBow className="w-7 h-7 text-white" />
              </Sticker>
              <Sticker
                className="hidden md:flex right-[5%] top-1/2 -translate-y-1/2 h-11 w-11 rotate-[12deg]"
                color="var(--accent)"
              >
                <KawaiiSparkle className="w-6 h-6 text-white" />
              </Sticker>
              <BubbleSticker className="hidden lg:block right-[15%] top-6 -rotate-[5deg]">
                make it yours!
              </BubbleSticker>
              {/* a little palette of swatch dots */}
              <Dot
                className="hidden md:block left-[16%] top-6 h-3 w-3"
                color="var(--primary)"
              />
              <Dot
                className="hidden md:block left-[18%] top-11 h-3 w-3"
                color="var(--secondary)"
              />
              <Dot
                className="hidden md:block left-[20%] top-16 h-3 w-3"
                color="var(--accent)"
              />
              <MoogleSticker
                src={gamingMoogle}
                ring="var(--secondary)"
                className="hidden lg:block left-[6%] bottom-3 h-14 w-14 rotate-[6deg]"
              />
            </>
          }
        />

        {/* single column on small screens; two columns on large screens. NB:
            CSS multi-column (columns-2) clips content that overflows a column
            box, which sheared off the cards' pushpins - so this uses grid, which
            doesn't clip. items-start keeps cards at their natural height. */}
        <div className="space-y-7 sm:space-y-9 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-7 lg:items-start">
          <AppearanceSection />
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
