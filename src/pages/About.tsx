import { useMemo, type CSSProperties } from "react";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { Quote } from "lucide-react";
import { membersApi } from "@/api/members";
import {
  PageLayout,
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/components/PageShell";
import {
  KawaiiStar,
  KawaiiBow,
  KawaiiSparkle,
  KawaiiHeart,
} from "@/components/kawaiiMotifs";
import { useAuth } from "@/contexts/AuthContext";
import { FC_RANKS } from "@/types";
import { StaffCard } from "@/components/about/StaffCard";

// rank -> sort index (same ordering as the Members page)
const RANK_ORDER = new Map<string, number>(FC_RANKS.map((r, i) => [r.name, i]));

import wizardMoogle from "@/assets/moogles/wizard moogle.webp";
import flyingMoogles from "@/assets/moogles/moogles flying.webp";
import moogleMail from "@/assets/moogles/moogle mail.webp";
import illustratedMoogle from "@/assets/moogles/illustrated moogle.webp";
import lilGuyMoogle from "@/assets/moogles/lil guy moogle.webp";

export function About() {
  const { user, isAuthenticated } = useAuth();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["staff"],
    queryFn: () => membersApi.getStaff(),
    staleTime: 1000 * 60 * 5,
  });

  const currentUserName = isAuthenticated ? user?.memberName : undefined;
  // inline note editing only when the role can set its own biography (same gate
  // as the Profile editor).
  const canEditOwn = isAuthenticated && user?.hasKnighthood === true;

  const staff = useMemo(() => {
    const rawStaff = data?.staff ?? [];
    return [...rawStaff].sort((a, b) => {
      const rankDiff =
        (RANK_ORDER.get(a.freeCompanyRank) ?? 999) -
        (RANK_ORDER.get(b.freeCompanyRank) ?? 999);
      return rankDiff !== 0 ? rankDiff : a.name.localeCompare(b.name);
    });
  }, [data?.staff]);

  const leaderName = useMemo(
    () => staff.find((m) => m.freeCompanyRank === "Moogle Guardian")?.name,
    [staff],
  );

  const hasStaff = !isLoading && !isError && staff.length > 0;

  return (
    <PageLayout
      moogles={{ primary: wizardMoogle, secondary: flyingMoogles }}
      maxWidth="max-w-5xl"
    >
      <div className="corkboard relative px-3.5 py-7 sm:px-6 sm:py-9 md:px-9 md:py-11">
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
          <div className="surface paper -rotate-1 px-7 sm:px-12 py-5 sm:py-6">
            <div
              className="flex items-center justify-center gap-1.5 mb-1.5"
              aria-hidden="true"
            >
              <KawaiiSparkle className="w-3.5 h-3.5 text-[var(--accent)]" />
              <KawaiiBow className="w-6 h-6 text-[var(--primary)]" />
              <KawaiiSparkle className="w-3.5 h-3.5 text-[var(--secondary)]" />
            </div>
            <p className="eyebrow-script text-lg sm:text-2xl text-[var(--secondary)]/90 mb-1">
              ~ pull up a chair, kupo ~
            </p>
            <h1 className="editorial-title text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[var(--text)]">
              <span className="text-highlight">Who We Are</span>
            </h1>
          </div>
        </header>

        <motion.section
          className="relative mb-9 sm:mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span
            className="pushpin absolute -top-2 left-10 z-10"
            style={{ "--pin": "var(--primary)" } as CSSProperties}
            aria-hidden="true"
          />
          <span
            className="pushpin absolute -top-2 right-10 z-10"
            style={{ "--pin": "var(--accent)" } as CSSProperties}
            aria-hidden="true"
          />
          <div className="surface paper p-5 sm:p-8 text-center -rotate-[0.5deg]">
            <img
              src={illustratedMoogle}
              alt=""
              aria-hidden="true"
              className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-5 object-contain drop-shadow-md"
            />
            <div className="space-y-4 text-[var(--text-muted)] font-soft text-base sm:text-lg leading-relaxed">
              <p>
                Kupo Life is a cozy Free Company on{" "}
                <strong className="text-[var(--text)] font-semibold">
                  Zalera
                </strong>
                , over in the{" "}
                <strong className="text-[var(--text)] font-semibold">
                  Crystal
                </strong>{" "}
                data center. More than anything, it's a place to log in and not
                be alone, kupo.
              </p>
              <p>
                There's no quota to hit and no pressure to perform. Raid if you
                raid, craft if you craft, or park a retainer and just chat.
                Whatever you're into, odds are someone here is into it too.
              </p>
              <p>
                We do the occasional silly thing, screenshot competitions,
                treasure hunts, a giveaway here and there, and the Discord stays
                lively even when the servers are down. Mostly though, it's just
                home.
              </p>
            </div>
            <figure className="mt-7">
              <Quote
                className="w-6 h-6 mx-auto mb-2 text-[var(--primary)]/40 rotate-180"
                aria-hidden="true"
              />
              <p className="font-accent text-2xl sm:text-3xl text-[var(--secondary)] leading-snug">
                A warm corner of Eorzea to come back to, kupo.
              </p>
            </figure>
          </div>
        </motion.section>

        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div
            className="sticker px-3 py-1.5"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--primary) 14%, var(--card))",
              border:
                "2px solid color-mix(in srgb, var(--primary) 30%, var(--card))",
            }}
          >
            <KawaiiHeart className="w-4 h-4 text-[var(--primary)]" />
            <h2 className="font-display font-bold text-sm sm:text-base text-[var(--text)] leading-none">
              The folks who keep it cozy
            </h2>
            {staff.length > 0 && (
              <span
                className="text-xs font-display font-bold px-1.5 py-0.5 rounded-full leading-none"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--primary) 20%, var(--card))",
                  color: "var(--primary)",
                }}
              >
                {staff.length}
              </span>
            )}
          </div>
          <div
            className="flex-1 border-t-2 border-dashed border-[color:color-mix(in_srgb,var(--primary)_22%,transparent)]"
            aria-hidden="true"
          />
          <KawaiiStar className="w-4 h-4 text-[var(--accent)]" />
        </div>

        {isLoading ? (
          <div className="paper">
            <LoadingState message="Rounding everyone up, kupo..." />
          </div>
        ) : isError ? (
          <div className="paper">
            <ErrorState
              message="A moogle fell over, kupo..."
              onRetry={() => refetch()}
            />
          </div>
        ) : staff.length === 0 ? (
          <div className="paper">
            <EmptyState
              title="Nobody home yet"
              message="No one to show just yet, kupo~"
              imageSrc={moogleMail}
            />
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-12 sm:gap-x-10 sm:gap-y-14">
            {staff.map((member) => (
              <StaffCard
                key={member.characterId}
                member={member}
                isLeader={member.name === leaderName}
                isCurrentUser={currentUserName === member.name}
                isOwnEditable={currentUserName === member.name && canEditOwn}
              />
            ))}
          </div>
        )}

        {hasStaff && (
          <div className="text-center mt-12 sm:mt-14 pt-2">
            <p className="eyebrow-script text-2xl text-[var(--text-muted)] inline-flex items-center justify-center gap-2.5">
              <KawaiiHeart className="w-5 h-5 text-[var(--primary)]" />
              However long you've been here, we're glad you're part of it, kupo.
              <KawaiiHeart className="w-5 h-5 text-[var(--primary)]" />
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
