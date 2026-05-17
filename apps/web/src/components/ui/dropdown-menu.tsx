import { cn } from '@/lib/utils';

interface DropdownMenuProps {
  children: React.ReactNode;
}

export const DropdownMenu = ({ children }: DropdownMenuProps) => <div className="relative">{children}</div>;

export const DropdownMenuTrigger = ({ children }: { children: React.ReactNode; asChild?: boolean }) => <>{children}</>;

export const DropdownMenuContent = ({ className, children }: { className?: string; children: React.ReactNode; align?: string }) => (
  <div className={cn('absolute right-0 top-12 z-50 min-w-[8rem] rounded-md border bg-white p-1 shadow-md', className)}>{children}</div>
);

export const DropdownMenuItem = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button type="button" className={cn('w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-[var(--color-surface-soft)]', className)} {...props} />
);
