import type React from "react";
import type { Metadata } from "next";
import { Chelsea_Market, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server"; // Import setRequestLocale and getTranslations
import { routing } from "@/i18n/routing";
import "../globals.css";

const chelseaMarket = Chelsea_Market({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-chelsea-market",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Generate dynamic metadata based on locale
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
    // You can add more metadata fields here if needed
    // generator: "v0.dev", // Keep or remove as needed
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Fetch messages asynchronously
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={`${chelseaMarket.variable} ${inter.variable}`}>
        {/* Wrap children with NextIntlClientProvider */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
