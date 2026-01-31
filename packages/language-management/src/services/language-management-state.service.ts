/**
 * Language Management State Service
 * Translated from @volo/abp.ng.language-management v2.0.0
 *
 * Provides a stateful facade over language management operations,
 * maintaining internal state that mirrors the Angular NGXS store pattern.
 */

import { RestService, ABP } from '@abpjs/core';
import { LanguageManagement } from '../models';
import { LanguageManagementService } from './language-management.service';

/**
 * State service for language management operations.
 * Provides dispatch methods that execute API operations and update internal state,
 * mirroring the Angular NGXS store pattern.
 *
 * @since 2.0.0
 *
 * @example
 * ```tsx
 * const stateService = new LanguageManagementStateService(restService);
 *
 * // Dispatch to fetch languages
 * await stateService.dispatchGetLanguages({ maxResultCount: 10 });
 *
 * // Access the result
 * const languages = stateService.getLanguages();
 * const total = stateService.getLanguagesTotalCount();
 * ```
 */
export class LanguageManagementStateService {
  private service: LanguageManagementService;
  private state: LanguageManagement.State = {
    languageResponse: { items: [], totalCount: 0 },
    languageTextsResponse: { items: [], totalCount: 0 },
    selectedItem: null,
    cultures: [],
    resources: [],
  };

  constructor(rest: RestService) {
    this.service = new LanguageManagementService(rest);
  }

  // ========================
  // Getter Methods
  // ========================

  /**
   * Get the current list of languages from state
   */
  getLanguages(): LanguageManagement.Language[] {
    return this.state.languageResponse?.items ?? [];
  }

  /**
   * Get the total count of languages from state
   */
  getLanguagesTotalCount(): number {
    return this.state.languageResponse?.totalCount ?? 0;
  }

  /**
   * Get the current list of language texts from state
   */
  getLanguageTexts(): LanguageManagement.LanguageText[] {
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
   */
  getCultures(): LanguageManagement.Culture[] {
    return this.state.cultures ?? [];
  }

  /**
   * Get the current list of resources from state
   */
  getResources(): LanguageManagement.Resource[] {
    return this.state.resources ?? [];
  }

  // ========================
  // Language Dispatch Methods
  // ========================

  /**
   * Dispatch action to fetch languages with optional pagination
   * @param params - Optional query parameters for pagination and filtering
   * @returns Promise with the language response
   */
  async dispatchGetLanguages(
    params: ABP.PageQueryParams = {}
  ): Promise<LanguageManagement.LanguageResponse> {
    const response = await this.service.getLanguages(params);
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
  async dispatchGetLanguageById(id: string): Promise<LanguageManagement.Language> {
    const language = await this.service.getLanguageById(id);
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
    body: LanguageManagement.CreateLanguageInput | LanguageManagement.UpdateLanguageInput,
    id?: string
  ): Promise<LanguageManagement.Language> {
    let result: LanguageManagement.Language;
    if (id) {
      result = await this.service.updateLanguage(id, body as LanguageManagement.UpdateLanguageInput);
    } else {
      result = await this.service.createLanguage(body as LanguageManagement.CreateLanguageInput);
    }
    // Refresh the list after create/update
    await this.dispatchGetLanguages();
    return result;
  }

  /**
   * Dispatch action to delete a language
   * @param id - The language ID to delete
   * @returns Promise resolving when complete (returns null per v2.0.0 spec)
   */
  async dispatchDeleteLanguage(id: string): Promise<null> {
    await this.service.deleteLanguage(id);
    // Refresh the list after deletion
    await this.dispatchGetLanguages();
    return null;
  }

  /**
   * Dispatch action to set a language as the default
   * @param id - The language ID to set as default
   * @returns Promise resolving when complete
   */
  async dispatchSetAsDefaultLanguage(id: string): Promise<void> {
    await this.service.setAsDefaultLanguage(id);
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
    params: LanguageManagement.LanguageTextQueryParams
  ): Promise<LanguageManagement.LanguageTextResponse> {
    const response = await this.service.getLanguageTexts(params);
    this.state = {
      ...this.state,
      languageTextsResponse: response,
    };
    return response;
  }

  /**
   * Dispatch action to update a language text by name
   * @param params - Parameters including the new value
   * @returns Promise with the updated language text
   */
  async dispatchUpdateLanguageTextByName(
    params: LanguageManagement.LanguageTextUpdateByNameParams
  ): Promise<LanguageManagement.LanguageText> {
    const result = await this.service.updateLanguageTextByName(params);
    return result;
  }

  /**
   * Dispatch action to restore a language text to its default value
   * @param params - Parameters identifying the language text
   * @returns Promise resolving when complete
   */
  async dispatchRestoreLanguageTextByName(
    params: LanguageManagement.LanguageTextRequestByNameParams
  ): Promise<void> {
    await this.service.restoreLanguageTextByName(params);
  }

  // ========================
  // Culture & Resource Dispatch Methods
  // ========================

  /**
   * Dispatch action to fetch available cultures
   * @returns Promise with the list of cultures
   */
  async dispatchGetLanguageCultures(): Promise<LanguageManagement.Culture[]> {
    const cultures = await this.service.getCultures();
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
  async dispatchGetLanguageResources(): Promise<LanguageManagement.Resource[]> {
    const resources = await this.service.getResources();
    this.state = {
      ...this.state,
      resources,
    };
    return resources;
  }
}
