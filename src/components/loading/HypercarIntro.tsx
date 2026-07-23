"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE } from "@/constants/site";

export type HypercarPhase =
  | "standby"
  | "ignition"
  | "dashboard"
  | "overload"
  | "assembling"
  | "reveal"
  | "dissolve"
  | "done";

const PHASE_AT: { phase: HypercarPhase; ms: number }[] = [
  { phase: "standby", ms: 0 },
  { phase: "ignition", ms: 900 },
  { phase: "dashboard", ms: 1500 },
  { phase: "overload", ms: 3300 },
  { phase: "assembling", ms: 3900 },
  { phase: "reveal", ms: 4800 },
  { phase: "dissolve", ms: 5600 },
  { phase: "done", ms: 6100 },
];

const RPM_STEPS = [1000, 3000, 5000, 7000, 9000];
const FULL_TEXT = "VIBRONLABZ";

function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function useHypercarTimeline(onComplete: () => void) {
  const [phase, setPhase] = useState<HypercarPhase>("standby");

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const schedule = reducedMotion ? [{ phase: "done" as HypercarPhase, ms: 0 }] : PHASE_AT;

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

interface Particle {
  angle: number;
  speed: number;
  size: number;
  hue: "blue" | "purple";
}

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2 + seededRandom(i * 2 + 1) * 0.3,
    speed: 80 + seededRandom(i * 2 + 2) * 420,
    size: 1.5 + seededRandom(i * 2 + 3) * 2.5,
    hue: i % 2 === 0 ? "blue" : "purple",
  }));
}

const BLUE = "59,130,246";
const PURPLE = "124,58,237";

