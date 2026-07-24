import profile from "./profile";

// 首页门户专属数据，复用同一份 Profile，避免重复维护
export const homepage = {
  // 字母 monogram（无头像时使用），取姓名首字
  monogram: profile.name.charAt(0),
  // 状态徽章
  statusBadge: "开放新机会",
  // 首页精选 3 个项目（引用 profile.projects 前 3 个）
  featuredProjectIds: profile.projects.slice(0, 3).map((p) => p.id),
  // 首页理念陈述（与简历页完整自述区分，一句话更有记忆点）
  philosophy:
    "我相信好的工具应该安静地解决问题——代码、产品、体验，皆如此。 真棒",
  // 当前专注方向（取技能大类前两项）
  focus: profile.skills.slice(0, 2).map((s) => s.name),
};

export default homepage;
