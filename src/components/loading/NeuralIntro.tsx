"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE } from "@/constants/site";

export type NeuralPhase =
  | "nodes"
  | "connecting"
  | "network"
  | "monogram"
  | "wordmark"
  | "reveal"
  | "dissolve"
  | "done";

const PHASE_AT: { phase: NeuralPhase; ms: number }[] = [
  { phase: "nodes", ms: 0 },
  { phase: "connecting", ms: 700 },
  { phase: "network", ms: 1600 },
  { phase: "monogram", ms: 2600 },
  { phase: "wordmark", ms: 3400 },
  { phase: "reveal", ms: 4200 },
  { phase: "dissolve", ms: 4900 },
  { phase: "done", ms: 5400 },
];

const FULL_TEXT = "VIBRONLABZ";
const MONOGRAM = "VL";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
  hue: "blue" | "purple";
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function makeNodes(count: number, width: number, height: number): Node[] {
  return Array.from({ length: count }, (_, i) => {
    const rx = seededRandom(i * 3 + 1);
    const ry = seededRandom(i * 3 + 2);
    const rv = seededRandom(i * 3 + 3);
    return {
      x: rx * width,
      y: ry * height,
      vx: (rv - 0.5) * 0.15,
      vy: (seededRandom(i * 3 + 4) - 0.5) * 0.15,
      radius: 1.2 + seededRandom(i * 3 + 5) * 1.8,
      pulsePhase: rv * Math.PI * 2,
      hue: i % 2 === 0 ? "blue" : "purple",
    } as Node;
  });
}

export function useNeuralTimeline(onComplete: () => void) {
  const [phase, setPhase] = useState<NeuralPhase>("nodes");

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const schedule = reducedMotion ? [{ phase: "done" as NeuralPhase, ms: 0 }] : PHASE_AT;

    const timers = schedule.map(({ phase: p, ms }) =>
      window.setTimeout(() => {
        setPhase(p);
        if (p === "done") onComplete();
      }, ms),
    );

    return () => timers.forEach(window.clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return phase;
}

const GLOW_BLUE = "rgba(96,165,250,0.9)";
const GLOW_PURPLE = "rgba(168,85,247,0.9)";

function NeuralCanvas({ phase }: { phase: NeuralPhase }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const rafRef = useRef<number | undefined>(undefined);
  const phaseRef = useRef(phase);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    nodesRef.current = makeNodes(70, w, h);

    let t = 0;
    let lastTime = performance.now();

    const draw = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.67, 2);
      lastTime = now;
      t += 0.016 * dt;

      const phase = phaseRef.current;
      // Fade the previous frame instead of clearing it so each node leaves a
      // short comet-like trail along its drift path.
      ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
      ctx.fillRect(0, 0, w, h);

      const nodeCount =
        phase === "nodes"
          ? 22
          : phase === "connecting"
            ? 45
            : phase === "network"
              ? 70
              : phase === "monogram" || phase === "wordmark" || phase === "reveal"
                ? 50
                : 26;

      const active = nodesRef.current.slice(0, nodeCount);
      const showConnections = phase !== "nodes" && phase !== "dissolve" && phase !== "done";
      const connectDistanceSq = (phase === "network" ? 150 : 115) ** 2;

      for (const n of active) {
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      if (showConnections) {
        ctx.lineWidth = 0.6;
        ctx.strokeStyle = "rgba(96, 165, 250, 0.25)";
        ctx.beginPath();
        for (let i = 0; i < active.length; i++) {
          const a = active[i];
          for (let j = i + 1; j < active.length; j++) {
            const b = active[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < connectDistanceSq) {
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
            }
          }
        }
        ctx.stroke();
      }

      for (const n of active) {
        const pulse = 0.5 + Math.sin(t * 2 + n.pulsePhase) * 0.5;
        const radius = n.radius + pulse * 1.2;

        ctx.fillStyle = n.hue === "blue" ? GLOW_PURPLE : GLOW_BLUE;
        ctx.globalAlpha = 0.18 + pulse * 0.12;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // Intentionally set up canvas/loop once; phase is read via phaseRef so
    // scene transitions don't tear down and restart the animation loop.
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />;
}

export function NeuralIntro({ onComplete }: { onComplete: () => void }) {
  const phase = useNeuralTimeline(onComplete);

  const showCanvas = phase !== "done";
  const showMonogram = phase === "monogram";
  const showWordmark = phase === "wordmark" || phase === "reveal";
  const showTagline = phase === "reveal";
  const dissolving = phase === "dissolve";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-black">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: "radial-gradient(60% 60% at 50% 45%, rgba(124,58,237,0.15) 0%, transparent 70%)",
        }}
      />

      {showCanvas && (
        <motion.div
          className="absolute inset-0"
          animate={dissolving ? { opacity: 0, scale: 1.15 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeIn" }}
        >
          <NeuralCanvas phase={phase} />
        </motion.div>
      )}

      <div className="relative flex flex-col items-center gap-4">
        <AnimatePresence mode="wait">
          {showMonogram && (
            <motion.div
              key="monogram"
              initial={{ opacity: 0, scale: 0.7, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl font-heading font-bold tracking-[0.1em] sm:text-8xl"
              style={{
                backgroundImage: "linear-gradient(135deg, #A855F7 0%, #60A5FA 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                filter: "drop-shadow(0 0 30px rgba(124,58,237,0.6))",
              }}
            >
              {MONOGRAM}
            </motion.div>
          )}

          {showWordmark && (
            <motion.div
              key="wordmark"
              className="flex [perspective:800px] text-4xl font-heading font-bold tracking-[0.15em] sm:text-6xl"
              style={{
                backgroundImage: "linear-gradient(135deg, #A855F7 0%, #60A5FA 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
              animate={
                phase === "reveal"
                  ? { filter: "drop-shadow(0 0 34px rgba(168,85,247,0.75))" }
                  : { filter: "drop-shadow(0 0 24px rgba(124,58,237,0.55))" }
              }
              transition={{ duration: 0.6 }}
            >
              {FULL_TEXT.split("").map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  initial={{ opacity: 0, y: 46, rotateX: 60, filter: "blur(10px)", scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", scale: 1 }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.055,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ display: "inline-block", transformOrigin: "bottom center" }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {showTagline && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-mono text-xs tracking-[0.3em] text-blue-200/70 sm:text-sm"
          >
            {SITE.companyTagline.toUpperCase()}
          </motion.p>
        )}
      </div>
    </div>
  );
}
