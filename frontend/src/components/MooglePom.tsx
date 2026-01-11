interface MooglePomProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function MooglePom({ size = 'md', className = '' }: MooglePomProps) {
  const sizeConfig = {
    sm: { pom: 'w-3 h-3', stem: 'h-3 w-0.5' },
    md: { pom: 'w-5 h-5', stem: 'h-4 w-0.5' },
    lg: { pom: 'w-8 h-8', stem: 'h-6 w-1' },
    xl: { pom: 'w-12 h-12', stem: 'h-8 w-1' },
  };

  const { pom, stem } = sizeConfig[size];

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      <div className={`${pom} rounded-full bg-pink-400 shadow`} />
      <div className={`${stem} bg-pink-300 rounded-full`} />
    </div>
  );
}
