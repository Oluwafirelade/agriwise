import { ArrowRight, MessageCircle, Globe2, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-farm.jpg";

interface HeroSectionProps {
  onStartChat: () => void;
}

export function HeroSection({ onStartChat }: HeroSectionProps) {
  const handleExploreLanguages = () => {
    document.getElementById("languages")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src={heroImage} 
          alt="Nigerian farmland at sunrise" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 pattern-dots opacity-30 z-[1] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <Leaf className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Agricultural Guidance</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight animate-slide-up">
            Farm Smarter with{" "}
            <span className="text-gradient-warm">Multilingual</span>{" "}
            <span className="text-primary">AI Advisory</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Get personalized farming advice in your native language. Our intelligent platform 
            understands Hausa, Yoruba, Igbo, and English — helping Nigerian farmers make 
            better decisions for healthier crops and higher yields.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button variant="hero" size="xl" onClick={onStartChat} className="group">
              <MessageCircle className="w-5 h-5" />
              Start Asking Questions
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="xl" onClick={handleExploreLanguages}>
              <Globe2 className="w-5 h-5" />
              Explore Languages
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}
