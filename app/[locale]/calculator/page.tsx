import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { CalculatorProvider } from '@/contexts/CalculatorContext';
import { Calculator } from '@/components/calculator/Calculator';

export default function CalculatorPage() {
  const t = useTranslations('calculator');

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-2"
          >
            ← Back to home
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-600">{t('subtitle')}</p>
        </div>

        <CalculatorProvider>
          <Calculator />
        </CalculatorProvider>
      </div>
    </main>
  );
}
