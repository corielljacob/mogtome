import { useEffect, useId, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { biographyApi } from "@/shared/api/biography";
import { AboutIcon } from "./AboutIcons";
import "./about-bio.css";

const MAX_BIO_LENGTH = 500;

export function StickyBioNote({
  bio,
  editable,
  memberName,
}: {
  bio?: string;
  rankHex: string;
  editable: boolean;
  tilt: number;
  memberName?: string;
}) {
  const queryClient = useQueryClient();
  const bioId = useId();
  const editorId = useId();
  const countId = useId();
  const errorId = useId();
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const returnFocusRef = useRef(false);
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState(bio ?? "");
  const [savedBio, setSavedBio] = useState<{
    source: string | undefined;
    value: string;
  } | null>(null);
  // Keep a successful edit visible while the staff query refreshes. New server data wins.
  const displayedBio =
    savedBio && savedBio.source === bio ? savedBio.value : (bio ?? "");
  const hasBio = displayedBio.trim().length > 0;
  const canExpand =
    displayedBio.length > 240 || displayedBio.split("\n").length > 5;
  const isEditing = editing && editable;
  const overLimit = draft.length > MAX_BIO_LENGTH;

  useEffect(() => {
    if (isEditing) textareaRef.current?.focus();
    else if (returnFocusRef.current) {
      editButtonRef.current?.focus();
      returnFocusRef.current = false;
    }
  }, [isEditing]);

  const mutation = useMutation({
    mutationFn: (value: string) => biographyApi.setBiography(value),
    onSuccess: (_result, value) => {
      setSavedBio({ source: bio, value });
      void queryClient.invalidateQueries({ queryKey: ["staff"] });
      setExpanded(false);
      returnFocusRef.current = true;
      setEditing(false);
    },
  });

  const beginEditing = () => {
    setDraft(displayedBio);
    mutation.reset();
    setEditing(true);
  };

  const cancelEditing = () => {
    setDraft(displayedBio);
    mutation.reset();
    returnFocusRef.current = true;
    setEditing(false);
  };

  return (
    <div className="about-bio-note">
      {isEditing ? (
        <form
          className="about-bio-editor"
          aria-label="Edit your bio"
          onSubmit={(event) => {
            event.preventDefault();
            if (!editable || mutation.isPending || overLimit) return;
            mutation.mutate(draft.trim());
          }}
        >
          <label htmlFor={editorId}>Your bio</label>
          <textarea
            ref={textareaRef}
            id={editorId}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={6}
            maxLength={MAX_BIO_LENGTH}
            placeholder="What do you get up to in FFXIV?"
            disabled={mutation.isPending}
            aria-describedby={`${countId}${mutation.isError ? ` ${errorId}` : ""}`}
            aria-invalid={overLimit || undefined}
          />
          <p className="about-bio-counter" id={countId}>
            {draft.length} / {MAX_BIO_LENGTH} characters
          </p>
          <div className="about-bio-actions">
            <button
              type="submit"
              className="about-bio-save"
              disabled={mutation.isPending || overLimit}
            >
              <AboutIcon name="check" size={17} />
              {mutation.isPending ? "Saving…" : "Save bio"}
            </button>
            <button
              type="button"
              onClick={cancelEditing}
              disabled={mutation.isPending}
            >
              <AboutIcon name="close" size={16} /> Cancel
            </button>
          </div>
          {mutation.isPending && (
            <p className="about-bio-status" role="status">
              Saving your bio…
            </p>
          )}
          {mutation.isError && (
            <p className="about-bio-error" id={errorId} role="alert">
              Couldn't save your bio. Your changes are still here. Try again.
            </p>
          )}
        </form>
      ) : (
        <>
          <div
            role="region"
            aria-label={memberName ? `${memberName}'s bio` : "Member bio"}
          >
            <p
              id={bioId}
              className={`about-bio-text${!hasBio ? " about-bio-empty" : ""}${canExpand && !expanded ? " is-collapsed" : ""}`}
            >
              {hasBio
                ? displayedBio
                : editable
                  ? "Add a few words about yourself."
                  : "No bio yet."}
            </p>
            {canExpand && (
              <button
                type="button"
                className="about-bio-expand"
                aria-expanded={expanded}
                aria-controls={bioId}
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded ? "Show less" : "Read full bio"}
                <AboutIcon name="chevron-down" size={16} />
              </button>
            )}
          </div>
          {editable && (
            <div className="about-bio-edit-row">
              <button
                ref={editButtonRef}
                type="button"
                className="about-bio-edit"
                onClick={beginEditing}
              >
                <AboutIcon name="edit" size={16} />
                {hasBio ? "Edit bio" : "Add bio"}
              </button>
              {mutation.isSuccess && (
                <p className="about-bio-status" role="status">
                  Bio saved.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
