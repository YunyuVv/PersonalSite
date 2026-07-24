import profile from "@/data/profile";
import { SocialLinks } from "@/components/ui/social-links";

export function Footer() {
  return (
    <footer className="relative py-10 px-4 border-t border-[var(--divider)]">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-5">
        <p className="text-sm text-[var(--text-muted)]">
          &copy; {new Date().getFullYear()} {profile.name}. 用 Next.js 构建。
        </p>
        <SocialLinks iconSize={18} />
      </div>
    </footer>
  );
}
