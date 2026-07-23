"use client";

import { motion } from "framer-motion";
import { useLoadingStore } from "@/store/useLoadingStore";

export function EnergyCore() {
  const phase = useLoadingStore((s) => s.phase);
  const progress = useLoadingStore((s) => s.progress);

  const brightness = 0.4 + (progress / 100) * 0.9;
  const isExploding = phase === "exploding";

  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={isExploding ? { scale: [1, 1.4, 0] } : { scale: 1 }}
      transition={isExploding ? { duration: 0.5, times: [0, 0.3, 1], ease: "easeIn" } : undefined}
    >
      <motion.div
        aria-hidden="true"
        className="absolute h-40 w-40 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.55) 0%, rgba(59,130,246,0.25) 45%, transparent 70%)",
          filter: `brightness(${brightness})`,
        }}
        animate={{
          scale: phase === "core" ? [0.9, 1.1, 0.9] : [1, 1.15, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: phase === "core" ? 2.2 : 0.9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="relative h-6 w-6 rounded-full bg-white"
        style={{
          boxShadow: `0 0 20px 6px rgba(168,85,247,${brightness}), 0 0 48px 18px rgba(59,130,246,${
            brightness * 0.6
          })`,
        }}
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
