"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";
import profile from "@/data/profile";
import { Reveal } from "@/components/ui/reveal";
import { SocialLinks } from "@/components/ui/social-links";
import { ElectricBorder } from "@/components/reactbits/electric-border";

export function HomeContact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // 忽略剪贴板不可用的环境
    }
  };

  return (
    <Reveal id="contact" className="hm-section hm-hairline">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 text-center">
        <span className="hm-eyebrow">联系 / Contact</span>
        <h2 className="hm-h2 mt-5">一起做点有意思的事？</h2>
        <p className="mt-4 text-[var(--text-secondary)] max-w-lg mx-auto">
          无论合作、招聘还是单纯聊聊技术，欢迎随时来信。
        </p>

        <div className="mt-10 inline-block">
          <ElectricBorder
            color="var(--accent)"
            speed={0.6}
            chaos={0.08}
            borderRadius={20}
          >
            <div className="p-8 sm:p-10 flex flex-col items-center gap-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={copyEmail}
                  className="hm-btn-primary"
                >
                  {copied ? <Check size={16} /> : <Mail size={16} />}
                  {copied ? "已复制邮箱" : profile.email}
                </button>
                <a
                  href={`mailto:${profile.email}`}
                  className="hm-btn-ghost"
                >
                  <Mail size={16} />
                  直接发邮件
                </a>
              </div>

              <SocialLinks iconSize={18} />
            </div>
          </ElectricBorder>
        </div>
      </div>
    </Reveal>
  );
}
