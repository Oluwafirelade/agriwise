import { Sprout, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom"; // 1. Added import for navigation

export function Footer() {
  const navigate = useNavigate(); // 2. Initialize navigation hook

  // Helper function for smooth scrolling
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // If the section exists on the current page, scroll to it smoothly
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      // If the section isn't on this page (e.g., user is on the /chat page), 
      // navigate them to the home page's section
      window.location.href = `/#${id}`;
    }
  };

  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-sidebar-primary flex items-center justify-center">
                <Sprout className="w-6 h-6 text-sidebar-primary-foreground" />
              </div>
              <div>
                <span className="font-display font-bold text-xl text-sidebar-foreground">
                  AgriAdvisor
                </span>
                <p className="text-xs text-sidebar-foreground/60">
                  Multilingual Farm Advisory
                </p>
              </div>
            </div>
            <p className="text-sm text-sidebar-foreground/70 mb-6">
              Empowering Nigerian farmers with AI-powered agricultural guidance
              in their native languages.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#features" 
                  onClick={(e) => scrollToSection(e, "features")}
                  className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors cursor-pointer"
                >
                  Features
                </a>
              </li>
              <li>
                <a 
                  href="#how-it-works" 
                  onClick={(e) => scrollToSection(e, "how-it-works")}
                  className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors cursor-pointer"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a 
                  href="#languages" 
                  onClick={(e) => scrollToSection(e, "languages")}
                  className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors cursor-pointer"
                >
                  Languages
                </a>
              </li>
              <li>
                {/* 3. Updated Try It Now to use navigate */}
                <a 
                  href="/chat" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/chat");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors cursor-pointer"
                >
                  Try It Now
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sidebar-primary flex-shrink-0 mt-0.5" />
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Babcock+University,+Ilishan-Remo,+Nigeria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors cursor-pointer"
                >
                  Babcock University,<br />
                  Ilishan-Remo, Nigeria
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-sidebar-primary" />
                <a href="mailto:info@agriadvisor.ng" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  info@agriadvisor.ng
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-sidebar-primary" />
                <a href="tel:+2348084139346" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  +234 808 413 9346
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-sidebar-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-sidebar-foreground/60">
              © 2025 AgriAdvisor. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}