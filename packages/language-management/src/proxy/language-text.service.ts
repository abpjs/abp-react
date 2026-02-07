/**
 * Language Text Service (Proxy)
 * Translated from @volo/abp.ng.language-management v3.2.0
 *
 * New typed proxy service for language text (localization) operations.
 * This service uses the new DTO types from proxy/dto/models.
 *
 * @since 3.2.0
 */

import type { RestService, PagedResultDto } from '@abpjs/core';
import type { GetLanguagesTextsInput, LanguageTextDto } from './dto/models';

/**
 * Proxy service for language text (localization) operations.
 * Provides strongly-typed methods for querying and updating translations.
 *
 * @since 3.2.0
 *
 * @example
 * ```tsx
 * const languageTextService = new LanguageTextService(restService);
 *
 * // Get language texts
 * const texts = await languageTextService.getList({
 *   filter: '',
 *   resourceName: 'AbpIdentity',
 *   baseCultureName: 'en',
 *   targetCultureName: 'fr',
 *   getOnlyEmptyValues: true,
 *   skipCount: 0,
 *   maxResultCount: 10,
 * });
 *
 * // Update a translation
 * await languageTextService.update('AbpIdentity', 'fr', 'UserName', 'Nom d\'utilisateur');
 * ```
 */
export class LanguageTextService {
  /**
   * API name for multi-API configurations
   */
  apiName = 'default';

  private restService: RestService;

  constructor(restService: RestService) {
    this.restService = restService;
  }

  /**
   * Get a specific language text by resource, culture, and name
   * @param resourceName - The resource name
   * @param cultureName - The culture name
   * @param name - The text key/name
   * @param baseCultureName - The base culture for comparison
   * @returns Promise with the language text
   */
  get(
    resourceName: string,
    cultureName: string,
    name: string,
    baseCultureName: string
  ): Promise<LanguageTextDto> {
    return this.restService.request<null, LanguageTextDto>({
      method: 'GET',
      url: `/api/language-management/language-texts/${resourceName}/${cultureName}/${name}`,
      params: { baseCultureName },
    });
  }

  /**
   * Get language texts with pagination and filtering
   * @param input - Query parameters for filtering and pagination
   * @returns Promise with paginated language texts
   */
  getList(input: GetLanguagesTextsInput): Promise<PagedResultDto<LanguageTextDto>> {
    return this.restService.request<null, PagedResultDto<LanguageTextDto>>({
      method: 'GET',
      url: '/api/language-management/language-texts',
      params: input as unknown as Record<string, unknown>,
    });
  }

  /**
   * Restore a language text to its default value
   * @param resourceName - The resource name
   * @param cultureName - The culture name
   * @param name - The text key/name
   * @returns Promise resolving when complete
   */
  restoreToDefault(resourceName: string, cultureName: string, name: string): Promise<void> {
    return this.restService.request<null, void>({
      method: 'PUT',
      url: `/api/language-management/language-texts/${resourceName}/${cultureName}/${name}/restore`,
    });
  }

  /**
   * Update a language text value
   * @param resourceName - The resource name
   * @param cultureName - The culture name
   * @param name - The text key/name
   * @param value - The new translated value
   * @returns Promise resolving when complete
   */
  update(
    resourceName: string,
    cultureName: string,
    name: string,
    value: string
  ): Promise<void> {
    return this.restService.request<{ value: string }, void>({
      method: 'PUT',
      url: `/api/language-management/language-texts/${resourceName}/${cultureName}/${name}`,
      body: { value },
    });
  }
}
