"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectGroup {
  label: string;
  options: { value: string; label: string }[];
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value?: string;
  onChange: (value: string) => void;
  options?: SelectOption[];
  groups?: SelectGroup[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  /** 下拉面板最大高度，默认 280px */
  maxHeight?: number | string;
  disabled?: boolean;
  /** 为每个选项渲染图标（如品牌图标），传入 value 返回节点 */
  renderIcon?: (value: string) => React.ReactNode;
  iconClassName?: string;
}

export function Select({
  value,
  onChange,
  options,
  groups,
  placeholder = "请选择…",
  className,
  triggerClassName,
  dropdownClassName,
  maxHeight = 280,
  disabled = false,
  renderIcon,
  iconClassName,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const flatGroups = React.useMemo<SelectGroup[]>(() => {
    if (groups) return groups;
    if (options) return [{ label: "", options }];
    return [];
  }, [groups, options]);

  const allOptions = React.useMemo(
    () => flatGroups.flatMap((g) => g.options),
    [flatGroups]
  );

  const selectedLabel = React.useMemo(
    () => allOptions.find((o) => o.value === value)?.label ?? placeholder,
    [allOptions, value, placeholder]
  );

  React.useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function handleSelect(v: string) {
    onChange(v);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-md border border-[var(--divider)] bg-[var(--bg-primary)] px-3 py-2 text-left text-sm text-[var(--text-primary)] outline-none transition-colors hover:border-[var(--accent)]/50 focus:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50",
          open && "border-[var(--accent)]",
          triggerClassName
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {renderIcon && value && (
          <span className={cn("shrink-0", iconClassName)}>{renderIcon(value)}</span>
        )}
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 text-[var(--text-secondary)] transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1 w-full min-w-[12rem] overflow-hidden rounded-md border border-[var(--divider)] bg-[var(--bg-primary)] shadow-lg ring-1 ring-black/5",
            dropdownClassName
          )}
          style={{ maxHeight, overflowY: "auto" }}
          role="listbox"
        >
          {flatGroups.map((group, gi) => (
            <div key={group.label || `__group-${gi}`}>
              {group.label && (
                <div className="sticky top-0 z-10 bg-[var(--bg-muted)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
                  {group.label}
                </div>
              )}
              <ul className="py-1">
                {group.options.map((opt) => {
                  const active = opt.value === value;
                  return (
                    <li key={opt.value} role="option" aria-selected={active}>
                        <button
                          type="button"
                          onClick={() => handleSelect(opt.value)}
                          className={cn(
                            "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-muted)]",
                            active && "bg-[var(--accent)]/10 text-[var(--accent)]"
                          )}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            {renderIcon && (
                              <span className={cn("shrink-0", iconClassName)}>
                                {renderIcon(opt.value)}
                              </span>
                            )}
                            <span className="truncate">{opt.label}</span>
                          </span>
                          {active && <Check size={14} className="shrink-0" />}
                        </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
