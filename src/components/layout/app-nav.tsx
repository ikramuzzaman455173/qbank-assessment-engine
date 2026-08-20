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
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:scale-[0.98]"
          activeProps={{
            className: "bg-sidebar-accent text-foreground font-semibold",
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
