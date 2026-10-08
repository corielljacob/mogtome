import { QueryClient } from "@tanstack/react-query";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { membersApi } from "@/shared/api/members";
import { memberDirectoryQuery, staffQuery } from "@/shared/api/memberQueries";
import { preloadRoute, routeLoaders } from "./routePreload";

vi.mock("@/shared/api/members", () => ({
  membersApi: { getMembers: vi.fn(), getStaff: vi.fn() },
}));

let client: QueryClient;

beforeEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  for (const path of Object.keys(
    routeLoaders,
  ) as (keyof typeof routeLoaders)[]) {
    vi.spyOn(routeLoaders, path).mockResolvedValue({
      default: () => createElement("div"),
    });
  }
});

describe("navigation preloading", () => {
  it("shares the Members view's cache and deduplicates repeated link previews", async () => {
    const data = {
      items: [],
      totalCount: 0,
      page: 1,
      pageSize: 1000,
      totalPages: 0,
    };
    vi.mocked(membersApi.getMembers).mockResolvedValue(data);

    preloadRoute("/members", client);
    preloadRoute("/members", client);
    expect(await client.fetchQuery(memberDirectoryQuery)).toEqual(data);

    expect(membersApi.getMembers).toHaveBeenCalledExactlyOnceWith({
      pageSize: 1000,
    });
    expect(routeLoaders["/members"]).toHaveBeenCalled();
    expect(membersApi.getStaff).not.toHaveBeenCalled();
  });

  it("reuses prefetched staff when About opens", async () => {
    const data = { staff: [], totalCount: 0 };
    vi.mocked(membersApi.getStaff).mockResolvedValue(data);
    preloadRoute("/about", client);
    expect(await client.fetchQuery(staffQuery)).toEqual(data);
    preloadRoute("/about", client);

    expect(membersApi.getStaff).toHaveBeenCalledTimes(1);
    expect(membersApi.getMembers).not.toHaveBeenCalled();
  });

  it("warms private route code without requesting private data", () => {
    for (const path of ["/chronicle", "/profile", "/dashboard"] as const) {
      preloadRoute(path, client);
      expect(routeLoaders[path]).toHaveBeenCalledOnce();
    }
    expect(client.getQueryCache().getAll()).toHaveLength(0);
    expect(membersApi.getMembers).not.toHaveBeenCalled();
    expect(membersApi.getStaff).not.toHaveBeenCalled();
  });

  it("ignores unknown destinations and absorbs speculative import failures", async () => {
    vi.mocked(routeLoaders["/settings"]).mockRejectedValue(
      new Error("Offline"),
    );
    expect(() => preloadRoute("/unknown", client)).not.toThrow();
    expect(() => preloadRoute("/settings", client)).not.toThrow();
    await Promise.resolve();
    expect(routeLoaders["/settings"]).toHaveBeenCalledOnce();
    expect(client.getQueryCache().getAll()).toHaveLength(0);
  });
});
