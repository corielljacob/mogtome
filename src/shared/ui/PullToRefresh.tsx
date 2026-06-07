import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useHasTouch } from "@/shared/hooks/useMobile";

// px the finger must travel (after resistance) to fire a refresh
const TRIGGER = 72;
// visual ceiling so an over-eager pull doesn't drag the spinner to the moon
const MAX = 110;
// drag resistance - the sheet follows at half speed for a rubbery feel
const RESIST = 0.5;
// keep the spinner up at least this long so a cached refetch doesn't flash
const MIN_SPIN_MS = 650;
// where the spinner rests while the refresh is in flight
const REST = 52;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface PullToRefreshProps {
  /** what to run on pull. Defaults to refetching all active React Query data. */
  onRefresh?: () => Promise<unknown> | void;
  disabled?: boolean;
}

// Native-style pull-to-refresh for the app's shared scroll container. Renders
// nothing inline - it attaches touch listeners to #app-scroll and portals a
// small spinner badge that follows the pull, then spins while refreshing. Only
// engages on touch devices and only when the view is already scrolled to the
// top, so it never fights normal scrolling.
export function PullToRefresh({
  onRefresh,
  disabled = false,
}: PullToRefreshProps) {
  const hasTouch = useHasTouch();
  const queryClient = useQueryClient();
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [dragging, setDragging] = useState(false);

  const pullRef = useRef(0);
  const refreshingRef = useRef(false);
  const onRefreshRef = useRef(onRefresh);
  // Keep the latest onRefresh in a ref so the touch handlers (set up once in
  // the effect below) always call the current one without re-subscribing.
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  });

  const setPullBoth = useCallback((v: number) => {
    pullRef.current = v;
    setPull(v);
  }, []);

  const runRefresh = useCallback(async () => {
    const job = onRefreshRef.current
      ? onRefreshRef.current()
      : queryClient.refetchQueries({ type: "active" });
    await Promise.all([Promise.resolve(job), wait(MIN_SPIN_MS)]);
  }, [queryClient]);

  useEffect(() => {
    if (!hasTouch || disabled) return;

    // the document scrolls (body scroll), so read the window scroll position
    const scrollTop = () =>
      window.scrollY || document.documentElement.scrollTop || 0;

    let startY = 0;
    let tracking = false; // touch began at the very top
    let active = false; // currently driving a downward pull

    const reset = () => {
      tracking = false;
      active = false;
    };

    const onStart = (e: TouchEvent) => {
      if (refreshingRef.current || e.touches.length !== 1 || scrollTop() > 0) {
        reset();
        return;
      }
      startY = e.touches[0].clientY;
      tracking = true;
      active = false;
    };

    const onMove = (e: TouchEvent) => {
      if (!tracking || refreshingRef.current) return;
      const dy = e.touches[0].clientY - startY;
      // pulling up, or the view scrolled away from the top: bail out
      if (dy <= 0 || scrollTop() > 0) {
        if (active) {
          active = false;
          setDragging(false);
          setPullBoth(0);
        }
        return;
      }
      if (!active) {
        active = true;
        setDragging(true);
      }
      // own the gesture so the browser doesn't rubber-band / native-refresh
      if (e.cancelable) e.preventDefault();
      setPullBoth(Math.min(MAX, dy * RESIST));
    };

    const onEnd = () => {
      if (!tracking) return;
      const shouldFire = active && pullRef.current >= TRIGGER;
      reset();
      setDragging(false);

      if (shouldFire) {
        refreshingRef.current = true;
        setRefreshing(true);
        setPullBoth(REST);
        runRefresh().finally(() => {
          refreshingRef.current = false;
          setRefreshing(false);
          setPullBoth(0);
        });
      } else {
        setPullBoth(0);
      }
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", onEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, [hasTouch, disabled, runRefresh, setPullBoth]);

  if (!hasTouch) return null;

  const progress = Math.min(1, pull / TRIGGER);
  const visible = pull > 0 || refreshing;

  return createPortal(
    <div
      aria-hidden="true"
      className="md:hidden fixed left-1/2 top-[calc(env(safe-area-inset-top)+0.5rem)] z-[45] pointer-events-none"
      style={{
        transform: `translate(-50%, ${pull}px)`,
        opacity: visible ? (refreshing ? 1 : progress) : 0,
        transition: dragging
          ? "none"
          : "transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.25s ease",
      }}
    >
      <div className="surface grid place-items-center w-10 h-10 rounded-full">
        <RefreshCw
          className={`w-5 h-5 text-[var(--primary)] ${refreshing ? "animate-spin" : ""}`}
          style={
            refreshing
              ? undefined
              : { transform: `rotate(${progress * 270}deg)` }
          }
        />
      </div>
    </div>,
    document.body,
  );
}
