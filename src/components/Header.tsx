import { Sprout, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
  onStartChat?: () => void; // Made optional as we'll handle navigation here
}

export function Header({ selectedLanguage, onLanguageChange, onStartChat }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Unified function to handle navigation and cleanup
  const handleStartChat = () => {
    setMobileMenuOpen(false); // Close mobile menu if open
    if (onStartChat) onStartChat(); // Run parent logic if provided
    navigate("/chat"); // Take user to Chat.tsx
  };

  // Helper function for smooth scrolling
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false); // Always close the mobile menu on click
    
    const element = document.getElementById(id);
    if (element) {
      // If on the home page, scroll smoothly
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      // If on a different page (like /chat), navigate back to home + section
      window.location.href = `/#${id}`;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button 
            onClick={() => {
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to top
            }} 
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all duration-300">
              <Sprout className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg md:text-xl text-foreground">
                AgriAdvisor
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                Multilingual Farm Advisory
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#features" 
              onClick={(e) => scrollToSection(e, "features")}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => scrollToSection(e, "how-it-works")}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              How It Works
            </a>
            <a 
              href="#languages" 
              onClick={(e) => scrollToSection(e, "languages")}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Languages
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />
            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageChange={onLanguageChange}
              variant="glass"
            />
            {/* Desktop Get Started */}
            <Button variant="hero" size="lg" className="hidden sm:flex" onClick={handleStartChat}>
              Get Started
            </Button>
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-border/50 bg-background/95 backdrop-blur-lg animate-in fade-in slide-in-from-top-4 duration-300">
            <nav className="flex flex-col gap-4">
              <a 
                href="#features" 
                onClick={(e) => scrollToSection(e, "features")}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors py-2 px-2 cursor-pointer"
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                onClick={(e) => scrollToSection(e, "how-it-works")}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors py-2 px-2 cursor-pointer"
              >
                How It Works
              </a>
              <a 
                href="#languages" 
                onClick={(e) => scrollToSection(e, "languages")}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors py-2 px-2 cursor-pointer"
              >
                Languages
              </a>
              {/* Mobile Get Started */}
              <Button variant="hero" size="lg" className="mt-4 w-full" onClick={handleStartChat}>
                Get Started
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}