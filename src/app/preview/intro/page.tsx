"use client";

import { useState } from "react";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { NeuralIntro, NeuralPhase } from "@/components/loading/NeuralIntro";
import { HypercarIntro, HypercarPhase } from "@/components/loading/HypercarIntro";
import { OSBootIntro, OSBootPhase } from "@/components/loading/OSBootIntro";
import { useLoadingStore, LoadingPhase } from "@/store/useLoadingStore";

const ENERGY_PHASES: LoadingPhase[] = [
  "core",
  "rings",
  "charging",
  "paused",
  "exploding",
  "assembling",
  "reveal",
  "done",
];

const NEURAL_PHASES: NeuralPhase[] = [
  "nodes",
  "connecting",
  "network",
  "monogram",
  "wordmark",
  "reveal",
  "dissolve",
  "done",
];

const HYPERCAR_PHASES: HypercarPhase[] = [
  "standby",
  "ignition",
  "dashboard",
  "overload",
  "assembling",
  "reveal",
  "dissolve",
  "done",
];

const OSBOOT_PHASES: OSBootPhase[] = [
  "spark",
  "boot",
  "ai",
  "database",
  "services",
  "analytics",
  "security",
  "systemsOnline",
  "logo",
  "dissolve",
  "done",
];

type Variant = "energy" | "neural" | "hypercar" | "osboot";

// The loading store is a global singleton, so a prior visit elsewhere in the
// app can leave it parked on "done". Reset it once, synchronously, before
// this page's first paint so autoplay always starts clean.
function resetStore() {
  const { setPhase, setProgress } = useLoadingStore.getState();
  setProgress(0);
  setPhase("core");
  return true;
}

export default function IntroPreviewPage() {
  useState(resetStore);
  const [variant, setVariant] = useState<Variant>("osboot");
  const [runId, setRunId] = useState(0);
  const [playing, setPlaying] = useState(true);
  const setEnergyPhase = useLoadingStore((s) => s.setPhase);
  const setEnergyProgress = useLoadingStore((s) => s.setProgress);
  const energyPhase = useLoadingStore((s) => s.phase);

  function switchVariant(next: Variant) {
    setVariant(next);
    setEnergyProgress(0);
    setEnergyPhase("core");
    setPlaying(true);
    setRunId((id) => id + 1);
  }

  function replay() {
    setEnergyProgress(0);
    setEnergyPhase("core");
    setPlaying(true);
    setRunId((id) => id + 1);
  }

  function jumpToEnergyPhase(target: LoadingPhase) {
    setPlaying(false);
    setEnergyPhase(target);
    setEnergyProgress(target === "core" ? 0 : 100);
  }

  return (
    <div className="relative min-h-screen bg-black">
      {playing && variant === "energy" && (
        <LoadingScreen key={`energy-${runId}`} onComplete={() => setPlaying(false)} />
      )}
      {playing && variant === "neural" && (
        <NeuralIntro key={`neural-${runId}`} onComplete={() => setPlaying(false)} />
      )}
      {playing && variant === "hypercar" && (
        <HypercarIntro key={`hypercar-${runId}`} onComplete={() => setPlaying(false)} />
      )}
      {playing && variant === "osboot" && (
        <OSBootIntro key={`osboot-${runId}`} onComplete={() => setPlaying(false)} />
      )}

      {!playing && (
        <div className="flex min-h-screen items-center justify-center text-white/40 font-mono text-sm">
          intro finished — {variant === "energy" ? `phase: ${energyPhase}` : `${variant} sequence complete`}
        </div>
      )}

      <div className="fixed bottom-4 left-1/2 z-[300] flex -translate-x-1/2 flex-col items-center gap-2 rounded-2xl border border-white/10 bg-black/70 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <button
            onClick={() => switchVariant("neural")}
            className={`rounded-full px-3 py-1.5 text-[11px] font-mono ${
              variant === "neural"
                ? "bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white"
                : "border border-white/10 text-white/60 hover:text-white"
            }`}
          >
            Neural Network
          </button>
          <button
            onClick={() => switchVariant("osboot")}
            className={`rounded-full px-3 py-1.5 text-[11px] font-mono ${
              variant === "osboot"
                ? "bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white"
                : "border border-white/10 text-white/60 hover:text-white"
            }`}
          >
            AI OS Boot
          </button>
          <button
            onClick={() => switchVariant("hypercar")}
            className={`rounded-full px-3 py-1.5 text-[11px] font-mono ${
              variant === "hypercar"
                ? "bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white"
                : "border border-white/10 text-white/60 hover:text-white"
            }`}
          >
            Hypercar HUD
          </button>
          <button
            onClick={() => switchVariant("energy")}
            className={`rounded-full px-3 py-1.5 text-[11px] font-mono ${
              variant === "energy"
                ? "bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white"
                : "border border-white/10 text-white/60 hover:text-white"
            }`}
          >
            Energy Core
          </button>
          <span className="mx-1 h-4 w-px bg-white/15" />
          <button
            onClick={replay}
            className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-white/15"
          >
            ▶ Replay
          </button>
        </div>

        {variant === "energy" && (
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {ENERGY_PHASES.map((p) => (
              <button
                key={p}
                onClick={() => jumpToEnergyPhase(p)}
                className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-mono text-white/70 hover:border-white/30 hover:text-white"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {variant === "neural" && (
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {NEURAL_PHASES.map((p) => (
              <span
                key={p}
                className="rounded-full border border-white/5 px-2.5 py-1 text-[10px] font-mono text-white/40"
              >
                {p}
              </span>
            ))}
          </div>
        )}

        {variant === "hypercar" && (
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {HYPERCAR_PHASES.map((p) => (
              <span
                key={p}
                className="rounded-full border border-white/5 px-2.5 py-1 text-[10px] font-mono text-white/40"
              >
                {p}
              </span>
            ))}
          </div>
        )}

        {variant === "osboot" && (
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {OSBOOT_PHASES.map((p) => (
              <span
                key={p}
                className="rounded-full border border-white/5 px-2.5 py-1 text-[10px] font-mono text-white/40"
              >
                {p}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
