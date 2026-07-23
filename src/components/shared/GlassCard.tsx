"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, MouseEvent } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

export function GlassCard({ className, hover = true, glow = false, onMouseMove, onMouseLeave, ...props }: GlassCardProps) {
  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--spec-x", `${x}%`);
    e.currentTarget.style.setProperty("--spec-y", `${y}%`);
    e.currentTarget.style.setProperty("--spec-opacity", "1");
    onMouseMove?.(e);
  }

  function handleMouseLeave(e: MouseEvent<HTMLDivElement>) {
    e.currentTarget.style.setProperty("--spec-opacity", "0");
    onMouseLeave?.(e);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "glass-card rounded-3xl p-6 transition-all duration-300",
        hover && "hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_0_40px_-12px_rgba(56,189,248,0.5)]",
        glow && "gradient-border",
        className
      )}
      {...props}
    />
  );
}
