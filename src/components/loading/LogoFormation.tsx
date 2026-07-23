"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoadingStore } from "@/store/useLoadingStore";
import { SITE } from "@/constants/site";

const FULL_TEXT = "VIBRONLABZ";

export function LogoFormation() {
  const phase = useLoadingStore((s) => s.phase);

  const letters = useMemo(() => FULL_TEXT.split(""), []);
  const visible = phase === "assembling" || phase === "reveal";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="flex flex-col items-center gap-4"
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="flex text-4xl font-heading font-bold tracking-[0.15em] sm:text-6xl"
            style={{
              backgroundImage: "linear-gradient(135deg, #A855F7 0%, #60A5FA 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: "drop-shadow(0 0 24px rgba(124,58,237,0.55))",
            }}
          >
            {letters.map((char, i) => (
              <motion.span
                key={`${char}-${i}`}
                initial={{ opacity: 0, y: 24, filter: "blur(8px)", scale: 0.6 }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {phase === "reveal" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-mono text-xs tracking-[0.3em] text-blue-200/70 sm:text-sm"
            >
              {SITE.companyTagline.toUpperCase()}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
