/**
 * Template Content Service
 * Translated from @volo/abp.ng.text-template-management v2.7.0
 *
 * Provides REST API methods for managing text template content.
 */

import type { RestService } from '@abpjs/core';
import type { TextTemplateManagement } from '../models';

/**
 * Service for template content operations.
 * This service wraps all REST API calls for template content.
 *
 * @since 2.7.0
 */
export class TemplateContentService {
  /**
   * API name for multi-API configurations
   * @since 2.7.0
   */
  apiName = 'default';

  constructor(private restService: RestService) {}

  /**
   * Get template content by input parameters
   * @param params Input parameters containing template name and optional culture name
   * @returns Promise with template content
   */
  async getByInput(
    params: TextTemplateManagement.TemplateContentInput
  ): Promise<TextTemplateManagement.TextTemplateContentDto> {
    return this.restService.request<
      null,
      TextTemplateManagement.TextTemplateContentDto
    >({
      method: 'GET',
      url: '/api/text-template-management/template-contents',
      params,
    });
  }

  /**
   * Restore template content to default
   * @param body Input containing template name and culture name to restore
   * @returns Promise that resolves when restore is complete
   */
  async restoreToDefaultByInput(
    body: TextTemplateManagement.TemplateContentInput
  ): Promise<void> {
    return this.restService.request<TextTemplateManagement.TemplateContentInput, void>({
      method: 'PUT',
      url: '/api/text-template-management/template-contents/restore-to-default',
      body,
    });
  }

  /**
   * Update template content
   * @param body DTO containing template name, culture name, and new content
   * @returns Promise with updated template content
   */
  async updateByInput(
    body: TextTemplateManagement.CreateOrUpdateTemplateContentDto
  ): Promise<TextTemplateManagement.TextTemplateContentDto> {
    return this.restService.request<
      TextTemplateManagement.CreateOrUpdateTemplateContentDto,
      TextTemplateManagement.TextTemplateContentDto
    >({
      method: 'PUT',
      url: '/api/text-template-management/template-contents',
      body,
    });
  }
}
