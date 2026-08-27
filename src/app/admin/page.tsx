"use client";

import { useEffect, useState } from "react";
import type { SiteConfig } from "@/lib/config";

type SocialLinks = SiteConfig["social"];
type ContentItem = SiteConfig["contents"][number];
type Channel = SiteConfig["channels"][number];
type Credential = SiteConfig["credentials"][number];
type MBTIDimension = SiteConfig["mbti"]["dimensions"][number];

const PLATFORMS: { value: string; label: string }[] = [
  { value: "bilibili", label: "B站" },
  { value: "douyin", label: "抖音" },
  { value: "youtube", label: "YouTube" },
  { value: "xiaohongshu", label: "小红书" },
  { value: "wechat", label: "公众号" },
  { value: "weibo", label: "微博" },
  { value: "shipinhao", label: "视频号" },
];

const SOCIAL_FIELDS: { key: keyof SocialLinks; label: string }[] = [
  { key: "bilibili", label: "B站 主页" },
  { key: "douyin", label: "抖音 主页" },
  { key: "youtube", label: "YouTube 主页" },
  { key: "xiaohongshu", label: "小红书 主页" },
  { key: "wechat", label: "公众号 主页" },
  { key: "weibo", label: "微博 主页" },
  { key: "shipinhao", label: "视频号 主页" },
  { key: "zhihu", label: "知乎 主页" },
  { key: "juejin", label: "掘金 主页" },
  { key: "github", label: "GitHub 主页" },
  { key: "linkedin", label: "LinkedIn 主页" },
  { key: "twitter", label: "Twitter / X 主页" },
  { key: "website", label: "个人网站" },
];

const toTags = (s: string) => s.split(/[，,]/).map((t) => t.trim()).filter(Boolean);

