"use client";

import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "../language-provider";

const LANGUAGES = [
  { code: "FI", label: "Suomi", flag: "🇫🇮" },
  { code: "EN", label: "English", flag: "🇬🇧" },
  { code: "SE", label: "Svenska", flag: "🇸🇪" },
] as const;

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const current = LANGUAGES.find(l => l.code === lang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-10 h-10 hover:bg-primary/5 hover:text-primary transition-colors flex items-center justify-center relative rounded-md outline-none">
        <Globe className="h-5 w-5" />
        <span className="absolute -bottom-1 -right-1 text-sm bg-background rounded border shadow-sm leading-none">
          {current?.flag}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {LANGUAGES.map(({ code, label, flag }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLang(code as any)}
            className={`font-bold cursor-pointer gap-2 ${lang === code ? "bg-primary/10 text-primary" : ""}`}
          >
            <span className="text-base">{flag}</span>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