// Canvas-driven burst + ambient particle field: cheaper than per-node DOM
// animation at this particle count, and the loop is set up once and reads
// the current phase via a ref so scene changes don't restart it.
function EffectsCanvas({ phase }: { phase: HypercarPhase }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(phase);
  const rafRef = useRef<number | undefined>(undefined);
  const burstStartRef = useRef<number | null>(null);

  useEffect(() => {
    phaseRef.current = phase;
    if (phase === "overload" && burstStartRef.current === null) {
      burstStartRef.current = performance.now();
    }
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

    const ambient = makeParticles(28);
    const burst = makeParticles(140);

    let t = 0;
    let lastTime = performance.now();

    const draw = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.67, 2);
      lastTime = now;
      t += 0.016 * dt;

      const phase = phaseRef.current;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // ambient drifting particles (standby / ignition / dashboard)
      if (phase === "standby" || phase === "ignition" || phase === "dashboard") {
        for (const p of ambient) {
          const wobble = Math.sin(t * 0.6 + p.angle * 3) * 40;
          const dist = 60 + wobble;
          const x = cx + Math.cos(p.angle + t * 0.05) * (dist + p.speed * 0.15);
          const y = cy + Math.sin(p.angle + t * 0.05) * (dist + p.speed * 0.15);
          ctx.globalAlpha = 0.5;
          ctx.fillStyle = p.hue === "blue" ? `rgba(${BLUE},1)` : `rgba(${PURPLE},1)`;
          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // energy burst radiating from center on overload
      if (burstStartRef.current !== null) {
        const elapsed = (now - burstStartRef.current) / 1000;
        if (elapsed < 1.4) {
          const easedProgress = 1 - (1 - Math.min(elapsed / 1.1, 1)) ** 3;
          for (const p of burst) {
            const dist = easedProgress * p.speed * 1.6;
            const x = cx + Math.cos(p.angle) * dist;
            const y = cy + Math.sin(p.angle) * dist;
            const alpha = Math.max(0, 1 - elapsed / 1.2);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.hue === "blue" ? `rgba(${BLUE},1)` : `rgba(${PURPLE},1)`;
            ctx.beginPath();
            ctx.arc(x, y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }

          // shockwave rings
          for (let ring = 0; ring < 2; ring++) {
            const ringElapsed = Math.max(0, elapsed - ring * 0.15);
            if (ringElapsed <= 0 || ringElapsed > 1) continue;
            const radius = ringElapsed * Math.max(w, h) * 0.6;
            const alpha = (1 - ringElapsed) * 0.5;
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = ring === 0 ? `rgba(${BLUE},1)` : `rgba(${PURPLE},1)`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />;
}

function RpmGauge({ phase }: { phase: HypercarPhase }) {
  const [stepIndex, setStepIndex] = useState(-1);

  useEffect(() => {
    if (phase !== "dashboard") return;
    const timers = RPM_STEPS.map((_, i) =>
      window.setTimeout(() => setStepIndex(i), 260 * (i + 1)),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [phase]);

  const value = stepIndex >= 0 ? RPM_STEPS[stepIndex] : 0;
  const isMax = stepIndex === RPM_STEPS.length - 1;
  const fillPct = Math.min(100, (value / 9000) * 100);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-40 w-40 sm:h-52 sm:w-52">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
          <motion.circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="url(#rpmGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 44}
            animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - fillPct / 100) }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="rpmGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span
            className={`font-mono text-2xl font-bold tabular-nums sm:text-3xl ${
              isMax ? "text-white" : "text-blue-200"
            }`}
            style={{ filter: isMax ? "drop-shadow(0 0 12px rgba(168,85,247,0.9))" : undefined }}
          >
            {isMax ? "MAX" : value}
          </span>
          <span className="font-mono text-[10px] tracking-[0.3em] text-white/40">RPM</span>
        </div>
      </div>
    </div>
  );
}

export function HypercarIntro({ onComplete }: { onComplete: () => void }) {
  const phase = useHypercarTimeline(onComplete);

  const showStandbyText = phase === "standby";
  const showButton = phase === "standby" || phase === "ignition";
  const showDashboard = phase === "dashboard" || phase === "overload";
  const showFlash = phase === "overload";
  const showWordmark = phase === "assembling" || phase === "reveal";
  const showTagline = phase === "reveal";
  const dissolving = phase === "dissolve";
  const showCanvas = phase !== "dissolve" && phase !== "done";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#050505]">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: "radial-gradient(55% 55% at 50% 45%, rgba(124,58,237,0.16) 0%, transparent 70%)",
        }}
      />

      {showCanvas && (
        <motion.div
          className="absolute inset-0"
          animate={dissolving ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <EffectsCanvas phase={phase} />
        </motion.div>
      )}

      <AnimatePresence>
        {showFlash && (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, times: [0, 0.15, 1] }}
            className="absolute inset-0 bg-white"
          />
        )}
      </AnimatePresence>

      <motion.div
        className="relative flex flex-col items-center gap-5"
        animate={dissolving ? { opacity: 0, scale: 0.85 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
      >
        <AnimatePresence mode="wait">
          {showButton && (
            <motion.div
              key="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: phase === "ignition" ? [1, 1.3, 0] : 1,
              }}
              exit={{ opacity: 0 }}
              transition={
                phase === "ignition"
                  ? { duration: 0.5, times: [0, 0.35, 1], ease: "easeIn" }
                  : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
              }
              className="relative flex h-24 w-24 items-center justify-center rounded-full sm:h-28 sm:w-28"
              style={{
                background: "radial-gradient(circle, rgba(124,58,237,0.35) 0%, rgba(59,130,246,0.15) 60%, transparent 80%)",
                boxShadow: "0 0 40px 10px rgba(124,58,237,0.35)",
              }}
            >
              <motion.div
                className="absolute inset-0 rounded-full border border-blue-400/40"
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-white/90">
                START
              </span>
            </motion.div>
          )}

          {showDashboard && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <RpmGauge phase={phase} />
            </motion.div>
          )}

          {showWordmark && (
            <motion.div
              key="wordmark"
              className="flex [perspective:800px] text-4xl font-heading font-bold tracking-[0.15em] sm:text-6xl"
              style={{
                backgroundImage: "linear-gradient(135deg, #A855F7 0%, #3B82F6 100%)",
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
                  transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: "inline-block", transformOrigin: "bottom center" }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {showStandbyText && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-mono text-[11px] tracking-[0.35em] text-blue-200/70"
          >
            VIBRONLABZ SYSTEM READY
          </motion.p>
        )}

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
      </motion.div>
    </div>
  );
}
