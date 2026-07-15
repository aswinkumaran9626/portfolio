"use client";

import { motion } from "framer-motion";
import { ExternalLink, LayoutTemplate } from "lucide-react";
import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/GlassCard";
import { GithubIcon } from "@/components/icons/BrandIcons";
import { fadeUp } from "@/lib/motion";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div variants={fadeUp}>
      <GlassCard className="flex h-full flex-col overflow-hidden p-0">
        <div className="flex h-44 items-center justify-center border-b border-white/10 bg-gradient-to-br from-primary/20 to-secondary/20">
          <LayoutTemplate className="h-10 w-10 text-white/40" />
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div>
            <h3 className="text-lg font-semibold">{project.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="bg-white/5 text-xs font-normal">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="mt-auto flex gap-3 pt-2">
            {project.githubUrl && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 rounded-full border-white/15 bg-white/5 hover:bg-white/10"
                nativeButton={false}
                render={
                  <a href={project.githubUrl} target="_blank" rel="noreferrer">
                    <GithubIcon className="h-4 w-4" /> GitHub
                  </a>
                }
              />
            )}
            {project.liveUrl && (
              <Button
                size="sm"
                className="flex-1 rounded-full"
                nativeButton={false}
                render={
                  <a href={project.liveUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" /> Live Demo
                  </a>
                }
              />
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
