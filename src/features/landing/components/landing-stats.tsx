import { CheckCircle2, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function LandingStats() {
  const highlights = [
    {
      icon: Zap,
      title: "Instant Ingestion",
      desc: "Import complete multi-page PDF question documents without manual copy-pasting.",
      badge: "⚡ Fast",
      rotation: "-rotate-2 hover:rotate-0",
      accent: "border-amber-500/40 bg-amber-500/5",
    },
    {
      icon: Sparkles,
      title: "Dual Learning Modes",
      desc: "Switch seamlessly between untimed practice with solutions and timed exam conditions.",
      badge: "🎯 Versatile",
      rotation: "rotate-2 hover:rotate-0",
      accent: "border-blue-500/40 bg-blue-500/5",
    },
    {
      icon: CheckCircle2,
      title: "Weak Area Radar",
      desc: "Target exactly what you don't know rather than wasting hours on already mastered topics.",
      badge: "📈 Diagnostic",
      rotation: "-rotate-1 hover:rotate-0",
      accent: "border-emerald-500/40 bg-emerald-500/5",
    },
    {
      icon: ShieldCheck,
      title: "Private & Secure",
      desc: "Your questions, test attempts, and study analytics belong solely to your account.",
      badge: "🔒 100% Private",
      rotation: "rotate-1.5 hover:rotate-0",
      accent: "border-purple-500/40 bg-purple-500/5",
    },
  ];

  return (
    <section id="stats" className="scroll-mt-20 py-20 border-b border-border bg-muted/20 relative">
      <div className="container-page space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Why Serious Students Choose Knowledge Canvas
          </h3>
          <p className="text-muted-foreground text-sm">
            Everything structured to maximize retention and exam readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={cn(
                  "p-6 rounded-xl border-2 border-dashed border-border bg-card shadow-2xs space-y-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-solid relative group",
                  item.rotation,
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs">
                    <Icon className="size-5" />
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-border bg-muted/60 text-muted-foreground">
                    {item.badge}
                  </span>
                </div>

                <h4 className="text-base font-bold text-foreground pt-1">{item.title}</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
