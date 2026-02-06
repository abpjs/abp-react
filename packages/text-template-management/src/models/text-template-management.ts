/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Text Template Management Models
 * Translated from @volo/abp.ng.text-template-management v2.7.0
 */

/**
 * Text Template Management namespace containing types and interfaces
 * @since 2.7.0
 */
export namespace TextTemplateManagement {
  /**
   * Template definition DTO
   * Represents a text template definition
   */
  export interface TemplateDefinitionDto {
    /** Template name (unique identifier) */
    name: string;
    /** Display name for the template */
    displayName: string;
    /** Whether this template is a layout template */
    isLayout: boolean;
    /** Layout template name (if this template uses a layout) */
    layout: string;
    /** Default culture name for the template */
    defaultCultureName: string;
    /** Whether the template is localized inline */
    isInlineLocalized: boolean;
  }

  /**
   * Text template content DTO
   * Represents the content of a text template
   */
  export interface TextTemplateContentDto {
    /** Template name */
    name: string;
    /** Culture name for the content */
    cultureName: string;
    /** Template content */
    content: string;
  }

  /**
   * Input for getting template content
   */
  export interface TemplateContentInput {
    /** Template name */
    templateName: string;
    /** Optional culture name */
    cultureName?: string;
  }

  /**
   * DTO for creating or updating template content
   */
  export interface CreateOrUpdateTemplateContentDto {
    /** Template name */
    templateName: string;
    /** Culture name for the content */
    cultureName: string;
    /** Template content */
    content: string;
  }

  /**
   * State interface for text template management
   * @since 2.7.0
   */
  export interface State {
    /** List of template definitions */
    templateDefinitions: TemplateDefinitionDto[];
    /** Total count of template definitions */
    totalCount: number;
    /** Currently selected template definition */
    selectedTemplate: TemplateDefinitionDto | null;
    /** Template content for the selected template */
    templateContent: TextTemplateContentDto | null;
  }

  /**
   * Request parameters for fetching template definitions
   */
  export interface GetTemplateDefinitionsInput {
    /** Filter text */
    filterText?: string;
    /** Skip count for pagination */
    skipCount?: number;
    /** Max result count for pagination */
    maxResultCount?: number;
    /** Sorting field and order */
    sorting?: string;
  }
}
