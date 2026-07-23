"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/constants/site";
import { fadeUp, staggerContainer, floatAnimation, wordReveal, wordContainer } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { ShockwaveHover } from "@/components/shared/ShockwaveHover";

const NAME_WORDS = ["Hi,", "I'm"];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    setShowVideo(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden px-4 pt-24"
    >
      {showVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-70"
        >
          <source src="/video/intro.mp4" type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/60 to-background" />

      <AnimatedBackground />

      <motion.div
        style={{ y, opacity, scale }}
        className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <motion.div
          variants={staggerContainer(0.15, 0.1)}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          <motion.span
            variants={fadeUp}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-muted-foreground"
          >
            Available for freelance &amp; full-time opportunities
          </motion.span>

          <motion.div
            variants={wordContainer(0.12, 0.15)}
            initial="hidden"
            animate="show"
            className="mt-6 flex flex-wrap items-center justify-center gap-x-3 overflow-hidden text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:justify-start"
          >
            {NAME_WORDS.map((word) => (
              <span key={word} className="overflow-hidden">
                <motion.span variants={wordReveal} className="inline-block">
                  {word}
                </motion.span>
              </span>
            ))}
            <span className="overflow-hidden">
              <motion.span variants={wordReveal} className="gradient-text inline-block">
                Aswin
              </motion.span>
            </span>
            <span className="overflow-hidden">
              <motion.span variants={wordReveal} className="gradient-text inline-block">
                BalaKumaran
              </motion.span>
            </span>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-4 flex flex-wrap items-center justify-center gap-2 text-lg font-medium text-muted-foreground sm:text-xl lg:justify-start"
          >
            {SITE.roles.map((role, i) => (
              <span key={role} className="flex items-center gap-2">
                {role}
                {i < SITE.roles.length - 1 && <span className="text-primary">/</span>}
              </span>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-3 flex flex-col items-center gap-1.5 lg:items-start"
          >
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Image
                src="/brand/vibronlabz-logo.png"
                alt="Vibronlabz logo"
                width={22}
                height={22}
                className="rounded-full ring-1 ring-white/15"
              />
              Founder,{" "}
              <span className="font-semibold text-foreground">{SITE.company}</span>
            </div>
            <span className="text-xs italic tracking-wide text-muted-foreground/70">
              &ldquo;{SITE.companyTagline}&rdquo;
            </span>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            {SITE.description}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="group relative overflow-hidden rounded-full px-8 shadow-[0_0_30px_-8px_rgba(56,189,248,0.7)] transition-shadow duration-300 hover:shadow-[0_0_45px_-6px_rgba(56,189,248,0.9)]"
              nativeButton={false}
              render={
                <a href="#projects">
                  <span className="relative z-10 flex items-center gap-1.5">
                    View Projects
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </a>
              }
            />
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/15 bg-white/5 px-8 transition-colors duration-300 hover:bg-white/10"
              nativeButton={false}
              render={<a href="#contact">Contact Me</a>}
            />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10">
            <SocialLinks />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden justify-self-center lg:flex"
        >
          <motion.div animate={floatAnimation} className="relative">
            <div className="absolute inset-0 -z-10 scale-90 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-[80px]" />
            <ShockwaveHover>
              <Image
                src="/avatar/coding-pose.png"
                alt="Aswin BalaKumaran coding, wearing a Vibronlabz hoodie"
                width={480}
                height={480}
                priority
                unoptimized
                className="w-[22rem] object-contain drop-shadow-[0_20px_60px_rgba(56,189,248,0.35)] xl:w-[26rem]"
              />
            </ShockwaveHover>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        animate={floatAnimation}
        className="glass-card absolute left-[8%] top-1/3 hidden h-24 w-24 rounded-2xl lg:block"
      />
      <motion.div
        animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 1.5 } }}
        className="glass-card absolute right-[10%] top-1/4 hidden h-16 w-16 rounded-2xl lg:block"
      />
      <motion.div
        animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 0.8 } }}
        className="glass-card absolute bottom-[15%] right-[18%] hidden h-20 w-20 rounded-full lg:block"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1.5"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
