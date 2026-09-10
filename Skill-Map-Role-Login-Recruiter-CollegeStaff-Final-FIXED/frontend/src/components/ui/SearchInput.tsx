import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
  sizeVariant?: 'sm' | 'md';
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClear, sizeVariant = 'md', className = '', placeholder = 'Search...', ...props }, ref) => {
    const hasValue = Boolean(value && String(value).length > 0);

    return (
      <div className={`relative flex items-center w-full ${className}`}>
        <Search
          className={`absolute left-3 text-slate-400 pointer-events-none ${
            sizeVariant === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
          }`}
          aria-hidden="true"
        />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white text-slate-900 border border-slate-200 rounded-lg pl-9 pr-8 transition-colors duration-150 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 ${
            sizeVariant === 'sm' ? 'text-xs py-1.5' : 'text-sm py-2'
          }`}
          {...props}
        />
        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
