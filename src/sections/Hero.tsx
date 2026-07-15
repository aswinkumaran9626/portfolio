"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/constants/site";
import { fadeUp, staggerContainer, floatAnimation } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { SocialLinks } from "@/components/shared/SocialLinks";

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-24"
    >
      <AnimatedBackground />

      <motion.div
        variants={staggerContainer(0.15, 0.1)}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <motion.span
          variants={fadeUp}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-muted-foreground"
        >
          Available for freelance &amp; full-time opportunities
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
        >
          Hi, I&apos;m <span className="gradient-text">Aswin Kumaran</span>
        </motion.h1>

        <motion.div
          variants={fadeUp}
          className="mt-4 flex flex-wrap items-center justify-center gap-2 text-lg font-medium text-muted-foreground sm:text-xl"
        >
          {SITE.roles.map((role, i) => (
            <span key={role} className="flex items-center gap-2">
              {role}
              {i < SITE.roles.length - 1 && <span className="text-primary">/</span>}
            </span>
          ))}
        </motion.div>

        <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          {SITE.description}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            className="rounded-full px-8"
            nativeButton={false}
            render={
              <a href="#projects">
                View Projects
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            }
          />
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-white/15 bg-white/5 px-8 hover:bg-white/10"
            nativeButton={false}
            render={<a href="#contact">Contact Me</a>}
          />
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10">
          <SocialLinks />
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
    </section>
  );
}
