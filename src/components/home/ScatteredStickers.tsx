import {
  KawaiiStar,
  KawaiiHeart,
  KawaiiBow,
  KawaiiSparkle,
} from "@/components/kawaiiMotifs";

export function ScatteredStickers() {
  return (
    <div
      className="hidden lg:block absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    >
      <KawaiiStar className="absolute left-[47%] top-[14%] w-7 h-7 text-[var(--accent)] rotate-12" />
      <KawaiiHeart className="absolute left-[57%] top-[28%] w-6 h-6 text-[var(--primary)] -rotate-6" />
      <KawaiiBow className="absolute left-[44%] top-[55%] w-9 h-9 text-[var(--secondary)] rotate-6" />
      <KawaiiSparkle className="absolute left-[60%] top-[66%] w-6 h-6 text-[var(--accent)]" />
      <KawaiiStar className="absolute left-[40%] top-[80%] w-5 h-5 text-[var(--primary)] -rotate-12" />
      <KawaiiHeart className="absolute left-[63%] top-[12%] w-5 h-5 text-[var(--secondary)] rotate-12" />
      <KawaiiSparkle className="absolute left-[51%] top-[42%] w-5 h-5 text-[var(--primary)]" />
    </div>
  );
}
