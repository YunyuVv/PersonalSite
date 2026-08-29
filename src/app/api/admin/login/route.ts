import { NextRequest, NextResponse } from "next/server";
import { getAppEnv } from "@/lib/server-env";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const env = await getAppEnv();
  const body = await req.json().catch(() => null);
  const key = typeof body?.key === "string" ? body.key : "";

  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) {
    return NextResponse.json({ ok: false, error: "口令错误" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", key, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 天
  });
  return res;
}
