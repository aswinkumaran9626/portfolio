"use client";

import { motion } from "framer-motion";
import { Skill } from "@/types/skill";

export function SkillBar({ skill }: { skill: Skill }) {
  return (
    <div className="group">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium">{skill.name}</span>
        <span className="text-muted-foreground">{skill.level}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-[filter] duration-300 group-hover:brightness-125"
        />
      </div>
    </div>
  );
}
