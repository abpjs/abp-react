/**
 * Template Definition Proxy Service
 * Translated from @volo/abp.ng.text-template-management v3.2.0
 *
 * Provides typed REST API methods for managing text template definitions.
 *
 * @since 3.2.0
 */

import type { RestService, PagedResultDto } from '@abpjs/core';
import type { GetTemplateDefinitionListInput, TemplateDefinitionDto } from './models';

/**
 * Service for template definition operations with typed DTOs.
 * This is the new proxy service that replaces the legacy TemplateDefinitionService
 * in lib/services.
 *
 * @since 3.2.0
 */
export class TemplateDefinitionService {
  /**
   * API name for multi-API configurations
   * @since 3.2.0
   */
  apiName = 'default';

  constructor(private restService: RestService) {}

  /**
   * Get a template definition by name
   * @param name Template name
   * @returns Promise with template definition
   */
  async get(name: string): Promise<TemplateDefinitionDto> {
    return this.restService.request<null, TemplateDefinitionDto>({
      method: 'GET',
      url: `/api/text-template-management/template-definitions/${name}`,
    });
  }

  /**
   * Get paginated list of template definitions
   * @param input Query parameters for filtering and pagination
   * @returns Promise with paginated template definitions response
   */
  async getList(
    input: GetTemplateDefinitionListInput = {}
  ): Promise<PagedResultDto<TemplateDefinitionDto>> {
    return this.restService.request<null, PagedResultDto<TemplateDefinitionDto>>({
      method: 'GET',
      url: '/api/text-template-management/template-definitions',
      params: input,
    });
  }
}
