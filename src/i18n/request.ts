import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// Define the locales your application supports
export const locales = ["fr", "en", "nl"];
export const defaultLocale = "fr";

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that the incoming locale is valid
  if (!locale || !locales.includes(locale as any)) {
    // Fallback to default locale or handle as needed, here we use notFound
    // If you want a fallback, you could do: locale = defaultLocale;
    notFound();
  }

  // Assert locale as string after validation/fallback
  const validLocale = locale as string;

  return {
    locale: validLocale,
    // Load the messages for the current locale from the root `messages` directory
    messages: (await import(`../../messages/${validLocale}.json`)).default, // Corrected path
  };
});
