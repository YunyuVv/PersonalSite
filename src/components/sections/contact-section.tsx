"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Code2, Briefcase, Copy, Check } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Seal } from "@/components/ui/seal";
import { BrushDivider } from "@/components/ui/brush-divider";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import profile from "@/data/profile";

export function ContactSection() {
  const { copied, copy } = useCopyToClipboard();
  const reduced = useReducedMotion();

  const socialLinks = [
    { icon: Code2, href: profile.social.github, label: "GitHub" },
    { icon: Briefcase, href: profile.social.linkedin, label: "LinkedIn" },
  ].filter((l) => l.href);

  return (
    <SectionWrapper
      id="contact"
      dark
      className="py-24 md:py-32"
    >
      {/* 区域标题 */}
      <motion.div
        className="text-center mb-16"
        initial={reduced ? undefined : { opacity: 0, y: 20 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          联系我
        </h2>
        <BrushDivider />
      </motion.div>

      <div className="max-w-lg mx-auto text-center space-y-10">
        {/* CTA */}
        <motion.p
          className="text-lg md:text-xl font-light tracking-wide"
          initial={reduced ? undefined : { opacity: 0 }}
          whileInView={reduced ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{ fontFamily: "var(--font-serif)" }}
        >
          期待与你交流
        </motion.p>

        {/* 邮箱 */}
        <motion.div
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[var(--overlay-bg)] border border-[var(--overlay-border)] hover:bg-[var(--overlay-bg)]/150 transition-colors cursor-pointer"
          onClick={() => copy(profile.email)}
          whileHover={reduced ? undefined : { scale: 1.03 }}
          whileTap={reduced ? undefined : { scale: 0.97 }}
        >
          <Mail size={18} className="text-[var(--gold)]" />
          <span className="text-base font-mono">{profile.email}</span>
          {copied ? (
            <Check size={16} className="text-green-400" />
          ) : (
            <Copy size={16} className="opacity-50" />
          )}
        </motion.div>

        {/* 复制提示 */}
        {copied && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-[var(--gold)]"
          >
            已复制到剪贴板
          </motion.p>
        )}

        {/* 社交链接 */}
        <motion.div
          className="flex items-center justify-center gap-4"
          initial={reduced ? undefined : { opacity: 0 }}
          whileInView={reduced ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {socialLinks.map(({ icon: Icon, href, label }, i) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={
                reduced
                  ? undefined
                  : { scale: 1.15, rotate: [0, -5, 5, 0] }
              }
              whileTap={reduced ? undefined : { scale: 0.95 }}
              className="p-3 rounded-full bg-[var(--overlay-bg)] border border-[var(--overlay-border)] text-[var(--overlay-text)] hover:text-[var(--gold)] hover:border-[var(--gold)]/40 transition-colors"
              aria-label={label}
            >
              <Icon size={20} />
            </motion.a>
          ))}
        </motion.div>

        {/* 印章落款 */}
        <motion.div
          className="pt-8"
          initial={reduced ? undefined : { opacity: 0, scale: 0.8 }}
          whileInView={
            reduced ? undefined : { opacity: 1, scale: 1 }
          }
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Seal name={profile.name} />
          <p className="text-xs text-[var(--overlay-text)]/40 mt-3">
            {profile.name} 敬上
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
