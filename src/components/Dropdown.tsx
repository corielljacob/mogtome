import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps<T extends string = string> {
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  /** Accessible label for the dropdown (required for accessibility) */
  'aria-label'?: string;
  /** ID of element that labels this dropdown */
  'aria-labelledby'?: string;
}

/**
 * Custom styled dropdown that matches the Soft Bento design system.
 * Replaces native <select> with a fully styled accessible dropdown.
 * Uses a portal to escape overflow:hidden containers.
 * 
 * Accessibility features:
 * - Proper ARIA roles (listbox, option)
 * - Keyboard navigation (Arrow keys, Enter, Escape, Tab)
 * - Focus management
 * - Screen reader announcements
 */
export function Dropdown<T extends string = string>({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  icon,
  className = '',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  
  const listboxId = useId();
  const buttonId = useId();

  const selectedOption = options.find(o => o.value === value);

  // Calculate menu position when opening
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8, // 8px gap below trigger
        left: rect.left,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        listRef.current && !listRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on scroll (menu position would be stale)
  useEffect(() => {
    if (isOpen) {
      const handleScroll = () => setIsOpen(false);
      window.addEventListener('scroll', handleScroll, true);
      return () => window.removeEventListener('scroll', handleScroll, true);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          onChange(options[focusedIndex].value);
          setIsOpen(false);
        } else {
          setIsOpen(true);
          setFocusedIndex(options.findIndex(o => o.value === value));
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(options.findIndex(o => o.value === value));
        } else {
          setFocusedIndex(i => Math.min(i + 1, options.length - 1));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(i => Math.max(i - 1, 0));
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  }, [isOpen, focusedIndex, options, value, onChange]);

  // Scroll focused item into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listRef.current) {
      const focusedItem = listRef.current.children[focusedIndex] as HTMLElement;
      focusedItem?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex, isOpen]);

  const handleSelect = (optionValue: T) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const menu = isOpen && createPortal(
    <ul
      ref={listRef}
      id={listboxId}
      role="listbox"
      aria-activedescendant={focusedIndex >= 0 ? `${listboxId}-option-${focusedIndex}` : undefined}
      aria-label={ariaLabel}
      tabIndex={-1}
      style={{
        position: 'fixed',
        top: menuPosition.top,
        left: menuPosition.left,
        minWidth: Math.max(menuPosition.width, 160),
      }}
      className="
        z-[9999]
        bg-[var(--bento-card)] 
        border border-[var(--bento-border)]
        rounded-xl shadow-xl shadow-black/10
        py-1 sm:py-1.5 max-h-60 overflow-auto
        focus:outline-none
      "
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;
        const isFocused = index === focusedIndex;
        
        return (
          <li
            key={option.value}
            id={`${listboxId}-option-${index}`}
            role="option"
            aria-selected={isSelected}
            onClick={() => handleSelect(option.value)}
            onMouseEnter={() => setFocusedIndex(index)}
            className={`
              flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-2 sm:py-2.5 mx-1 sm:mx-1.5 rounded-lg
              cursor-pointer transition-colors
              ${isFocused ? 'bg-[var(--bento-primary)]/10' : ''}
              ${isSelected ? 'text-[var(--bento-primary)] font-semibold' : 'text-[var(--bento-text)]'}
            `}
          >
            {option.icon && (
              <span className={isSelected ? 'text-[var(--bento-primary)]' : 'text-[var(--bento-text-muted)]'} aria-hidden="true">
                {option.icon}
              </span>
            )}
            <span className="flex-1 text-xs sm:text-sm font-soft">{option.label}</span>
            {isSelected && (
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--bento-primary)]" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ul>,
    document.body
  );

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        ref={triggerRef}
        id={buttonId}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={`
          w-full flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-xl
          bg-[var(--bento-bg)]
          border border-[var(--bento-border)]
          hover:border-[var(--bento-primary)]/20 hover:bg-[var(--bento-primary)]/5
          focus:border-[var(--bento-primary)] focus:ring-2 focus:ring-[var(--bento-primary)]/20 focus:outline-none
          font-soft font-medium text-xs sm:text-sm text-[var(--bento-text)]
          cursor-pointer transition-colors
          ${isOpen ? 'border-[var(--bento-primary)] ring-2 ring-[var(--bento-primary)]/20' : ''}
        `}
      >
        {icon && (
          <span className="text-[var(--bento-secondary)] flex-shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="flex-1 text-left truncate">
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown 
          className={`
            w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--bento-text-muted)] flex-shrink-0
            transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}
          `}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown menu (rendered via portal) */}
      {menu}
    </div>
  );
}
