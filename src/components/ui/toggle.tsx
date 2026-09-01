"use client";

import { useId } from "react";

export interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  id?: string;
  size?: "sm" | "md";
}

/**
 * 苹果风格胶囊滑块开关：开启态为 iOS 标志性绿色，关闭态为中性灰。
 * 语义化 role="switch"，支持键盘（Enter / Space）与读屏。
 */
export function Toggle({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  id,
  size = "md",
}: ToggleProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const dims =
    size === "sm"
      ? { w: 38, h: 22, thumb: 18, tx: 16 }
      : { w: 46, h: 26, thumb: 22, tx: 20 };

  return (
    <div className={`flex items-center gap-3 ${disabled ? "opacity-50" : ""}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={label ? `${inputId}-label` : undefined}
        aria-describedby={description ? `${inputId}-desc` : undefined}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className="relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1"
        style={{
          width: dims.w,
          height: dims.h,
          backgroundColor: checked ? "#34C759" : "var(--bg-muted)",
        }}
      >
        <span
          className="absolute rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out"
          style={{
            width: dims.thumb,
            height: dims.thumb,
            left: 2,
            transform: checked ? `translateX(${dims.tx}px)` : "translateX(0)",
          }}
        />
      </button>
      {(label || description) && (
        <div className="leading-tight">
          {label && (
            <span id={`${inputId}-label`} className="text-sm font-medium text-[var(--text-primary)]">
              {label}
            </span>
          )}
          {description && (
            <p id={`${inputId}-desc`} className="text-xs text-[var(--text-secondary)]">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Toggle;
