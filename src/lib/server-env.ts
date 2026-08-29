import { getCloudflareContext } from "@opennextjs/cloudflare";

export type AppEnv = {
  ADMIN_KEY?: string;
  GITHUB_TOKEN?: string;
  GITHUB_REPO?: string;
  GITHUB_BRANCH?: string;
};

/**
 * 统一读取环境变量：
 * - 生产（Cloudflare Worker）：优先从 getCloudflareContext 绑定读取
 * - 本地 next dev：Cloudflare ctx 不含自定义变量，回退到 process.env（如 .env.local）
 *
 * 注意：必须在动态路由/动态页面内调用，不能是静态路由或模块顶层。
 */
export async function getAppEnv(): Promise<AppEnv> {
  let cfEnv: Record<string, string | undefined> = {};
  try {
    const ctx = (await getCloudflareContext({ async: true })) as unknown as {
      env?: Record<string, string | undefined>;
    };
    if (ctx?.env) cfEnv = ctx.env;
  } catch {
    // 忽略：本地 dev 或静态预渲染阶段无 ctx
  }

  // cf 绑定优先；其上缺失的字段（多为本地开发时的自定义变量）从 process.env 补齐
  return {
    ADMIN_KEY: cfEnv.ADMIN_KEY ?? process.env.ADMIN_KEY,
    GITHUB_TOKEN: cfEnv.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN,
    GITHUB_REPO: cfEnv.GITHUB_REPO ?? process.env.GITHUB_REPO,
    GITHUB_BRANCH: cfEnv.GITHUB_BRANCH ?? process.env.GITHUB_BRANCH,
  };
}
