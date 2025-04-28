import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server"; // Import setRequestLocale
import { locales } from "@/src/i18n/request"; // Updated import path
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

// Metadata can potentially be dynamic based on locale
export const metadata: Metadata = {
  title: "Bruxelles Logement - À combien se loue un logement à Bruxelles?",
  description: "Service public régional de Bruxelles - Bruxelles Logement",
  generator: "v0.dev",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = params;

  // Enable static rendering
  setRequestLocale(locale);

  // Fetch messages asynchronously
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={inter.className}>
        {/* Wrap children with NextIntlClientProvider */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
