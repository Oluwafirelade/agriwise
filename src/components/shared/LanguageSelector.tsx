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
  inline?: boolean;
}

export function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  variant = "default",
  inline = false,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);

  const currentLang = languages.find(l => l.code === selectedLanguage) || languages[0];

  // Inline mode: render as a flat list of buttons (for mobile menus)
  if (inline) {
    return (
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-2 text-sm text-muted-foreground px-2 pb-1">
          <Globe className="h-4 w-4" />
          Language
        </span>
        <div className="grid grid-cols-2 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onLanguageChange(lang.code)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                selectedLanguage === lang.code
                  ? "bg-primary/10 text-primary font-medium ring-1 ring-primary/20"
                  : "bg-muted/50 text-foreground hover:bg-muted"
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.nativeName}</span>
              {selectedLanguage === lang.code && (
                <Check className="h-3.5 w-3.5 ml-auto text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Dropdown mode: standard desktop dropdown
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
                <span className="text-xs text-muted-foreground">{lang.name}</span>
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
