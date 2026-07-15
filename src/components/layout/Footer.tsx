import { SITE } from "@/constants/site";
import { SocialLinks } from "@/components/shared/SocialLinks";

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-sm font-semibold">{SITE.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {SITE.shortName}. All rights reserved.
          </p>
        </div>
        <SocialLinks />
      </div>
    </footer>
  );
}
