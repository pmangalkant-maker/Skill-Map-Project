import React, { useId } from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, id, className = '', disabled, checked, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    return (
      <label
        htmlFor={checkboxId}
        className={`flex items-start gap-3 select-none ${
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
        } ${className}`}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={checkboxId}
            ref={ref}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div className="w-4 h-4 rounded border border-slate-300 bg-white transition-colors duration-150 peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/25 flex items-center justify-center text-white" />
          <Check className="w-3 h-3 stroke-[3] text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-800 leading-tight">{label}</span>
          {description && (
            <span className="text-xs text-slate-500 mt-0.5 leading-normal">{description}</span>
          )}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
