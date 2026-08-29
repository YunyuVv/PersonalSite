"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastOptions {
  /** 停留时长（毫秒），默认 success/info 2400、error/warning 4000 */
  duration?: number;
}

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastContextValue {
  show: (type: ToastType, message: string, options?: ToastOptions) => void;
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/** 在任意客户端组件中弹出提示：const toast = useToast(); toast.success("保存成功"); */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast 必须在 ToastProvider 内使用");
  }
  return ctx;
}

const STYLES: Record<ToastType, { color: string; bg: string }> = {
  success: { color: "#1D9E75", bg: "rgba(29, 158, 117, 0.14)" },
  error: { color: "#E24B4A", bg: "rgba(226, 75, 74, 0.14)" },
  info: { color: "#378ADD", bg: "rgba(55, 138, 221, 0.14)" },
  warning: { color: "#EF9F27", bg: "rgba(239, 159, 39, 0.16)" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setItems((list) => list.filter((it) => it.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (type: ToastType, message: string, options?: ToastOptions) => {
      const id = ++idRef.current;
      const duration = options?.duration ?? (type === "error" || type === "warning" ? 4000 : 2400);
      setItems((list) => [...list, { id, type, message, duration }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), duration)
      );
    },
    [dismiss]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      success: (message, options) => show("success", message, options),
      error: (message, options) => show("error", message, options),
      info: (message, options) => show("info", message, options),
      warning: (message, options) => show("warning", message, options),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2 sm:bottom-6 sm:right-6">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <ToastCard key={item.id} item={item} onDismiss={() => dismiss(item.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const style = STYLES[item.type];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      role="status"
      aria-live="polite"
      className="pointer-events-auto overflow-hidden rounded-xl border border-[var(--divider)] bg-[var(--bg-card)] shadow-lg"
    >
      <div className="flex items-start gap-3 p-3.5">
        <span
          className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
          style={{ color: style.color, backgroundColor: style.bg }}
        >
          <ToastIcon type={item.type} />
        </span>
        <p className="flex-1 text-sm leading-relaxed text-[var(--text-primary)]">
          {item.message}
        </p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="关闭提示"
          className="-mr-1 -mt-1 shrink-0 rounded-md p-1 text-[var(--text-secondary)] transition-colors hover:bg-[var(--divider)] hover:text-[var(--text-primary)]"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: item.duration / 1000, ease: "linear" }}
        style={{ backgroundColor: style.color, transformOrigin: "left center" }}
        className="h-0.5 w-full"
      />
    </motion.div>
  );
}

function ToastIcon({ type }: { type: ToastType }) {
  const common = {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (type) {
    case "success":
      return (
        <svg {...common}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case "error":
      return (
        <svg {...common}>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      );
    case "warning":
      return (
        <svg {...common}>
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 16v-5M12 8h.01" />
        </svg>
      );
  }
}
