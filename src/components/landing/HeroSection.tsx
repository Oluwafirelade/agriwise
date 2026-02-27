import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 1. Added import for navigation
import { ArrowRight, MessageCircle, Globe2, Leaf, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-farm.jpg";

// Array of farming-related Bible verses
const farmingVerses = [
  { text: "Those who work their land will have abundant food.", ref: "Proverbs 28:19" },
  { text: "The hardworking farmer should be the first to receive a share of the crops.", ref: "2 Timothy 2:6" },
  { text: "Sow your seed in the morning, and at evening let your hands not be idle.", ref: "Ecclesiastes 11:6" },
  { text: "For the seed shall be prosperous; the vine shall give her fruit, and the ground shall give her increase.", ref: "Zechariah 8:12" },
  { text: "And let us not grow weary of doing good, for in due season we will reap, if we do not give up.", ref: "Galatians 6:9" }
];

interface HeroSectionProps {
  onStartChat?: () => void; // 2. Made optional to match Header
}

export function HeroSection({ onStartChat }: HeroSectionProps) {
  const [verseIndex, setVerseIndex] = useState(0);
  const navigate = useNavigate(); // 3. Initialize navigation hook

  // 4. Create unified function to handle navigation and parent logic
  const handleStartChatClick = () => {
    if (onStartChat) onStartChat();
    navigate("/chat");
  };

  // Rotate verse every 8 seconds. 
  useEffect(() => {
    const interval = setInterval(() => {
      setVerseIndex((prevIndex) => (prevIndex + 1) % farmingVerses.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [verseIndex]);

  const handleNextVerse = () => {
    setVerseIndex((prevIndex) => (prevIndex + 1) % farmingVerses.length);
  };

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

      {/* Rotating Bible Verse - Top Right */}
      <div className="absolute top-28 right-4 md:right-8 lg:right-12 z-20 max-w-[280px] hidden lg:block">
        <div 
          key={verseIndex} 
          onClick={handleNextVerse}
          className="bg-background/40 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-xl animate-in fade-in slide-in-from-right-4 duration-700 cursor-pointer transition-all hover:scale-105 hover:bg-background/60 hover:shadow-2xl group"
        >
          <Quote className="w-5 h-5 text-primary/70 mb-3 group-hover:text-primary transition-colors" />
          <p className="text-sm italic text-foreground/90 leading-relaxed mb-3 font-medium select-none">
            "{farmingVerses[verseIndex].text}"
          </p>
          <p className="text-[11px] uppercase tracking-widest text-primary font-bold select-none">
            — {farmingVerses[verseIndex].ref}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6 mt-3 animate-fade-in">
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
            understands Hausa, Yoruba, Igbo, and English ,helping Nigerian farmers make 
            better decisions for healthier crops and higher yields.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {/* 5. Updated onClick handler here */}
            <Button variant="hero" size="xl" onClick={handleStartChatClick} className="group">
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
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0 pointer-events-none" />
    </section>
  );
}