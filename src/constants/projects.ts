import { Project } from "@/types/project";

export const PROJECTS: Project[] = [
  {
    slug: "toy-junction-pos",
    title: "Toy Junction POS",
    description:
      "Inventory management and billing system for toy businesses, built for wholesale shop owners to track stock and generate bills in real time.",
    technologies: ["React Native", "PostgreSQL", "Node.js"],
    githubUrl: "https://github.com/",
    liveUrl: "",
    imagePlaceholder: "/projects/toy-junction.svg",
  },
  {
    slug: "school-app",
    title: "SchoolApp",
    description:
      "School management platform with student records, attendance, and administration tools for staff and faculty.",
    technologies: ["React", "TypeScript", "Firebase"],
    githubUrl: "https://github.com/",
    liveUrl: "",
    imagePlaceholder: "/projects/school-app.svg",
  },
  {
    slug: "ai-project",
    title: "AI Project",
    description:
      "A future AI-powered application exploring conversational assistants and automation workflows.",
    technologies: ["Next.js", "OpenAI", "PostgreSQL"],
    githubUrl: "",
    liveUrl: "",
    imagePlaceholder: "/projects/ai-project.svg",
  },
];
