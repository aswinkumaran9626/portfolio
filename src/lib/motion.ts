import { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

export const staggerContainer = (stagger = 0.12, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export const floatAnimation = {
  y: [0, -16, 0],
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as const },
};

export const wordReveal: Variants = {
  hidden: { opacity: 0, y: "100%" },
  show: { opacity: 1, y: "0%", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export const wordContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

export const revealMask: Variants = {
  hidden: { opacity: 0, scale: 0.94, clipPath: "inset(12% 0% 12% 0% round 24px)" },
  show: {
    opacity: 1,
    scale: 1,
    clipPath: "inset(0% 0% 0% 0% round 24px)",
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};
