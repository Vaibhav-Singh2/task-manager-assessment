import { cn } from '@/lib/utils';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export const Select = ({ value, onValueChange, children }: SelectProps) => (
  <select
    value={value}
    onChange={(event) => onValueChange(event.target.value)}
    className="flex h-10 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
  >
    {children}
  </select>
);

export const SelectTrigger = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('w-full', className)}>{children}</div>
);

export const SelectValue = ({ placeholder }: { placeholder?: string }) => <span className="text-sm">{placeholder}</span>;

export const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <option value={value}>{children}</option>
);
