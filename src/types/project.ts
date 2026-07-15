export interface Project {
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imagePlaceholder: string;
}
