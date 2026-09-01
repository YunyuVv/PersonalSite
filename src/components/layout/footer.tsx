import profile from "@/data/profile";
import { homepage } from "@/data/homepage";

export function Footer() {
  // 模块开关：footer 关闭时不渲染页脚
  if (homepage.modules?.footer === false) return null;

  return (
    <footer className="relative py-10 px-4 border-t border-[var(--divider)]">
      <div className="mx-auto max-w-6xl space-y-4">
        {profile.disclaimer && (
          <p className="text-xs leading-relaxed text-[var(--text-muted)] border-l-2 border-[var(--divider)] pl-3">
            {profile.disclaimer}
          </p>
        )}
        <p className="text-sm text-[var(--text-muted)]">
          {profile.footerCopyright?.trim()
            ? profile.footerCopyright.replace(/\{year\}/g, String(new Date().getFullYear()))
            : `© ${new Date().getFullYear()} ${profile.name}.`}
        </p>
      </div>
    </footer>
  );
}
