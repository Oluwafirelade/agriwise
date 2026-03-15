import { MessageCircle, Languages, Cpu, Send } from "lucide-react";
import { getTranslation, LanguageCode } from "@/lib/translations";

interface HowItWorksSectionProps {
  selectedLanguage?: string;
}

export function HowItWorksSection({ selectedLanguage = "en" }: HowItWorksSectionProps) {
  const t = (key: string) => getTranslation(selectedLanguage as LanguageCode, key as any);

  const steps = [
    {
      icon: MessageCircle,
      step: "01",
      titleKey: "howStep1Title",
      descKey: "howStep1Desc",
      exampleKey: "howStep1Example",
    },
    {
      icon: Languages,
      step: "02", 
      titleKey: "howStep2Title",
      descKey: "howStep2Desc",
      exampleKey: "howStep2Example",
    },
    {
      icon: Cpu,
      step: "03",
      titleKey: "howStep3Title",
      descKey: "howStep3Desc",
      exampleKey: "howStep3Example",
    },
    {
      icon: Send,
      step: "04",
      titleKey: "howStep4Title",
      descKey: "howStep4Desc",
      exampleKey: "howStep4Example",
    },
  ];
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
            {t("howItWorksLabel")}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t("howItWorksHeading")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("howItWorksSubheading")}
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className="relative flex gap-6 md:gap-8 pb-12 last:pb-0"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-7 top-16 w-0.5 h-[calc(100%-4rem)] bg-gradient-to-b from-primary/50 to-primary/10" />
              )}
              
              {/* Icon */}
              <div className="relative z-10 flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow">
                  <step.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-bold text-secondary">{step.step}</span>
                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">
                    {t(step.titleKey)}
                  </h3>
                </div>
                <p className="text-muted-foreground mb-4 max-w-xl">
                  {t(step.descKey)}
                </p>
                <div className="inline-block bg-muted/50 rounded-lg px-4 py-2 border border-border/50">
                  <code className="text-sm text-foreground/80 italic">
                    {t(step.exampleKey)}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
