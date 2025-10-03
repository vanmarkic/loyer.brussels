'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Menu, Twitter, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import LanguageSwitcher from '@/app/components/language-switcher';

export default function Home() {
  const t = useTranslations();
  const currentLocale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top header - simplified like wuune.be */}
      <header className="bg-white py-3 px-4 border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-red-600" />
            <span className="text-sm font-bold uppercase text-gray-700 tracking-wider">
              {t('HomePage.header.collectiveTitle')}
            </span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main navigation - bold style like wuune.be */}
      <nav className="bg-red-600 py-3 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Heart className="h-8 w-8 text-white" />
            <div className="text-white">
              <div className="font-black text-xl leading-tight tracking-wide">WUUNE</div>
              <div className="text-xs font-medium leading-tight opacity-90">
                {t('HomePage.navigation.collective')}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-white">
            <Link
              href={`/${currentLocale}`}
              className="wuune-nav hover:underline transition-all"
            >
              {t('HomePage.navigation.home')}
            </Link>
            <Link
              href={`/${currentLocale}/wuune`}
              className="wuune-nav hover:underline transition-all"
            >
              {t('HomePage.navigation.about')}
            </Link>
            <Link
              href={`/${currentLocale}/campagne`}
              className="wuune-nav hover:underline transition-all"
            >
              {t('HomePage.navigation.campaign')}
            </Link>
            <Link
              href={`/${currentLocale}/contact`}
              className="wuune-nav hover:underline transition-all"
            >
              {t('HomePage.navigation.contact')}
            </Link>
          </div>
          <button
            className="text-white flex items-center gap-2 wuune-nav md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {t('HomePage.navigation.menu')} <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile menu - clean style */}
      {isMenuOpen && (
        <div className="md:hidden bg-red-700 py-4 px-6 border-t border-red-500">
          <div className="flex flex-col gap-4 text-white">
            <Link href={`/${currentLocale}`} className="wuune-nav hover:underline">
              {t('HomePage.navigation.home')}
            </Link>
            <Link href={`/${currentLocale}/wuune`} className="wuune-nav hover:underline">
              {t('HomePage.navigation.about')}
            </Link>
            <Link
              href={`/${currentLocale}/campagne`}
              className="wuune-nav hover:underline"
            >
              {t('HomePage.navigation.campaign')}
            </Link>
            <Link
              href={`/${currentLocale}/contact`}
              className="wuune-nav hover:underline"
            >
              {t('HomePage.navigation.contact')}
            </Link>
          </div>
        </div>
      )}

      {/* Hero section with gradient background - matching wuune.be style */}
      <main className="flex-1 bg-gradient-to-br from-red-600 via-red-500 to-orange-500">
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="text-center max-w-6xl mx-auto">
            {/* Main hero content centered like wuune.be */}
            <div className="text-white space-y-12">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-tight text-shadow-lg tracking-wide">
                {t('HomePage.hero.mainTitle')}
              </h1>

              <div className="flex justify-center mb-8">
                <div className="aspect-video w-full max-w-md md:max-w-lg rounded-xl overflow-hidden shadow-2xl border-4 border-white/20">
                  <Image
                    src="/hero-manifestation.svg"
                    alt={t('HomePage.hero.imageAlt')}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="space-y-8 max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-4xl font-bold">
                  {t('HomePage.hero.subtitle')}
                </h2>
                <p className="text-lg md:text-xl leading-relaxed font-medium">
                  {t('HomePage.hero.description')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-8 items-center justify-center pt-8">
                <Link href={`/${currentLocale}/calculateur`}>
                  <Button className="bg-white text-red-600 hover:bg-gray-100 rounded-full px-12 py-4 text-xl font-bold shadow-lg transform hover:scale-105 transition-all uppercase">
                    {t('HomePage.hero.startButton')}
                  </Button>
                </Link>

                <div className="flex items-center gap-4">
                  <span className="text-sm uppercase font-bold tracking-wide">
                    {t('HomePage.hero.shareText')}
                  </span>
                  <Link
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://loyer.brussels')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    <Facebook className="h-6 w-6 text-white" />
                  </Link>
                  <Link
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent('https://loyer.brussels')}&text=${encodeURIComponent('Rejoignez Wuune - Collectif contre les loyers abusifs')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-400 p-3 rounded-full hover:bg-blue-500 transition-colors shadow-lg"
                  >
                    <Twitter className="h-6 w-6 text-white" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Qui sommes-nous section - matching wuune.be content style */}
      <section className="wuune-section bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="wuune-section-title text-gray-800 mb-8">
              {t('HomePage.aboutUs.title')}
            </h2>
            <div className="wuune-content-block">
              <p className="text-lg text-gray-700 leading-relaxed mb-6 wuune-text-strong">
                {t('HomePage.aboutUs.description1')}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6 wuune-text-strong">
                {t('HomePage.aboutUs.description2')}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8 wuune-text-strong">
                {t('HomePage.aboutUs.description3')}
              </p>
              <Link href={`/${currentLocale}/wuune`}>
                <Button className="bg-red-600 text-white hover:bg-red-700 px-8 py-3 font-bold uppercase tracking-wide">
                  {t('HomePage.aboutUs.learnMoreButton')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Actualités section - matching wuune.be news style */}
      <section className="wuune-section bg-white">
        <div className="container mx-auto px-4">
          <h2 className="wuune-section-title text-center text-gray-800 mb-12">
            {t('HomePage.news.title')}
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="wuune-news-item">
                <div className="wuune-news-date">
                  {t('HomePage.news.items.permanences.date')}
                </div>
                <h3 className="wuune-news-title">
                  {/* News article pages not yet created - linking to contact for more info */}
                  <Link href={`/${currentLocale}/contact`} className="hover:text-red-600">
                    {t('HomePage.news.items.permanences.title')}
                  </Link>
                </h3>
                <p className="wuune-news-excerpt">
                  {t('HomePage.news.items.permanences.excerpt')}
                </p>
              </div>

              <div className="wuune-news-item">
                <div className="wuune-news-date">
                  {t('HomePage.news.items.abusiveRent.date')}
                </div>
                <h3 className="wuune-news-title">
                  <Link href={`/${currentLocale}/contact`} className="hover:text-red-600">
                    {t('HomePage.news.items.abusiveRent.title')}
                  </Link>
                </h3>
                <p className="wuune-news-excerpt">
                  {t('HomePage.news.items.abusiveRent.excerpt')}
                </p>
              </div>

              <div className="wuune-news-item">
                <div className="wuune-news-date">
                  {t('HomePage.news.items.manifesto.date')}
                </div>
                <h3 className="wuune-news-title">
                  <Link href={`/${currentLocale}/contact`} className="hover:text-red-600">
                    {t('HomePage.news.items.manifesto.title')}
                  </Link>
                </h3>
                <p className="wuune-news-excerpt">
                  {t('HomePage.news.items.manifesto.excerpt')}
                </p>
              </div>

              <div className="wuune-news-item">
                <div className="wuune-news-date">
                  {t('HomePage.news.items.formation.date')}
                </div>
                <h3 className="wuune-news-title">
                  <Link href={`/${currentLocale}/contact`} className="hover:text-red-600">
                    {t('HomePage.news.items.formation.title')}
                  </Link>
                </h3>
                <p className="wuune-news-excerpt">
                  {t('HomePage.news.items.formation.excerpt')}
                </p>
              </div>
            </div>

            {/* Note: "View All News" button removed as /actualites page does not exist yet */}
            {/* Uncomment when actualites page is created:
            <div className="text-center mt-8">
              <Link href={`/${currentLocale}/actualites`}>
                <Button
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold"
                >
                  {t('HomePage.news.viewAllButton')}
                </Button>
              </Link>
            </div>
            */}
          </div>
        </div>
      </section>

      {/* Resources and newsletter section - matching wuune.be */}
      <section className="wuune-section bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="wuune-content-block">
              <h3 className="wuune-heading-md text-gray-800 mb-6 uppercase">
                {t('HomePage.resources.title')}
              </h3>
              <div className="space-y-4">
                {/* Resources coming soon - for now linking to contact page */}
                <Link
                  href={`/${currentLocale}/contact`}
                  className="block text-red-600 hover:text-red-700 font-semibold"
                >
                  {t('HomePage.resources.links.legalAid')}
                </Link>
                <Link
                  href={`/${currentLocale}/contact`}
                  className="block text-red-600 hover:text-red-700 font-semibold"
                >
                  {t('HomePage.resources.links.tenantRights')}
                </Link>
                <Link
                  href={`/${currentLocale}/contact`}
                  className="block text-red-600 hover:text-red-700 font-semibold"
                >
                  {t('HomePage.resources.links.rentControl')}
                </Link>
                <Link
                  href={`/${currentLocale}/contact`}
                  className="block text-red-600 hover:text-red-700 font-semibold"
                >
                  {t('HomePage.resources.links.mediation')}
                </Link>
              </div>
            </div>

            <div className="wuune-content-block">
              <h3 className="wuune-heading-md text-gray-800 mb-6 uppercase">
                {t('HomePage.newsletter.title')}
              </h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder={t('HomePage.newsletter.namePlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
                <input
                  type="text"
                  placeholder={t('HomePage.newsletter.firstNamePlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
                <input
                  type="email"
                  placeholder={t('HomePage.newsletter.emailPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
                <Button className="w-full bg-red-600 text-white hover:bg-red-700 py-3 font-bold uppercase tracking-wide">
                  {t('HomePage.newsletter.subscribeButton')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - simplified like wuune.be */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="h-6 w-6 text-red-500" />
            <span className="font-black text-xl tracking-wide">WUUNE</span>
          </div>
          <p className="text-gray-300 text-sm mb-4">{t('HomePage.footer.description')}</p>
          <p className="text-gray-400 text-xs">© 2025 {t('HomePage.footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
