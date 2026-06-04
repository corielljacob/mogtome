import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type CSSProperties,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, ChevronDown } from "lucide-react";
import { biographyApi } from "../../api/biography";

export function StickyBioNote({
  bio,
  rankHex,
  editable,
  tilt,
}: {
  bio?: string;
  rankHex: string;
  editable: boolean;
  tilt: number;
}) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(bio ?? "");

  // track whether the note overflows (and isn't scrolled to the end) so we can
  // show a "scroll for more" hint on long bios.
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    canScroll: false,
    atBottom: true,
  });
  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const canScroll = el.scrollHeight - el.clientHeight > 4;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
    setScrollState((prev) =>
      prev.canScroll === canScroll && prev.atBottom === atBottom
        ? prev
        : { canScroll, atBottom },
    );
  }, []);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScroll();
    const ro = new ResizeObserver(updateScroll);
    ro.observe(el);
    let cancelled = false;
    void document.fonts?.ready?.then(() => {
      if (!cancelled) updateScroll();
    });
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [updateScroll, bio, editing]);

  const mutation = useMutation({
    mutationFn: (b: string) => biographyApi.setBiography(b),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      setEditing(false);
    },
  });

  // A warm Post-it, tinted a touch toward the rank colour. Fixed colours (not
  // theme tokens) so it reads as a physical sticky note in light + dark.
  const stickyBg = `color-mix(in srgb, ${rankHex} 13%, #fbf2d3)`;
  const stickyStyle: CSSProperties = {
    background: stickyBg,
    boxShadow:
      "2px 5px 13px -3px rgba(0, 0, 0, 0.30), inset 0 -14px 18px -14px rgba(90, 70, 25, 0.18)",
  };
  // iOS Safari won't touch-scroll an overflow container nested inside a
  // transform (the note's rotate), so opt this one back into momentum scrolling
  // and keep the gesture contained to the note.
  const scrollerStyle: CSSProperties = {
    ...stickyStyle,
    WebkitOverflowScrolling: "touch",
    touchAction: "pan-y",
    overscrollBehavior: "contain",
  };

  // Same overlap + tilt in both states so the note keeps its scrapbook spot,
  // tucked over the polaroid's edge. Fixed size keeps every note consistent;
  // a long bio scrolls inside it rather than stretching the card.
  const shellCls =
    "relative z-20 shrink-0 -ml-4 sm:-ml-5 mt-4 sm:mt-6 w-44 sm:w-56";
  const shellStyle: CSSProperties = { transform: `rotate(${tilt}deg)` };
  const pin = (
    <span
      className="pushpin absolute -top-2 left-1/2 -translate-x-1/2 z-10"
      style={{ "--pin": rankHex } as CSSProperties}
      aria-hidden="true"
    />
  );

  if (editing) {
    return (
      <div className={shellCls} style={shellStyle}>
        {pin}
        <div className="rounded-[3px] p-3.5" style={stickyStyle}>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={6}
            maxLength={500}
            autoFocus
            placeholder="Write your note, kupo~"
            className="w-full resize-none border-none bg-transparent p-0 font-accent text-lg leading-snug text-[#463c2e] placeholder:text-[#463c2e]/40 focus:outline-none"
          />
          <div className="mt-1 flex items-center gap-2">
            <button
              onClick={() => mutation.mutate(draft.trim())}
              disabled={mutation.isPending}
              className="gel hover-bounce px-3 py-1 font-display text-xs font-bold text-white disabled:opacity-50 cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none touch-manipulation"
            >
              {mutation.isPending ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => setEditing(false)}
              disabled={mutation.isPending}
              className="px-1.5 py-1 font-display text-xs font-bold text-[#463c2e]/70 hover:text-[#463c2e] cursor-pointer touch-manipulation"
            >
              Cancel
            </button>
          </div>
          {mutation.isError && (
            <p className="mt-1 font-soft text-[11px] text-[#a23a2a]">
              couldn't save, kupo
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={shellCls} style={shellStyle}>
      {pin}
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={updateScroll}
          className="h-48 sm:h-56 overflow-y-auto rounded-[3px] p-3.5 sm:p-4"
          style={scrollerStyle}
        >
          <p
            className={`font-accent text-[17px] sm:text-lg leading-snug whitespace-pre-line ${bio ? "text-[#463c2e]" : "text-[#463c2e]/55"}`}
          >
            {bio || "no note pinned yet, kupo~"}
          </p>
        </div>
        {scrollState.canScroll && !scrollState.atBottom && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 flex h-11 items-end justify-center rounded-b-[3px] pb-1.5"
            style={{
              background: `linear-gradient(to bottom, transparent, ${stickyBg} 78%)`,
            }}
            aria-hidden="true"
          >
            <ChevronDown className="w-4 h-4 text-[#463c2e]/55 motion-safe:animate-bounce" />
          </div>
        )}
      </div>
      {editable && (
        <button
          onClick={() => {
            setDraft(bio ?? "");
            setEditing(true);
          }}
          className="mt-2 ml-1 inline-flex items-center gap-1 text-xs font-display font-bold text-[var(--primary)] hover:underline cursor-pointer touch-manipulation"
        >
          <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
          {bio ? "edit my note" : "add my note"}
        </button>
      )}
    </div>
  );
}
