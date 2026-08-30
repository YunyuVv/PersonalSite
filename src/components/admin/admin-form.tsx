"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Profile } from "@/types/profile";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { Select } from "@/components/ui/select";
import { SocialIcon } from "@/lib/social-icons";
import { PLATFORM_CATALOG, SOCIAL_CATEGORY_ORDER } from "@/lib/social-platforms";

type HomepageFields = {
  philosophy: string;
  focus: string[];
  statusBadge: string;
  featuredProjectIds: string[];
};

type InitialData = { profile: Profile; homepage: HomepageFields };

const TABS = [
  { key: "basic", label: "基础信息" },
  { key: "social", label: "社交链接" },
  { key: "mbti", label: "性格 / MBTI" },
  { key: "projects", label: "近期项目" },
  { key: "about", label: "关于 / 理念" },
  { key: "footer", label: "页脚" },
] as const;

const SOCIAL_GROUPS = SOCIAL_CATEGORY_ORDER.map((cat) => ({
  label: cat,
  options: Object.entries(PLATFORM_CATALOG)
    .filter(([, m]) => m.category === cat)
    .map(([value, m]) => ({ value, label: m.label })),
}));

function toList(s: string): string[] {
  return s
    .split(/[，,]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function AdminForm({ initialData }: { initialData: InitialData }) {
  const router = useRouter();
  const [data, setData] = useState<InitialData>(initialData);
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("basic");
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } |  null>(null);

  const setProfile = (patch: Partial<Profile>) =>
    setData((d) => ({ ...d, profile: { ...d.profile, ...patch } }));
  const setHomepage = (patch: Partial<HomepageFields>) =>
    setData((d) => ({ ...d, homepage: { ...d.homepage, ...patch } }));

  const confirmSave = () => {
    setShowConfirm(true);
  };

  const save = async (mode: "github" | "local" = "github") => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ profile: data.profile, homepage: data.homepage, mode }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setMsg({
          ok: true,
          text:
            mode === "local"
              ? "已写入本地 src/data/site-content.json"
              : "已保存，约 1–3 分钟后 Cloudflare 自动重建生效",
        });
      } else if (res.status === 401) {
        setMsg({ ok: false, text: "会话已失效，请重新登录" });
        router.push("/admin/login");
      } else {
        setMsg({ ok: false, text: json.error || `保存失败（${res.status}）` });
      }
    } catch (e) {
      setMsg({ ok: false, text: "请求异常：" + String(e) });
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "same-origin",
      });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  const { profile, homepage } = data;

  // 本地环境判定：localhost / 127.0.0.1 / *.local 视为本地调试，显示「仅更改本地文件」按钮
  const isLocal =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.endsWith(".local"));

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <header className="border-b border-[var(--divider)] bg-[var(--bg-card)] px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">站点后台管理</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              修改后保存到 GitHub（约 1–3 分钟自动重建生效）；本地调试可仅写入本地文件
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-md border border-[var(--divider)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
            >
              返回首页
            </Link>
            <ThemeToggle />
            <button
              onClick={logout}
              disabled={loggingOut}
              className="rounded-md border border-[var(--divider)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] disabled:opacity-50"
            >
              {loggingOut ? "退出中…" : "退出登录"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                tab === t.key
                  ? "bg-[var(--accent)] text-[var(--text-on-accent)]"
                  : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--divider)] hover:bg-[var(--bg-muted)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 表单区 */}
        <div className="rounded-lg border border-[var(--divider)] bg-[var(--bg-card)] p-5">
          {tab === "basic" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="姓名" value={profile.name} onChange={(v) => setProfile({ name: v })} />
              <Field label="职位" value={profile.role} onChange={(v) => setProfile({ role: v })} />
              <Field label="标语" value={profile.tagline} onChange={(v) => setProfile({ tagline: v })} />
              <Field label="现居" value={profile.location} onChange={(v) => setProfile({ location: v })} />
              <Field label="邮箱" value={profile.email} onChange={(v) => setProfile({ email: v })} />
              <Field
                label="头像路径"
                value={profile.avatar}
                onChange={(v) => setProfile({ avatar: v })}
                placeholder="本地路径如 /images/avatar.jpg，或外链 https://..."
              />
              <div className="sm:col-span-2 flex items-center gap-3 rounded-md border border-[var(--divider)] bg-[var(--bg-primary)] px-3 py-2">
                <Avatar src={profile.avatar} name={profile.name} size={56} />
                <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  支持两种格式：① 本地路径（如 <code className="text-[var(--text-primary)]">/images/avatar.jpg</code>，需把图片放到 <code className="text-[var(--text-primary)]">public/</code> 下）；② 外部图片链接（以 <code className="text-[var(--text-primary)]">http://</code> 或 <code className="text-[var(--text-primary)]">https://</code> 开头）。加载失败时自动回退为姓名首字母。
                </div>
              </div>
            </div>
          )}

          {tab === "social" && (
            <div className="flex flex-col gap-4">
              {profile.social.map((item, i) => (
                <div key={i} className="rounded-md border border-[var(--divider)] p-3">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <Select
                      value={item.platform}
                      onChange={(v) =>
                        updateSocial(i, {
                          platform: v,
                          label: v === "custom" ? item.label ?? "" : undefined,
                        })
                      }
                      groups={SOCIAL_GROUPS}
                      placeholder="选择平台"
                      maxHeight={280}
                      renderIcon={(v) => <SocialIcon platform={v} size={16} />}
                    />
                    {item.platform === "custom" && (
                      <input
                        placeholder="自定义名称"
                        value={item.label ?? ""}
                        onChange={(e) => updateSocial(i, { label: e.target.value })}
                        className="w-40 rounded-md border border-[var(--divider)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                      />
                    )}
                    <button
                      onClick={() => removeSocial(i)}
                      className="ml-auto text-xs text-red-600 hover:underline"
                    >
                      删除
                    </button>
                  </div>
                  <Field
                    label="链接地址"
                    value={item.url}
                    onChange={(v) => updateSocial(i, { url: v })}
                  />
                </div>
              ))}
              <button
                onClick={addSocial}
                className="self-start rounded-md border border-[var(--divider)] px-3 py-1.5 text-sm hover:bg-[var(--bg-muted)]"
              >
                + 添加社交链接
              </button>
            </div>
          )}

          {tab === "mbti" && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="类型" value={profile.mbti.type} onChange={(v) => setProfile({ mbti: { ...profile.mbti, type: v } })} />
                <Field label="中文名" value={profile.mbti.name} onChange={(v) => setProfile({ mbti: { ...profile.mbti, name: v } })} />
                <Field label="英文名" value={profile.mbti.nameEn} onChange={(v) => setProfile({ mbti: { ...profile.mbti, nameEn: v } })} />
              </div>
              <TextArea label="一句话描述" value={profile.mbti.description} onChange={(v) => setProfile({ mbti: { ...profile.mbti, description: v } })} />
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">四个维度</span>
                {profile.mbti.dimensions.map((d, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    <Field label="左" value={d.left} onChange={(v) => updateDim(i, { left: v })} />
                    <Field label="右" value={d.right} onChange={(v) => updateDim(i, { right: v })} />
                    <Field label="左名" value={d.leftName} onChange={(v) => updateDim(i, { leftName: v })} />
                    <Field label="右名" value={d.rightName} onChange={(v) => updateDim(i, { rightName: v })} />
                    <Field label="倾向%" value={String(d.score)} onChange={(v) => updateDim(i, { score: Number(v) || 0 })} />
                  </div>
                ))}
              </div>
              <TextArea label="核心优势（逗号分隔）" value={profile.mbti.strengths.join("，")} onChange={(v) => setProfile({ mbti: { ...profile.mbti, strengths: toList(v) } })} />
              <TextArea label="潜在盲区（逗号分隔）" value={profile.mbti.weaknesses.join("，")} onChange={(v) => setProfile({ mbti: { ...profile.mbti, weaknesses: toList(v) } })} />
            </div>
          )}

          {tab === "projects" && (
            <div className="flex flex-col gap-4">
              {profile.projects.map((p, i) => {
                const featured = homepage.featuredProjectIds.includes(p.id);
                return (
                  <div key={p.id} className="rounded-md border border-[var(--divider)] p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">项目 {i + 1}（{p.id}）</span>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                          <input
                            type="checkbox"
                            checked={featured}
                            onChange={(e) =>
                              setHomepage({
                                featuredProjectIds: e.target.checked
                                  ? [...homepage.featuredProjectIds, p.id]
                                  : homepage.featuredProjectIds.filter((x) => x !== p.id),
                              })
                            }
                          />
                          首页展示
                        </label>
                        <button
                          onClick={() =>
                            setProfile({ projects: profile.projects.filter((_, j) => j !== i) })
                          }
                          className="text-xs text-red-600 hover:underline"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Field label="名称" value={p.name} onChange={(v) => updateProject(i, { name: v })} />
                      <Field label="封面路径" value={p.image} onChange={(v) => updateProject(i, { image: v })} />
                      <Field label="Demo 链接" value={p.demoUrl ?? ""} onChange={(v) => updateProject(i, { demoUrl: v })} />
                      <Field label="GitHub 链接" value={p.githubUrl ?? ""} onChange={(v) => updateProject(i, { githubUrl: v })} />
                      <div className="sm:col-span-2">
                        <TextArea label="描述" value={p.description} onChange={(v) => updateProject(i, { description: v })} />
                      </div>
                      <div className="sm:col-span-2">
                        <Field label="标签（逗号分隔）" value={p.tags.join("，")} onChange={(v) => updateProject(i, { tags: toList(v) })} />
                      </div>
                    </div>
                  </div>
                );
              })}
              <button
                onClick={() =>
                  setProfile({
                    projects: [
                      ...profile.projects,
                      {
                        id: `project-${Date.now()}`,
                        name: "新项目",
                        description: "",
                        tags: [],
                        image: "",
                      },
                    ],
                  })
                }
                className="self-start rounded-md border border-[var(--divider)] px-3 py-1.5 text-sm hover:bg-[var(--bg-muted)]"
              >
                + 新增项目
              </button>
            </div>
          )}

          {tab === "about" && (
            <div className="flex flex-col gap-4">
              <TextArea label="个人简介（bio）" value={profile.bio} onChange={(v) => setProfile({ bio: v })} rows={6} />
              <TextArea label="理念陈述（philosophy）" value={homepage.philosophy} onChange={(v) => setHomepage({ philosophy: v })} rows={3} />
              <Field label="专注方向（逗号分隔）" value={homepage.focus.join("，")} onChange={(v) => setHomepage({ focus: toList(v) })} />
              <Field label="状态徽章" value={homepage.statusBadge} onChange={(v) => setHomepage({ statusBadge: v })} />
            </div>
          )}

          {tab === "footer" && (
            <TextArea label="页脚免责声明" value={profile.disclaimer} onChange={(v) => setProfile({ disclaimer: v })} rows={3} />
          )}
        </div>

        {/* 保存 */}
        <div className="flex items-center gap-4">
          <button
            onClick={confirmSave}
            disabled={saving}
            className="rounded-md bg-[var(--accent)] px-5 py-2 text-sm font-medium text-[var(--text-on-accent)] disabled:opacity-50"
          >
            {saving ? "保存中…" : "保存到 GitHub"}
          </button>
          {mounted && isLocal && (
            <button
              onClick={() => save("local")}
              disabled={saving}
              className="rounded-md border border-[var(--divider)] px-5 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] disabled:opacity-50"
            >
              {saving ? "保存中…" : "仅更改本地文件"}
            </button>
          )}
          {msg && (
            <span className={`text-sm ${msg.ok ? "text-green-600" : "text-red-600"}`}>
              {msg.text}
            </span>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="确认保存到 GitHub？"
        description="保存将触发一次 GitHub 提交并自动重建 Cloudflare 部署（Worker 每日有部署额度限制）。"
        confirmText="确定保存"
        cancelText="取消"
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          save("github");
        }}
      />
    </div>
  );

  function updateDim(i: number, patch: Partial<Profile["mbti"]["dimensions"][number]>) {
    const dims = profile.mbti.dimensions.map((d, idx) => (idx === i ? { ...d, ...patch } : d));
    setProfile({ mbti: { ...profile.mbti, dimensions: dims as Profile["mbti"]["dimensions"] } });
  }

  function updateProject(i: number, patch: Partial<Profile["projects"][number]>) {
    const projects = profile.projects.map((p, idx) => (idx === i ? { ...p, ...patch } : p));
    setProfile({ projects });
  }

  function updateSocial(i: number, patch: Partial<Profile["social"][number]>) {
    const social = profile.social.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    setProfile({ social });
  }

  function addSocial() {
    setProfile({ social: [...profile.social, { platform: "github", url: "" }] });
  }

  function removeSocial(i: number) {
    setProfile({ social: profile.social.filter((_, idx) => idx !== i) });
  }
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-[var(--text-primary)]">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-[var(--divider)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-[var(--text-primary)]">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-[var(--divider)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
      />
    </label>
  );
}
