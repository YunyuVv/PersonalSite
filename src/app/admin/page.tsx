"use client";

import { useEffect, useState } from "react";
import type { SiteConfig } from "@/lib/config";
import { useToast } from "@/components/ui/toast";

type SocialLinks = SiteConfig["social"];
type ContentItem = SiteConfig["contents"][number];
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
  { key: "github", label: "GitHub 主页" },
  { key: "website", label: "个人网站" },
];

const toTags = (s: string) => s.split(/[，,]/).map((t) => t.trim()).filter(Boolean);

const TABS = [
  { key: "basic", label: "基础信息" },
  { key: "social", label: "社交平台" },
  { key: "seo", label: "站点SEO" },
  { key: "about", label: "关于理念" },
  { key: "featured", label: "精选内容" },
  { key: "disclaimer", label: "免责声明" },
  { key: "mbti", label: "性格MBTI" },
] as const;

const TOKEN_KEY = "admin_token";
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 登录状态保留 7 天

type StoredToken = { value: string; expiresAt: number };

// 读取本机保存的 token：过期或非法返回 null
function readStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return raw; // 兼容早期版本：直接存的明文字符串
    }
    if (!parsed || typeof parsed !== "object" || !("value" in parsed)) return raw;
    const { value, expiresAt } = parsed as StoredToken;
    if (!value || !expiresAt) return null;
    if (Date.now() > expiresAt) {
      window.localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return value;
  } catch {
    return null;
  }
}

function writeStoredToken(value: string): void {
  try {
    window.localStorage.setItem(
      TOKEN_KEY,
      JSON.stringify({ value, expiresAt: Date.now() + TOKEN_TTL_MS } satisfies StoredToken)
    );
  } catch {
    // 隐私模式等存储不可用时忽略，不影响本次会话
  }
}

function clearStoredToken(): void {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export default function AdminPage() {
  const toast = useToast();
  const [token, setToken] = useState("");
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [tab, setTab] = useState<string>("basic");

  useEffect(() => {
    const saved = readStoredToken();
    if (!saved) return;
    setToken(saved);
    // 7 天内免输入：直接用本机保存的 token 读取配置
    void load(saved);
  }, []);

  async function load(useToken?: string) {
    const authToken = useToken ?? token;
    try {
      const res = await fetch(`/api/admin/config?ts=${Date.now()}`, {
        headers: authToken ? { authorization: `Bearer ${authToken}` } : {},
      });
      if (res.status === 401) {
        // token 失效则清除本机登录状态，避免反复 401
        clearStoredToken();
        toast.error("Token 无效，请重新输入");
        return;
      }
      const data = (await res.json()) as SiteConfig;
      setConfig(data);
    } catch (e) {
      toast.error("加载失败");
      console.error("[admin] 加载配置失败：", e);
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
  function updateDimension(i: number, patch: Partial<MBTIDimension>) {
    setConfig((c) =>
      c
        ? { ...c, mbti: { ...c.mbti, dimensions: c.mbti.dimensions.map((d, idx) => (idx === i ? { ...d, ...patch } : d)) } }
        : c
    );
  }

  async function save() {
    if (!config) return;
    const payload = { ...config };
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        clearStoredToken();
        toast.error("Token 无效，请重新输入");
        return;
      }
      if (!res.ok) {
        toast.error("保存失败");
        console.error("[admin] 保存失败：", await res.text());
        return;
      }
      toast.success("保存成功");
    } catch (e) {
      toast.error("保存失败");
      console.error("[admin] 保存失败：", e);
    }
  }

  if (!config) {
    return (
      <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold mb-4">后台配置</h1>
          <p className="text-xs text-[var(--text-muted)] mb-4">登录后 7 天内免重复输入。</p>
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
                writeStoredToken(token);
                void load();
              }}
              className="rounded-md bg-[var(--accent)] text-[var(--text-on-accent)] px-4 py-2 text-sm font-medium"
            >
              读取配置
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">后台配置 · 实时生效</h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              改完点「保存」，首页刷新后即更新。带 <span className="text-[var(--text-secondary)]">+</span> 的区块可新增条目。
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                clearStoredToken();
                setToken("");
                setConfig(null);
              }}
              className="rounded-md border border-[var(--divider)] px-3 py-2 text-sm"
              title="清除本机的登录状态（默认保留 7 天）"
            >
              退出登录
            </button>
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

        <div className="flex gap-2 overflow-x-auto pb-3 mb-5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm border transition-colors ${
                tab === t.key
                  ? "bg-[var(--accent)] text-[var(--text-on-accent)] border-[var(--accent)] font-medium"
                  : "border-[var(--divider)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {tab === "basic" && (
            <Section title="基础信息">
              <Field label="姓名" value={config.name} onChange={(v) => setTop("name", v)} />
              <Field label="身份 / 职位" value={config.role} onChange={(v) => setTop("role", v)} />
              <Field label="标语" value={config.tagline} onChange={(v) => setTop("tagline", v)} />
              <Field label="现居城市" value={config.location} onChange={(v) => setTop("location", v)} />
              <Field label="邮箱" value={config.email} onChange={(v) => setTop("email", v)} />
              <Field label="状态徽章（仅知识地图页显示）" value={config.statusBadge} onChange={(v) => setTop("statusBadge", v)} />
            </Section>
          )}

          {tab === "social" && (
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
          )}

          {tab === "seo" && (
            <Section title="站点信息（SEO）">
              <Field label="站点标题" value={config.siteConfig.title} onChange={(v) => setSite("title", v)} />
              <TextArea label="站点描述" value={config.siteConfig.description} onChange={(v) => setSite("description", v)} />
              <Field label="站点域名" value={config.siteConfig.url} onChange={(v) => setSite("url", v)} hint="如 https://example.com" />
              <Field label="分享缩略图" value={config.siteConfig.ogImage} onChange={(v) => setSite("ogImage", v)} />
            </Section>
          )}

          {tab === "about" && (
            <Section title="关于 / 理念">
              <TextArea label="个人简介" value={config.bio} onChange={(v) => setTop("bio", v)} hint="仅知识地图页显示，可换行" />
              <TextArea label="理念陈述（首页大字）" value={config.philosophy} onChange={(v) => setTop("philosophy", v)} />
              <Field
                label="专注方向"
                value={config.focus.join("，")}
                onChange={(v) => setTop("focus", toTags(v))}
                hint="用逗号分隔，如 基金，股票，宏观"
              />
            </Section>
          )}

          {tab === "featured" && (
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
          )}

          {tab === "disclaimer" && (
            <Section title="免责声明（页脚）">
              <TextArea
                label="免责声明文案"
                value={config.disclaimer}
                onChange={(v) => setTop("disclaimer", v)}
                hint="首页底部展示的合规声明"
              />
            </Section>
          )}

          {tab === "mbti" && (
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
          )}
        </div>

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
