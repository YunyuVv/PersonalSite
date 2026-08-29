"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-lg font-semibold text-neutral-900">后台登录</h1>
        <p className="mt-1 text-sm text-neutral-500">
          请输入管理口令以进入站点后台
        </p>

        <label className="mt-5 block text-sm font-medium text-neutral-700">
          访问口令（ADMIN_KEY）
        </label>
        <input
          type="password"
          autoFocus
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
          placeholder="输入 ADMIN_KEY"
        />

        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "登录中…" : "登录"}
        </button>
      </form>
    </div>
  );
}
