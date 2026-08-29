"use client";

import { useEffect, useState } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "确定",
  cancelText = "取消",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (open) {
      // 下一帧切换可见态，触发进入过渡动画
      const id = requestAnimationFrame(() => setEntered(true));
      return () => {
        cancelAnimationFrame(id);
        setEntered(false);
      };
    }
    setEntered(false);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* 遮罩：点击取消 */}
      <div
        onClick={onCancel}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* 卡片 */}
      <div
        className={`relative w-full max-w-sm rounded-xl border border-[var(--divider)] bg-[var(--bg-card)] p-6 shadow-xl transition-all duration-200 ${
          entered ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md border border-[var(--divider)] px-4 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)]"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--text-on-accent)] transition hover:opacity-90"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
