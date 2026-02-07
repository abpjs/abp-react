/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Text Template Management Models
 * Translated from @volo/abp.ng.text-template-management v3.2.0
 *
 * @deprecated Legacy types in this namespace are deprecated and will be removed in v4.0.
 * Use the new proxy types from '@abpjs/text-template-management' instead:
 * - TemplateDefinitionDto from proxy/text-templates/models
 * - TextTemplateContentDto from proxy/text-templates/models
 * - GetTemplateContentInput from proxy/text-templates/models
 * - UpdateTemplateContentInput from proxy/text-templates/models
 * - RestoreTemplateContentInput from proxy/text-templates/models
 * - GetTemplateDefinitionListInput from proxy/text-templates/models
 */

/**
 * Text Template Management namespace containing types and interfaces
 * @since 2.7.0
 * @deprecated To be removed in v4.0. Use proxy types instead.
 */
export namespace TextTemplateManagement {
  /**
   * Template definition DTO
   * Represents a text template definition
   * @deprecated To be removed in v4.0. Use TemplateDefinitionDto from proxy/text-templates/models
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
   * @deprecated To be removed in v4.0. Use TextTemplateContentDto from proxy/text-templates/models
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
   * @deprecated To be removed in v4.0. Use GetTemplateContentInput from proxy/text-templates/models
   */
  export interface TemplateContentInput {
    /** Template name */
    templateName: string;
    /** Optional culture name */
    cultureName?: string;
  }

  /**
   * DTO for creating or updating template content
   * @deprecated To be removed in v4.0. Use UpdateTemplateContentInput from proxy/text-templates/models
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
   * @deprecated To be removed in v4.0. Use GetTemplateDefinitionListInput from proxy/text-templates/models
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

// Note: GetTemplateDefinitionListInput is now exported from proxy/text-templates/models
// The type is re-exported here for backwards compatibility
import type { GetTemplateDefinitionListInput } from '../proxy/text-templates/models';

/**
 * Factory function to create GetTemplateDefinitionListInput
 * @param initialValues Optional initial values
 * @returns GetTemplateDefinitionListInput instance
 * @since 3.1.0
 * @deprecated To be removed in v4.0. Use GetTemplateDefinitionListInput from proxy/text-templates/models directly
 */
export function createGetTemplateDefinitionListInput(
  initialValues?: Partial<GetTemplateDefinitionListInput>
): GetTemplateDefinitionListInput {
  return {
    filterText: initialValues?.filterText,
    skipCount: initialValues?.skipCount ?? 0,
    maxResultCount: initialValues?.maxResultCount ?? 10,
    sorting: initialValues?.sorting,
  };
}
