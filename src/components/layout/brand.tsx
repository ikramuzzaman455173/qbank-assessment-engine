import { GraduationCap } from "lucide-react";

import { appConfig } from "@/app/config/app.config";
import { cn } from "@/lib/utils";

export function Brand({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 font-display text-base font-semibold", className)}>
      <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <GraduationCap className="size-4.5" aria-hidden="true" />
      </span>
      {appConfig.name}
    </span>
  );
}
