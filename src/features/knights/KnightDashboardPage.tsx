import { useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useTheme } from "@/shared/contexts/ThemeContext";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { biographyApi } from "@/shared/api/biography";
import { useCharacterMapping } from "@/features/characterMapping/hooks/useCharacterMapping";
import { CharacterMapping } from "@/features/characterMapping/CharacterMapping";
import { NookRoomDecor } from "@/features/home/components/NookRoomDecor";
import { NookFairyLights } from "@/features/home/components/NookFairyLights";
import { PendingSubmissions } from "./PendingSubmissions";
import { DashboardIcon, type DashboardIconName } from "./DashboardIcons";
import mailMoogle from "@/assets/moogles/moogle mail.webp";
import "./dashboard-screen.css";

type Workspace = "biographies" | "links";
type MappingTab = "suggested" | "manual";

function DeskSummary({
  icon,
  label,
  count,
  detail,
  loading,
  error,
  action,
  onClick,
}: {
  icon: DashboardIconName;
  label: string;
  count: number;
  detail: string;
  loading: boolean;
  error: boolean;
  action: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="dashboard-summary"
      onClick={onClick}
      aria-label={`${label}: ${loading ? "loading" : error ? "unavailable" : count}. ${action}.`}
    >
      <span className="dashboard-summary-icon">
        <DashboardIcon name={icon} size={25} />
      </span>
      <span className="dashboard-summary-copy">
        <span className="dashboard-summary-label">{label}</span>
        <strong>
          {loading ? (
            <span className="dashboard-count-loading" aria-label="Loading" />
          ) : error ? (
            "—"
          ) : (
            count
          )}
        </strong>
        <span className="dashboard-summary-detail">
          {loading
            ? "Checking the desk…"
            : error
              ? "Couldn’t load · open to retry"
              : detail}
        </span>
      </span>
      <DashboardIcon
        name="arrow-right"
        className="dashboard-summary-arrow"
        size={19}
      />
    </button>
  );
}

