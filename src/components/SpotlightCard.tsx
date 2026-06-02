import React from 'react';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function SpotlightCard({
  children,
  className = '',
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
