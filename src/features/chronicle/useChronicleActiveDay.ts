import { useEffect, useState } from "react";
import { chronicleDayId, type DayGroup } from "./chronicleHelpers";

const READING_LINE_PX = 96;
const BOTTOM_TOLERANCE_PX = 2;
const BOTTOM_READING_ALLOWANCE_PX = 48;

/** Follow the reader's position without moving the page or changing read state. */
export function useChronicleActiveDay(groups: DayGroup[]): string | null {
  const firstKey = groups[0]?.key ?? null;
  const [activeKey, setActiveKey] = useState<string | null>(firstKey);

  useEffect(() => {
    if (groups.length === 0) return;
    let frame: number | null = null;

    const measure = () => {
      frame = null;
      const headings = groups.flatMap((group) => {
        const element = document.getElementById(chronicleDayId(group.key));
        return element
          ? [{ key: group.key, element, rect: element.getBoundingClientRect() }]
          : [];
      });
      let nextKey = groups[0].key;
      for (const { key, rect } of headings) {
        if (rect.top <= READING_LINE_PX) {
          nextKey = key;
        }
      }

      const scroller = document.scrollingElement ?? document.documentElement;
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const documentHeight = Math.max(
        scroller.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      );
      const scrollTop =
        window.scrollY || scroller.scrollTop || document.body.scrollTop;
      // A short final section may never reach the reading line. Do not treat a
      // non-scrolling document (or one still waiting for its feed) as the bottom.
      const atBottom =
        documentHeight > viewportHeight &&
        scrollTop + viewportHeight >= documentHeight - BOTTOM_TOLERANCE_PX;
      if (atBottom && headings.length > 0) {
        const visibleHeadings = headings.filter(
          ({ rect }) => rect.bottom > 0 && rect.top < viewportHeight,
        );
        // A day jump can be clamped before its heading reaches the reading
        // line. Preserve that visible focused target, including repeat jumps
        // that do not cause another scroll event.
        const focusedHeading = visibleHeadings.find(
          ({ element }) => element === document.activeElement,
        );
        const nearReadingLine = visibleHeadings.find(
          ({ rect }) =>
            rect.top <= READING_LINE_PX + BOTTOM_READING_ALLOWANCE_PX,
        );
        nextKey =
          focusedHeading?.key ??
          nearReadingLine?.key ??
          headings[headings.length - 1].key;
      }
      setActiveKey(nextKey);
    };

    const scheduleMeasure = () => {
      if (frame === null) frame = window.requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("resize", scheduleMeasure);
    document.addEventListener("focusin", scheduleMeasure);
    scheduleMeasure();

    return () => {
      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
      document.removeEventListener("focusin", scheduleMeasure);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [groups]);

  // Filters can remove the active day before the next animation frame runs.
  return groups.some((group) => group.key === activeKey) ? activeKey : firstKey;
}

export default useChronicleActiveDay;
