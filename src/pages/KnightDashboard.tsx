import type { CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  FileText,
  Link2,
  Sparkles,
  Lightbulb,
  Loader2,
  Inbox,
} from "lucide-react";

import { PageLayout, PageHeader, SectionLabel } from "../components/PageShell";
import { Tag } from "../components/Tag";
import { PendingSubmissions } from "../components/PendingSubmissions";
import { CharacterMapping } from "../features/characterMapping/CharacterMapping";
import { useAuth } from "../contexts/AuthContext";
import { useCharacterMapping } from "../features/characterMapping/hooks/useCharacterMapping";
import { biographyApi } from "../api/biography";

function CountBadge({ n }: { n: number }) {
  return <Tag color="var(--primary)">{n}</Tag>;
}

interface StatTileProps {
  icon: React.ReactNode;
  count: number;
  label: string;
  hint: string;
  targetId: string;
  isLoading: boolean;
  delay: number;
}

function StatTile({
  icon,
  count,
  label,
  hint,
  targetId,
  isLoading,
  delay,
}: StatTileProps) {
  const isClear = !isLoading && count === 0;

  const handleClick = () => {
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="surface hover-lift p-4 sm:p-5 flex items-center gap-4 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
      aria-label={`${count} ${label} - ${hint}. Jump to section.`}
    >
      <span className="icon-badge w-11 h-11 shrink-0 text-[var(--primary)]">
        {icon}
      </span>
      <span className="min-w-0">
        {isLoading ? (
          <Loader2
            className="w-6 h-6 text-[var(--text-subtle)] animate-spin"
            aria-hidden="true"
          />
        ) : (
          <span
            className={`font-number text-3xl font-bold leading-none ${isClear ? "text-[var(--text-subtle)]" : "text-[var(--text)]"}`}
          >
            {count}
          </span>
        )}
        <span className="block font-soft font-semibold text-sm text-[var(--text)] mt-1.5">
          {label}
        </span>
        <span className="block text-xs text-[var(--text-muted)]">
          {isClear ? "all clear, kupo!" : hint}
        </span>
      </span>
    </motion.button>
  );
}

export function KnightDashboard() {
  const { user } = useAuth();
  const firstName = user?.memberName?.split(" ")[0] ?? "Knight";

  // shares the ['biography-submissions'] cache with <PendingSubmissions />, so
  // no extra request.
  const {
    data: pendingBios,
    isLoading: isLoadingBios,
    isError: isErrorBios,
  } = useQuery({
    queryKey: ["biography-submissions"],
    queryFn: () => biographyApi.getPendingSubmissions(),
    staleTime: 1000 * 30,
  });
  const pendingCount = pendingBios?.length ?? 0;

  // shares cache with the <CharacterMapping /> tool
  const {
    allCharacters,
    totalMatches,
    isLoading: isLoadingMapping,
    isError: isErrorMapping,
  } = useCharacterMapping();
  const unmappedCount = allCharacters.length;
  const autoMatchCount = totalMatches;

  const hasError = isErrorBios || isErrorMapping;
  const isLoading = isLoadingBios || isLoadingMapping;
  const allClear =
    !isLoading &&
    !hasError &&
    pendingCount === 0 &&
    unmappedCount === 0 &&
    autoMatchCount === 0;

  return (
    <PageLayout maxWidth="max-w-4xl">
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
          opener="~ Tend to the realm ~"
          title="Knight Dashboard"
          subtitle={`Welcome back, ${firstName}`}
        />

        <section className="mb-12">
          <SectionLabel
            label="Needs Attention"
            icon={<Inbox className="w-4 h-4" aria-hidden="true" />}
          />

          {allClear ? (
            <div className="surface p-6 sm:p-8 text-center">
              <p className="font-accent text-2xl sm:text-3xl text-[var(--primary)]">
                All caught up, kupo! ✦
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Nothing needs a knight&apos;s attention right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <StatTile
                icon={<FileText className="w-5 h-5" aria-hidden="true" />}
                count={pendingCount}
                label="Biographies"
                hint="awaiting review"
                targetId="submissions"
                isLoading={isLoadingBios}
                delay={0.05}
              />
              <StatTile
                icon={<Link2 className="w-5 h-5" aria-hidden="true" />}
                count={unmappedCount}
                label="Characters"
                hint="left to link"
                targetId="mapping"
                isLoading={isLoadingMapping}
                delay={0.1}
              />
              <StatTile
                icon={<Sparkles className="w-5 h-5" aria-hidden="true" />}
                count={autoMatchCount}
                label="Auto-matches"
                hint="ready to confirm"
                targetId="mapping"
                isLoading={isLoadingMapping}
                delay={0.15}
              />
            </div>
          )}
        </section>

        <section id="submissions" className="mb-12 scroll-mt-24">
          <SectionLabel
            label="Biography Submissions"
            icon={<FileText className="w-4 h-4" aria-hidden="true" />}
            badge={
              pendingCount > 0 ? <CountBadge n={pendingCount} /> : undefined
            }
          />
          <PendingSubmissions />
        </section>

        <section id="mapping" className="mb-12 scroll-mt-24">
          <SectionLabel
            label="Character Mapping"
            icon={<Link2 className="w-4 h-4" aria-hidden="true" />}
            badge={
              unmappedCount > 0 ? <CountBadge n={unmappedCount} /> : undefined
            }
          />
          <CharacterMapping />
        </section>

        <div className="text-center pb-2">
          <p className="font-accent text-lg text-[var(--text-muted)] inline-flex items-center gap-2">
            <Lightbulb
              className="w-4 h-4 text-[var(--accent)]"
              aria-hidden="true"
            />
            Have an idea for the dashboard? Ping{" "}
            <span className="text-[var(--primary)] font-semibold">Plane</span>,
            kupo~
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