export function KnightDashboard() {
  const { user } = useAuth();
  const { isDarkMode, activeEvent, isEventThemeActive } = useTheme();
  const reducedMotion = useReducedMotion();
  const [workspace, setWorkspace] = useState<Workspace>("biographies");
  const [mappingTab, setMappingTab] = useState<MappingTab>("suggested");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const {
    data: submissions,
    isLoading: loadingBios,
    isError: errorBios,
  } = useQuery({
    queryKey: ["biography-submissions"],
    queryFn: () => biographyApi.getPendingSubmissions(),
    staleTime: 1000 * 30,
  });
  // One model keeps summary counts, skipped suggestions, and linked rows in sync.
  const mapping = useCharacterMapping();
  const pendingCount =
    submissions?.filter((submission) => submission.status === "Pending")
      .length ?? 0;
  const characterCount = mapping.allCharacters.length;
  const discordCount = mapping.allDiscordUsers.length;
  const allClear =
    !loadingBios &&
    !errorBios &&
    !mapping.isLoading &&
    !mapping.isError &&
    pendingCount === 0 &&
    characterCount === 0 &&
    discordCount === 0;
  const firstName = user?.memberName?.split(" ")[0] || "friend";

  const openWorkspace = (next: Workspace, nextMappingTab?: MappingTab) => {
    setWorkspace(next);
    if (nextMappingTab) setMappingTab(nextMappingTab);
    requestAnimationFrame(() => {
      const panel = document.getElementById(`dashboard-panel-${next}`);
      panel?.focus({ preventScroll: true });
      panel?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  };

  const onTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? 1 : 1 - index;
    setWorkspace(next === 0 ? "biographies" : "links");
    tabs.current[next]?.focus();
  };

  return (
    <div className="dashboard-screen" data-mode={isDarkMode ? "dark" : "light"}>
      <NookRoomDecor isDark={isDarkMode} />
      <div className="dashboard-content">
        <NookFairyLights
          eventId={isEventThemeActive ? (activeEvent?.id ?? null) : null}
        />
        <header className="dashboard-masthead">
          <div>
            <p className="dashboard-eyebrow">
              <DashboardIcon name="shield" size={15} /> Kupo Life · Member care
            </p>
            <h1>
              Knight dashboard <DashboardIcon name="leaf" size={26} />
            </h1>
            <p>Welcome back, {firstName}. Here’s what needs a hand.</p>
          </div>
          <Link className="dashboard-home-link" to="/">
            <DashboardIcon name="arrow-left" size={16} /> Back home
          </Link>
        </header>

        <section
          className="dashboard-overview"
          aria-labelledby="dashboard-overview-title"
        >
          <div className="dashboard-section-heading">
            <h2 id="dashboard-overview-title">On the desk</h2>
            <span>Choose a task to get started</span>
          </div>
          <div
            className="dashboard-summary-grid"
            aria-live="polite"
            aria-atomic="true"
          >
            <DeskSummary
              icon="book"
              label="Biographies"
              count={pendingCount}
              detail={
                pendingCount === 1
                  ? "biography awaiting review"
                  : "biographies awaiting review"
              }
              loading={loadingBios}
              error={errorBios}
              action="Open biography reviews"
              onClick={() => openWorkspace("biographies")}
            />
            <DeskSummary
              icon="people"
              label="Characters to link"
              count={characterCount}
              detail={`${discordCount} Discord ${discordCount === 1 ? "account" : "accounts"} also unlinked`}
              loading={mapping.isLoading}
              error={mapping.isError}
              action="Choose a character and Discord account"
              onClick={() => openWorkspace("links", "manual")}
            />
            <DeskSummary
              icon="sparkles"
              label="Suggested links"
              count={mapping.totalMatches}
              detail="Possible pairs from the unlinked accounts"
              loading={mapping.isLoading}
              error={mapping.isError}
              action="Review suggested links"
              onClick={() => openWorkspace("links", "suggested")}
            />
          </div>
          {allClear && (
            <p className="dashboard-all-clear" role="status">
              <DashboardIcon name="check" size={18} />
              <span>
                <strong>All caught up, kupo.</strong> No biographies or account
                links need review.
              </span>
            </p>
          )}
        </section>

        <div className="dashboard-desk-layout">
          <section
            className="dashboard-workspace"
            aria-label="Member care workspace"
          >
            <div
              className="dashboard-tabs"
              role="tablist"
              aria-label="Dashboard tools"
            >
              {(
                [
                  {
                    id: "biographies",
                    label: "Biography reviews",
                    icon: "book",
                  },
                  { id: "links", label: "Character links", icon: "link" },
                ] as const
              ).map((tab, index) => (
                <button
                  key={tab.id}
                  ref={(node) => {
                    tabs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`dashboard-tab-${tab.id}`}
                  aria-controls={`dashboard-panel-${tab.id}`}
                  aria-selected={workspace === tab.id}
                  tabIndex={workspace === tab.id ? 0 : -1}
                  onClick={() => setWorkspace(tab.id)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                >
                  <DashboardIcon name={tab.icon} size={19} />
                  <span>{tab.label}</span>
                  {tab.id === "biographies" &&
                    !loadingBios &&
                    !errorBios &&
                    pendingCount > 0 && (
                      <span className="dashboard-tab-count">
                        {pendingCount}
                      </span>
                    )}
                </button>
              ))}
            </div>
            <div
              id="dashboard-panel-biographies"
              className="dashboard-panel"
              role="tabpanel"
              aria-labelledby="dashboard-tab-biographies"
              hidden={workspace !== "biographies"}
              tabIndex={0}
            >
              <header className="dashboard-panel-heading">
                <p className="dashboard-paper-eyebrow">The review tray</p>
                <h2>Member stories, ready to share.</h2>
              </header>
              <PendingSubmissions />
            </div>
            <div
              id="dashboard-panel-links"
              className="dashboard-panel"
              role="tabpanel"
              aria-labelledby="dashboard-tab-links"
              hidden={workspace !== "links"}
              tabIndex={0}
            >
              <header className="dashboard-panel-heading">
                <p className="dashboard-paper-eyebrow">Put a name to a face</p>
                <h2>Link member accounts.</h2>
                <p>
                  Match an in-game character with the person behind their
                  Discord account.
                </p>
              </header>
              <CharacterMapping
                embedded
                mapping={mapping}
                tab={mappingTab}
                onTabChange={setMappingTab}
              />
            </div>
          </section>

          <aside className="dashboard-aside" aria-label="Helpful notes">
            <section className="dashboard-note">
              <span className="dashboard-washi" aria-hidden="true" />
              <DashboardIcon name="feather" size={27} />
              <h2>
                {workspace === "biographies"
                  ? "Before you publish"
                  : "Before you link"}
              </h2>
              {workspace === "biographies" ? (
                <>
                  <p>
                    Keep each member’s own voice. Approving publishes their
                    words as written.
                  </p>
                  <p>
                    Not sure about a submission? Leave it in the tray and check
                    in with the member.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    A similar name is a starting point. Make sure the character
                    and Discord account belong to the same person.
                  </p>
                  <p>
                    Skip a suggestion if you’re unsure, or choose the pair by
                    hand.
                  </p>
                </>
              )}
              <span className="dashboard-note-signoff">
                a little care goes a long way
              </span>
            </section>
            <nav
              className="dashboard-quick-links"
              aria-label="Community shortcuts"
            >
              <Link to="/members">
                <DashboardIcon name="people" size={20} />
                <span>
                  Members<small>Find a member</small>
                </span>
                <DashboardIcon name="arrow-right" size={16} />
              </Link>
              <Link to="/about">
                <DashboardIcon name="leaf" size={20} />
                <span>
                  Meet the crew<small>Faces around the FC</small>
                </span>
                <DashboardIcon name="arrow-right" size={16} />
              </Link>
            </nav>
            <figure className="dashboard-moogle-note">
              <img src={mailMoogle} alt="" aria-hidden="true" />
              <figcaption>Thanks for lending a hand.</figcaption>
            </figure>
          </aside>
        </div>
        <footer className="dashboard-footer">
          <DashboardIcon name="leaf" size={16} />
          <span>For the FC, one little task at a time.</span>
        </footer>
      </div>
    </div>
  );
}
