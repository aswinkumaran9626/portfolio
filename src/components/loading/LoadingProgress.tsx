"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLoadingStore } from "@/store/useLoadingStore";

export function LoadingProgress() {
  const phase = useLoadingStore((s) => s.phase);
  const progress = useLoadingStore((s) => s.progress);

  const label = phase === "core" ? "INITIALIZING..." : "INITIALIZING VIBRONLABZ";
  const show = phase === "core" || phase === "rings" || phase === "charging" || phase === "paused";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-[18%] flex flex-col items-center gap-3"
        >
          <span className="font-mono text-[11px] tracking-[0.35em] text-blue-300/80">{label}</span>
          <div className="relative h-px w-48 overflow-hidden bg-white/10">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#3B82F6] to-[#A855F7]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          <span className="font-mono text-xs tabular-nums text-white/70">{Math.round(progress)}%</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
