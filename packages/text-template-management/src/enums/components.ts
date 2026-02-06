/**
 * Component keys for the Text Template Management module.
 * These keys are used for component replacement/customization.
 * @since 2.7.0
 */
export const eTextTemplateManagementComponents = {
  /**
   * Key for the TextTemplates component.
   * Use this to replace the default TextTemplates list with a custom implementation.
   */
  TextTemplates: 'TextTemplateManagement.TextTemplates',

  /**
   * Key for the TemplateContents component.
   * Use this to replace the default template content editor.
   */
  TemplateContents: 'TextTemplateManagement.TemplateContents',

  /**
   * Key for the InlineTemplateContent component.
   * Use this to replace the inline template content editor.
   */
  InlineTemplateContent: 'TextTemplateManagement.InlineTemplateContent',
} as const;

/**
 * Type for text template management component key values
 */
export type TextTemplateManagementComponentKey =
  (typeof eTextTemplateManagementComponents)[keyof typeof eTextTemplateManagementComponents];
