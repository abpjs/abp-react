/**
 * Text Template Management Route Names
 * Translated from @volo/abp.ng.text-template-management/config v3.0.0
 *
 * Route name keys for the Text Template Management module.
 * These keys are used for route localization and identification.
 *
 * @since 3.0.0
 *
 * Breaking changes in v3.0.0:
 * - Removed 'Administration' key
 */

/**
 * Enum-like const object for Text Template Management route names.
 * @since 3.0.0
 */
export const eTextTemplateManagementRouteNames = {
  /**
   * Text Templates route name key.
   * Used for the text templates management route.
   */
  TextTemplates: 'TextTemplateManagement::Menu:TextTemplates',
} as const;

/**
 * Type for Text Template Management route name key values
 * @since 3.0.0
 */
export type TextTemplateManagementRouteNameKey =
  (typeof eTextTemplateManagementRouteNames)[keyof typeof eTextTemplateManagementRouteNames];
