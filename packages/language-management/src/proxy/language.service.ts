/**
 * Language Service (Proxy)
 * Translated from @volo/abp.ng.language-management v3.2.0
 *
 * New typed proxy service for language management operations.
 * This service uses the new DTO types from proxy/dto/models.
 *
 * @since 3.2.0
 */

import type { RestService, ListResultDto } from '@abpjs/core';
import type {
  CreateLanguageDto,
  CultureInfoDto,
  GetLanguagesTextsInput,
  LanguageDto,
  LanguageResourceDto,
  UpdateLanguageDto,
} from './dto/models';

/**
 * Proxy service for language management operations.
 * Provides strongly-typed methods for all language CRUD operations.
 *
 * @since 3.2.0
 *
 * @example
 * ```tsx
 * const languageService = new LanguageService(restService);
 *
 * // Get all languages
 * const languages = await languageService.getAllList();
 *
 * // Create a new language
 * const newLanguage = await languageService.create({
 *   displayName: 'French',
 *   cultureName: 'fr-FR',
 *   uiCultureName: 'fr-FR',
 *   flagIcon: 'fr',
 *   isEnabled: true,
 * });
 * ```
 */
export class LanguageService {
  /**
   * API name for multi-API configurations
   */
  apiName = 'default';

  private restService: RestService;

  constructor(restService: RestService) {
    this.restService = restService;
  }

  /**
   * Create a new language
   * @param input - The language data to create
   * @returns Promise with the created language
   */
  create(input: CreateLanguageDto): Promise<LanguageDto> {
    return this.restService.request<CreateLanguageDto, LanguageDto>({
      method: 'POST',
      url: '/api/language-management/languages',
      body: input,
    });
  }

  /**
   * Delete a language by ID
   * @param id - The language ID to delete
   * @returns Promise resolving when complete
   */
  delete(id: string): Promise<void> {
    return this.restService.request<null, void>({
      method: 'DELETE',
      url: `/api/language-management/languages/${id}`,
    });
  }

  /**
   * Get a language by ID
   * @param id - The language ID
   * @returns Promise with the language
   */
  get(id: string): Promise<LanguageDto> {
    return this.restService.request<null, LanguageDto>({
      method: 'GET',
      url: `/api/language-management/languages/${id}`,
    });
  }

  /**
   * Get all languages without pagination
   * @returns Promise with all languages
   */
  getAllList(): Promise<ListResultDto<LanguageDto>> {
    return this.restService.request<null, ListResultDto<LanguageDto>>({
      method: 'GET',
      url: '/api/language-management/languages/all',
    });
  }

  /**
   * Get available cultures for language selection
   * @returns Promise with list of cultures
   */
  getCulturelist(): Promise<CultureInfoDto[]> {
    return this.restService.request<null, CultureInfoDto[]>({
      method: 'GET',
      url: '/api/language-management/languages/culture-list',
    });
  }

  /**
   * Get languages with optional filtering
   * @param input - Query parameters for filtering
   * @returns Promise with list of languages
   */
  getList(input?: GetLanguagesTextsInput): Promise<ListResultDto<LanguageDto>> {
    return this.restService.request<null, ListResultDto<LanguageDto>>({
      method: 'GET',
      url: '/api/language-management/languages',
      params: input as unknown as Record<string, unknown>,
    });
  }

  /**
   * Get available localization resources
   * @returns Promise with list of resources
   */
  getResources(): Promise<LanguageResourceDto[]> {
    return this.restService.request<null, LanguageResourceDto[]>({
      method: 'GET',
      url: '/api/language-management/languages/resources',
    });
  }

  /**
   * Set a language as the default language
   * @param id - The language ID to set as default
   * @returns Promise resolving when complete
   */
  setAsDefault(id: string): Promise<void> {
    return this.restService.request<null, void>({
      method: 'PUT',
      url: `/api/language-management/languages/${id}/set-as-default`,
    });
  }

  /**
   * Update an existing language
   * @param id - The language ID to update
   * @param input - The updated language data
   * @returns Promise with the updated language
   */
  update(id: string, input: UpdateLanguageDto): Promise<LanguageDto> {
    return this.restService.request<UpdateLanguageDto, LanguageDto>({
      method: 'PUT',
      url: `/api/language-management/languages/${id}`,
      body: input,
    });
  }
}
