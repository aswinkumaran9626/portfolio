"use client";

import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShockwaveHoverProps {
  children: ReactNode;
  className?: string;
}

let rippleId = 0;

export function ShockwaveHover({ children, className }: ShockwaveHoverProps) {
  const [ripples, setRipples] = useState<number[]>([]);

  function triggerShockwave() {
    const id = ++rippleId;
    setRipples((prev) => [...prev, id]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r !== id));
    }, 900);
  }

  return (
    <div
      onMouseEnter={triggerShockwave}
      className={cn("relative flex items-center justify-center", className)}
    >
      <AnimatePresence>
        {ripples.map((id) => (
          <motion.span
            key={id}
            aria-hidden="true"
            initial={{ scale: 0.3, opacity: 0.6 }}
            animate={{ scale: 2.4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 -z-10 rounded-full border-2 border-primary/60"
          />
        ))}
      </AnimatePresence>
      {children}
    </div>
  );
}
