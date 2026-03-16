import { confidenceConfig, type MatchConfidence } from '../types';

interface ConfidenceBadgeProps {
  confidence: MatchConfidence;
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const cfg = confidenceConfig[confidence];
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-soft font-medium ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}
