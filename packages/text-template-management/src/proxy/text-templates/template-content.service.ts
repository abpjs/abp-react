/**
 * Template Content Proxy Service
 * Translated from @volo/abp.ng.text-template-management v3.2.0
 *
 * Provides typed REST API methods for managing text template content.
 *
 * @since 3.2.0
 */

import type { RestService } from '@abpjs/core';
import type {
  GetTemplateContentInput,
  RestoreTemplateContentInput,
  TextTemplateContentDto,
  UpdateTemplateContentInput,
} from './models';

/**
 * Service for template content operations with typed DTOs.
 * This is the new proxy service that replaces the legacy TemplateContentService
 * in lib/services.
 *
 * @since 3.2.0
 */
export class TemplateContentService {
  /**
   * API name for multi-API configurations
   * @since 3.2.0
   */
  apiName = 'default';

  constructor(private restService: RestService) {}

  /**
   * Get template content
   * @param input Input containing template name and culture name
   * @returns Promise with template content
   */
  async get(input: GetTemplateContentInput): Promise<TextTemplateContentDto> {
    return this.restService.request<null, TextTemplateContentDto>({
      method: 'GET',
      url: '/api/text-template-management/template-contents',
      params: input,
    });
  }

  /**
   * Restore template content to default
   * @param input Input containing template name and culture name
   * @returns Promise that resolves when restore is complete
   */
  async restoreToDefault(input: RestoreTemplateContentInput): Promise<void> {
    return this.restService.request<RestoreTemplateContentInput, void>({
      method: 'PUT',
      url: '/api/text-template-management/template-contents/restore-to-default',
      body: input,
    });
  }

  /**
   * Update template content
   * @param input Input containing template name, culture name, and content
   * @returns Promise with updated template content
   */
  async update(input: UpdateTemplateContentInput): Promise<TextTemplateContentDto> {
    return this.restService.request<UpdateTemplateContentInput, TextTemplateContentDto>({
      method: 'PUT',
      url: '/api/text-template-management/template-contents',
      body: input,
    });
  }
}
