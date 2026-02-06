/**
 * Language Management Policy Names
 * Policy names for permission checking in the Language Management module.
 * @since 3.0.0
 */

/**
 * Language Management policy names enum.
 * Used for checking permissions in the language management module.
 * @since 3.0.0
 */
export const eLanguageManagementPolicyNames = {
  LanguageManagement: 'LanguageManagement.Languages || LanguageManagement.LanguageTexts',
  Languages: 'LanguageManagement.Languages',
  LanguageTexts: 'LanguageManagement.LanguageTexts',
} as const;

/**
 * Type for language management policy name values
 */
export type LanguageManagementPolicyNameKey =
  (typeof eLanguageManagementPolicyNames)[keyof typeof eLanguageManagementPolicyNames];
