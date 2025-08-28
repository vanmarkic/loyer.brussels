"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Menu, Twitter, Users, Heart, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import LanguageSwitcher from "@/app/components/language-switcher";

export default function Home() {
  const t = useTranslations();
  const currentLocale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top header */}
      <header className="bg-white py-2 px-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-red-600" />
          <span className="text-xs font-medium uppercase text-gray-700">
            {t('HomePage.header.collectiveTitle')}
          </span>
        </div>
        <LanguageSwitcher />
      </header>

      {/* Main navigation */}
      <nav className="bg-red-600 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Heart className="h-10 w-10 text-white" />
          <div className="text-white uppercase">
            <div className="font-bold text-lg leading-tight">WUUNE</div>
            <div className="text-xs leading-tight">
              {t('HomePage.navigation.collective')}
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-white">
          <Link href={`/${currentLocale}`} className="hover:underline">
            {t('HomePage.navigation.home')}
          </Link>
          <Link href={`/${currentLocale}/wuune`} className="hover:underline">
            {t('HomePage.navigation.about')}
          </Link>
          <Link href={`/${currentLocale}/campagne`} className="hover:underline">
            {t('HomePage.navigation.campaign')}
          </Link>
          <Link href={`/${currentLocale}/contact`} className="hover:underline">
            {t('HomePage.navigation.contact')}
          </Link>
        </div>
        <button
          className="text-white flex items-center gap-2 uppercase font-medium md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {t('HomePage.navigation.menu')} <Menu className="h-5 w-5" />
        </button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-red-700 py-4 px-6">
          <div className="flex flex-col gap-4 text-white">
            <Link href={`/${currentLocale}`} className="hover:underline">
              {t('HomePage.navigation.home')}
            </Link>
            <Link href={`/${currentLocale}/wuune`} className="hover:underline">
              {t('HomePage.navigation.about')}
            </Link>
            <Link href={`/${currentLocale}/campagne`} className="hover:underline">
              {t('HomePage.navigation.campaign')}
            </Link>
            <Link href={`/${currentLocale}/contact`} className="hover:underline">
              {t('HomePage.navigation.contact')}
            </Link>
          </div>
        </div>
      )}

      {/* Hero section with gradient background */}
      <main className="flex-1 bg-gradient-to-br from-red-600 via-red-500 to-orange-500">
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-white space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold uppercase leading-tight text-shadow-lg">
                {t('HomePage.hero.title')}
              </h1>

              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-semibold">
                  {t('HomePage.hero.subtitle')}
                </h2>
                <p className="text-lg md:text-xl leading-relaxed">
                  {t('HomePage.hero.description')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <Link href={`/${currentLocale}/calculateur`}>
                  <Button className="bg-white text-red-600 hover:bg-gray-100 rounded-full px-10 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all">
                    {t('HomePage.hero.startButton')}
                  </Button>
                </Link>

                <div className="flex items-center gap-4">
                  <span className="text-sm uppercase font-medium">{t('HomePage.hero.shareText')}</span>
                  <Link
                    href="#"
                    className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="h-5 w-5 text-white" />
                  </Link>
                  <Link
                    href="#"
                    className="bg-blue-400 p-2 rounded-full hover:bg-blue-500 transition-colors"
                  >
                    <Twitter className="h-5 w-5 text-white" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right content - hero image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <Image
                  src="/hero-manifestation.svg"
                  alt={t('HomePage.hero.imageAlt')}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Qui sommes-nous section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                {t('HomePage.aboutUs.title')}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('HomePage.aboutUs.description1')}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('HomePage.aboutUs.description2')}
              </p>
              <Link href={`/${currentLocale}/wuune`}>
                <Button className="bg-red-600 text-white hover:bg-red-700 px-6 py-3">
                  {t('HomePage.aboutUs.learnMoreButton')}
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/community-warmth.svg"
                  alt={t('HomePage.aboutUs.imageAlt')}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action sections */}
      <section className="bg-red-600 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg text-center">
              <Users className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold uppercase mb-4">
                {t('HomePage.callToAction.joinCampaign.title')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('HomePage.callToAction.joinCampaign.description')}
              </p>
              <Link href={`/${currentLocale}/campagne`}>
                <Button className="bg-red-600 text-white hover:bg-red-700 w-full">
                  {t('HomePage.callToAction.joinCampaign.button')}
                </Button>
              </Link>
            </div>

            <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg text-center">
              <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold uppercase mb-4">{t('HomePage.callToAction.evaluateRent.title')}</h3>
              <p className="text-gray-600 mb-6">
                {t('HomePage.callToAction.evaluateRent.description')}
              </p>
              <Link href={`/${currentLocale}/calculateur`}>
                <Button className="bg-red-600 text-white hover:bg-red-700 w-full">
                  {t('HomePage.callToAction.evaluateRent.button')}
                </Button>
              </Link>
            </div>

            <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg text-center">
              <Mail className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold uppercase mb-4">{t('HomePage.callToAction.contactUs.title')}</h3>
              <p className="text-gray-600 mb-6">
                {t('HomePage.callToAction.contactUs.description')}
              </p>
              <Link href={`/${currentLocale}/contact`}>
                <Button className="bg-red-600 text-white hover:bg-red-700 w-full">
                  {t('HomePage.callToAction.contactUs.button')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-red-500" />
                <span className="font-bold text-lg">WUUNE</span>
              </div>
              <p className="text-gray-300 text-sm">
                {t('HomePage.footer.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('HomePage.footer.usefulLinks')}</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href={`/${currentLocale}/wuune`}
                  className="block text-gray-300 hover:text-white"
                >
                  {t('HomePage.footer.aboutLink')}
                </Link>
                <Link
                  href={`/${currentLocale}/campagne`}
                  className="block text-gray-300 hover:text-white"
                >
                  {t('HomePage.footer.campaignLink')}
                </Link>
                <Link
                  href={`/${currentLocale}/contact`}
                  className="block text-gray-300 hover:text-white"
                >
                  {t('HomePage.footer.contactLink')}
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('HomePage.footer.followUs')}</h4>
              <div className="flex gap-3">
                <Link href="#" className="bg-blue-600 p-2 rounded hover:bg-blue-700">
                  <Facebook className="h-4 w-4" />
                </Link>
                <Link href="#" className="bg-blue-400 p-2 rounded hover:bg-blue-500">
                  <Twitter className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 {t('HomePage.footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
