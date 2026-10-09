import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";
import { NookMoogle } from "./NookMoogle";

const MoogleArt = memo(NookMoogle);

/** A boop updates only the character and its greeting, not the whole room. */
export function NookMoogleInteraction({
  eventId,
  children,
}: {
  eventId: SeasonalEventId | null;
  children?: ReactNode;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [boops, setBoops] = useState(0);
  const [isBooping, setIsBooping] = useState(false);

  useEffect(() => {
    if (boops === 0) return;
    const timer = window.setTimeout(() => setIsBooping(false), 1800);
    return () => window.clearTimeout(timer);
  }, [boops]);

  useLayoutEffect(() => {
    if (boops === 0) return;
    // Restart just the reaction on repeated taps. Keep the character's sewn
    // artwork and the room's ambient clocks intact across every reaction.
    for (const animation of buttonRef.current?.getAnimations?.({
      subtree: true,
    }) ?? []) {
      if (
        "animationName" in animation &&
        String(animation.animationName).startsWith("moogle-model-boop-")
      ) {
        animation.currentTime = 0;
        animation.play();
      }
    }
  }, [boops]);

  return (
    <>
      <div className="nook-illustration-frame">
        {children}
        <button
          ref={buttonRef}
          className="nook-moogle"
          onClick={() => {
            setIsBooping(true);
            setBoops((count) => count + 1);
          }}
          aria-label="Boop the moogle"
        >
          <MoogleArt
            className={isBooping ? "is-booped" : undefined}
            booped={isBooping}
            eventId={eventId}
          />
        </button>
      </div>
      <p className="nook-moogle-note" role="status" aria-live="polite">
        {isBooping
          ? eventId === "all-saints-wake"
            ? "Boo, kupo!"
            : "kupo!"
          : ""}
      </p>
    </>
  );
}
