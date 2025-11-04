import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Home() {
  const t = useTranslations('home');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <div className="max-w-5xl w-full items-center justify-between">
        <h1 className="text-4xl font-bold text-center mb-4">
          {t('title')}
        </h1>
        <p className="text-xl text-center mb-4">
          {t('subtitle')}
        </p>
        <p className="text-center text-gray-600 mb-8">
          {t('description')}
        </p>

        <div className="flex justify-center mb-12">
          <Link
            href="/calculator"
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('startCalculator')}
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
            <h2 className="text-xl font-semibold mb-2">{t('calculateRent')}</h2>
            <p className="text-gray-600">{t('calculateRentDesc')}</p>
          </div>

          <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
            <h2 className="text-xl font-semibold mb-2">{t('knowYourRights')}</h2>
            <p className="text-gray-600">{t('knowYourRightsDesc')}</p>
          </div>

          <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
            <h2 className="text-xl font-semibold mb-2">{t('joinCommunity')}</h2>
            <p className="text-gray-600">{t('joinCommunityDesc')}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
