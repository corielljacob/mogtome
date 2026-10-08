import { queryOptions } from "@tanstack/react-query";
import { membersApi } from "./members";

// Navigation prefetch and the views must share keys, parameters, and freshness.
export const memberDirectoryQuery = queryOptions({
  queryKey: ["members-all"],
  queryFn: () => membersApi.getMembers({ pageSize: 1000 }),
  staleTime: 1000 * 60 * 5,
});

export const staffQuery = queryOptions({
  queryKey: ["staff"],
  queryFn: () => membersApi.getStaff(),
  staleTime: 1000 * 60 * 5,
});
