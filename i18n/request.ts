import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !['fr', 'nl', 'en'].includes(locale)) {
    locale = 'fr'; // Default to French
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
