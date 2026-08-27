"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun, Home } from "lucide-react";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { useTheme } from "next-themes";

const HOME_SECTIONS = ["about", "featured", "skills", "links", "contact"];
const RESUME_SECTIONS = ["about", "skills", "projects", "contact"];

const NAV_BY_PAGE = {
  home: [
    { id: "about", label: "关于" },
    { id: "featured", label: "作品" },
    { id: "skills", label: "技能" },
    { id: "contact", label: "联系" },
  ],
  resume: [
    { id: "about", label: "关于" },
    { id: "skills", label: "技能" },
    { id: "projects", label: "项目" },
    { id: "contact", label: "联系" },
  ],
} as const;

export function Nav() {
  const pathname = usePathname();
  const isResume = pathname === "/resume";
  const page = isResume ? "resume" : "home";
  const sectionIds = isResume ? RESUME_SECTIONS : HOME_SECTIONS;
  const navItems = NAV_BY_PAGE[page];

  const activeSection = useScrollSpy(sectionIds);
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = resolvedTheme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8"
      >
        <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Left: Home icon (品牌 / 返回首页) */}
          <Link
            href="/"
            aria-label="返回首页"
            className="hidden md:inline-flex items-center justify-center h-9 w-9 glass rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
          >
            <Home size={17} />
          </Link>

          {/* Right: desktop nav + mobile buttons */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 glass rounded-full px-2 py-1.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 cursor-pointer ${
                    activeSection === item.id
                      ? "text-[var(--text-on-accent)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-[var(--accent)] rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}

              <div className="w-px h-5 bg-[var(--divider)] mx-1" />
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
                aria-label={isDark ? "切换到浅色模式" : "切换到深色模式"}
              >
                {mounted ? (isDark ? <Sun size={16} /> : <Moon size={16} />) : null}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <Link
                href="/"
                aria-label="返回首页"
                className="p-2 rounded-full glass backdrop-blur-xl text-[var(--text-secondary)] cursor-pointer"
              >
                <Home size={18} />
              </Link>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full glass backdrop-blur-xl text-[var(--text-secondary)] cursor-pointer"
                aria-label={isDark ? "切换到浅色模式" : "切换到深色模式"}
              >
                {mounted ? (isDark ? <Sun size={18} /> : <Moon size={18} />) : null}
              </button>
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 rounded-full glass backdrop-blur-xl text-[var(--text-primary)] cursor-pointer"
                aria-label="打开菜单"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            <div
              className="absolute inset-0 bg-[var(--hero-bg-deep)]/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-64 bg-[var(--bg-card)] border-l border-[var(--divider)] p-6"
            >
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-full hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium mb-1 transition-colors cursor-pointer ${
                    activeSection === item.id
                      ? "bg-[var(--accent)] text-[var(--text-on-accent)]"
                      : "text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
