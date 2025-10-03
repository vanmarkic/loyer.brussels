import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from "@/app/i18n/request";

export default createMiddleware({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: defaultLocale,

  // Don't prefix the URL for the default locale (optional)
  // localePrefix: 'as-needed' // Or 'always' or 'never'
});

export const config = {
  // Match only internationalized pathnames
  // Skip paths like /api/, /_next/static/, /_next/image/, /assets/, /favicon.ico, and files with extensions
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|.*\\..*).*)"],
};
