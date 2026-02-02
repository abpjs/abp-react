/**
 * Language Management Component Identifiers
 * Used for component registration and routing
 *
 * @since 2.4.0
 * @updated 2.7.0 - Changed from enum to const object
 */
export const eLanguageManagementComponents = {
  Languages: 'LanguageManagement.LanguagesComponent',
  LanguageTexts: 'LanguageManagement.LanguageTextsComponent',
} as const;

/**
 * Type for language management component key values
 */
export type LanguageManagementComponentKey =
  (typeof eLanguageManagementComponents)[keyof typeof eLanguageManagementComponents];
