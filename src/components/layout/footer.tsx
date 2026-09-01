import { getSiteConfig } from "@/lib/config";

export function Footer() {
  const config = getSiteConfig();
  const m = config.modules ?? {};

  return (
    <footer className="relative py-10 px-4 border-t border-[var(--divider)]">
      <div className="mx-auto max-w-6xl space-y-4">
        {config.disclaimer && m.disclaimer !== false && (
          <p className="text-xs leading-relaxed text-[var(--text-muted)] border-l-2 border-[var(--divider)] pl-3">
            {config.disclaimer}
          </p>
        )}
        <p className="text-sm text-[var(--text-muted)]">
          &copy; {new Date().getFullYear()} {config.name}.
        </p>
      </div>
    </footer>
  );
}
