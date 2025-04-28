import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// Define the locales your application supports
export const locales = ["fr", "en", "nl"];
export const defaultLocale = "fr";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Assert locale as string after validation
  const validLocale = locale as string;

  return {
    locale: validLocale,
    // Load the messages for the current locale from the root `messages` directory
    messages: (await import(`../../messages/${validLocale}.json`)).default, // Corrected path
  };
});
