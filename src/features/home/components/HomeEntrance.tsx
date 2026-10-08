import { useEffect, useRef, useState } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { observeHomeAnimationVisibility } from "./homeAnimationVisibility";

type EntrancePhase = "pending" | "ready" | "static";

/** Paint the detailed room once before moving its outer layers into place. */
export function HomeEntrance({
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  const reducedMotion = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<EntrancePhase>(
    reducedMotion ? "static" : "pending",
  );

  useEffect(() => {
    if (root.current) return observeHomeAnimationVisibility(root.current);
  }, []);

  useEffect(() => {
    if (phase === "static" || (phase === "ready" && !reducedMotion)) return;
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      if (reducedMotion) setPhase("static");
      else {
        secondFrame = requestAnimationFrame(() => setPhase("ready"));
      }
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [phase, reducedMotion]);

  return (
    <div ref={root} {...props} data-entrance={reducedMotion ? "static" : phase}>
      {children}
    </div>
  );
}
