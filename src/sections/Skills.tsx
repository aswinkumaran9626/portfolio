"use client";

import { motion } from "framer-motion";
import { SKILL_CATEGORIES } from "@/constants/skills";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GlassCard } from "@/components/shared/GlassCard";
import { TiltCard } from "@/components/shared/TiltCard";
import { SkillBar } from "@/components/shared/SkillBar";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function Skills() {
  return (
    <section id="skills" className="relative px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Skills"
          title="Technologies I work with"
          description="Tools and frameworks I use to design, build, and ship software."
        />

        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 grid gap-6 sm:grid-cols-2"
        >
          {SKILL_CATEGORIES.map((category) => (
            <motion.div key={category.category} variants={fadeUp}>
              <TiltCard maxTilt={5} className="h-full rounded-2xl">
                <GlassCard className="h-full">
                  <h3 className="mb-6 text-lg font-semibold">{category.category}</h3>
                  <div className="flex flex-col gap-5">
                    {category.skills.map((skill) => (
                      <SkillBar key={skill.name} skill={skill} />
                    ))}
                  </div>
                </GlassCard>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
