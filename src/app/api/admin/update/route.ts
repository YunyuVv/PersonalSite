import { NextRequest, NextResponse } from "next/server";
import { getAppEnv } from "@/lib/server-env";

// 该接口只写回这一个固定路径，避免任意文件写入
const REPO_FILE = "src/data/site-content.json";
const COMMIT_MESSAGE = "chore: update site content via admin";

export const dynamic = "force-dynamic";

type Env = {
  ADMIN_KEY?: string;
  GITHUB_TOKEN?: string;
  GITHUB_REPO?: string;
  GITHUB_BRANCH?: string;
};

/** 深合并：对象递归，数组/基本类型直接覆盖（入参优先） */
function deepMerge<T>(base: T, patch: Partial<T>): T {
  // 任一为数组则整体覆盖（数组不逐元素合并）
  if (Array.isArray(base) || Array.isArray(patch)) {
    return (patch ?? base) as T;
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(patch as Record<string, unknown>)) {
    const bv = (base as Record<string, unknown>)?.[key];
    const pv = (patch as Record<string, unknown>)[key];
    if (
      pv &&
      typeof pv === "object" &&
      !Array.isArray(pv) &&
      bv &&
      typeof bv === "object" &&
      !Array.isArray(bv)
    ) {
      out[key] = deepMerge(bv, pv as Record<string, unknown>);
    } else {
      out[key] = pv;
    }
  }
  return out as T;
}

export async function POST(req: NextRequest) {
  const env = await getAppEnv();

  // 鉴权：优先请求头 x-admin-key，其次 Cookie（登录后由浏览器自动携带）
  const adminKey =
    req.headers.get("x-admin-key") ?? req.cookies.get("admin_session")?.value;
  if (!env.ADMIN_KEY || !adminKey || adminKey !== env.ADMIN_KEY) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
  if (!body.profile && !body.homepage) {
    return NextResponse.json(
      { ok: false, error: "nothing to update" },
      { status: 400 }
    );
  }

  const repo = env.GITHUB_REPO;
  const branch = env.GITHUB_BRANCH || "main";
  const token = env.GITHUB_TOKEN;
  if (!repo || !token) {
    return NextResponse.json(
      { ok: false, error: "server missing GITHUB_REPO / GITHUB_TOKEN" },
      { status: 500 }
    );
  }

  const apiBase = `https://api.github.com/repos/${repo}/contents/${REPO_FILE}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "personal-site-admin",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // 合并入参到仓库当前内容（最多重试 1 次以处理并发 409）
  for (let attempt = 0; attempt < 2; attempt++) {
    const getRes = await fetch(`${apiBase}?ref=${branch}`, { headers });
    if (!getRes.ok) {
      return NextResponse.json(
        { ok: false, error: `github get failed: ${getRes.status}` },
        { status: 502 }
      );
    }
    const current = await getRes.json();
    const decoded = JSON.parse(
      Buffer.from(current.content, "base64").toString("utf-8")
    );
    const merged = {
      profile: body.profile
        ? deepMerge(decoded.profile, body.profile as Record<string, unknown>)
        : decoded.profile,
      homepage: body.homepage
        ? deepMerge(decoded.homepage, body.homepage as Record<string, unknown>)
        : decoded.homepage,
    };
    const content = Buffer.from(
      JSON.stringify(merged, null, 2),
      "utf-8"
    ).toString("base64");

    const putRes = await fetch(apiBase, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: COMMIT_MESSAGE,
        content,
        sha: current.sha,
        branch,
      }),
    });

    if (putRes.ok) {
      return NextResponse.json({ ok: true });
    }
    // 仅在首次且为冲突时重试
    if (putRes.status === 409 && attempt === 0) {
      continue;
    }
    const errText = await putRes.text().catch(() => "");
    return NextResponse.json(
      { ok: false, error: `github put failed: ${putRes.status} ${errText}` },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: false, error: "github write failed" }, { status: 502 });
}
