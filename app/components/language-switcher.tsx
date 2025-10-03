"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/app/i18n/navigation";
import { locales } from "@/app/i18n/request";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname(); // This pathname is locale-agnostic
  const [isPending, startTransition] = useTransition();

  const handleChange = (newLocale: string) => {
    startTransition(() => {
      // Use replace with the locale option for language switching
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="flex items-center gap-1">
      {locales.map((locale) => (
        <Button
          key={locale}
          variant={currentLocale === locale ? "secondary" : "ghost"}
          size="sm"
          onClick={() => handleChange(locale)}
          disabled={currentLocale === locale || isPending} // Disable while pending
          className="uppercase text-xs px-2 py-1 h-auto"
        >
          {locale}
        </Button>
      ))}
    </div>
  );
}
