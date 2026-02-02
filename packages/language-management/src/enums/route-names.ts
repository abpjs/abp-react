/**
 * Language Management Route Names
 * Translated from @volo/abp.ng.language-management v2.7.0
 */

/**
 * Enum-like const object for language management route names.
 * Used for localization and navigation configuration.
 * @since 2.7.0
 */
export const eLanguageManagementRouteNames = {
  Administration: 'AbpUiNavigation::Menu:Administration',
  Languages: 'LanguageManagement::Menu:Languages',
  LanguageTexts: 'LanguageManagement::LanguageTexts',
} as const;

/**
 * Type for language management route name values
 */
export type LanguageManagementRouteNameKey =
  (typeof eLanguageManagementRouteNames)[keyof typeof eLanguageManagementRouteNames];