const ADVANCED_KEYS = ["experiences", "education", "skills", "projects"] as const;

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [jsonDrafts, setJsonDrafts] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } |  null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  async function load() {
    setToast(null);
    try {
      const res = await fetch(`/api/admin/config?ts=${Date.now()}`, {
        headers: token ? { authorization: `Bearer ${token}` } : {},
      });
      if (res.status === 401) {
        setToast({ type: "error", msg: "未授权：请确认 Token 正确（或先在 .env 设置 ADMIN_TOKEN）。" });
        return;
      }
      const data = (await res.json()) as SiteConfig;
      setConfig(data);
      setJsonDrafts({
        experiences: JSON.stringify(data.experiences, null, 2),
        education: JSON.stringify(data.education, null, 2),
        skills: JSON.stringify(data.skills, null, 2),
        projects: JSON.stringify(data.projects, null, 2),
      });
    } catch (e) {
      setToast({ type: "error", msg: "加载失败：" + (e instanceof Error ? e.message : String(e)) });
    }
  }

  function setTop<K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) {
    setConfig((c) => (c ? { ...c, [key]: value } : c));
  }
  function setSocial(key: keyof SocialLinks, value: string) {
    setConfig((c) => (c ? { ...c, social: { ...c.social, [key]: value } } : c));
  }
  function setSite(key: keyof SiteConfig["siteConfig"], value: string) {
    setConfig((c) => (c ? { ...c, siteConfig: { ...c.siteConfig, [key]: value } } : c));
  }
  function setMbti(patch: Partial<SiteConfig["mbti"]>) {
    setConfig((c) => (c ? { ...c, mbti: { ...c.mbti, ...patch } } : c));
  }
  function updateContent(i: number, patch: Partial<ContentItem>) {
    setConfig((c) => (c ? { ...c, contents: c.contents.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) } : c));
  }
  function addContent() {
    setConfig((c) =>
      c
        ? {
            ...c,
            contents: [
              ...c.contents,
              { id: `c-${Date.now()}`, title: "", cover: "", platform: "bilibili", views: "", duration: "", url: "", date: "", tags: [] },
            ],
          }
        : c
    );
  }
  function removeContent(i: number) {
    setConfig((c) => (c ? { ...c, contents: c.contents.filter((_, idx) => idx !== i) } : c));
  }
  function updateChannel(i: number, patch: Partial<Channel>) {
    setConfig((c) => (c ? { ...c, channels: c.channels.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) } : c));
  }
  function addChannel() {
    setConfig((c) =>
      c ? { ...c, channels: [...c.channels, { platform: "bilibili", name: "", url: "", followers: "", totalViews: "" }] } : c
    );
  }
  function removeChannel(i: number) {
    setConfig((c) => (c ? { ...c, channels: c.channels.filter((_, idx) => idx !== i) } : c));
  }
  function updateCredential(i: number, patch: Partial<Credential>) {
    setConfig((c) => (c ? { ...c, credentials: c.credentials.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) } : c));
  }
  function addCredential() {
    setConfig((c) => (c ? { ...c, credentials: [...c.credentials, { label: "", value: "", desc: "" }] } : c));
  }
  function removeCredential(i: number) {
    setConfig((c) => (c ? { ...c, credentials: c.credentials.filter((_, idx) => idx !== i) } : c));
  }
  function updateDimension(i: number, patch: Partial<MBTIDimension>) {
    setConfig((c) =>
      c
        ? { ...c, mbti: { ...c.mbti, dimensions: c.mbti.dimensions.map((d, idx) => (idx === i ? { ...d, ...patch } : d)) } }
        : c
    );
  }

  async function save() {
    if (!config) return;
    setToast(null);
    const parsed: Record<string, unknown> = {};
    for (const key of ADVANCED_KEYS) {
      try {
        parsed[key] = JSON.parse(jsonDrafts[key] || "[]");
      } catch {
        setToast({ type: "error", msg: `❌ ${key} 不是合法 JSON，保存已中止。` });
        return;
      }
    }
    const payload = { ...config, ...parsed };
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        setToast({ type: "error", msg: "未授权：Token 错误。" });
        return;
      }
      if (!res.ok) {
        setToast({ type: "error", msg: "❌ 保存失败：" + (await res.text()) });
        return;
      }
      setToast({ type: "success", msg: "✅ 保存成功，首页将于下次刷新时生效（无需重启）。" });
    } catch (e) {
      setToast({ type: "error", msg: "❌ 保存失败：" + (e instanceof Error ? e.message : String(e)) });
    }
  }

  if (!config) {
    return (
      <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold mb-4">后台配置</h1>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            用这个页面修改首页内容，保存后立即生效，不需要懂代码。
          </p>
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
        </div>
        <Toast toast={toast} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">后台配置 · 实时生效</h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              改完点「保存」，首页刷新后即更新。带 <span className="text-[var(--text-secondary)]">+</span> 的区块可新增条目。
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-[var(--divider)] px-4 py-2 text-sm"
            >
              预览首页
            </a>
            <button
              onClick={save}
              className="rounded-md bg-[var(--accent)] text-[var(--text-on-accent)] px-5 py-2 text-sm font-medium"
            >
              保存
            </button>
          </div>
        </div>

        <Toast toast={toast} />

        <Section title="基础信息">
          <Field label="姓名" value={config.name} onChange={(v) => setTop("name", v)} />
          <Field label="身份 / 职位" value={config.role} onChange={(v) => setTop("role", v)} />
          <Field label="标语" value={config.tagline} onChange={(v) => setTop("tagline", v)} />
          <Field label="现居城市" value={config.location} onChange={(v) => setTop("location", v)} />
          <Field label="邮箱" value={config.email} onChange={(v) => setTop("email", v)} />
          <Field label="头像路径" value={config.avatar} onChange={(v) => setTop("avatar", v)} hint="如 /images/avatar.jpg" />
          <Field label="状态徽章（留空不显示）" value={config.statusBadge} onChange={(v) => setTop("statusBadge", v)} />
        </Section>

        <Section title="社交 / 平台主页链接">
          {SOCIAL_FIELDS.map((f) => (
            <Field
              key={f.key}
              label={f.label}
              value={config.social[f.key] ?? ""}
              onChange={(v) => setSocial(f.key, v)}
              hint="填对应平台的主页地址"
            />
          ))}
        </Section>

        <Section title="站点信息（SEO）">
          <Field label="站点标题" value={config.siteConfig.title} onChange={(v) => setSite("title", v)} />
          <TextArea label="站点描述" value={config.siteConfig.description} onChange={(v) => setSite("description", v)} />
          <Field label="站点域名" value={config.siteConfig.url} onChange={(v) => setSite("url", v)} hint="如 https://example.com" />
          <Field label="分享缩略图" value={config.siteConfig.ogImage} onChange={(v) => setSite("ogImage", v)} />
        </Section>

        <Section title="关于 / 理念">
          <TextArea label="个人简介" value={config.bio} onChange={(v) => setTop("bio", v)} hint="可换行" />
          <TextArea label="理念陈述（首页大字）" value={config.philosophy} onChange={(v) => setTop("philosophy", v)} />
          <Field
            label="专注方向"
            value={config.focus.join("，")}
            onChange={(v) => setTop("focus", toTags(v))}
            hint="用逗号分隔，如 基金，股票，宏观"
          />
        </Section>

        <Section title="精选内容（首页漂移墙）">
          <p className="text-xs text-[var(--text-muted)]">首页「近期最受关注的内容」展示的视频，可任意增删改。</p>
          <div className="space-y-4">
            {config.contents.map((it, i) => (
              <Card key={it.id} title={`内容 ${i + 1}`} onRemove={() => removeContent(i)}>
                <Field label="标题" value={it.title} onChange={(v) => updateContent(i, { title: v })} />
                <SelectField
                  label="平台"
                  value={it.platform}
                  options={PLATFORMS}
                  onChange={(v) => updateContent(i, { platform: v })}
                />
                <Field
                  label="封面图链接"
                  value={it.cover}
                  onChange={(v) => updateContent(i, { cover: v })}
                  hint="填图片地址 https://...，留空则用占位图"
                />
                <Field label="视频链接" value={it.url} onChange={(v) => updateContent(i, { url: v })} hint="点击后跳转的地址" />
                <div className="grid grid-cols-3 gap-3">
                  <Field label="播放量" value={it.views} onChange={(v) => updateContent(i, { views: v })} hint="如 86万" />
                  <Field label="时长" value={it.duration} onChange={(v) => updateContent(i, { duration: v })} hint="如 12:30" />
                  <Field label="日期" value={it.date} onChange={(v) => updateContent(i, { date: v })} hint="如 2026-05" />
                </div>
                <Field
                  label="标签"
                  value={it.tags.join("，")}
                  onChange={(v) => updateContent(i, { tags: toTags(v) })}
                  hint="逗号分隔"
                />
              </Card>
            ))}
          </div>
          <button
            onClick={addContent}
            className="mt-3 rounded-md border border-[var(--divider)] px-3 py-2 text-sm text-[var(--text-secondary)]"
          >
            + 新增内容
          </button>
        </Section>

        <Section title="平台矩阵（数据背书）">
          <p className="text-xs text-[var(--text-muted)]">首页展示的各平台粉丝 / 播放数据。</p>
          <div className="space-y-4">
            {config.channels.map((it, i) => (
              <Card key={i} title={`平台 ${i + 1}`} onRemove={() => removeChannel(i)}>
                <SelectField
                  label="平台"
                  value={it.platform}
                  options={PLATFORMS}
                  onChange={(v) => updateChannel(i, { platform: v })}
                />
                <Field label="显示名称" value={it.name} onChange={(v) => updateChannel(i, { name: v })} hint="如 哔哩哔哩" />
                <Field label="主页链接" value={it.url} onChange={(v) => updateChannel(i, { url: v })} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="粉丝数" value={it.followers} onChange={(v) => updateChannel(i, { followers: v })} hint="如 12.8万" />
                  <Field label="总播放" value={it.totalViews ?? ""} onChange={(v) => updateChannel(i, { totalViews: v })} hint="如 3200万+" />
                </div>
              </Card>
            ))}
          </div>
          <button
            onClick={addChannel}
            className="mt-3 rounded-md border border-[var(--divider)] px-3 py-2 text-sm text-[var(--text-secondary)]"
          >
            + 新增平台
          </button>
        </Section>

        <Section title="资质墙">
          <div className="space-y-4">
            {config.credentials.map((it, i) => (
              <Card key={i} title={`资质 ${i + 1}`} onRemove={() => removeCredential(i)}>
                <Field label="标签" value={it.label} onChange={(v) => updateCredential(i, { label: v })} hint="如 从业经验" />
                <Field label="数值" value={it.value} onChange={(v) => updateCredential(i, { value: v })} hint="如 6 年+" />
                <Field label="说明" value={it.desc ?? ""} onChange={(v) => updateCredential(i, { desc: v })} />
              </Card>
            ))}
          </div>
          <button
            onClick={addCredential}
            className="mt-3 rounded-md border border-[var(--divider)] px-3 py-2 text-sm text-[var(--text-secondary)]"
          >
            + 新增资质
          </button>
        </Section>

        <Section title="免责声明（页脚）">
          <TextArea
            label="免责声明文案"
            value={config.disclaimer}
            onChange={(v) => setTop("disclaimer", v)}
            hint="首页底部展示的合规声明"
          />
        </Section>

        <Section title="性格 / MBTI">
          <div className="grid grid-cols-2 gap-3">
            <Field label="类型（4 字母）" value={config.mbti.type} onChange={(v) => setMbti({ type: v })} hint="如 INTP" />
            <Field label="中文名" value={config.mbti.name} onChange={(v) => setMbti({ name: v })} />
          </div>
          <Field label="英文名" value={config.mbti.nameEn} onChange={(v) => setMbti({ nameEn: v })} />
          <TextArea label="描述" value={config.mbti.description} onChange={(v) => setMbti({ description: v })} />
          <p className="text-xs text-[var(--text-muted)] mt-2">四个维度（倾向分 0–100，越高越偏向左侧字母）</p>
          <div className="space-y-3">
            {config.mbti.dimensions.map((d, i) => (
              <div key={i} className="rounded-md border border-[var(--divider)] p-3 grid grid-cols-2 gap-3">
                <Field label="左字母" value={d.left} onChange={(v) => updateDimension(i, { left: v })} />
                <Field label="右字母" value={d.right} onChange={(v) => updateDimension(i, { right: v })} />
                <Field label="左名称" value={d.leftName} onChange={(v) => updateDimension(i, { leftName: v })} />
                <Field label="右名称" value={d.rightName} onChange={(v) => updateDimension(i, { rightName: v })} />
                <Field
                  label="倾向分（0–100）"
                  value={String(d.score)}
                  onChange={(v) => updateDimension(i, { score: Number(v) || 0 })}
                  hint="数值越高越偏左"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <Field
              label="核心优势"
              value={config.mbti.strengths.join("，")}
              onChange={(v) => setMbti({ strengths: toTags(v) })}
              hint="逗号分隔"
            />
            <Field
              label="潜在盲区"
              value={config.mbti.weaknesses.join("，")}
              onChange={(v) => setMbti({ weaknesses: toTags(v) })}
              hint="逗号分隔"
            />
          </div>
        </Section>

        <Section title="高级设置（一般不改）">
          <p className="text-xs text-[var(--text-muted)]">以下为原始数据，仅在有经验时调整。</p>
          {ADVANCED_KEYS.map((key) => (
            <TextArea
              key={key}
              label={key}
              value={jsonDrafts[key]}
              onChange={(v) => setJsonDrafts((d) => ({ ...d, [key]: v }))}
            />
          ))}
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

function Toast({ toast }: { toast: { type: "success" | "error"; msg: string } | null }) {
  if (!toast) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className={`rounded-lg px-5 py-3 text-sm font-medium shadow-lg ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}
      >
        {toast.msg}
      </div>
    </div>
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

function Card({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-[var(--divider)] bg-[var(--bg-primary)] p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--text-secondary)]">{title}</span>
        <button onClick={onRemove} className="text-xs text-red-500 hover:underline">
          删除
        </button>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs text-[var(--text-muted)]">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-[var(--divider)] bg-[var(--bg-primary)] px-3 py-2 text-sm"
      />
      {hint && <span className="text-[11px] text-[var(--text-muted)] mt-1 block">{hint}</span>}
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 5,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs text-[var(--text-muted)]">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="mt-1 w-full rounded-md border border-[var(--divider)] bg-[var(--bg-primary)] px-3 py-2 text-sm"
      />
      {hint && <span className="text-[11px] text-[var(--text-muted)] mt-1 block">{hint}</span>}
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs text-[var(--text-muted)]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-[var(--divider)] bg-[var(--bg-primary)] px-3 py-2 text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
