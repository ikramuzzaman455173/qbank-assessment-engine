import { useEffect, useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { ArrowUp } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/features/landing/components/landing-header";
import { LandingHero } from "@/features/landing/components/landing-hero";
import { LandingFeatures } from "@/features/landing/components/landing-features";
import { LandingHowItWorks } from "@/features/landing/components/landing-how-it-works";
import { LandingFAQ } from "@/features/landing/components/landing-faq";
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
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground scroll-smooth">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingFAQ />
        <LandingCTA />
      </main>
      <LandingFooter />

      {/* Floating Scroll to Top Action */}
      {showScrollTop && (
        <Button
          size="icon"
          variant="outline"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 size-10 rounded-full border border-border bg-background/80 backdrop-blur-md shadow-md hover:scale-110 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          aria-label="Scroll to top"
        >
          <ArrowUp className="size-4" />
        </Button>
      )}
    </div>
  );
}
