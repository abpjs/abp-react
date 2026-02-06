/**
 * Text Template Management State Service
 * Translated from @volo/abp.ng.text-template-management v2.7.0
 *
 * Provides a stateful facade over text template operations,
 * maintaining internal state similar to Angular's NGXS store pattern.
 */

import type { RestService, PagedResultRequestDto, ListResultDto } from '@abpjs/core';
import type { TextTemplateManagement } from '../models';
import { TemplateDefinitionService } from './template-definition.service';
import { TemplateContentService } from './template-content.service';

/**
 * State service for text template management.
 * Maintains state for template definitions and content.
 *
 * @since 2.7.0
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
  getTemplateDefinitions(): TextTemplateManagement.TemplateDefinitionDto[] {
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
  getSelectedTemplate(): TextTemplateManagement.TemplateDefinitionDto | null {
    return this._state.selectedTemplate;
  }

  /**
   * Get template content from state
   * @returns Template content or null
   */
  getTemplateContent(): TextTemplateManagement.TextTemplateContentDto | null {
    return this._state.templateContent;
  }

  // ==================== Dispatch Methods ====================

  /**
   * Dispatch action to fetch template definitions
   * @param params Query parameters for filtering and pagination
   * @returns Promise with list result
   */
  async dispatchGetTemplateDefinitions(
    params: Partial<PagedResultRequestDto> = {}
  ): Promise<ListResultDto<TextTemplateManagement.TemplateDefinitionDto>> {
    const result = await this.templateDefinitionService.getList(params);
    this._state.templateDefinitions = result.items || [];
    this._state.totalCount = this._state.templateDefinitions.length;
    return result;
  }

  /**
   * Dispatch action to get template content
   * @param params Input containing template name and optional culture name
   * @returns Promise with template content
   */
  async dispatchGetTemplateContent(
    params: TextTemplateManagement.TemplateContentInput
  ): Promise<TextTemplateManagement.TextTemplateContentDto> {
    const result = await this.templateContentService.getByInput(params);
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
  ): Promise<TextTemplateManagement.TextTemplateContentDto> {
    const result = await this.templateContentService.updateByInput(body);
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
    await this.templateContentService.restoreToDefaultByInput(body);
    // Refresh the content after restore
    if (body.cultureName) {
      await this.dispatchGetTemplateContent(body);
    }
  }

  /**
   * Set the selected template
   * @param template Template to select or null to clear
   */
  setSelectedTemplate(
    template: TextTemplateManagement.TemplateDefinitionDto | null
  ): void {
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
