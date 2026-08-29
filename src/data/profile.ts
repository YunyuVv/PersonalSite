import raw from "./site-content.json";
import type { Profile } from "@/types/profile";

// 单一数据源：site-content.json（可由 /admin 后台通过 GitHub API 写回）。
// 此处仅做薄封装，组件 import 路径保持不变。
const content = raw as unknown as { profile: Profile };

const profile: Profile = content.profile;

export default profile;
