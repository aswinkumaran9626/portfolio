"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE } from "@/constants/site";
import { PROJECTS } from "@/constants/projects";

export type OSBootPhase =
  | "spark"
  | "boot"
  | "ai"
  | "database"
  | "services"
  | "analytics"
  | "security"
  | "systemsOnline"
  | "logo"
  | "dissolve"
  | "done";

const PHASE_AT: { phase: OSBootPhase; ms: number }[] = [
  { phase: "spark", ms: 0 },
  { phase: "boot", ms: 450 },
  { phase: "ai", ms: 950 },
  { phase: "database", ms: 1600 },
  { phase: "services", ms: 2150 },
  { phase: "analytics", ms: 2650 },
  { phase: "security", ms: 3150 },
  { phase: "systemsOnline", ms: 3600 },
  { phase: "logo", ms: 3950 },
  { phase: "dissolve", ms: 5950 },
  { phase: "done", ms: 6250 },
];

const AI_PROGRESS_STEPS = [0, 12, 28, 45, 67, 89, 100];
const SERVICES = ["Mobile Development", "Web Applications", "AI Solutions", "Business Automation"];
const METRICS = [
  { label: "CPU", value: 92 },
  { label: "NETWORK", value: 98 },
  { label: "MEMORY", value: 87 },
  { label: "AI CORE", value: 100 },
];
const SYSTEM_ROWS = ["AI", "PROJECTS", "SERVICES", "ANALYTICS", "SECURITY"];
const FULL_TEXT = "VIBRONLABZ";

let bootAudioCtx: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext;
  if (!AudioCtx) return null;
  if (!bootAudioCtx) bootAudioCtx = new AudioCtx();
  if (bootAudioCtx.state === "suspended") bootAudioCtx.resume().catch(() => {});
  return bootAudioCtx;
}

function beep(freq: number, duration: number, gainPeak = 0.06, type: OscillatorType = "sine") {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(gainPeak, now + duration * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  } catch {
    // audio is best-effort only
  }
}

const PHASE_BEEPS: Partial<Record<OSBootPhase, () => void>> = {
  spark: () => beep(440, 0.5, 0.05),
  boot: () => beep(660, 0.15, 0.05, "triangle"),
  ai: () => {
    beep(520, 0.08, 0.04, "square");
    window.setTimeout(() => beep(780, 0.08, 0.04, "square"), 90);
  },
  database: () => beep(600, 0.12, 0.04, "triangle"),
  services: () => beep(600, 0.12, 0.04, "triangle"),
  analytics: () => beep(600, 0.12, 0.04, "triangle"),
  security: () => beep(300, 0.3, 0.05, "sawtooth"),
  systemsOnline: () => {
    beep(660, 0.1, 0.05);
    window.setTimeout(() => beep(880, 0.18, 0.05), 100);
  },
  logo: () => {
    beep(880, 0.3, 0.05);
    window.setTimeout(() => beep(1320, 0.35, 0.04), 120);
  },
};

