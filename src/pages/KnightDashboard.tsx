/**
 * Knight Dashboard - Only accessible to users with knighthood
 * 
 * This dashboard is reserved for Moogle Knights and those with 
 * temporary knighthood permissions.
 */
export function KnightDashboard() {
  return (
    <div className="min-h-[100dvh] relative pt-[calc(4rem+env(safe-area-inset-top))] pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.06] via-[var(--bento-accent)]/[0.03] to-[var(--bento-secondary)]/[0.05] pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Dashboard content will go here */}
      </div>
    </div>
  );
}
