"use client";

import { motion } from "framer-motion";

interface EnergyRingProps {
  size: number;
  duration: number;
  direction?: 1 | -1;
  color: string;
  opacity?: number;
  dashed?: boolean;
}

export function EnergyRing({ size, duration, direction = 1, color, opacity = 0.5, dashed }: EnergyRingProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="absolute"
      style={{ willChange: "transform" }}
      initial={{ opacity: 0, rotate: 0 }}
      animate={{ opacity, rotate: 360 * direction }}
      transition={{
        opacity: { duration: 0.6 },
        rotate: { duration, repeat: Infinity, ease: "linear" },
      }}
    >
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="0.6"
        strokeDasharray={dashed ? "6 10" : undefined}
        strokeLinecap="round"
      />
    </motion.svg>
  );
}