export function useOSBootTimeline(onComplete: () => void) {
  const [phase, setPhase] = useState<OSBootPhase>("spark");

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const schedule = reducedMotion ? [{ phase: "done" as OSBootPhase, ms: 0 }] : PHASE_AT;

    const timers = schedule.map(({ phase: p, ms }) =>
      window.setTimeout(() => {
        setPhase(p);
        PHASE_BEEPS[p]?.();
        if (p === "done") onComplete();
      }, ms),
    );

    return () => timers.forEach(window.clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return phase;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

interface NetNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  pulsePhase: number;
}

function makeNodes(count: number, w: number, h: number): NetNode[] {
  return Array.from({ length: count }, (_, i) => ({
    x: seededRandom(i * 4 + 1) * w,
    y: seededRandom(i * 4 + 2) * h,
    vx: (seededRandom(i * 4 + 3) - 0.5) * 0.12,
    vy: (seededRandom(i * 4 + 4) - 0.5) * 0.12,
    pulsePhase: seededRandom(i * 4 + 5) * Math.PI * 2,
  }));
}

// Ambient neural-network backdrop, always running underneath the HUD.
// Loop is set up once; phase intensity is read via a ref so scene changes
// don't tear down and restart the canvas.
function NetworkBackdrop({ phase }: { phase: OSBootPhase }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(phase);
  const rafRef = useRef<number | undefined>(undefined);

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

    const nodes = makeNodes(60, w, h);
    let t = 0;
    let lastTime = performance.now();

    const draw = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.67, 2);
      lastTime = now;
      t += 0.016 * dt;

      const phase = phaseRef.current;
      ctx.clearRect(0, 0, w, h);

      const intensity =
        phase === "spark"
          ? 0.15
          : phase === "dissolve" || phase === "done"
            ? 0
            : phase === "ai" || phase === "logo"
              ? 1
              : 0.55;

      if (intensity <= 0) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const count = Math.round(nodes.length * Math.min(intensity, 1));
      const active = nodes.slice(0, Math.max(count, 8));
      const connectDistSq = 130 ** 2;

      for (const n of active) {
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      ctx.lineWidth = 0.5;
      ctx.strokeStyle = `rgba(96,165,250,${0.2 * intensity})`;
      ctx.beginPath();
      for (let i = 0; i < active.length; i++) {
        const a = active[i];
        for (let j = i + 1; j < active.length; j++) {
          const b = active[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (dx * dx + dy * dy < connectDistSq) {
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
          }
        }
      }
      ctx.stroke();

      for (const n of active) {
        const pulse = 0.5 + Math.sin(t * 2 + n.pulsePhase) * 0.5;
        ctx.globalAlpha = intensity * (0.5 + pulse * 0.5);
        ctx.fillStyle = "rgba(168,85,247,0.9)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.4 + pulse * 1, 0, Math.PI * 2);
        ctx.fill();
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

function HudFrame({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4 }}
      className="flex w-[min(90vw,420px)] flex-col items-center gap-4 rounded-2xl border border-blue-400/20 bg-white/[0.02] px-6 py-6 backdrop-blur-sm"
      style={{ boxShadow: "0 0 40px -12px rgba(59,130,246,0.35)" }}
    >
      {children}
    </motion.div>
  );
}

function HudLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] tracking-[0.35em] text-blue-300/80">{children}</span>
  );
}

function ScanSweep() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 h-24"
      style={{
        background:
          "linear-gradient(180deg, transparent, rgba(96,165,250,0.25) 50%, transparent)",
      }}
      initial={{ top: "-10%" }}
      animate={{ top: "110%" }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
    />
  );
}

function BootScene() {
  return (
    <HudFrame>
      <HudLabel>SYSTEM BOOT</HudLabel>
      <div className="relative flex h-16 w-16 items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full border border-blue-400/40"
            style={{ inset: -i * 8 }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 1.6, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        <span className="h-2.5 w-2.5 rounded-full bg-blue-300" style={{ boxShadow: "0 0 16px 4px rgba(59,130,246,0.8)" }} />
      </div>
      <div className="flex items-center gap-2">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-emerald-400"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <span className="font-mono text-xs tracking-[0.2em] text-emerald-300">SYSTEM ONLINE</span>
      </div>
    </HudFrame>
  );
}

function AiScene() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timers = AI_PROGRESS_STEPS.map((_, i) => window.setTimeout(() => setStep(i), 90 * (i + 1)));
    return () => timers.forEach(window.clearTimeout);
  }, []);
  const value = AI_PROGRESS_STEPS[step];

  return (
    <HudFrame>
      <HudLabel>LOADING AI MODULES</HudLabel>
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#3B82F6] to-[#A855F7]"
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>
      <span className="font-mono text-2xl font-semibold tabular-nums text-white">{value}%</span>
    </HudFrame>
  );
}

function DatabaseScene() {
  return (
    <HudFrame>
      <HudLabel>LOADING PROJECT DATABASE</HudLabel>
      <div className="flex w-full flex-col gap-2">
        {PROJECTS.map((p, i) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.09, duration: 0.25 }}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
          >
            <span className="font-mono text-xs text-white/80">{p.title}</span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.09 + 0.18 }}
              className="font-mono text-[10px] text-emerald-300"
            >
              SYNCED
            </motion.span>
          </motion.div>
        ))}
      </div>
    </HudFrame>
  );
}

function ServicesScene() {
  return (
    <HudFrame>
      <HudLabel>LOADING SERVICES</HudLabel>
      <div className="flex w-full flex-col gap-2">
        {SERVICES.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.22 }}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
          >
            <span className="font-mono text-xs text-white/80">{s}</span>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.07 + 0.16, type: "spring", stiffness: 300 }}
              className="font-mono text-[10px] text-emerald-300"
            >
              ✓ ONLINE
            </motion.span>
          </motion.div>
        ))}
      </div>
    </HudFrame>
  );
}

