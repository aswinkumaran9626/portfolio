"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface ParticleSystemProps {
  count?: number;
  mode: "ambient" | "burst";
}

// Deterministic pseudo-random in [0, 1), seeded by index, so server and
// client render identical values and hydration doesn't mismatch.
function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function generateParticles(count: number, mode: "ambient" | "burst") {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + seededRandom(i * 2 + 1) * 0.5;
    const radius = mode === "burst" ? 260 + seededRandom(i * 2 + 2) * 220 : 60 + seededRandom(i * 2 + 2) * 90;
    return {
      id: i,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      delay: mode === "burst" ? seededRandom(i * 2 + 3) * 0.15 : seededRandom(i * 2 + 3) * 2,
      size: mode === "burst" ? 2 + seededRandom(i * 2 + 4) * 3 : 1.5 + seededRandom(i * 2 + 4) * 2,
      duration: 3 + seededRandom(i * 2 + 5) * 2,
    };
  });
}

export function ParticleSystem({ count = 24, mode }: ParticleSystemProps) {
  const particles = useMemo(() => generateParticles(count, mode), [count, mode]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: p.id % 2 === 0 ? "#A855F7" : "#60A5FA",
            boxShadow: "0 0 6px 1px currentColor",
          }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={
            mode === "burst"
              ? { x: p.x, y: p.y, opacity: [1, 1, 0], scale: [0.5, 1, 0.3] }
              : {
                  x: [0, p.x * 0.3, 0],
                  y: [0, p.y * 0.3, 0],
                  opacity: [0, 0.8, 0],
                }
          }
          transition={
            mode === "burst"
              ? { duration: 0.9, delay: p.delay, ease: "easeOut" }
              : { duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }
          }
        />
      ))}
    </div>
  );
}
