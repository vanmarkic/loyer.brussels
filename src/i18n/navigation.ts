import {
  createNavigation, // Use createNavigation
} from "next-intl/navigation";
import { locales, defaultLocale } from "./request"; // Import locales from our config

export const { Link, redirect, usePathname, useRouter } = createNavigation({ locales }); // Pass locales directly

// Note: You might need localePrefix configuration here if you
// want different behavior than the default (which prefixes all locales).
// Example:
// createNavigation({locales, localePrefix: 'as-needed'});