function AnalyticsScene() {
  return (
    <HudFrame>
      <HudLabel>LOADING ANALYTICS</HudLabel>
      <div className="grid w-full grid-cols-2 gap-3">
        {METRICS.map((m, i) => (
          <div key={m.label} className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/50">{m.label}</span>
            <div className="h-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-[#3B82F6] to-[#A855F7]"
                initial={{ width: "0%" }}
                animate={{ width: `${m.value}%` }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    </HudFrame>
  );
}

function SecurityScene() {
  const [status, setStatus] = useState<"scanning" | "clear">("scanning");
  useEffect(() => {
    const timer = window.setTimeout(() => setStatus("clear"), 300);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <HudFrame>
      <HudLabel>SECURITY CHECK</HudLabel>
      <div className="relative h-20 w-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]">
        {status === "scanning" && <ScanSweep />}
      </div>
      <AnimatePresence mode="wait">
        {status === "scanning" ? (
          <motion.span key="scanning" className="font-mono text-xs text-blue-300/80">
            Scanning...
          </motion.span>
        ) : (
          <motion.div
            key="clear"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-1"
          >
            <span className="font-mono text-xs text-emerald-300">Verification Complete</span>
            <span className="font-mono text-[11px] text-white/60">No Threats Detected</span>
            <span className="font-mono text-[11px] tracking-[0.2em] text-white">ACCESS AUTHORIZED</span>
          </motion.div>
        )}
      </AnimatePresence>
    </HudFrame>
  );
}

function SystemsOnlineScene() {
  return (
    <HudFrame>
      <HudLabel>ALL SYSTEMS ONLINE</HudLabel>
      <div className="flex w-full flex-col gap-1.5">
        {SYSTEM_ROWS.map((row, i) => (
          <motion.div
            key={row}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center justify-between"
          >
            <span className="font-mono text-[11px] tracking-[0.2em] text-white/70">{row}</span>
            <span className="font-mono text-[11px] text-emerald-300">100%</span>
          </motion.div>
        ))}
      </div>
    </HudFrame>
  );
}

export function OSBootIntro({ onComplete }: { onComplete: () => void }) {
  const phase = useOSBootTimeline(onComplete);

  const showBackdrop = phase !== "done";
  const showSpark = phase === "spark";
  const showWordmark = phase === "logo";
  const showTagline = phase === "logo";
  const dissolving = phase === "dissolve";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-black">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: "radial-gradient(55% 55% at 50% 45%, rgba(124,58,237,0.16) 0%, transparent 70%)",
        }}
      />

      {showBackdrop && (
        <motion.div
          className="absolute inset-0"
          animate={dissolving ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <NetworkBackdrop phase={phase} />
        </motion.div>
      )}

      <motion.div
        className="relative flex flex-col items-center gap-5"
        animate={dissolving ? { opacity: 0, scale: 0.85 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
      >
        {showSpark && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.span
              className="h-3 w-3 rounded-full bg-blue-300"
              style={{ boxShadow: "0 0 24px 8px rgba(59,130,246,0.7)" }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="font-mono text-[11px] tracking-[0.3em] text-blue-200/70">
              INITIALIZING VIBRONLABZ OS
            </span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {phase === "boot" && <BootScene key="boot" />}
          {phase === "ai" && <AiScene key="ai" />}
          {phase === "database" && <DatabaseScene key="database" />}
          {phase === "services" && <ServicesScene key="services" />}
          {phase === "analytics" && <AnalyticsScene key="analytics" />}
          {phase === "security" && <SecurityScene key="security" />}
          {phase === "systemsOnline" && <SystemsOnlineScene key="systemsOnline" />}
        </AnimatePresence>

        {showWordmark && (
          <motion.div
            key="wordmark"
            className="flex [perspective:800px] text-4xl font-heading font-bold tracking-[0.15em] sm:text-6xl"
            style={{
              backgroundImage: "linear-gradient(135deg, #A855F7 0%, #3B82F6 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: "drop-shadow(0 0 34px rgba(168,85,247,0.75))",
            }}
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

        {showTagline && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="font-mono text-xs tracking-[0.3em] text-blue-200/70 sm:text-sm"
          >
            {SITE.companyTagline.toUpperCase()}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
