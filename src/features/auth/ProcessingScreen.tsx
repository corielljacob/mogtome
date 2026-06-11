import { Loader2 } from "lucide-react";

export function ProcessingScreen() {
  return (
    <div className="text-center py-4">
      <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/20 flex items-center justify-center animate-[spin_1.5s_linear_infinite]">
        <Loader2 className="w-7 h-7 text-[var(--primary)]" />
      </div>
      <h2 className="font-display text-xl font-bold text-[var(--text)] mb-2">
        Logging you in, kupo~!
      </h2>
      <p className="text-[var(--text-muted)] font-soft text-sm">
        Completing Discord authentication...
      </p>
    </div>
  );
}
