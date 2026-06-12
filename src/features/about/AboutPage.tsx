import { useMemo, type CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import { Quote } from "lucide-react";
import { membersApi } from "@/shared/api/members";
import {
  PageLayout,
  PageHeader,
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/shared/ui/PageShell";
import { ScrollToTopButton } from "@/shared/ui/ScrollToTopButton";
import { KawaiiStar, KawaiiHeart } from "@/shared/ui/kawaiiMotifs";
import { Tag } from "@/shared/ui/Tag";
import {
  Sticker,
  MoogleSticker,
  BubbleSticker,
  TapeStrip,
  Dot,
} from "@/shared/ui/stickers";
import { useAuth } from "@/shared/contexts/AuthContext";
import { FC_RANKS } from "@/shared/types";
import { StaffCard } from "@/features/about/StaffCard";

// rank -> sort index (same ordering as the Members page)
const RANK_ORDER = new Map<string, number>(FC_RANKS.map((r, i) => [r.name, i]));

import wizardMoogle from "@/assets/moogles/wizard moogle.webp";
import flyingMoogles from "@/assets/moogles/moogles flying.webp";
import moogleMail from "@/assets/moogles/moogle mail.webp";
import illustratedMoogle from "@/assets/moogles/illustrated moogle.webp";

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
      bleed
      moogles={{ primary: wizardMoogle, secondary: flyingMoogles }}
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

        <PageHeader
          opener="~ pull up a chair, kupo ~"
          title="Who We Are"
          stickers={
            <>
              <TapeStrip
                className="top-4 right-[7%] rotate-[14deg]"
                color="var(--accent)"
              />
              <Sticker
                className="hidden sm:flex left-[5%] top-1/2 -translate-y-1/2 h-12 w-12 -rotate-[12deg]"
                color="var(--secondary)"
              >
                <KawaiiStar className="w-6 h-6 text-white" />
              </Sticker>
              <MoogleSticker
                src={illustratedMoogle}
                ring="var(--primary)"
                className="hidden md:block right-[4%] top-1/2 -translate-y-1/2 h-16 w-16 rotate-[8deg]"
              />
              <BubbleSticker
                className="hidden lg:block left-[14%] bottom-5 rotate-[4deg]"
                color="var(--secondary)"
              >
                hello~
              </BubbleSticker>
              <Sticker
                className="hidden lg:flex left-[3%] bottom-4 h-10 w-10 rotate-[8deg]"
                color="var(--primary)"
              >
                <KawaiiHeart className="w-5 h-5 text-white" />
              </Sticker>
              <Dot
                className="hidden md:block right-[17%] top-6 h-2.5 w-2.5"
                color="var(--secondary)"
              />
            </>
          }
        />

        <section className="relative mb-10 sm:mb-14 max-w-3xl mx-auto">
          {/* confetti dots tying the note to the board */}
          <Dot
            className="hidden sm:block -left-2 top-14 h-2.5 w-2.5"
            color="var(--secondary)"
          />
          <Dot
            className="hidden sm:block -right-1 top-28 h-2 w-2"
            color="var(--accent)"
          />
          <Dot
            className="hidden sm:block left-8 -bottom-2 h-2 w-2"
            color="var(--primary)"
          />

          <div className="surface bg-none relative p-6 sm:p-9">
            {/* washi tape pinning the note to the board */}
            <TapeStrip className="-top-3 left-10 -rotate-[8deg]" />
            <TapeStrip
              className="-top-3 right-10 rotate-[8deg]"
              color="var(--accent)"
            />

            {/* moogle polaroid */}
            <div className="relative mx-auto mb-6 w-fit -rotate-2">
              <div className="surface p-2 pb-3 w-32 sm:w-36">
                <div className="aspect-square overflow-hidden rounded-lg bg-[var(--bg)]">
                  <img
                    src={illustratedMoogle}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <p className="font-accent font-bold text-center text-sm text-[var(--text)] mt-1.5">
                  just a moogle
                </p>
              </div>
            </div>

            <p className="eyebrow-script text-center text-xl sm:text-2xl text-[var(--secondary)] mb-3">
              ~ a little about us ~
            </p>

            <div className="space-y-4 text-[var(--text-muted)] font-soft text-base sm:text-lg leading-relaxed text-center max-w-2xl mx-auto">
              <p>
                Kupo Life is a cozy Free Company where, more than anything, it's
                a place to log in and not be alone, kupo.
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

            {/* scrapbook labels */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              <Tag color="var(--secondary)" dot>
                Zalera
              </Tag>
              <Tag color="var(--primary)" dot>
                Crystal Data Center
              </Tag>
              <Tag
                color="var(--accent)"
                icon={<KawaiiHeart className="w-3 h-3" aria-hidden="true" />}
              >
                cozy &amp; no pressure
              </Tag>
            </div>

            {/* sticky-note quote */}
            <div className="relative mx-auto mt-8 w-fit max-w-md rotate-[1deg]">
              <TapeStrip
                className="-top-2.5 left-1/2 -translate-x-1/2 -rotate-3"
                color="var(--secondary)"
              />
              <figure
                className="rounded-2xl border-2 px-5 py-4 text-center"
                style={{
                  background:
                    "color-mix(in srgb, var(--accent) 12%, var(--card))",
                  borderColor:
                    "color-mix(in srgb, var(--accent) 28%, transparent)",
                }}
              >
                <Quote
                  className="w-5 h-5 mx-auto mb-1 text-[var(--primary)]/40 rotate-180"
                  aria-hidden="true"
                />
                <figcaption className="font-accent text-2xl sm:text-3xl text-[var(--secondary)] leading-snug">
                  A warm corner of Eorzea to come back to, kupo.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

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

      <ScrollToTopButton />
    </PageLayout>
  );
}
