/**
 * Language Management Route Names
 * Translated from @volo/abp.ng.language-management v3.0.0
 *
 * @since 3.0.0
 * Changes in v3.0.0:
 * - Removed Administration key
 * - Changed Languages value from 'LanguageManagement::Menu:Languages' to 'LanguageManagement::Languages'
 * - Added LanguageManagement key for parent route
 */

/**
 * Enum-like const object for language management route names.
 * Used for localization and navigation configuration.
 * @since 3.0.0
 */
export const eLanguageManagementRouteNames = {
  LanguageManagement: 'LanguageManagement::LanguageManagement',
  Languages: 'LanguageManagement::Languages',
  LanguageTexts: 'LanguageManagement::LanguageTexts',
} as const;

/**
 * Type for language management route name values
 */
export type LanguageManagementRouteNameKey =
  (typeof eLanguageManagementRouteNames)[keyof typeof eLanguageManagementRouteNames];
