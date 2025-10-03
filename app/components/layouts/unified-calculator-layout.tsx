'use client';

import Link from 'next/link';
import { ArrowLeft, Building, MapPin } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useLocale } from 'next-intl';

interface UnifiedCalculatorLayoutProps {
  children: React.ReactNode;
  title: string;
  backUrl?: string;
  backText: string;
  onBack?: () => void;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export function UnifiedCalculatorLayout({
  children,
  title,
  backUrl,
  backText,
  onBack,
  showProgress = false,
  currentStep = 0,
  totalSteps = 0,
}: UnifiedCalculatorLayoutProps) {
  const currentLocale = useLocale();

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Unified Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {backUrl ? (
              <Link
                href={backUrl}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors touch-manipulation"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm sm:text-base">{backText}</span>
              </Link>
            ) : onBack ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors touch-manipulation"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm sm:text-base">{backText}</span>
              </button>
            ) : null}
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              <span className="font-bold text-lg sm:text-xl text-gray-800">{title}</span>
            </div>
          </div>
          {/* Progress indicator */}
          {showProgress && totalSteps > 0 && (
            <div className="mt-3 sm:mt-4">
              <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
                <span>
                  Étape {currentStep} sur {totalSteps}
                </span>
                <span>{Math.round((currentStep / totalSteps) * 100)}% complété</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 py-4 sm:py-8">
        <div className="container mx-auto px-3 sm:px-4">{children}</div>
      </main>

      {/* Unified Footer */}
      <footer className="bg-white border-t py-3 sm:py-4 px-3 sm:px-4">
        <div className="container mx-auto text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            © 2024 Collectif Wuune - Outil d&apos;évaluation des loyers
          </p>
        </div>
      </footer>
    </div>
  );
}
