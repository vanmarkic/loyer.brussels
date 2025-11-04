import { Link } from '@/i18n/routing';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslations } from 'next-intl';

export function Header() {
  const t = useTranslations('home');

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-2xl font-bold text-blue-600">
              Loyer.Brussels
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/calculator"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Calculator
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
            <div className="ml-4 border-l pl-4">
              <LanguageSwitcher />
            </div>
          </nav>

          <div className="md:hidden">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
