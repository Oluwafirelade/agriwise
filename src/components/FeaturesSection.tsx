import { Globe, MessageSquareText, Zap, Brain, Mic, Shield } from "lucide-react";
import { getTranslation, LanguageCode } from "@/lib/translations";

interface FeaturesSectionProps {
  selectedLanguage?: string;
}

export function FeaturesSection({ selectedLanguage = "en" }: FeaturesSectionProps) {
  const t = (key: string) => getTranslation(selectedLanguage as LanguageCode, key as any);

  const features = [
    {
      icon: Globe,
      titleKey: "feature1Title",
      descKey: "feature1Desc",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: MessageSquareText,
      titleKey: "feature2Title",
      descKey: "feature2Desc",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Zap,
      titleKey: "feature3Title",
      descKey: "feature3Desc",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Brain,
      titleKey: "feature4Title",
      descKey: "feature4Desc",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Mic,
      titleKey: "feature5Title",
      descKey: "feature5Desc",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Shield,
      titleKey: "feature6Title",
      descKey: "feature6Desc",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];
  return (
    <section id="features" className="py-20 md:py-32 bg-gradient-subtle relative">
      <div className="absolute inset-0 pattern-lines" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
            {t("featuresSectionLabel")}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t("featuresHeading")}{" "}
            <span className="text-primary">{t("featuresHeadingHighlight")}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("featuresSubheading")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.titleKey}
              className="group bg-card rounded-2xl p-6 md:p-8 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {t(feature.titleKey)}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t(feature.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
