export function CardShine({
  delay = 0,
  intensity = "normal",
}: {
  delay?: number;
  intensity?: "subtle" | "normal" | "bright";
}) {
  const opacityMap = { subtle: 0.2, normal: 0.4, bright: 0.6 };
  const opacity = opacityMap[intensity];

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg animate-[fadeIn_0.3s_ease-out_both]"
      style={{ animationDelay: `${delay}s` }}
    >
      <div
        className="absolute inset-y-0 w-[250%] -left-[150%] animate-[shimmer_1s_cubic-bezier(0.25,0.46,0.45,0.94)_both]"
        style={{
          background: `linear-gradient(
            105deg,
            transparent 0%,
            transparent 35%,
            rgba(255,255,255,${opacity * 0.3}) 42%,
            rgba(255,255,255,${opacity}) 50%,
            rgba(255,255,255,${opacity * 0.3}) 58%,
            transparent 65%,
            transparent 100%
          )`,
          animationDelay: `${delay}s`,
        }}
      />
      <div
        className="absolute inset-y-0 w-[200%] -left-full animate-[shimmer_0.9s_cubic-bezier(0.25,0.46,0.45,0.94)_both]"
        style={{
          background: `linear-gradient(
            95deg,
            transparent 0%,
            transparent 40%,
            rgba(255,255,255,${opacity * 0.15}) 48%,
            rgba(255,255,255,${opacity * 0.25}) 52%,
            rgba(255,255,255,${opacity * 0.15}) 56%,
            transparent 64%,
            transparent 100%
          )`,
          animationDelay: `${delay + 0.15}s`,
        }}
      />
    </div>
  );
}
