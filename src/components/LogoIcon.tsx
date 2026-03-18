import { memo } from 'react';
import lilGuyMoogle from '../assets/moogles/lil guy moogle.webp';

/**
 * FloatingPom - Moogle pom-pom decoration for the logo.
 * Shared between Sidebar and Navbar.
 * 
 * PERFORMANCE: Memoized to prevent re-renders.
 */
export const FloatingPom = memo(function FloatingPom({ isHovered }: { isHovered: boolean }) {
  return (
    <div 
      className={`absolute -top-2 -right-2 z-10 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        ${isHovered ? '-translate-y-0.5 scale-115 rotate-[10deg]' : ''}`}
    >
      <div className="relative">
        {/* Pom glow */}
        <div className="absolute inset-0 rounded-full bg-[var(--accent)]/35 blur-sm animate-pulse" />
        {/* Main pom */}
        <div className="relative w-5 h-5 rounded-full bg-[var(--primary)] border-2 border-[var(--card)] shadow-lg shadow-[var(--primary)]/25">
          <div className="absolute top-0.5 left-1 w-2 h-1.5 rounded-full bg-white/40" />
        </div>
        {/* Tiny antenna line */}
        <div className="absolute -bottom-1 left-1/2 w-px h-2 bg-gradient-to-b from-[var(--text-subtle)] to-transparent -translate-x-1/2" />
      </div>
    </div>
  );
});

/**
 * LogoIcon - MogTome logo mark with moogle and floating pom.
 * Shared between Sidebar and Navbar.
 * 
 * PERFORMANCE: Memoized to prevent re-renders.
 */
export const LogoIcon = memo(function LogoIcon({ hovered = false }: { hovered?: boolean }) {
  return (
    <div className="relative flex-shrink-0">
      {/* Soft glow behind on hover */}
      <div 
        className={`absolute inset-0 rounded-2xl bg-[var(--accent)]/25 blur-xl transition-opacity duration-300
          ${hovered ? 'opacity-100' : 'opacity-0'}`}
      />
      
      {/* Main icon container */}
      <div 
        className={`relative w-11 h-11 rounded-2xl surface flex items-center justify-center
          border-[color:color-mix(in_srgb,var(--primary)_18%,var(--border))]
          transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${hovered ? 'scale-[1.06] rotate-[-2deg]' : ''}`}
      >
        {/* Inner white container */}
        <div className="w-9 h-9 rounded-xl bg-[color:color-mix(in_srgb,var(--bg)_70%,var(--card))] border border-white/40 flex items-center justify-center overflow-hidden">
          <img 
            src={lilGuyMoogle} 
            alt="MogTome" 
            className={`w-8 h-8 object-contain transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
              ${hovered ? 'scale-110 -translate-y-0.5' : ''}`}
          />
        </div>

        <div className="absolute inset-x-2 bottom-1 h-px bg-[color:color-mix(in_srgb,var(--primary)_22%,transparent)]" aria-hidden="true" />
      </div>
      
      {/* Floating pom-pom */}
      <FloatingPom isHovered={hovered} />
    </div>
  );
});
