import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', {
  variants: {
    variant: {
      default: 'bg-[var(--color-surface-soft)] text-[var(--color-foreground)]',
      low: 'bg-slate-100 text-slate-700',
      medium: 'bg-amber-100 text-amber-700',
      high: 'bg-rose-100 text-rose-700',
      success: 'bg-emerald-100 text-emerald-700'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <div className={cn(badgeVariants({ variant }), className)} {...props} />
);
