import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  // Skip paths like /api/, /_next/static/, /_next/image/, /assets/, /favicon.ico, and files with extensions
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|.*\\..*).*)"],
};
