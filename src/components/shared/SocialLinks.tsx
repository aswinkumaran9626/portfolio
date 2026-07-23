import { Mail } from "lucide-react";
import { SITE } from "@/constants/site";
import { cn } from "@/lib/utils";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";

interface SocialLinksProps {
  className?: string;
}

const links = [
  { href: SITE.social.github, label: "GitHub", Icon: GithubIcon },
  { href: SITE.social.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  { href: `mailto:${SITE.email}`, label: "Email", Icon: Mail },
];

export function SocialLinks({ className }: SocialLinksProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noreferrer"
          aria-label={label}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:text-primary hover:shadow-[0_0_20px_-6px_rgba(56,189,248,0.6)]"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
