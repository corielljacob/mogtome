import { DashboardIcon } from "@/features/knights/DashboardIcons";
export function TriggerCard({
  onOpen,
  isLoading,
  isError,
  hasAnyUnmapped,
  charactersCount,
  totalMatches,
}: {
  onOpen: () => void;
  isLoading: boolean;
  isError: boolean;
  hasAnyUnmapped: boolean;
  charactersCount: number;
  totalMatches: number;
}) {
  return (
    <button
      type="button"
      className="dash-mapping-trigger"
      onClick={onOpen}
      aria-label="Open Character Mapping"
    >
      <DashboardIcon name="link" size={25} />
      <span>
        <strong>Character linking</strong>
        <span>Link characters to Discord accounts</span>
        <small>
          {isLoading
            ? "Loading accounts…"
            : isError
              ? "Couldn't load accounts. Open to try again."
              : !hasAnyUnmapped
                ? "All accounts linked"
                : `${charactersCount} characters · ${totalMatches} suggestions`}
        </small>
      </span>
      <DashboardIcon name="arrow-right" size={22} />
    </button>
  );
}
