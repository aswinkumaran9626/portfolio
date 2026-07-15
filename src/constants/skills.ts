import { SkillCategory } from "@/types/skill";

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: "Frontend",
    skills: [
      { name: "React", level: 90 },
      { name: "Next.js", level: 88 },
      { name: "TypeScript", level: 85 },
      { name: "Tailwind CSS", level: 90 },
    ],
  },
  {
    category: "Mobile",
    skills: [
      { name: "React Native", level: 85 },
      { name: "Expo", level: 85 },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", level: 82 },
      { name: "Express.js", level: 80 },
      { name: "PostgreSQL", level: 78 },
    ],
  },
  {
    category: "Tools",
    skills: [
      { name: "Git", level: 90 },
      { name: "GitHub", level: 90 },
      { name: "Firebase", level: 80 },
      { name: "Prisma", level: 78 },
    ],
  },
];
