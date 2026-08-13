import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState, type ReactNode } from "react";

import { AppBreadcrumbs } from "@/components/layout/app-breadcrumbs";
import { AppNav } from "@/components/layout/app-nav";
import { Brand } from "@/components/layout/brand";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ROUTES } from "@/constants/routes";

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
        <div className="flex h-16 items-center px-5">
          <Link to={ROUTES.dashboard} aria-label="Go to dashboard">
            <Brand />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <AppNav />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/85 px-4 backdrop-blur md:px-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden shrink-0"
                aria-label="Open navigation"
              >
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-16 items-center px-5">
                <Brand />
              </div>
              <div className="px-3">
                <AppNav onNavigate={() => setMobileOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <Link
            to={ROUTES.dashboard}
            className="lg:hidden shrink-0 mr-auto"
            aria-label="Go to dashboard"
          >
            <Brand />
          </Link>

          <div className="hidden lg:flex flex-1 items-center">
            <AppBreadcrumbs />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto w-full max-w-6xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
