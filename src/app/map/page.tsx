"use client";

import { useMemo, useState } from "react";
import { useSiteConfig } from "@/lib/site-config-context";

/* ---------------- 布局（径向：中心 + 四向模块 + 分支） ---------------- */

const VIEW_W = 1200;
const VIEW_H = 820;
const CX = 600;
const CY = 410;
const R1 = 175; // 模块距中心
const R2 = 105; // 叶子距模块

type Dir = "up" | "right" | "down" | "left";

interface Pos {
  x: number;
  y: number;
}

function groupPos(dir: Dir): Pos {
  switch (dir) {
    case "up":
      return { x: CX, y: CY - R1 };
    case "down":
      return { x: CX, y: CY + R1 };
    case "left":
      return { x: CX - R1, y: CY };
    case "right":
      return { x: CX + R1, y: CY };
  }
}

function leafPos(dir: Dir, group: Pos, i: number, n: number): Pos {
  const sx = Math.min(125, (VIEW_W - 240) / Math.max(n, 1));
  const sy = Math.min(82, (VIEW_H - 240) / Math.max(n, 1));
  const off = i - (n - 1) / 2;
  switch (dir) {
    case "up":
      return { x: CX + off * sx, y: group.y - R2 };
    case "down":
      return { x: CX + off * sx, y: group.y + R2 };
    case "left":
      return { x: group.x - R2, y: CY + off * sy };
    case "right":
      return { x: group.x + R2, y: CY + off * sy };
  }
}

interface GraphNode {
  id: string;
  kind: "center" | "group" | "leaf";
  label: string;
  sub?: string;
  parent?: string; // leaf -> group id
  pos: Pos;
  payload?: { kind: string; data: unknown };
}

function buildGraph(config: ReturnType<typeof useSiteConfig>): {
  nodes: GraphNode[];
  edges: [string, string][];
} {
  const socials = [
    { name: "微信", url: config.social.wechat },
    { name: "小红书", url: config.social.xiaohongshu },
    { name: "微博", url: config.social.weibo },
  ].filter(
    (s) =>
      s.url && !s.url.includes("yourname") && s.url !== "https://mp.weixin.qq.com/"
  );

  const GROUPS: {
    id: string;
    label: string;
    dir: Dir;
    leaves: { id: string; label: string; sub?: string; kind: string; data: unknown }[];
  }[] = [
    {
      id: "skills",
      label: "技能",
      dir: "up",
      leaves: config.skills.map((c) => ({
        id: `skill-${c.name}`,
        label: c.name,
        kind: "skill",
        data: c,
      })),
    },
    {
      id: "projects",
      label: "项目",
      dir: "right",
      leaves: config.projects.map((p) => ({
        id: `proj-${p.id}`,
        label: p.name,
        sub: p.description,
        kind: "project",
        data: p,
      })),
    },
    {
      id: "experience",
      label: "经历",
      dir: "down",
      leaves: config.experiences.map((e, i) => ({
        id: `exp-${i}`,
        label: e.company,
        sub: e.role,
        kind: "experience",
        data: e,
      })),
    },
    {
      id: "contact",
      label: "联系",
      dir: "left",
      leaves: socials.map((s) => ({
        id: `soc-${s.name}`,
        label: s.name,
        sub: s.url,
        kind: "social",
        data: s,
      })),
    },
  ];

  const nodes: GraphNode[] = [];
  const edges: [string, string][] = [];

  nodes.push({
    id: "me",
    kind: "center",
    label: config.name,
    sub: config.role,
    pos: { x: CX, y: CY },
  });

  for (const g of GROUPS) {
    const gp = groupPos(g.dir);
    nodes.push({ id: g.id, kind: "group", label: g.label, pos: gp });
    edges.push(["me", g.id]);

    g.leaves.forEach((leaf, i) => {
      const lp = leafPos(g.dir, gp, i, g.leaves.length);
      nodes.push({
        id: leaf.id,
        kind: "leaf",
        label: leaf.label,
        sub: leaf.sub,
        parent: g.id,
        pos: lp,
        payload: { kind: leaf.kind, data: leaf.data },
      });
      edges.push([g.id, leaf.id]);
    });
  }
  return { nodes, edges };
}

/* ---------------- 详情渲染 ---------------- */

