import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  icon?: string;
  className?: string;
  placeholder?: string;
  buttonClassName?: string;
}

export function CustomSelect({ value, onChange, options, icon, className, placeholder, buttonClassName }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={cn('relative', className)} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full appearance-none bg-surface-container-high text-on-surface border border-outline-variant/20 rounded-full font-body-md text-body-md flex items-center hover:bg-surface-bright transition-colors outline-none focus:border-primary text-left relative",
          icon ? "px-4 py-2 pl-10 pr-8" : "px-4 py-2 pr-8",
          buttonClassName
        )}
      >
        {icon && <span className="material-symbols-outlined text-[18px] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">{icon}</span>}
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder || 'Select...'}</span>
        <span 
          className={cn(
            "material-symbols-outlined text-[18px] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 text-on-surface-variant",
            isOpen && "rotate-180"
          )} 
        >
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-35 bg-surface-container-highest border border-outline-variant/20 rounded-xl shadow-2xl z-100 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                'w-full text-left px-4 py-2.5 font-body-md text-body-md hover:bg-surface-bright transition-colors flex items-center justify-between',
                value === option.value ? 'bg-primary/10 text-primary font-medium' : 'text-on-surface'
              )}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
              {value === option.value && <span className="material-symbols-outlined text-[18px]">check</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
