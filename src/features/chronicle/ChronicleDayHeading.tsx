import {
  chronicleDayId,
  formatChronicleDay,
  type DayGroup,
} from "./chronicleHelpers";

export function ChronicleDayHeading({ group }: { group: DayGroup }) {
  const date = new Date(group.items[0]?.event.createdAt ?? "");
  const validDate = !Number.isNaN(date.getTime());

  return (
    <header className="chronicle-day-heading">
      <span className="chronicle-date-tab" aria-hidden="true">
        <span>
          {validDate
            ? date.toLocaleDateString("en-US", { month: "short" })
            : "Date"}
        </span>
        <strong>
          {validDate ? date.getDate().toString().padStart(2, "0") : "—"}
        </strong>
      </span>
      <div className="chronicle-day-title">
        <h3 id={chronicleDayId(group.key)} tabIndex={-1}>
          {group.label}
        </h3>
        <span>{formatChronicleDay(group)}</span>
      </div>
      <span className="chronicle-day-count">
        {group.items.length} {group.items.length === 1 ? "entry" : "entries"}
      </span>
    </header>
  );
}
