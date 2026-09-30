import type { MatchConfidence } from "../types";
const labels: Record<MatchConfidence, string> = {
  exact: "Exact name match",
  high: "Strong suggestion",
  medium: "Possible match",
  low: "Check carefully",
};
export function ConfidenceBadge({
  confidence,
}: {
  confidence: MatchConfidence;
}) {
  return (
    <span className="dash-mapping-confidence" data-confidence={confidence}>
      {labels[confidence]}
    </span>
  );
}
