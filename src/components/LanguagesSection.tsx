import { Check, Users } from "lucide-react";

const languageDetails = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    speakers: "~20 Million",
    regions: "Nationwide",
    features: ["Full text support", "Voice input/output", "Comprehensive vocabulary"],
  },
  {
    code: "ha",
    name: "Hausa", 
    nativeName: "Hausa",
    flag: "🇳🇬",
    speakers: "~70 Million",
    regions: "Northern Nigeria",
    features: ["Native text processing", "Agricultural terminology", "Dialect variations"],
  },
  {
    code: "yo",
    name: "Yoruba",
    nativeName: "Yorùbá",
    flag: "🇳🇬",
    speakers: "~45 Million",
    regions: "Southwestern Nigeria",
    features: ["Tonal language support", "Diacritical marks", "Local farming terms"],
  },
  {
    code: "ig",
    name: "Igbo",
    nativeName: "Igbo",
    flag: "🇳🇬",
    speakers: "~45 Million",
    regions: "Southeastern Nigeria",
    features: ["Complex orthography", "Regional dialects", "Traditional practices"],
  },
];

export function LanguagesSection() {
  return (
    <section id="languages" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
            Language Support
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Speak Your <span className="text-primary">Native Language</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Breaking language barriers for Nigerian farmers. Our platform understands 
            the major Nigerian languages, making agricultural knowledge accessible to all.
          </p>
        </div>

        {/* Language Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {languageDetails.map((lang, index) => (
            <div
              key={lang.code}
              className="group bg-card rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border border-border/50 relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
              
              <div className="relative z-10">
                {/* Flag & Name */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{lang.flag}</span>
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {lang.nativeName}
                    </h3>
                    {lang.nativeName !== lang.name && (
                      <p className="text-sm text-muted-foreground">{lang.name}</p>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Users className="w-4 h-4" />
                  <span>{lang.speakers} speakers</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {lang.regions}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {lang.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
