import raw from "./site-content.json";
import profile from "./profile";

// 首页门户专属数据，复用同一份 Profile，避免重复维护。
// 单一数据源：site-content.json（可由 /admin 后台通过 GitHub API 写回）。
const content = raw as unknown as {
  homepage: {
    philosophy: string;
    focus: string[];
    statusBadge: string;
    featuredProjectIds: string[];
    modules: Record<string, boolean>;
  };
};

export const homepage = {
  // 字母 monogram（无头像时使用），取姓名首字
  monogram: profile.name.charAt(0),
  ...content.homepage,
};

/** 各内容模块的启用开关；缺省视为开启 */
export const moduleEnabled = (key: string): boolean => homepage.modules?.[key] !== false;

export default homepage;
