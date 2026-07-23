"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Code2, Sparkles, Target } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GlassCard } from "@/components/shared/GlassCard";
import { TiltCard } from "@/components/shared/TiltCard";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { SITE } from "@/constants/site";
import { fadeUp, fadeIn, staggerContainer, floatAnimation } from "@/lib/motion";

const STATS = [
  { label: "Projects Built", value: 3, suffix: "+" },
  { label: "Technologies Learned", value: 7, suffix: "+" },
  { label: "Months Learning", value: 4, suffix: "+" },
];

const HIGHLIGHTS = [
  {
    icon: Code2,
    title: "Developer Journey",
    text: `I started out building small web tools and quickly moved into full stack and mobile development, learning by shipping real products for real users. Today I build under ${SITE.company}, my own dev studio, where I take on projects end to end.`,
  },
  {
    icon: Sparkles,
    title: "AI & Automation",
    text: "I'm deeply interested in AI-powered systems and automation — building tools that reduce manual work and make software feel genuinely intelligent.",
  },
  {
    icon: Target,
    title: "Career Goals",
    text: "My goal is to keep building products that solve real business problems, while growing into a well-rounded engineer across web, mobile, and AI.",
  },
];

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const avatarY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="about" ref={sectionRef} className="relative px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="About Me"
          title="Building software with purpose"
          description="A quick look at who I am, what drives me, and where I'm headed."
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            style={{ y: avatarY }}
            className="flex flex-col items-center gap-6"
          >
            <motion.div animate={floatAnimation}>
              <TiltCard maxTilt={14} className="rounded-3xl">
                <div className="glass-card relative flex h-56 w-56 items-end justify-center overflow-hidden rounded-3xl sm:h-64 sm:w-64">
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
                  <Image
                    src="/avatar/portrait.png"
                    alt="Portrait of Aswin BalaKumaran wearing a Vibronlabz hoodie"
                    width={256}
                    height={256}
                    unoptimized
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </TiltCard>
            </motion.div>

            <motion.div
              variants={staggerContainer(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="grid w-full grid-cols-3 gap-3"
            >
              {STATS.map((stat) => (
                <motion.div key={stat.label} variants={fadeUp}>
                  <GlassCard className="flex flex-col items-center gap-1 p-4 text-center">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      className="text-xl font-bold text-primary sm:text-2xl"
                    />
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col gap-5"
          >
            {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
              <motion.div key={title} variants={fadeUp}>
                <TiltCard maxTilt={4} className="rounded-2xl">
                  <GlassCard className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                    </div>
                  </GlassCard>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
