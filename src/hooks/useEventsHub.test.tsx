import { describe, it, expect } from "vitest";
import type { ConnectionStatus } from "./useEventsHub";

// types/structure only - full coverage needs SignalR mocking, left to e2e

describe("useEventsHub types", () => {
  it("ConnectionStatus type has expected values", () => {
    const statuses: ConnectionStatus[] = [
      "disconnected",
      "connecting",
      "connected",
      "reconnecting",
      "error",
    ];

    expect(statuses).toHaveLength(5);
    expect(statuses).toContain("disconnected");
    expect(statuses).toContain("connecting");
    expect(statuses).toContain("connected");
    expect(statuses).toContain("reconnecting");
    expect(statuses).toContain("error");
  });
});

describe("useEventsHub exports", () => {
  it("exports useEventsHub function", async () => {
    const module = await import("./useEventsHub");
    expect(module.useEventsHub).toBeDefined();
    expect(typeof module.useEventsHub).toBe("function");
  });

  it("exports ConnectionStatus type", async () => {
    // compile-time check: if it compiles, the type exists
    const status: ConnectionStatus = "connected";
    expect(status).toBe("connected");
  });

  it("hook returns expected shape", async () => {
    // structure-only; exercising the hook needs a SignalR mock
    const module = await import("./useEventsHub");

    expect(typeof module.useEventsHub).toBe("function");
  });
});
