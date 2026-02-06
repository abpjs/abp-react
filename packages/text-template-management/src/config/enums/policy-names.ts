/**
 * Text Template Management Policy Names
 * Translated from @volo/abp.ng.text-template-management/config v3.0.0
 *
 * Policy name constants for Text Template Management module permission checking.
 * @since 3.0.0
 */

/**
 * Enum-like const object for Text Template Management policy names.
 * Used for permission checking in Text Template Management module.
 * @since 3.0.0
 */
export const eTextTemplateManagementPolicyNames = {
  /** Policy for Text Templates management */
  TextTemplates: 'TextTemplateManagement.TextTemplates',
} as const;

/**
 * Type for Text Template Management policy name values
 * @since 3.0.0
 */
export type TextTemplateManagementPolicyNameKey =
  (typeof eTextTemplateManagementPolicyNames)[keyof typeof eTextTemplateManagementPolicyNames];
