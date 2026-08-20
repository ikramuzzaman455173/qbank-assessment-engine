import { CheckCircle2, ShieldCheck, Sparkles, Zap } from "lucide-react";

export function LandingStats() {
  const highlights = [
    {
      icon: Zap,
      title: "Instant Ingestion",
      desc: "Import complete multi-page PDF question documents without manual copy-pasting.",
    },
    {
      icon: Sparkles,
      title: "Dual Learning Modes",
      desc: "Switch seamlessly between untimed practice with solutions and timed exam conditions.",
    },
    {
      icon: CheckCircle2,
      title: "Weak Area Radar",
      desc: "Target exactly what you don't know rather than wasting hours on already mastered topics.",
    },
    {
      icon: ShieldCheck,
      title: "Private & Secure",
      desc: "Your questions, test attempts, and study analytics belong solely to your account.",
    },
  ];

  return (
    <section id="stats" className="py-16 border-b border-border bg-muted/20">
      <div className="container-page">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-lg border border-border bg-card shadow-2xs space-y-2.5"
              >
                <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4.5" />
                </div>
                <h4 className="text-base font-semibold text-foreground">{item.title}</h4>
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
