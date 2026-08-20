import { Link } from "@tanstack/react-router";

import { primaryNavigation } from "@/app/config/navigation";

interface AppNavProps {
  onNavigate?: () => void;
}

export function AppNav({ onNavigate }: AppNavProps) {
  return (
    <nav aria-label="Main" className="flex flex-col gap-1">
      {primaryNavigation.map(({ label, to, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground border border-transparent transition-all hover:border-border/60 hover:bg-muted/60 hover:text-foreground active:scale-[0.98]"
          activeProps={{
            className: "bg-primary text-primary-foreground font-semibold border border-primary shadow-xs",
            "aria-current": "page",
          }}
          activeOptions={{ exact: to === "/dashboard" }}
        >
          <Icon className="size-4 shrink-0 transition-transform group-hover:scale-110" aria-hidden="true" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
