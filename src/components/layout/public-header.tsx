import { Link } from "@tanstack/react-router";

import { Brand } from "@/components/layout/brand";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useSession } from "@/features/auth/hooks/use-session";

export function PublicHeader() {
  const { user, isLoading } = useSession();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to={ROUTES.landing} aria-label="Home">
          <Brand />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isLoading ? null : user ? (
            <Button asChild size="sm">
              <Link to={ROUTES.dashboard}>Go to dashboard</Link>
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link to={ROUTES.auth}>Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
