/**
 * Text Template Management Proxy DTOs
 * Translated from @volo/abp.ng.text-template-management v3.2.0
 *
 * Typed Data Transfer Objects for the Text Template Management module proxy services.
 *
 * @since 3.2.0
 */

/**
 * Input for getting template content
 * @since 3.2.0
 */
export interface GetTemplateContentInput {
  templateName: string;
  cultureName: string;
}

/**
 * Input for getting template definition list
 * @since 3.2.0
 */
export interface GetTemplateDefinitionListInput {
  filterText?: string;
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
}

/**
 * Input for restoring template content to default
 * @since 3.2.0
 */
export interface RestoreTemplateContentInput {
  templateName: string;
  cultureName: string;
}

/**
 * Template definition DTO
 * @since 3.2.0
 */
export interface TemplateDefinitionDto {
  name: string;
  displayName: string;
  isLayout: boolean;
  layout: string;
  isInlineLocalized: boolean;
  defaultCultureName: string;
}

/**
 * Text template content DTO
 * @since 3.2.0
 */
export interface TextTemplateContentDto {
  name: string;
  cultureName: string;
  content: string;
}

/**
 * Input for updating template content
 * @since 3.2.0
 */
export interface UpdateTemplateContentInput {
  templateName: string;
  cultureName: string;
  content: string;
}
