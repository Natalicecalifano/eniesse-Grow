import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/src/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-primary/5 transition-all duration-500',
          hover && 'hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1',
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
