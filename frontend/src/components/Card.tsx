import { type ReactNode } from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  compact?: boolean;
}

export function Card({ children, className = '', hover = true, compact = false }: CardProps) {
  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`card bg-base-100 shadow-lg ${compact ? 'card-compact' : ''} ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`card bg-base-100 shadow-lg ${compact ? 'card-compact' : ''} ${className}`}>
      {children}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={`card-body ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return <h2 className={`card-title ${className}`}>{children}</h2>;
}

interface CardActionsProps {
  children: ReactNode;
  className?: string;
  justify?: 'start' | 'end' | 'center';
}

export function CardActions({ children, className = '', justify = 'end' }: CardActionsProps) {
  const justifyClass = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
  }[justify];

  return <div className={`card-actions ${justifyClass} ${className}`}>{children}</div>;
}
