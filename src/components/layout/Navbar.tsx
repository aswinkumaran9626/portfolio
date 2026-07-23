"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { NAV_ITEMS } from "@/constants/nav";
import { SITE } from "@/constants/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeId = useActiveSection(NAV_ITEMS.map((item) => item.id));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <motion.nav
        animate={{
          maxWidth: scrolled ? 720 : 896,
          paddingTop: scrolled ? 8 : 12,
          paddingBottom: scrolled ? 8 : 12,
        }}
        transition={{ type: "spring", damping: 26, stiffness: 220 }}
        className={cn(
          "glass-card flex w-full items-center justify-between rounded-full px-5 transition-shadow duration-300",
          scrolled && "shadow-[0_8px_32px_-12px_rgba(0,0,0,0.6)]"
        )}
      >
        <a href="#home" data-cursor-hover className="text-sm font-semibold tracking-tight">
          {SITE.shortName}
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.id} className="relative">
              <a
                href={item.href}
                data-cursor-hover
                className={cn(
                  "relative z-10 block rounded-full px-4 py-2 text-sm transition-colors duration-200",
                  activeId === item.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </a>
              {activeId === item.id && (
                <motion.div
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-full bg-primary/15"
                  transition={{ type: "spring", damping: 24, stiffness: 260 }}
                />
              )}
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button
            size="sm"
            className="rounded-full"
            nativeButton={false}
            render={<a href="#contact">Contact Me</a>}
          />
        </div>

        <button
          aria-label="Open menu"
          data-cursor-hover
          onClick={() => setMenuOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 md:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
      </motion.nav>

      <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} activeId={activeId} />
    </motion.header>
  );
}
