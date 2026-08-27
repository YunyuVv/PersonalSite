import { Mail } from "lucide-react";
import { getSiteConfig } from "@/lib/config";
import { Reveal } from "@/components/ui/reveal";
import { SocialLinks } from "@/components/ui/social-links";

export function ContactSection() {
  const config = getSiteConfig();
  return (
    <Reveal id="contact" className="md:col-span-6 bento-card p-8 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="bento-label">联系 / Contact</span>
          <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            一起做点有意思的事
          </h2>
          <p className="mt-2 text-[var(--text-secondary)] max-w-md">
            无论商务合作、内容共创还是单纯想聊聊投资，欢迎随时来信。
          </p>
        </div>

        <div className="flex md:flex-col gap-3">
          <a
            href={`mailto:${config.email}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--accent)] text-[var(--text-on-accent)] text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Mail size={16} />
            {config.email}
          </a>
          <div className="flex items-center">
            <SocialLinks iconSize={18} />
          </div>
        </div>
      </div>
    </Reveal>
  );
}
