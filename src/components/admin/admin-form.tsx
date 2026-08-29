"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Profile } from "@/types/profile";
import ConfirmDialog from "@/components/ui/confirm-dialog";

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

const SOCIAL_KEYS = [
  "github",
  "linkedin",
  "juejin",
  "zhihu",
  "twitter",
  "wechat",
  "website",
] as const;

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

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ profile: data.profile, homepage: data.homepage }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setMsg({
          ok: true,
          text: "已保存，约 1–3 分钟后 Cloudflare 自动重建生效",
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

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">站点后台管理</h1>
            <p className="text-sm text-neutral-500">
              修改后保存到 GitHub，触发 Cloudflare 自动重建（约 1–3 分钟生效）
            </p>
          </div>
          <button
            onClick={logout}
            disabled={loggingOut}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 disabled:opacity-50"
          >
            {loggingOut ? "退出中…" : "退出登录"}
          </button>
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
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 表单区 */}
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          {tab === "basic" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="姓名" value={profile.name} onChange={(v) => setProfile({ name: v })} />
              <Field label="职位" value={profile.role} onChange={(v) => setProfile({ role: v })} />
              <Field label="标语" value={profile.tagline} onChange={(v) => setProfile({ tagline: v })} />
              <Field label="现居" value={profile.location} onChange={(v) => setProfile({ location: v })} />
              <Field label="邮箱" value={profile.email} onChange={(v) => setProfile({ email: v })} />
              <Field label="头像路径" value={profile.avatar} onChange={(v) => setProfile({ avatar: v })} />
            </div>
          )}

          {tab === "social" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {SOCIAL_KEYS.map((k) => (
                <Field
                  key={k}
                  label={k}
                  value={profile.social[k] ?? ""}
                  onChange={(v) =>
                    setProfile({ social: { ...profile.social, [k]: v } })
                  }
                />
              ))}
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
                  <div key={p.id} className="rounded-md border border-neutral-200 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">项目 {i + 1}（{p.id}）</span>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-sm text-neutral-600">
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
                className="self-start rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100"
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
            className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "保存中…" : "保存到 GitHub"}
          </button>
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
          save();
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
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-neutral-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
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
      <span className="mb-1 block text-sm font-medium text-neutral-700">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
      />
    </label>
  );
}
