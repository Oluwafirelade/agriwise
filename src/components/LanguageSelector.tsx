import { useState } from "react";
import { ChevronDown, Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "ha", name: "Hausa", nativeName: "Hausa", flag: "🇳🇬" },
  { code: "yo", name: "Yoruba", nativeName: "Yorùbá", flag: "🇳🇬" },
  { code: "ig", name: "Igbo", nativeName: "Igbo", flag: "🇳🇬" },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
  variant?: "default" | "glass";
}

export function LanguageSelector({ 
  selectedLanguage, 
  onLanguageChange,
  variant = "default" 
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  
  const currentLang = languages.find(l => l.code === selectedLanguage) || languages[0];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant === "glass" ? "glass" : "outline"} 
          className="gap-2 min-w-[140px] justify-between"
        >
          <span className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="text-lg">{currentLang.flag}</span>
            <span className="hidden sm:inline">{currentLang.nativeName}</span>
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => {
              onLanguageChange(lang.code);
              setOpen(false);
            }}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">{lang.flag}</span>
              <span className="flex flex-col">
                <span className="font-medium">{lang.nativeName}</span>
                {lang.nativeName !== lang.name && (
                  <span className="text-xs text-muted-foreground">{lang.name}</span>
                )}
              </span>
            </span>
            {selectedLanguage === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { languages };
