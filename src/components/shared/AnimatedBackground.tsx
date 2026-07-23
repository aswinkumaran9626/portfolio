"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function AnimatedBackground() {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) return;

    function handleMove(e: MouseEvent) {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      pointerX.set(nx);
      pointerY.set(ny);
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [pointerX, pointerY]);

  const springConfig = { damping: 30, stiffness: 60, mass: 0.8 };
  const blob1X = useSpring(useTransform(pointerX, [-0.5, 0.5], [-30, 30]), springConfig);
  const blob1Y = useSpring(useTransform(pointerY, [-0.5, 0.5], [-30, 30]), springConfig);
  const blob2X = useSpring(useTransform(pointerX, [-0.5, 0.5], [24, -24]), springConfig);
  const blob2Y = useSpring(useTransform(pointerY, [-0.5, 0.5], [24, -24]), springConfig);
  const blob3X = useSpring(useTransform(pointerX, [-0.5, 0.5], [-16, 16]), springConfig);
  const blob3Y = useSpring(useTransform(pointerY, [-0.5, 0.5], [16, -16]), springConfig);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        style={{ x: blob1X, y: blob1Y }}
        className="absolute -top-40 left-1/4 h-[32rem] w-[32rem] rounded-full bg-primary/20 blur-[120px]"
      >
        <motion.div
          className="h-full w-full"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <motion.div
        style={{ x: blob2X, y: blob2Y }}
        className="absolute top-1/3 right-0 h-[28rem] w-[28rem] rounded-full bg-secondary/20 blur-[120px]"
      >
        <motion.div
          className="h-full w-full"
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <motion.div
        style={{ x: blob3X, y: blob3Y }}
        className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-primary/10 blur-[100px]"
      >
        <motion.div
          className="h-full w-full"
          animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
    </div>
  );
}
