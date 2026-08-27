"use client";

import { useEffect, useState } from "react";

type Config = {
  name: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  avatar: string;
  bio: string;
  statusBadge: string;
  philosophy: string;
  focus: string[];
  social: { wechat?: string; xiaohongshu?: string; weibo?: string };
  siteConfig: { title: string; description: string; url: string; ogImage: string };
  mbti: unknown;
  experiences: unknown;
  education: unknown;
  skills: unknown;
  projects: unknown;
};

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [config, setConfig] = useState<Config | null>(null);
  const [jsonDrafts, setJsonDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  async function load() {
    setError(null);
    setStatus(null);
    try {
      const res = await fetch(`/api/admin/config?ts=${Date.now()}`, {
        headers: token ? { authorization: `Bearer ${token}` } : {},
      });
      if (res.status === 401) {
        setError("未授权：请确认 Token 正确（或先在 .env 设置 ADMIN_TOKEN）。");
        return;
      }
      const data = (await res.json()) as Config;
      setConfig(data);
      setJsonDrafts({
        mbti: JSON.stringify(data.mbti, null, 2),
        experiences: JSON.stringify(data.experiences, null, 2),
        education: JSON.stringify(data.education, null, 2),
        skills: JSON.stringify(data.skills, null, 2),
        projects: JSON.stringify(data.projects, null, 2),
      });
    } catch (e) {
      setError("加载失败：" + (e instanceof Error ? e.message : String(e)));
    }
  }

  function update<K extends keyof Config>(key: K, value: Config[K]) {
    setConfig((c) => (c ? { ...c, [key]: value } : c));
  }

  function updateNested(obj: "social" | "siteConfig", key: string, value: string) {
    setConfig((c) =>
      c ? { ...c, [obj]: { ...(c[obj] as object), [key]: value } } : c
    );
  }

  function setJson(key: string, text: string) {
    setJsonDrafts((d) => ({ ...d, [key]: text }));
  }

  async function save() {
    if (!config) return;
    setError(null);
    setStatus(null);
    // 校验 JSON 字段
    const parsed: Record<string, unknown> = {};
    for (const key of ["mbti", "experiences", "education", "skills", "projects"]) {
      try {
        parsed[key] = JSON.parse(jsonDrafts[key] || "[]");
      } catch {
        setError(`${key} 不是合法 JSON，保存已中止。`);
        return;
      }
    }
    const payload = {
      ...config,
      ...parsed,
    };
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        setError("未授权：Token 错误。");
        return;
      }
      if (!res.ok) {
        setError("保存失败：" + (await res.text()));
        return;
      }
      setStatus("已保存，页面将于下次加载时生效（无需重启）。");
      // 重新拉取最新配置
      load();
    } catch (e) {
      setError("保存失败：" + (e instanceof Error ? e.message : String(e)));
    }
  }

  if (!config) {
    return (
      <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold mb-4">后台配置</h1>
          <div className="flex gap-2 mb-4">
            <input
              type="password"
              placeholder="ADMIN_TOKEN"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="flex-1 rounded-md border border-[var(--divider)] bg-[var(--bg-card)] px-3 py-2 text-sm"
            />
            <button
              onClick={() => {
                localStorage.setItem("admin_token", token);
                load();
              }}
              className="rounded-md bg-[var(--accent)] text-[var(--text-on-accent)] px-4 py-2 text-sm font-medium"
            >
              读取配置
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">后台配置 · 实时生效</h1>
          <button
            onClick={save}
            className="rounded-md bg-[var(--accent)] text-[var(--text-on-accent)] px-5 py-2 text-sm font-medium"
          >
            保存
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
            {error}
          </p>
        )}
        {status && (
          <p className="text-green-500 text-sm bg-green-500/10 border border-green-500/30 rounded-md px-3 py-2">
            {status}
          </p>
        )}

        <Section title="基础信息">
          <Field label="姓名" value={config.name} onChange={(v) => update("name", v)} />
          <Field label="身份 / 职位" value={config.role} onChange={(v) => update("role", v)} />
          <Field label="标语" value={config.tagline} onChange={(v) => update("tagline", v)} />
          <Field label="现居" value={config.location} onChange={(v) => update("location", v)} />
          <Field label="邮箱" value={config.email} onChange={(v) => update("email", v)} />
          <Field label="头像路径" value={config.avatar} onChange={(v) => update("avatar", v)} />
        </Section>

        <Section title="社交链接">
          <Field
            label="微信"
            value={config.social.wechat || ""}
            onChange={(v) => updateNested("social", "wechat", v)}
          />
          <Field
            label="小红书"
            value={config.social.xiaohongshu || ""}
            onChange={(v) => updateNested("social", "xiaohongshu", v)}
          />
          <Field
            label="微博"
            value={config.social.weibo || ""}
            onChange={(v) => updateNested("social", "weibo", v)}
          />
        </Section>

        <Section title="站点信息">
          <Field
            label="站点标题"
            value={config.siteConfig.title}
            onChange={(v) => updateNested("siteConfig", "title", v)}
          />
          <Field
            label="站点描述"
            value={config.siteConfig.description}
            onChange={(v) => updateNested("siteConfig", "description", v)}
          />
          <Field
            label="站点域名"
            value={config.siteConfig.url}
            onChange={(v) => updateNested("siteConfig", "url", v)}
          />
          <Field
            label="OG 图片"
            value={config.siteConfig.ogImage}
            onChange={(v) => updateNested("siteConfig", "ogImage", v)}
          />
        </Section>

        <Section title="关于 / 理念">
          <TextArea label="个人简介" value={config.bio} onChange={(v) => update("bio", v)} />
          <Field label="状态徽章（留空则不显示）" value={config.statusBadge} onChange={(v) => update("statusBadge", v)} />
          <TextArea label="理念陈述" value={config.philosophy} onChange={(v) => update("philosophy", v)} />
          <Field
            label="专注方向（逗号分隔）"
            value={config.focus.join(" · ")}
            onChange={(v) => update("focus", v.split(/[，,]/).map((s) => s.trim()).filter(Boolean))}
          />
        </Section>

        <Section title="MBTI（JSON）">
          <TextArea label="mbti" value={jsonDrafts.mbti} onChange={(v) => setJson("mbti", v)} />
        </Section>
        <Section title="经历（JSON）">
          <TextArea label="experiences" value={jsonDrafts.experiences} onChange={(v) => setJson("experiences", v)} />
        </Section>
        <Section title="教育（JSON）">
          <TextArea label="education" value={jsonDrafts.education} onChange={(v) => setJson("education", v)} />
        </Section>
        <Section title="技能（JSON）">
          <TextArea label="skills" value={jsonDrafts.skills} onChange={(v) => setJson("skills", v)} />
        </Section>
        <Section title="项目（JSON）">
          <TextArea label="projects" value={jsonDrafts.projects} onChange={(v) => setJson("projects", v)} />
        </Section>

        <button
          onClick={save}
          className="rounded-md bg-[var(--accent)] text-[var(--text-on-accent)] px-5 py-2 text-sm font-medium"
        >
          保存
        </button>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-[var(--divider)] bg-[var(--bg-card)] p-4 space-y-3">
      <h2 className="text-sm font-semibold text-[var(--text-secondary)]">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs text-[var(--text-muted)]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-[var(--divider)] bg-[var(--bg-primary)] px-3 py-2 text-sm"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs text-[var(--text-muted)]">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className="mt-1 w-full rounded-md border border-[var(--divider)] bg-[var(--bg-primary)] px-3 py-2 text-xs font-mono"
      />
    </label>
  );
}
