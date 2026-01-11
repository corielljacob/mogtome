// Cute decorative moogle pom-pom element
interface MooglePomProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

export function MooglePom({ size = 'md', className = '', animate = true }: MooglePomProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`relative ${className}`}>
      {/* Antenna line */}
      <div className="absolute left-1/2 bottom-full w-0.5 h-4 bg-gradient-to-t from-moogle-brown-light to-moogle-pink -translate-x-1/2" />
      {/* Pom ball */}
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full
          bg-gradient-to-br from-moogle-pink to-moogle-pink-dark
          shadow-lg
          ${animate ? 'animate-bounce-slow' : ''}
        `}
        style={{
          boxShadow: '0 0 15px rgba(255, 183, 197, 0.6), inset 0 -2px 4px rgba(0,0,0,0.1)',
        }}
      />
    </div>
  );
}
