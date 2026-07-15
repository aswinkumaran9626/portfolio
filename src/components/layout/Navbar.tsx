"use client";

import { useState } from "react";
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
  const activeId = useActiveSection(NAV_ITEMS.map((item) => item.id));

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav className="glass-card flex w-full max-w-4xl items-center justify-between rounded-full px-5 py-3">
        <a href="#home" className="text-sm font-semibold tracking-tight">
          {SITE.shortName}
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground",
                  activeId === item.id && "bg-primary/15 text-foreground"
                )}
              >
                {item.label}
              </a>
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
          onClick={() => setMenuOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 md:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
      </nav>

      <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} activeId={activeId} />
    </motion.header>
  );
}
