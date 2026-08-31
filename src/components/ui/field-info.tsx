"use client";

import { useId, useState } from "react";
import { Info } from "lucide-react";

export interface FieldInfoProps {
  /** 提示浮层内容，支持文本或 ReactNode */
  children: React.ReactNode;
}

/**
 * 表单字段说明提示：标签旁的小信息图标。
 * - 鼠标悬停或点击图标时显示提示浮层
 * - 支持键盘聚焦，附带 aria-describedby / role="tooltip"
 */
export function FieldInfo({ children }: FieldInfoProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span
      className="relative inline-flex items-center align-middle"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        onClick={() => setOpen((v) => !v)}
        className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
      >
        <Info size={14} />
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute left-1/2 top-[calc(100%+6px)] z-50 w-72 -translate-x-1/2 rounded-md border border-[var(--divider)] bg-[var(--bg-card)] p-3 text-xs leading-relaxed text-[var(--text-secondary)] shadow-sm"
        >
          {children}
        </span>
      )}
    </span>
  );
}

export default FieldInfo;
