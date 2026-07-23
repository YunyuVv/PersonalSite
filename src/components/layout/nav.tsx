"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { useTheme } from "@/hooks/use-theme";

const NAV_ITEMS = [
  { id: "about", label: "关于" },
  { id: "skills", label: "技能" },
  { id: "projects", label: "项目" },
  { id: "contact", label: "联系" },
] as const;

export function Nav() {
  const activeSection = useScrollSpy();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

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
          <div className="flex items-center justify-end h-16">
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1 bg-[var(--bg-card)]/80 backdrop-blur-xl rounded-full px-2 py-1.5 border border-[var(--divider)] shadow-sm">
              {NAV_ITEMS.map((item) => (
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
                onClick={toggle}
                className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
                aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggle}
                className="p-2 rounded-full bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--divider)] text-[var(--text-secondary)] cursor-pointer"
                aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 rounded-full bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--divider)] text-[var(--text-primary)] cursor-pointer"
                aria-label="打开菜单"
              >
                <Menu size={20} />
              </button>
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
              {NAV_ITEMS.map((item, i) => (
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
