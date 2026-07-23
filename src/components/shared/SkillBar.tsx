"use client";

import { motion } from "framer-motion";
import { Skill } from "@/types/skill";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

export function SkillBar({ skill }: { skill: Skill }) {
  return (
    <div className="group">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium">{skill.name}</span>
        <AnimatedCounter value={skill.level} suffix="%" className="text-muted-foreground" />
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-primary to-secondary transition-[filter] duration-300 group-hover:brightness-125"
        >
          <motion.span
            aria-hidden="true"
            className="absolute inset-y-0 w-1/3 bg-white/30 blur-sm"
            initial={{ x: "-120%" }}
            whileInView={{ x: "220%" }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.4, delay: 0.3, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
}
