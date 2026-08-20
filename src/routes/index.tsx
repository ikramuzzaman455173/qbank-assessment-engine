import { createFileRoute, redirect } from "@tanstack/react-router";
import { ROUTES } from "@/constants/routes";
import { supabase } from "@/integrations/supabase/client";
import { LandingHeader } from "@/features/landing/components/landing-header";
import { LandingHero } from "@/features/landing/components/landing-hero";
import { LandingFeatures } from "@/features/landing/components/landing-features";
import { LandingHowItWorks } from "@/features/landing/components/landing-how-it-works";
import { LandingStats } from "@/features/landing/components/landing-stats";
import { LandingCTA } from "@/features/landing/components/landing-cta";
import { LandingFooter } from "@/features/landing/components/landing-footer";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      throw redirect({ to: ROUTES.dashboard });
    }
  },
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground scroll-smooth">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingStats />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
