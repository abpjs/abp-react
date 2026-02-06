/**
 * Route name keys for the Text Template Management module.
 * These keys are used for route localization and identification.
 * @since 2.7.0
 */
export const eTextTemplateManagementRouteNames = {
  /**
   * Administration route name key.
   * Used for the administration menu group.
   */
  Administration: 'AbpUiNavigation::Menu:Administration',

  /**
   * Text Templates route name key.
   * Used for the text templates management route.
   */
  TextTemplates: 'TextTemplateManagement::Menu:TextTemplates',
} as const;

/**
 * Type for text template management route name key values
 */
export type TextTemplateManagementRouteNameKey =
  (typeof eTextTemplateManagementRouteNames)[keyof typeof eTextTemplateManagementRouteNames];
