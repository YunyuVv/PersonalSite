"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code2, Briefcase, type LucideIcon } from "lucide-react";
import profile from "@/data/profile";

const socialIcons: Record<string, LucideIcon> = {
  github: Code2,
  linkedin: Briefcase,
};

export function Footer() {
  const [animationsDisabled, setAnimationsDisabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setAnimationsDisabled(
      localStorage.getItem("animations-disabled") === "true"
    );
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const next = !animationsDisabled;
    localStorage.setItem("animations-disabled", String(next));
    window.location.reload();
  };

  return (
    <footer className="relative py-12 px-4 bg-[var(--bg-primary)] border-t border-[var(--divider)]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-sm text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} {profile.name}. All rights
            reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {Object.entries(profile.social).map(([key, url]) => {
              if (!url) return null;
              const Icon =
                key === "github"
                  ? Code2
                  : key === "linkedin"
                    ? Briefcase
                    : null;
              if (!Icon) return null;

              return (
                <motion.a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-muted)] transition-colors"
                  aria-label={key}
                >
                  <Icon size={18} />
                </motion.a>
              );
            })}
          </div>

          {/* Animation Toggle */}
          <button
            onClick={handleToggle}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
          >
            动画:{" "}
            <span suppressHydrationWarning>
              {!mounted ? "开" : animationsDisabled ? "关" : "开"}
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
