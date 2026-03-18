import React from 'react';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
  enableTilt?: boolean;
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor: _spotlightColor,
  spotlightSize: _spotlightSize,
  enableTilt: _enableTilt,
  ...props
}: SpotlightCardProps) {
  return (
    <div
      className={`group relative overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
