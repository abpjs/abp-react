/**
 * Text Template Management State Service
 * Translated from @volo/abp.ng.text-template-management v3.2.0
 *
 * Provides a stateful facade over text template operations,
 * maintaining internal state similar to Angular's NGXS store pattern.
 *
 * @since 2.7.0
 * @updated 3.2.0 - Now uses proxy services
 */

import type { RestService, PagedResultDto } from '@abpjs/core';
import type { TextTemplateManagement } from '../models';
import type {
  TemplateDefinitionDto,
  TextTemplateContentDto,
  GetTemplateDefinitionListInput,
} from '../proxy/text-templates/models';
import { TemplateDefinitionService } from '../proxy/text-templates/template-definition.service';
import { TemplateContentService } from '../proxy/text-templates/template-content.service';

/**
 * State service for text template management.
 * Maintains state for template definitions and content.
 *
 * @since 2.7.0
 * @updated 3.2.0 - Now uses proxy services internally
 */
export class TextTemplateManagementStateService {
  private templateDefinitionService: TemplateDefinitionService;
  private templateContentService: TemplateContentService;

  private _state: TextTemplateManagement.State = {
    templateDefinitions: [],
    totalCount: 0,
    selectedTemplate: null,
    templateContent: null,
  };

  constructor(restService: RestService) {
    this.templateDefinitionService = new TemplateDefinitionService(restService);
    this.templateContentService = new TemplateContentService(restService);
  }

  // ==================== Getters ====================

  /**
   * Get template definitions from state
   * @returns Array of template definitions
   */
  getTemplateDefinitions(): TemplateDefinitionDto[] {
    return this._state.templateDefinitions;
  }

  /**
   * Get total count of template definitions
   * @returns Total count
   */
  getTotalCount(): number {
    return this._state.totalCount;
  }

  /**
   * Get the currently selected template
   * @returns Selected template or null
   */
  getSelectedTemplate(): TemplateDefinitionDto | null {
    return this._state.selectedTemplate;
  }

  /**
   * Get template content from state
   * @returns Template content or null
   */
  getTemplateContent(): TextTemplateContentDto | null {
    return this._state.templateContent;
  }

  // ==================== Dispatch Methods ====================

  /**
   * Dispatch action to fetch template definitions
   * @param params Query parameters for filtering and pagination
   * @returns Promise with paged result
   * @updated 3.2.0 - Now returns PagedResultDto instead of ListResultDto
   */
  async dispatchGetTemplateDefinitions(
    params: GetTemplateDefinitionListInput = {}
  ): Promise<PagedResultDto<TemplateDefinitionDto>> {
    const result = await this.templateDefinitionService.getList(params);
    this._state.templateDefinitions = result.items || [];
    this._state.totalCount = result.totalCount ?? this._state.templateDefinitions.length;
    return result;
  }

  /**
   * Dispatch action to get template content
   * @param params Input containing template name and culture name
   * @returns Promise with template content
   */
  async dispatchGetTemplateContent(
    params: TextTemplateManagement.TemplateContentInput
  ): Promise<TextTemplateContentDto> {
    if (!params.cultureName) {
      throw new Error('cultureName is required for getting template content');
    }
    const result = await this.templateContentService.get({
      templateName: params.templateName,
      cultureName: params.cultureName,
    });
    this._state.templateContent = result;
    return result;
  }

  /**
   * Dispatch action to update template content
   * @param body DTO containing template name, culture name, and content
   * @returns Promise with updated template content
   */
  async dispatchUpdateTemplateContent(
    body: TextTemplateManagement.CreateOrUpdateTemplateContentDto
  ): Promise<TextTemplateContentDto> {
    const result = await this.templateContentService.update({
      templateName: body.templateName,
      cultureName: body.cultureName,
      content: body.content,
    });
    this._state.templateContent = result;
    return result;
  }

  /**
   * Dispatch action to restore template content to default
   * @param body Input containing template name and culture name
   * @returns Promise that resolves when restore is complete
   */
  async dispatchRestoreToDefault(
    body: TextTemplateManagement.TemplateContentInput
  ): Promise<void> {
    if (!body.cultureName) {
      throw new Error('cultureName is required for restoring template content');
    }
    await this.templateContentService.restoreToDefault({
      templateName: body.templateName,
      cultureName: body.cultureName,
    });
    // Refresh the content after restore
    await this.dispatchGetTemplateContent(body);
  }

  /**
   * Set the selected template
   * @param template Template to select or null to clear
   */
  setSelectedTemplate(template: TemplateDefinitionDto | null): void {
    this._state.selectedTemplate = template;
  }

  /**
   * Clear all state
   */
  reset(): void {
    this._state = {
      templateDefinitions: [],
      totalCount: 0,
      selectedTemplate: null,
      templateContent: null,
    };
  }
}
