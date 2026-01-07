import { Sprout, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import { getTranslation, LanguageCode } from "@/lib/translations";

interface FooterProps {
  selectedLanguage?: string;
}

export function Footer({ selectedLanguage = "en" }: FooterProps) {
  const t = (key: string) => getTranslation(selectedLanguage as LanguageCode, key as any);
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-sidebar-primary flex items-center justify-center">
                <Sprout className="w-6 h-6 text-sidebar-primary-foreground" />
              </div>
              <div>
                <span className="font-display font-bold text-xl text-sidebar-foreground">
                  {t("footerBrand")}
                </span>
                <p className="text-xs text-sidebar-foreground/60">
                  {t("footerSubtitle")}
                </p>
              </div>
            </div>
            <p className="text-sm text-sidebar-foreground/70 mb-6">
              {t("footerDescription")}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center hover:bg-sidebar-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center hover:bg-sidebar-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center hover:bg-sidebar-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center hover:bg-sidebar-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">{t("footerQuickLinks")}</h4>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  {t("footerFeatures")}
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  {t("footerHowItWorks")}
                </a>
              </li>
              <li>
                <a href="#languages" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  {t("footerLanguages")}
                </a>
              </li>
              <li>
                <a href="#chat" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  {t("footerTryNow")}
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">{t("footerResources")}</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  {t("footerFarmingGuide")}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  {t("footerCropCalendar")}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  {t("footerPestLibrary")}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  {t("footerExtensionServices")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">{t("footerContact")}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sidebar-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-sidebar-foreground/70">
                  {t("footerAddress")}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-sidebar-primary" />
                <a href="mailto:info@agriadvisor.ng" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  {t("footerEmail")}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-sidebar-primary" />
                <a href="tel:+2348012345678" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  {t("footerPhone")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-sidebar-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-sidebar-foreground/60">
              {t("footerCopyright")}
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-sidebar-foreground/60 hover:text-sidebar-primary transition-colors">
                {t("footerPrivacy")}
              </a>
              <a href="#" className="text-sm text-sidebar-foreground/60 hover:text-sidebar-primary transition-colors">
                {t("footerTerms")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
