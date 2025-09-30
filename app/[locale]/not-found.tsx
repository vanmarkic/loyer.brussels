"use client";

import Link from "next/link";
import { Heart, Home, Calculator, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");
  const currentLocale = useLocale();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Wuune Header for branding consistency */}
      <header className="bg-white py-3 px-4 border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-600" />
            <div className="text-center">
              <div className="font-black text-xl leading-tight tracking-wide text-gray-900">
                WUUNE
              </div>
              <div className="text-xs font-medium leading-tight text-gray-600">
                Collectif Wuune
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Icon/Illustration */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="text-9xl font-black text-red-100 select-none">
                {t("code")}
              </div>
              <Heart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-24 w-24 text-red-600 opacity-30" />
            </div>
          </div>

          {/* Error message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600 mb-12 max-w-md mx-auto">
            {t("description")}
          </p>

          {/* Navigation options */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href={`/${currentLocale}`}>
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white min-w-[200px]"
              >
                <Home className="mr-2 h-5 w-5" />
                {t("backHome")}
              </Button>
            </Link>
            <Link href={`/${currentLocale}/calculateur`}>
              <Button
                size="lg"
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50 min-w-[200px]"
              >
                <Calculator className="mr-2 h-5 w-5" />
                {t("calculator")}
              </Button>
            </Link>
          </div>

          {/* Additional help */}
          <div className="text-sm text-gray-500">
            <Link
              href={`/${currentLocale}/contact`}
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 hover:underline"
            >
              <Mail className="h-4 w-4" />
              {t("contact")}
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 px-4">
        <div className="container mx-auto text-center text-sm">
          <p>© 2024 Collectif Wuune - Outil d&apos;évaluation des loyers</p>
        </div>
      </footer>
    </div>
  );
}
