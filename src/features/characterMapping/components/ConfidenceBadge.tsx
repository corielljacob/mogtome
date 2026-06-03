import { confidenceConfig, type MatchConfidence } from "../types";
import { Tag } from "../../../components/Tag";

interface ConfidenceBadgeProps {
  confidence: MatchConfidence;
}

// Per-confidence tag colors (green → orange as confidence drops).
const CONFIDENCE_COLOR: Record<MatchConfidence, string> = {
  exact: "#22c55e",
  high: "#10b981",
  medium: "#f59e0b",
  low: "#f97316",
};

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const cfg = confidenceConfig[confidence];
  return <Tag color={CONFIDENCE_COLOR[confidence]}>{cfg.label}</Tag>;
}
