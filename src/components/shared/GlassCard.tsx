import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function GlassCard({ className, hover = true, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-6 transition-all duration-300",
        hover && "hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_0_40px_-12px_rgba(124,58,237,0.5)]",
        className
      )}
      {...props}
    />
  );
}
