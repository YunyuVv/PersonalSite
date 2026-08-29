import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminForm from "@/components/admin/admin-form";
import { getAppEnv } from "@/lib/server-env";
import profile from "@/data/profile";
import homepage from "@/data/homepage";

// 读取 Cookie，必须动态渲染（不能在静态路由里取 Cookie/env）
export const dynamic = "force-dynamic";

export const metadata = {
  title: "后台管理 · PersonalSite",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const env = await getAppEnv();

  // 未登录或口令不匹配 → 跳转到登录页
  if (!env.ADMIN_KEY || !session || session !== env.ADMIN_KEY) {
    redirect("/admin/login");
  }

  const initialData = {
    profile,
    homepage: {
      philosophy: homepage.philosophy,
      focus: homepage.focus,
      statusBadge: homepage.statusBadge,
      featuredProjectIds: homepage.featuredProjectIds,
    },
  };
  return <AdminForm initialData={initialData} />;
}
