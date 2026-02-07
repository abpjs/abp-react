/**
 * Edition Proxy Service
 * Translated from @volo/abp.ng.saas v3.2.0
 *
 * Provides typed REST API methods for managing editions.
 *
 * @since 3.2.0
 */

import type { RestService, PagedResultDto } from '@abpjs/core';
import type {
  EditionCreateDto,
  EditionDto,
  EditionUpdateDto,
  GetEditionsInput,
} from './dtos/models';
import type { GetEditionUsageStatisticsResult } from './models';

/**
 * Service for edition operations with typed DTOs.
 * This is the new proxy service that replaces the edition-related
 * methods in the legacy SaasService.
 *
 * @since 3.2.0
 */
export class EditionService {
  /**
   * API name for multi-API configurations
   * @since 3.2.0
   */
  apiName = 'default';

  constructor(private restService: RestService) {}

  /**
   * Create a new edition
   * @param input Edition creation DTO
   * @returns Promise with created edition
   */
  async create(input: EditionCreateDto): Promise<EditionDto> {
    return this.restService.request<EditionCreateDto, EditionDto>({
      method: 'POST',
      url: '/api/saas/editions',
      body: input,
    });
  }

  /**
   * Delete an edition by ID
   * @param id Edition ID
   * @returns Promise that resolves when deletion is complete
   */
  async delete(id: string): Promise<void> {
    return this.restService.request<null, void>({
      method: 'DELETE',
      url: `/api/saas/editions/${id}`,
    });
  }

  /**
   * Get an edition by ID
   * @param id Edition ID
   * @returns Promise with edition data
   */
  async get(id: string): Promise<EditionDto> {
    return this.restService.request<null, EditionDto>({
      method: 'GET',
      url: `/api/saas/editions/${id}`,
    });
  }

  /**
   * Get paginated list of editions
   * @param input Query parameters for filtering and pagination
   * @returns Promise with paginated editions response
   */
  async getList(input: GetEditionsInput = {}): Promise<PagedResultDto<EditionDto>> {
    return this.restService.request<null, PagedResultDto<EditionDto>>({
      method: 'GET',
      url: '/api/saas/editions',
      params: input,
    });
  }

  /**
   * Get usage statistics for editions
   * @returns Promise with usage statistics data
   */
  async getUsageStatistics(): Promise<GetEditionUsageStatisticsResult> {
    return this.restService.request<null, GetEditionUsageStatisticsResult>({
      method: 'GET',
      url: '/api/saas/editions/statistics/usage-statistic',
    });
  }

  /**
   * Update an existing edition
   * @param id Edition ID
   * @param input Edition update DTO
   * @returns Promise with updated edition
   */
  async update(id: string, input: EditionUpdateDto): Promise<EditionDto> {
    return this.restService.request<EditionUpdateDto, EditionDto>({
      method: 'PUT',
      url: `/api/saas/editions/${id}`,
      body: input,
    });
  }
}
