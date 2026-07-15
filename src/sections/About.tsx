"use client";

import { motion } from "framer-motion";
import { Code2, Sparkles, Target } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GlassCard } from "@/components/shared/GlassCard";
import { fadeUp, fadeIn, staggerContainer } from "@/lib/motion";

const STATS = [
  { label: "Projects Built", value: "10+" },
  { label: "Technologies Learned", value: "20+" },
  { label: "Years Learning", value: "3+" },
];

const HIGHLIGHTS = [
  {
    icon: Code2,
    title: "Developer Journey",
    text: "I started out building small web tools and quickly moved into full stack and mobile development, learning by shipping real products for real users.",
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
  return (
    <section id="about" className="relative px-4 py-24">
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
            className="flex flex-col items-center gap-6"
          >
            <div className="glass-card relative flex h-56 w-56 items-center justify-center rounded-3xl text-5xl font-semibold text-primary sm:h-64 sm:w-64">
              AB
            </div>

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
                    <span className="text-xl font-bold text-primary sm:text-2xl">{stat.value}</span>
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
                <GlassCard className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