function SkillBars({ cat }: { cat: { name: string; items: { name: string; level: number }[] } }) {
  return (
    <div className="space-y-3">
      {cat.items.map((it) => (
        <div key={it.name}>
          <div className="flex justify-between text-[11px] text-slate-300/90">
            <span>{it.name}</span>
            <span className="text-sky-300/80">L{it.level}</span>
          </div>
          <div className="mt-1 h-1.5 w-full bg-slate-700/40">
            <div
              className="h-full bg-sky-400"
              style={{ width: `${(it.level / 5) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Detail({
  node,
  config,
  nodes,
}: {
  node: GraphNode | undefined;
  config: ReturnType<typeof useSiteConfig>;
  nodes: GraphNode[];
}) {
  if (!node) {
    return (
      <div className="text-slate-500 text-sm leading-relaxed">
        <p className="text-slate-400">// 悬停或点击任意节点</p>
        <p className="mt-2">查看「{config.name}」的系统拓扑——</p>
        <p>技能、项目、经历与联系，皆由此人连接。</p>
      </div>
    );
  }

  if (node.kind === "center") {
    return (
      <div className="space-y-3">
        <h3 className="text-xl text-white font-semibold">{config.name}</h3>
        <p className="text-sky-300 text-sm">{config.role} · {config.location}</p>
        <p className="text-slate-400 text-xs italic">“{config.tagline}”</p>
        <p className="text-sm text-slate-300/90 leading-relaxed">{config.bio}</p>
        <span className="inline-block mt-1 px-2 py-0.5 border border-emerald-400/60 text-emerald-300 text-[11px]">
          ● {config.statusBadge || "开放新机会"}
        </span>
      </div>
    );
  }

  if (node.kind === "group") {
    const children = nodes.filter((n) => n.parent === node.id);
    return (
      <div className="space-y-2">
        <h3 className="text-lg text-white">{node.label} 模块</h3>
        <p className="text-slate-400 text-xs">包含 {children.length} 个节点，悬停查看明细。</p>
        <ul className="text-sm text-slate-300/90 space-y-1 mt-2">
          {children.map((c) => (
            <li key={c.id} className="border-l-2 border-slate-600 pl-2">{c.label}</li>
          ))}
        </ul>
      </div>
    );
  }

  // leaf
  const p = node.payload!;
  if (p.kind === "skill") {
    const c = p.data as { name: string; items: { name: string; level: number }[] };
    return (
      <div className="space-y-2">
        <h3 className="text-lg text-white">{c.name}</h3>
        <SkillBars cat={c} />
      </div>
    );
  }
  if (p.kind === "project") {
    const pr = p.data as { description: string; tags: string[]; demoUrl?: string; githubUrl?: string };
    return (
      <div className="space-y-2">
        <h3 className="text-lg text-white">{node.label}</h3>
        <p className="text-sm text-slate-300/90">{pr.description}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {pr.tags.map((t) => (
            <span key={t} className="px-1.5 py-0.5 bg-slate-700/50 text-slate-300 text-[11px]">{t}</span>
          ))}
        </div>
        <div className="flex gap-3 pt-1 text-xs">
          {pr.demoUrl && <a className="text-sky-300 hover:underline" href={pr.demoUrl}>Demo ↗</a>}
          {pr.githubUrl && <a className="text-sky-300 hover:underline" href={pr.githubUrl}>GitHub ↗</a>}
        </div>
      </div>
    );
  }
  if (p.kind === "experience") {
    const e = p.data as { role: string; startDate: string; endDate: string; highlights: string[] };
    return (
      <div className="space-y-2">
        <h3 className="text-lg text-white">{node.label}</h3>
        <p className="text-sky-300 text-sm">{e.role}</p>
        <p className="text-slate-500 text-xs">{e.startDate} — {e.endDate}</p>
        <ul className="text-sm text-slate-300/90 space-y-1 mt-1 list-disc list-inside">
          {e.highlights.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      </div>
    );
  }
  // social
  const s = p.data as { name: string; url: string };
  return (
    <div className="space-y-2">
      <h3 className="text-lg text-white">{s.name}</h3>
      <a className="text-sky-300 text-sm break-all hover:underline" href={s.url}>{s.url}</a>
    </div>
  );
}

/* ---------------- 主组件 ---------------- */

export default function MapPage() {
  const config = useSiteConfig();
  const { nodes, edges } = useMemo(() => buildGraph(config), [config]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);

  const active = activeId ?? pinned;

  // 计算高亮集合
  const activeNode = nodes.find((n) => n.id === active);
  const highlightNodes = new Set<string>();
  const highlightEdges = new Set<string>();
  if (activeNode) {
    if (activeNode.kind === "center") {
      nodes.forEach((n) => highlightNodes.add(n.id));
      edges.forEach(([a, b]) => highlightEdges.add(`${a}->${b}`));
    } else if (activeNode.kind === "group") {
      highlightNodes.add("me");
      highlightNodes.add(activeNode.id);
      edges.forEach(([a, b]) => {
        if (a === activeNode.id || b === activeNode.id) {
          highlightNodes.add(a);
          highlightNodes.add(b);
          highlightEdges.add(`${a}->${b}`);
        }
      });
    } else {
      // leaf
      const g = activeNode.parent!;
      highlightNodes.add("me");
      highlightNodes.add(g);
      highlightNodes.add(activeNode.id);
      highlightEdges.add(`me->${g}`);
      highlightEdges.add(`${g}->${activeNode.id}`);
    }
  }

  const activeDetail = nodes.find((n) => n.id === active);

  const onEnter = (id: string) => setActiveId(id);
  const onLeave = () => setActiveId(null);
  const onClick = (id: string) => setPinned((p) => (p === id ? null : id));

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden font-mono"
      style={{ background: "radial-gradient(1200px 800px at 50% 40%, #0d1424 0%, #070b14 70%)" }}
      onClick={() => setPinned(null)}
    >
      {/* 蓝图网格 */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="rgba(56,189,248,0.06)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* 顶部栏 */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 text-slate-300">
        <span className="text-sm tracking-widest text-sky-300/80">~/ SYS-MAP</span>
        <nav className="flex gap-4 text-xs">
          <a href="/" className="hover:text-white">HOME</a>
          <a href="/map" className="text-sky-300">MAP</a>
        </nav>
      </header>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4">
        <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
          以架构作画
        </h1>
        <p className="mt-1 text-center text-xs text-slate-400 sm:text-sm">
          {config.name} · {config.role} 的系统性自画像 — 悬停 / 点击节点展开
        </p>
      </div>

      {/* 图 + 详情 */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-4 px-4 pb-10 lg:flex-row">
        <div className="flex-1">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="h-auto w-full"
            style={{ maxHeight: "72vh" }}
          >
            {/* 连线 */}
            {edges.map(([a, b]) => {
              const na = nodes.find((n) => n.id === a)!;
              const nb = nodes.find((n) => n.id === b)!;
              const key = `${a}->${b}`;
              const on = highlightEdges.has(key);
              // 中心到模块用曲线，模块到叶子用直线
              const d =
                a === "me"
                  ? `M${na.pos.x},${na.pos.y} Q${(na.pos.x + nb.pos.x) / 2},${(na.pos.y + nb.pos.y) / 2 - 40} ${nb.pos.x},${nb.pos.y}`
                  : `M${na.pos.x},${na.pos.y} L${nb.pos.x},${nb.pos.y}`;
              return (
                <path
                  key={key}
                  d={d}
                  fill="none"
                  stroke={on ? "rgba(56,189,248,0.75)" : "rgba(148,163,184,0.22)"}
                  strokeWidth={on ? 1.8 : 1}
                />
              );
            })}

            {/* 节点 */}
            {nodes.map((n) => {
              const on = highlightNodes.has(n.id);
              const isCenter = n.kind === "center";
              const r = isCenter ? 46 : n.kind === "group" ? 30 : 22;
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.pos.x},${n.pos.y})`}
                  className="cursor-pointer"
                  onMouseEnter={() => onEnter(n.id)}
                  onMouseLeave={onLeave}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick(n.id);
                  }}
                >
                  <circle
                    r={r}
                    fill={on ? "rgba(56,189,248,0.14)" : "rgba(15,23,42,0.92)"}
                    stroke={on ? "#38bdf8" : isCenter ? "#e2e8f0" : "rgba(148,163,184,0.55)"}
                    strokeWidth={on ? 2 : 1.2}
                  />
                  <text
                    textAnchor="middle"
                    dy={n.sub ? "-0.1em" : "0.32em"}
                    className="select-none"
                    fontSize={isCenter ? 14 : n.kind === "group" ? 13 : 10}
                    fill={on ? "#f8fafc" : isCenter ? "#ffffff" : "#cbd5e1"}
                  >
                    {n.label.length > 8 ? n.label.slice(0, 7) + "…" : n.label}
                  </text>
                  {n.sub && (
                    <text
                      textAnchor="middle"
                      dy="1.1em"
                      fontSize={n.kind === "group" ? 9 : 8}
                      fill={on ? "#7dd3fc" : "rgba(148,163,184,0.7)"}
                    >
                      {n.sub.length > 14 ? n.sub.slice(0, 13) + "…" : n.sub}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* 详情面板 */}
        <aside
          className="w-full shrink-0 rounded-lg border border-slate-700/60 bg-slate-900/70 p-5 backdrop-blur lg:w-80"
          onClick={(e) => e.stopPropagation()}
        >
          <Detail node={activeDetail} config={config} nodes={nodes} />
        </aside>
      </div>
    </main>
  );
}
