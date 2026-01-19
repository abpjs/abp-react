/**
 * List of RTL (Right-to-Left) language codes.
 * Includes both full locale codes and base language codes.
 */
export const RTL_LANGUAGES = [
  // Arabic
  'ar',
  'ar-SA', // Saudi Arabia
  'ar-EG', // Egypt
  'ar-AE', // UAE
  'ar-IQ', // Iraq
  'ar-JO', // Jordan
  'ar-KW', // Kuwait
  'ar-LB', // Lebanon
  'ar-LY', // Libya
  'ar-MA', // Morocco
  'ar-OM', // Oman
  'ar-QA', // Qatar
  'ar-SY', // Syria
  'ar-TN', // Tunisia
  'ar-YE', // Yemen
  // Hebrew
  'he',
  'he-IL',
  'iw', // Old Hebrew code
  // Persian/Farsi
  'fa',
  'fa-IR',
  // Urdu
  'ur',
  'ur-PK',
  // Pashto
  'ps',
  'ps-AF',
  // Dari
  'prs',
  // Sindhi
  'sd',
  // Uyghur
  'ug',
  // Yiddish
  'yi',
  // Divehi (Maldivian)
  'dv',
  'dv-MV',
] as const;

/**
 * Check if a language/locale code is RTL (Right-to-Left).
 * @param language - The language or locale code (e.g., 'ar', 'ar-SA', 'he-IL')
 * @returns true if the language is RTL, false otherwise
 */
export function isRtlLanguage(language: string | undefined | null): boolean {
  if (!language) return false;

  const normalizedLang = language.toLowerCase();

  // Check exact match first
  if (RTL_LANGUAGES.includes(normalizedLang as (typeof RTL_LANGUAGES)[number])) {
    return true;
  }

  // Check base language code (e.g., 'ar' from 'ar-SA')
  const baseLang = normalizedLang.split('-')[0];
  return RTL_LANGUAGES.includes(baseLang as (typeof RTL_LANGUAGES)[number]);
}

/**
 * Get the text direction for a language.
 * @param language - The language or locale code
 * @returns 'rtl' or 'ltr'
 */
export function getTextDirection(language: string | undefined | null): 'rtl' | 'ltr' {
  return isRtlLanguage(language) ? 'rtl' : 'ltr';
}
