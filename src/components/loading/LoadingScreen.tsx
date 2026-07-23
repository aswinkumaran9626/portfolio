"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoadingStore } from "@/store/useLoadingStore";
import { EnergyCore } from "./EnergyCore";
import { EnergyRing } from "./EnergyRing";
import { ParticleSystem } from "./ParticleSystem";
import { LoadingProgress } from "./LoadingProgress";
import { LogoFormation } from "./LogoFormation";
import { SoundController } from "./SoundController";

const PROGRESS_STEPS = [0, 15, 35, 60, 85, 100];

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const phase = useLoadingStore((s) => s.phase);
  const setPhase = useLoadingStore((s) => s.setPhase);
  const setProgress = useLoadingStore((s) => s.setProgress);
  const doneRef = useRef(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setPhase("done");
      onComplete();
      return;
    }

    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

    // Scene 1: core (0 - 0.8s)
    setPhase("core");

    // Scene 2: rings + progress (0.8s - 2.0s)
    at(800, () => setPhase("rings"));
    PROGRESS_STEPS.forEach((value, i) => {
      at(800 + i * 220, () => {
        setProgress(value);
        if (i === 1) setPhase("charging");
      });
    });

    // Scene 3: power surge (2.0s - 3.0s)
    at(2000, () => setPhase("paused"));
    at(2300, () => setPhase("exploding"));

    // Scene 4: logo formation (3.0s - 4.0s)
    at(2900, () => setPhase("assembling"));

    // Scene 5: final reveal (4.0s - 5.0s)
    at(3900, () => setPhase("reveal"));
    at(4800, () => {
      setPhase("done");
      doneRef.current = true;
      onComplete();
    });

    return () => timers.forEach(window.clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showRings = phase === "rings" || phase === "charging" || phase === "paused";
  const showCore = phase !== "assembling" && phase !== "reveal" && phase !== "done";
  const showAmbientParticles = showCore;
  const showBurst = phase === "exploding";
  const flash = phase === "exploding";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#050505]">
      <SoundController />

      {/* ambient bloom backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 45%, rgba(124,58,237,0.12) 0%, transparent 70%)",
        }}
      />

      <AnimatePresence>
        {flash && (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, times: [0, 0.15, 1] }}
            className="absolute inset-0 bg-white"
          />
        )}
      </AnimatePresence>

      <div className="relative flex h-full w-full items-center justify-center">
        {showAmbientParticles && <ParticleSystem mode="ambient" count={20} />}
        {showBurst && <ParticleSystem mode="burst" count={60} />}

        {showCore && (
          <div className="relative flex items-center justify-center">
            {showRings && (
              <>
                <EnergyRing size={140} duration={6} direction={1} color="#7C3AED" opacity={0.55} />
                <EnergyRing size={200} duration={9} direction={-1} color="#3B82F6" opacity={0.4} dashed />
                <EnergyRing size={260} duration={13} direction={1} color="#A855F7" opacity={0.25} />
              </>
            )}
            <EnergyCore />
          </div>
        )}

        <LogoFormation />
        <LoadingProgress />
      </div>
    </div>
  );
}
