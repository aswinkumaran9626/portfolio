"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NAV_ITEMS } from "@/constants/nav";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeId: string;
}

export function MobileMenu({ open, onOpenChange, activeId }: MobileMenuProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="border-white/10 bg-background/95 backdrop-blur-xl">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 px-4">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => onOpenChange(false)}
              className={cn(
                "rounded-xl px-4 py-3 text-base text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground",
                activeId === item.id && "bg-primary/15 text-foreground"
              )}
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="mt-auto px-4 pb-6">
          <SocialLinks />
        </div>
      </SheetContent>
    </Sheet>
  );
}
