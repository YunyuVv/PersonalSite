import { NextRequest, NextResponse } from "next/server";
import { getSiteConfig, saveSiteConfig, type SiteConfig } from "@/lib/config";

// SSR 主链路需要 POST 鉴权实时生效，使用 force-dynamic；
// 静态导出时 Next 要求路由显式声明，由 next.config 之外的构建约束另行处理（兜底见 docs）
export const dynamic = "force-dynamic";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "change-me";

export async function GET() {
  return NextResponse.json(getSiteConfig());
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth || auth !== `Bearer ${ADMIN_TOKEN}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as Partial<SiteConfig>;
    const next = { ...getSiteConfig(), ...body } as SiteConfig;
    saveSiteConfig(next);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
}
