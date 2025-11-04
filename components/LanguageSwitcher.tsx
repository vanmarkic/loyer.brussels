'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { Button } from './ui/button';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as string;

  const handleLanguageChange = (locale: string) => {
    router.replace(pathname, { locale });
  };

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={currentLocale === lang.code ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleLanguageChange(lang.code)}
          className="min-w-[60px]"
        >
          <span className="mr-1">{lang.flag}</span>
          {lang.code.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}
