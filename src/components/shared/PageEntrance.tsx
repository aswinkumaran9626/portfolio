"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OSBootIntro } from "@/components/loading/OSBootIntro";

export function PageEntrance() {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: "easeInOut" }}>
          <OSBootIntro onComplete={() => setVisible(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
