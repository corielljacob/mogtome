import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

/**
 * Card - Soft Bento design system card component.
 * Clean, modern cards with subtle shadows and optional hover effects.
 */
export function Card({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'md',
  hover = true,
}: CardProps) {
  const variantClasses = {
    default: 'bg-[var(--bento-card)]/80 backdrop-blur-md border border-[var(--bento-border)] shadow-sm',
    glass: 'bento-glass backdrop-blur-md',
    flat: 'bg-[var(--bento-bg)]/50 backdrop-blur-sm border border-[var(--bento-border)]',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3 md:p-4',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
  };

  const hoverClasses = hover 
    ? 'hover:shadow-lg hover:shadow-[var(--bento-primary)]/5 hover:-translate-y-0.5 transition-all duration-300' 
    : '';

  return (
    <div className={`
      rounded-2xl
      ${variantClasses[variant]}
      ${paddingClasses[padding]}
      ${hoverClasses}
      ${className}
    `}>
      {children}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={`space-y-3 ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

export function CardTitle({ children, className = '', as: Tag = 'h3' }: CardTitleProps) {
  return (
    <Tag className={`font-display font-bold text-lg text-[var(--bento-text)] ${className}`}>
      {children}
    </Tag>
  );
}

interface CardActionsProps {
  children: ReactNode;
  className?: string;
  justify?: 'start' | 'end' | 'center' | 'between';
}

export function CardActions({ children, className = '', justify = 'end' }: CardActionsProps) {
  const justifyClass = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
  }[justify];

  return (
    <div className={`flex items-center gap-3 pt-4 ${justifyClass} ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`flex items-center justify-between pb-4 border-b border-[var(--bento-border)] ${className}`}>
      {children}
    </div>
  );
}
