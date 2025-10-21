'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Menu, Twitter, Heart } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import LanguageSwitcher from '@/app/components/language-switcher';

export default function Home() {
  const t = useTranslations();
  const currentLocale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-red-600 focus:text-white focus:rounded-md focus:shadow-lg"
      >
        Aller au contenu principal
      </a>

      {/* Main navigation - bold style like wuune.be */}
      <nav className="bg-red-600 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Heart className="h-8 w-8 text-white" aria-hidden="true" />
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
            <LanguageSwitcher />
          </div>
          <div className="flex md:hidden items-center gap-4">
            <LanguageSwitcher />
            <button
              className="text-white flex items-center gap-2 wuune-nav"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {t('HomePage.navigation.menu')} <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu - clean style */}
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-red-700 py-4 px-6 border-t border-red-500">
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
      <main id="main-content" className="flex-1 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Main hero content centered like wuune.be */}
            <div className="text-white space-y-6 md:space-y-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-tight text-shadow-lg tracking-wide animate-fade-in">
                {t('HomePage.hero.mainTitle')}
              </h1>

              <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  {t('HomePage.hero.subtitle')}
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed font-medium opacity-95 max-w-3xl mx-auto">
                  {t('HomePage.hero.description')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center justify-center pt-6">
                <Link href={`/${currentLocale}/calculateur`} className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-white text-red-600 hover:bg-gray-50 rounded-full px-12 py-6 text-xl font-bold shadow-2xl transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 uppercase tracking-wide">
                    {t('HomePage.hero.startButton')}
                  </Button>
                </Link>

                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                  <span className="text-sm uppercase font-bold tracking-wide">
                    {t('HomePage.hero.shareText')}
                  </span>
                  <Link
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://loyer.brussels')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 hover:scale-110 transition-all duration-300 shadow-lg"
                    aria-label="Partager sur Facebook"
                  >
                    <Facebook className="h-5 w-5 text-white" aria-hidden="true" />
                  </Link>
                  <Link
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent('https://loyer.brussels')}&text=${encodeURIComponent('Rejoignez Wuune - Collectif contre les loyers abusifs')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-400 p-3 rounded-full hover:bg-blue-500 hover:scale-110 transition-all duration-300 shadow-lg"
                    aria-label="Partager sur Twitter"
                  >
                    <Twitter className="h-5 w-5 text-white" aria-hidden="true" />
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
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <Link href={`/${currentLocale}/contact`} className="group">
                <div className="wuune-news-item group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                  <div className="wuune-news-date">
                    {t('HomePage.news.items.permanences.date')}
                  </div>
                  <h3 className="wuune-news-title group-hover:text-red-600 transition-colors">
                    {t('HomePage.news.items.permanences.title')}
                  </h3>
                  <p className="wuune-news-excerpt">
                    {t('HomePage.news.items.permanences.excerpt')}
                  </p>
                  <div className="mt-4 text-red-600 font-semibold text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Lire la suite →
                  </div>
                </div>
              </Link>

              <Link href={`/${currentLocale}/contact`} className="group">
                <div className="wuune-news-item group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                  <div className="wuune-news-date">
                    {t('HomePage.news.items.abusiveRent.date')}
                  </div>
                  <h3 className="wuune-news-title group-hover:text-red-600 transition-colors">
                    {t('HomePage.news.items.abusiveRent.title')}
                  </h3>
                  <p className="wuune-news-excerpt">
                    {t('HomePage.news.items.abusiveRent.excerpt')}
                  </p>
                  <div className="mt-4 text-red-600 font-semibold text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Lire la suite →
                  </div>
                </div>
              </Link>

              <Link href={`/${currentLocale}/contact`} className="group">
                <div className="wuune-news-item group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                  <div className="wuune-news-date">
                    {t('HomePage.news.items.manifesto.date')}
                  </div>
                  <h3 className="wuune-news-title group-hover:text-red-600 transition-colors">
                    {t('HomePage.news.items.manifesto.title')}
                  </h3>
                  <p className="wuune-news-excerpt">
                    {t('HomePage.news.items.manifesto.excerpt')}
                  </p>
                  <div className="mt-4 text-red-600 font-semibold text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Lire la suite →
                  </div>
                </div>
              </Link>

              <Link href={`/${currentLocale}/contact`} className="group">
                <div className="wuune-news-item group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                  <div className="wuune-news-date">
                    {t('HomePage.news.items.formation.date')}
                  </div>
                  <h3 className="wuune-news-title group-hover:text-red-600 transition-colors">
                    {t('HomePage.news.items.formation.title')}
                  </h3>
                  <p className="wuune-news-excerpt">
                    {t('HomePage.news.items.formation.excerpt')}
                  </p>
                  <div className="mt-4 text-red-600 font-semibold text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Lire la suite →
                  </div>
                </div>
              </Link>
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
                <label htmlFor="newsletter-name" className="sr-only">
                  {t('HomePage.newsletter.namePlaceholder')}
                </label>
                <input
                  id="newsletter-name"
                  type="text"
                  placeholder={t('HomePage.newsletter.namePlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
                <label htmlFor="newsletter-firstname" className="sr-only">
                  {t('HomePage.newsletter.firstNamePlaceholder')}
                </label>
                <input
                  id="newsletter-firstname"
                  type="text"
                  placeholder={t('HomePage.newsletter.firstNamePlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
                <label htmlFor="newsletter-email" className="sr-only">
                  {t('HomePage.newsletter.emailPlaceholder')}
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder={t('HomePage.newsletter.emailPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                  aria-required="true"
                />
                <Button type="submit" className="w-full bg-red-600 text-white hover:bg-red-700 py-3 font-bold uppercase tracking-wide">
                  {t('HomePage.newsletter.subscribeButton')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - enhanced design with better visibility */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-12 md:py-16 border-t-4 border-red-600">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-8">
              {/* Brand section */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                  <Heart className="h-8 w-8 text-red-500" aria-hidden="true" />
                  <span className="font-black text-2xl tracking-wide">WUUNE</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {t('HomePage.footer.description')}
                </p>
              </div>

              {/* Quick links */}
              <div className="text-center">
                <h3 className="font-bold text-lg mb-4 uppercase tracking-wide">Navigation</h3>
                <div className="flex flex-col gap-3">
                  <Link href={`/${currentLocale}`} className="text-gray-300 hover:text-white hover:underline transition-colors">
                    {t('HomePage.navigation.home')}
                  </Link>
                  <Link href={`/${currentLocale}/wuune`} className="text-gray-300 hover:text-white hover:underline transition-colors">
                    {t('HomePage.navigation.about')}
                  </Link>
                  <Link href={`/${currentLocale}/campagne`} className="text-gray-300 hover:text-white hover:underline transition-colors">
                    {t('HomePage.navigation.campaign')}
                  </Link>
                  <Link href={`/${currentLocale}/contact`} className="text-gray-300 hover:text-white hover:underline transition-colors">
                    {t('HomePage.navigation.contact')}
                  </Link>
                </div>
              </div>

              {/* Social & CTA */}
              <div className="text-center md:text-right">
                <h3 className="font-bold text-lg mb-4 uppercase tracking-wide">Rejoignez-nous</h3>
                <div className="flex justify-center md:justify-end gap-4 mb-6">
                  <Link
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://loyer.brussels')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 hover:scale-110 transition-all duration-300 shadow-lg"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5 text-white" aria-hidden="true" />
                  </Link>
                  <Link
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent('https://loyer.brussels')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-400 p-3 rounded-full hover:bg-blue-500 hover:scale-110 transition-all duration-300 shadow-lg"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5 text-white" aria-hidden="true" />
                  </Link>
                </div>
                <Link href={`/${currentLocale}/calculateur`}>
                  <Button className="bg-red-600 text-white hover:bg-red-700 px-6 py-3 font-bold uppercase tracking-wide rounded-full shadow-lg hover:scale-105 transition-all">
                    Calculer mon loyer
                  </Button>
                </Link>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-700 pt-8 text-center">
              <p className="text-gray-400 text-sm">© 2025 {t('HomePage.footer.copyright')}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
