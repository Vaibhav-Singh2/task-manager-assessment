import * as React from 'react';
import { cn } from '@/lib/utils';

/* eslint-disable react/prop-types */
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex h-10 w-full rounded-md border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm placeholder:text-(--color-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';
