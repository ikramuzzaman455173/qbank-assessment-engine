import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      throw redirect({ to: ROUTES.dashboard });
    }
  },
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="mx-auto flex max-w-[480px] flex-col items-center justify-center text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Welcome to Knowledge Canvas
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Your personal platform for interactive learning and comprehensive assessments.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link to={ROUTES.auth}>Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
