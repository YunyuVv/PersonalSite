"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AdminLoginPage() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: `{"key":"${key.replace(/"/g, '\\"')}"}`,
        credentials: "same-origin",
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const json = await res.json().catch(() => ({}));
        setError(json.error || `登录失败（${res.status}）`);
      }
    } catch (err) {
      setError("请求异常：" + String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-6">
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <Link
          href="/"
          className="rounded-md border border-[var(--divider)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
        >
          返回首页
        </Link>
        <ThemeToggle />
      </div>
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-lg border border-[var(--divider)] bg-[var(--bg-card)] p-6 shadow-sm"
      >
        <h1 className="text-lg font-semibold text-[var(--text-primary)]">后台登录</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          请输入管理口令以进入站点后台
        </p>

        <label className="mt-5 block text-sm font-medium text-[var(--text-primary)]">
          访问口令（ADMIN_KEY）
        </label>
        <input
          type="password"
          autoFocus
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="mt-2 w-full rounded-md border border-[var(--divider)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
          placeholder="输入 ADMIN_KEY"
        />

        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--text-on-accent)] disabled:opacity-50"
        >
          {loading ? "登录中…" : "登录"}
        </button>
      </form>
    </div>
  );
}
