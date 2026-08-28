import { Link, useLocation } from "@tanstack/react-router";

import { primaryNavigation } from "@/app/config/navigation";
import { cn } from "@/lib/utils";

interface AppNavProps {
  onNavigate?: () => void;
}

export function AppNav({ onNavigate }: AppNavProps) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav aria-label="Main" className="flex flex-col gap-1">
      {primaryNavigation.map(({ label, to, icon: Icon }) => {
        const isPracticeItem = to.startsWith("/practice");
        const isActive = isPracticeItem 
          ? pathname.startsWith("/practice")
          : to === "/dashboard" 
          ? pathname === "/dashboard"
          : pathname.startsWith(to);

        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium border transition-all active:scale-[0.98]",
              isActive
                ? "bg-primary text-primary-foreground font-semibold border-primary shadow-xs"
                : "text-muted-foreground border-transparent hover:border-border/60 hover:bg-muted/60 hover:text-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="size-4 shrink-0 transition-transform group-hover:scale-110" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
