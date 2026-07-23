"use client";

import { useEffect, useRef } from "react";
import { useLoadingStore, LoadingPhase } from "@/store/useLoadingStore";

/**
 * Synthesizes cues with WebAudio instead of shipping audio files.
 * Silently no-ops if audio is unsupported or blocked by autoplay policy.
 */
export function SoundController() {
  const phase = useLoadingStore((s) => s.phase);
  const ctxRef = useRef<AudioContext | null>(null);
  const playedRef = useRef<Set<LoadingPhase>>(new Set());

  useEffect(() => {
    const AudioCtx = window.AudioContext;
    if (!AudioCtx) return;
    if (!ctxRef.current) ctxRef.current = new AudioCtx();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    if (playedRef.current.has(phase)) return;
    playedRef.current.add(phase);

    const now = ctx.currentTime;

    const tone = (freq: number, start: number, duration: number, gainPeak: number, type: OscillatorType = "sine") => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + start);
      gain.gain.setValueAtTime(0, now + start);
      gain.gain.linearRampToValueAtTime(gainPeak, now + start + duration * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + duration + 0.05);
    };

    try {
      switch (phase) {
        case "core":
          tone(80, 0, 1.5, 0.05, "sine");
          break;
        case "rings":
          tone(220, 0, 0.6, 0.03, "triangle");
          break;
        case "exploding":
          tone(60, 0, 0.6, 0.15, "sawtooth");
          tone(900, 0, 0.25, 0.06, "square");
          break;
        case "reveal":
          tone(660, 0, 0.35, 0.05, "sine");
          tone(990, 0.08, 0.4, 0.04, "sine");
          break;
        default:
          break;
      }
    } catch {
      // audio best-effort only
    }
  }, [phase]);

  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  return null;
}
