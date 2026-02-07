/**
 * Language Management State Service
 * Translated from @volo/abp.ng.language-management v3.2.0
 *
 * Provides a stateful facade over language management operations,
 * maintaining internal state that mirrors the Angular NGXS store pattern.
 *
 * @since 2.0.0
 * @updated 3.0.0 - Removed getLanguagesTotalCount() method
 * @updated 3.2.0 - Now uses new proxy services and types
 */

import type { RestService } from '@abpjs/core';
import type { LanguageManagement } from '../models';
import type {
  CultureInfoDto,
  GetLanguagesTextsInput,
  LanguageDto,
  LanguageResourceDto,
  LanguageTextDto,
  CreateLanguageDto,
  UpdateLanguageDto,
} from '../proxy/dto/models';
import { LanguageService } from '../proxy/language.service';
import { LanguageTextService } from '../proxy/language-text.service';

/**
 * State service for language management operations.
 * Provides dispatch methods that execute API operations and update internal state,
 * mirroring the Angular NGXS store pattern.
 *
 * @since 2.0.0
 * @updated 3.2.0 - Now uses new proxy services internally
 *
 * @example
 * ```tsx
 * const stateService = new LanguageManagementStateService(restService);
 *
 * // Dispatch to fetch languages
 * await stateService.dispatchGetLanguages();
 *
 * // Access the result
 * const languages = stateService.getLanguages();
 * ```
 */
export class LanguageManagementStateService {
  private languageService: LanguageService;
  private languageTextService: LanguageTextService;
  private state: LanguageManagement.State = {
    languageResponse: { items: [] },
    languageTextsResponse: { items: [], totalCount: 0 },
    selectedItem: null,
    cultures: [],
    resources: [],
  };

  constructor(rest: RestService) {
    this.languageService = new LanguageService(rest);
    this.languageTextService = new LanguageTextService(rest);
  }

  // ========================
  // Getter Methods
  // ========================

  /**
   * Get the current list of languages from state
   * @returns Array of LanguageDto
   */
  getLanguages(): LanguageDto[] {
    return this.state.languageResponse?.items ?? [];
  }

  // Note: getLanguagesTotalCount() was removed in v3.0.0

  /**
   * Get the current list of language texts from state
   * @returns Array of LanguageTextDto
   */
  getLanguageTexts(): LanguageTextDto[] {
    return this.state.languageTextsResponse?.items ?? [];
  }

  /**
   * Get the total count of language texts from state
   */
  getLanguageTextsTotalCount(): number {
    return this.state.languageTextsResponse?.totalCount ?? 0;
  }

  /**
   * Get the current list of cultures from state
   * @returns Array of CultureInfoDto
   */
  getCultures(): CultureInfoDto[] {
    return this.state.cultures ?? [];
  }

  /**
   * Get the current list of resources from state
   * @returns Array of LanguageResourceDto
   */
  getResources(): LanguageResourceDto[] {
    return this.state.resources ?? [];
  }

  // ========================
  // Language Dispatch Methods
  // ========================

  /**
   * Dispatch action to fetch languages with optional filtering
   * @param params - Optional query parameters for filtering
   * @returns Promise with the language list result
   */
  async dispatchGetLanguages(
    params?: GetLanguagesTextsInput
  ): Promise<LanguageManagement.State['languageResponse']> {
    const response = await this.languageService.getList(params);
    this.state = {
      ...this.state,
      languageResponse: response,
    };
    return response;
  }

  /**
   * Dispatch action to fetch a language by ID
   * @param id - The language ID
   * @returns Promise with the language
   */
  async dispatchGetLanguageById(id: string): Promise<LanguageDto> {
    const language = await this.languageService.get(id);
    this.state = {
      ...this.state,
      selectedItem: language,
    };
    return language;
  }

  /**
   * Dispatch action to create or update a language
   * @param body - The language data
   * @param id - Optional ID for update (if not provided, creates new)
   * @returns Promise with the created/updated language
   */
  async dispatchCreateUpdateLanguage(
    body: CreateLanguageDto | UpdateLanguageDto,
    id?: string
  ): Promise<LanguageDto> {
    let result: LanguageDto;
    if (id) {
      result = await this.languageService.update(id, body as UpdateLanguageDto);
    } else {
      result = await this.languageService.create(body as CreateLanguageDto);
    }
    // Refresh the list after create/update
    await this.dispatchGetLanguages();
    return result;
  }

  /**
   * Dispatch action to delete a language
   * @param id - The language ID to delete
   * @returns Promise resolving when complete
   */
  async dispatchDeleteLanguage(id: string): Promise<void> {
    await this.languageService.delete(id);
    // Refresh the list after deletion
    await this.dispatchGetLanguages();
  }

  /**
   * Dispatch action to set a language as the default
   * @param id - The language ID to set as default
   * @returns Promise resolving when complete
   */
  async dispatchSetAsDefaultLanguage(id: string): Promise<void> {
    await this.languageService.setAsDefault(id);
    // Refresh the list after setting default
    await this.dispatchGetLanguages();
  }

  // ========================
  // Language Text Dispatch Methods
  // ========================

  /**
   * Dispatch action to fetch language texts with filters
   * @param params - Query parameters including resource name, cultures, and filter options
   * @returns Promise with the language text response
   */
  async dispatchGetLanguageTexts(
    params: GetLanguagesTextsInput
  ): Promise<LanguageManagement.State['languageTextsResponse']> {
    const response = await this.languageTextService.getList(params);
    this.state = {
      ...this.state,
      languageTextsResponse: response,
    };
    return response;
  }

  /**
   * Dispatch action to update a language text by name
   * @param params - Parameters including the new value
   * @returns Promise resolving when complete
   */
  async dispatchUpdateLanguageTextByName(params: {
    resourceName: string;
    cultureName: string;
    name: string;
    value: string;
  }): Promise<void> {
    await this.languageTextService.update(
      params.resourceName,
      params.cultureName,
      params.name,
      params.value
    );
  }

  /**
   * Dispatch action to restore a language text to its default value
   * @param params - Parameters identifying the language text
   * @returns Promise resolving when complete
   */
  async dispatchRestoreLanguageTextByName(params: {
    resourceName: string;
    cultureName: string;
    name: string;
  }): Promise<void> {
    await this.languageTextService.restoreToDefault(
      params.resourceName,
      params.cultureName,
      params.name
    );
  }

  // ========================
  // Culture & Resource Dispatch Methods
  // ========================

  /**
   * Dispatch action to fetch available cultures
   * @returns Promise with the list of cultures
   */
  async dispatchGetLanguageCultures(): Promise<CultureInfoDto[]> {
    const cultures = await this.languageService.getCulturelist();
    this.state = {
      ...this.state,
      cultures,
    };
    return cultures;
  }

  /**
   * Dispatch action to fetch available localization resources
   * @returns Promise with the list of resources
   */
  async dispatchGetLanguageResources(): Promise<LanguageResourceDto[]> {
    const resources = await this.languageService.getResources();
    this.state = {
      ...this.state,
      resources,
    };
    return resources;
  }
}
