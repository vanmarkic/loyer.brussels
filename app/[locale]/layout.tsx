import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"; // Import setRequestLocale and getTranslations
import { locales } from "@/src/i18n/request"; // Updated import path
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

// Generate dynamic metadata based on locale
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
    // You can add more metadata fields here if needed
    // generator: "v0.dev", // Keep or remove as needed
  };
}

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
