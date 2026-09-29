import { useEffect, useId, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { biographyApi } from "@/shared/api/biography";
import { membersApi } from "@/shared/api/members";
import type { BiographySubmission, StaffMember } from "@/shared/types";
import { DashboardIcon } from "./DashboardIcons";
import "./dashboard-submissions.css";

type Decision = "approve" | "reject";

interface ReviewRequest {
  submission: BiographySubmission;
  decision: Decision;
  author: string;
  trigger: HTMLButtonElement;
}

interface ReviewFeedback {
  kind: "success" | "error";
  message: string;
  submissionId: string;
  trigger: HTMLButtonElement;
}

function submissionAuthor(
  submission: BiographySubmission,
  staff?: StaffMember,
) {
  return staff?.name || `Discord ID: ${submission.submittedByDiscordId}`;
}

function SubmissionCard({
  submission,
  submitter,
  onReview,
  pendingReview,
  errorId,
}: {
  submission: BiographySubmission;
  submitter?: StaffMember;
  onReview: (request: ReviewRequest) => void;
  pendingReview?: ReviewRequest;
  errorId?: string;
}) {
  const titleId = useId();
  const author = submissionAuthor(submission, submitter);
  const date = new Date(submission.submittedAt);
  const validDate = Number.isFinite(date.getTime());
  const isCurrentReview =
    pendingReview?.submission.submissionId === submission.submissionId;
  const initials = submitter?.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => Array.from(part)[0])
    .join("");

  return (
    <article
      className="dash-bio-review"
      aria-labelledby={titleId}
      aria-describedby={errorId}
      aria-busy={isCurrentReview}
    >
      <header className="dash-bio-review-header">
        <span className="dash-bio-monogram" aria-hidden="true">
          {initials || <DashboardIcon name="people" size={21} />}
        </span>
        <div className="dash-bio-author">
          <h3 id={titleId}>{author}</h3>
          {submitter && <p>{submitter.freeCompanyRank}</p>}
        </div>
        <div className="dash-bio-date">
          <span>Submitted</span>
          {validDate ? (
            <time dateTime={date.toISOString()} title={date.toLocaleString()}>
              {date.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              <span>
                {date.toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </time>
          ) : (
            <span>Date unavailable</span>
          )}
        </div>
      </header>

      <div className="dash-bio-proposed">
        <p className="dash-bio-label">
          <DashboardIcon name="feather" size={16} aria-hidden="true" />
          Submitted biography
        </p>
        <p className="dash-bio-prose">{submission.biography}</p>
      </div>

      {submitter?.biography && (
        <details className="dash-bio-current">
          <summary>
            <DashboardIcon name="book" size={16} aria-hidden="true" />
            Compare with current biography
            <DashboardIcon
              name="chevron-down"
              className="dash-bio-disclosure"
              size={16}
              aria-hidden="true"
            />
          </summary>
          <p className="dash-bio-prose">{submitter.biography}</p>
        </details>
      )}

      <footer className="dash-bio-review-footer">
        <p>Approve to publish this biography.</p>
        <div className="dash-bio-actions">
          <button
            className="dash-bio-button dash-bio-approve"
            type="button"
            disabled={!!pendingReview}
            aria-label={`Approve biography for ${author}`}
            onClick={(event) =>
              onReview({
                submission,
                author,
                decision: "approve",
                trigger: event.currentTarget,
              })
            }
          >
            <DashboardIcon name="check" size={18} aria-hidden="true" />
            {isCurrentReview && pendingReview.decision === "approve"
              ? "Approving…"
              : "Approve biography"}
          </button>
          <button
            className="dash-bio-button dash-bio-reject"
            type="button"
            disabled={!!pendingReview}
            aria-label={`Reject biography for ${author}`}
            onClick={(event) =>
              onReview({
                submission,
                author,
                decision: "reject",
                trigger: event.currentTarget,
              })
            }
          >
            <DashboardIcon name="close" size={18} aria-hidden="true" />
            {isCurrentReview && pendingReview.decision === "reject"
              ? "Rejecting…"
              : "Reject biography"}
          </button>
        </div>
      </footer>
    </article>
  );
}

export function PendingSubmissions() {
  const queryClient = useQueryClient();
  const inputId = useId();
  const sortId = useId();
  const errorId = useId();
  const resultsId = useId();
  const searchRef = useRef<HTMLInputElement>(null);
  const feedbackRef = useRef<HTMLParagraphElement>(null);
  const reviewLock = useRef(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("oldest");
  const [feedback, setFeedback] = useState<ReviewFeedback | null>(null);

  const {
    data: submissions,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["biography-submissions"],
    queryFn: () => biographyApi.getPendingSubmissions(),
    staleTime: 1000 * 30,
  });

  const { data: staffData, isError: isStaffError } = useQuery({
    queryKey: ["staff"],
    queryFn: () => membersApi.getStaff(),
    staleTime: 1000 * 60 * 5,
  });

  const staffByDiscordId = new Map(
    (staffData?.staff || [])
      .filter((member) => member.discordId)
      .map((member) => [member.discordId!, member]),
  );
  const pendingSubmissions = (submissions || []).filter(
    (submission) => submission.status === "Pending",
  );
  const query = search.trim().toLocaleLowerCase();
  const visibleSubmissions = pendingSubmissions
    .filter((submission) => {
      const author = submissionAuthor(
        submission,
        staffByDiscordId.get(submission.submittedByDiscordId),
      );
      return `${author} ${submission.submittedByDiscordId} ${submission.biography}`
        .toLocaleLowerCase()
        .includes(query);
    })
    .sort((first, second) => {
      const firstDate = Date.parse(first.submittedAt);
      const secondDate = Date.parse(second.submittedAt);
      if (!Number.isFinite(firstDate))
        return Number.isFinite(secondDate) ? 1 : 0;
      if (!Number.isFinite(secondDate)) return -1;
      return sort === "oldest"
        ? firstDate - secondDate
        : secondDate - firstDate;
    });

  const reviewMutation = useMutation({
    mutationFn: ({ submission, decision }: ReviewRequest) =>
      decision === "approve"
        ? biographyApi.approveSubmission(submission.submissionId)
        : biographyApi.rejectSubmission(submission.submissionId),
    onSuccess: async (_, request) => {
      const { submission, decision, author, trigger } = request;
      // Finish an older refresh before removing the successfully reviewed item.
      await queryClient.cancelQueries({ queryKey: ["biography-submissions"] });
      queryClient.setQueryData<BiographySubmission[]>(
        ["biography-submissions"],
        (current) =>
          current?.filter(
            (item) => item.submissionId !== submission.submissionId,
          ),
      );
      setFeedback({
        kind: "success",
        message: `${author}'s biography ${decision === "approve" ? "approved" : "rejected"}.`,
        submissionId: submission.submissionId,
        trigger,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["biography-submissions"] }),
        queryClient.invalidateQueries({
          queryKey: ["user-submission", submission.submittedByDiscordId],
        }),
        ...(decision === "approve"
          ? [queryClient.invalidateQueries({ queryKey: ["staff"] })]
          : []),
      ]);
    },
    onError: (_, { submission, decision, author, trigger }) => {
      setFeedback({
        kind: "error",
        message: `Couldn't ${decision} ${author}'s biography. Try again.`,
        submissionId: submission.submissionId,
        trigger,
      });
    },
    onSettled: () => {
      reviewLock.current = false;
    },
  });

  useEffect(() => {
    if (
      feedback?.kind === "success" &&
      (document.activeElement === feedback.trigger ||
        document.activeElement === document.body)
    ) {
      feedbackRef.current?.focus({ preventScroll: true });
    }
  }, [feedback]);

  const handleReview = (request: ReviewRequest) => {
    if (reviewLock.current) return;
    reviewLock.current = true;
    setFeedback(null);
    reviewMutation.mutate(request);
  };
  const clearSearch = () => {
    setSearch("");
    searchRef.current?.focus();
  };

  return (
    <div className="dash-bio-workspace">
      <div className="dash-bio-intro">
        <p>Read each biography before approving or rejecting it.</p>
        <button
          className="dash-bio-button dash-bio-refresh"
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching || reviewMutation.isPending}
          aria-label="Refresh biography submissions"
        >
          <DashboardIcon name="refresh" size={17} aria-hidden="true" />
          {isFetching && !isLoading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <p
        className={`dash-bio-feedback${feedback ? ` dash-bio-feedback-${feedback.kind}` : ""}`}
        ref={feedbackRef}
        role={feedback?.kind === "error" ? "alert" : "status"}
        id={errorId}
        tabIndex={-1}
      >
        {feedback && (
          <>
            <DashboardIcon
              name={feedback.kind === "error" ? "alert" : "check"}
              size={18}
              aria-hidden="true"
            />
            <span>{feedback.message}</span>
          </>
        )}
      </p>

      {isError && (
        <div className="dash-bio-load-error" role="alert">
          <DashboardIcon name="alert" size={20} aria-hidden="true" />
          <p>
            {submissions
              ? "Couldn't refresh the reviews. You're still seeing the previous list."
              : "Couldn't load biography submissions."}{" "}
            Try refreshing.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="dash-bio-empty" role="status">
          <DashboardIcon name="book" size={32} aria-hidden="true" />
          <p>Checking the review tray…</p>
        </div>
      ) : submissions ? (
        <>
          {pendingSubmissions.length > 0 && (
            <div className="dash-bio-toolbar">
              <div className="dash-bio-search-field">
                <label htmlFor={inputId}>Find a biography</label>
                <div className="dash-bio-search">
                  <DashboardIcon name="search" size={18} aria-hidden="true" />
                  <input
                    ref={searchRef}
                    id={inputId}
                    type="search"
                    value={search}
                    aria-describedby={resultsId}
                    onChange={(event) => setSearch(event.target.value)}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Escape" &&
                        search &&
                        !event.nativeEvent.isComposing
                      ) {
                        event.preventDefault();
                        event.stopPropagation();
                        clearSearch();
                      }
                    }}
                    placeholder="Member name or biography…"
                    autoComplete="off"
                  />
                  {search && (
                    <button
                      type="button"
                      aria-label="Clear biography search"
                      onClick={clearSearch}
                    >
                      <DashboardIcon
                        name="close"
                        size={17}
                        aria-hidden="true"
                      />
                    </button>
                  )}
                </div>
              </div>
              <div className="dash-bio-sort">
                <label htmlFor={sortId}>Review order</label>
                <select
                  id={sortId}
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                >
                  <option value="oldest">Oldest first</option>
                  <option value="newest">Newest first</option>
                </select>
              </div>
            </div>
          )}

          {isStaffError && !staffData && pendingSubmissions.length > 0 && (
            <p className="dash-bio-staff-note">
              Member names couldn't load. Submissions show Discord IDs instead.
            </p>
          )}

          <p
            className="dash-bio-count"
            id={resultsId}
            role="status"
            aria-label="Biography results"
            aria-atomic="true"
          >
            {query && pendingSubmissions.length > 0
              ? `${visibleSubmissions.length} of ${pendingSubmissions.length} pending biographies`
              : `${pendingSubmissions.length} ${pendingSubmissions.length === 1 ? "biography" : "biographies"} waiting for review`}
          </p>

          {pendingSubmissions.length === 0 ? (
            <div className="dash-bio-empty">
              <DashboardIcon name="inbox" size={34} aria-hidden="true" />
              <h3>All caught up</h3>
              <p>No biographies are waiting for review.</p>
            </div>
          ) : visibleSubmissions.length === 0 ? (
            <div className="dash-bio-empty">
              <DashboardIcon name="search" size={30} aria-hidden="true" />
              <h3>No matching biographies</h3>
              <p>Try another name or a few words from the biography.</p>
              <button
                className="dash-bio-button"
                type="button"
                onClick={clearSearch}
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="dash-bio-reviews">
              {visibleSubmissions.map((submission) => (
                <SubmissionCard
                  key={submission.submissionId}
                  submission={submission}
                  submitter={staffByDiscordId.get(
                    submission.submittedByDiscordId,
                  )}
                  onReview={handleReview}
                  pendingReview={
                    reviewMutation.isPending
                      ? reviewMutation.variables
                      : undefined
                  }
                  errorId={
                    feedback?.kind === "error" &&
                    feedback.submissionId === submission.submissionId
                      ? errorId
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
