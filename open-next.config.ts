import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// 本项目是纯静态展示站（无 API / 无 middleware / 无 server actions），
// 用静态资源缓存即可，无需额外创建 KV / R2 绑定。
// 若后续接入 ISR / 按需重新验证，可将 incrementalCache 改为 r2IncrementalCache 并绑定 R2 桶。
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
