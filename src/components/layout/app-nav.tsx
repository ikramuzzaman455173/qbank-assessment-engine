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
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{
            className: "bg-sidebar-accent text-sidebar-accent-foreground",
            "aria-current": "page",
          }}
          activeOptions={{ exact: to === "/dashboard" }}
        >
          <Icon className="size-4 shrink-0" aria-hidden="true" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
