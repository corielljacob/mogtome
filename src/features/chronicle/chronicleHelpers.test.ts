import { describe, expect, it } from "vitest";
import type { ChronicleEvent } from "@/shared/types";
import { getEventKey, hasValidId } from "./chronicleHelpers";

const event: ChronicleEvent = {
  id: { timestamp: 0, creationTime: "1970-01-01T00:00:00Z" },
  createdAt: "2026-09-28T15:00:00Z",
  text: "Ada joined the FC.",
  type: "MemberJoined",
};

describe("Chronicle entry IDs", () => {
  it.each([
    "1970-01-01T00:00:00Z",
    "1970-01-01T00:00:00.000Z",
    "1970-01-01T00:00:00+00:00",
    "1969-12-31T16:00:00-08:00",
  ])("recognizes the epoch placeholder spelled %s", (creationTime) => {
    const liveEvent = { ...event, id: { timestamp: 0, creationTime } };

    expect(hasValidId(liveEvent)).toBe(false);
    expect(getEventKey(liveEvent, 0)).not.toBe(getEventKey(liveEvent, 1));
  });

  it("keeps a nonzero ID timestamp valid even with an epoch creation time", () => {
    const savedEvent = { ...event, id: { ...event.id, timestamp: 42 } };

    expect(hasValidId(savedEvent)).toBe(true);
    expect(getEventKey(savedEvent, 0)).toBe(getEventKey(savedEvent, 1));
  });

  it("keeps a real creation time valid when the numeric timestamp is zero", () => {
    const savedEvent = {
      ...event,
      id: { timestamp: 0, creationTime: "2026-09-28T15:00:00Z" },
    };

    expect(hasValidId(savedEvent)).toBe(true);
    expect(getEventKey(savedEvent, 0)).toBe(getEventKey(savedEvent, 1));
  });

  it("gives distinct live entries unique keys for a millisecond epoch placeholder", () => {
    const first = {
      ...event,
      id: { timestamp: 0, creationTime: "1970-01-01T00:00:00.000Z" },
    };
    const second = { ...first, text: "Bram joined the FC." };

    expect(getEventKey(first, 0)).not.toBe(getEventKey(second, 0));
  });
});
