import { Sprout, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
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
                <a href="#features" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#languages" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  Languages
                </a>
              </li>
              <li>
                <a href="#chat" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
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
                <span className="text-sm text-sidebar-foreground/70">
                  Babcock University,<br />
                  Ilishan-Remo, Nigeria
                </span>
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