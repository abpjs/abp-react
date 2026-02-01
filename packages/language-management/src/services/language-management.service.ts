/**
 * Language Management Service
 * Translated from @volo/abp.ng.language-management v2.0.0
 *
 * Provides API operations for managing languages and language texts (localization).
 */

import { RestService, ABP } from '@abpjs/core';
import { LanguageManagement } from '../models';

/**
 * Service for managing language-related API operations.
 * Handles languages, cultures, resources, and language texts CRUD operations.
 *
 * @since 2.0.0
 * @updated 2.4.0 - Added apiName property
 */
export class LanguageManagementService {
  private rest: RestService;

  /**
   * API name for multi-API configurations
   * @since 2.4.0
   */
  apiName = 'default';

  constructor(rest: RestService) {
    this.rest = rest;
  }

  // ========================
  // Language Operations
  // ========================

  /**
   * Get all languages with optional pagination
   * @param params - Optional query parameters for pagination and filtering
   * @returns Promise with paginated language response
   */
  getLanguages(params: ABP.PageQueryParams = {}): Promise<LanguageManagement.LanguageResponse> {
    return this.rest.request<null, LanguageManagement.LanguageResponse>({
      method: 'GET',
      url: '/api/language-management/languages',
      params,
    });
  }

  /**
   * Get a language by ID
   * @param id - The language ID
   * @returns Promise with the language
   */
  getLanguageById(id: string): Promise<LanguageManagement.Language> {
    return this.rest.request<null, LanguageManagement.Language>({
      method: 'GET',
      url: `/api/language-management/languages/${id}`,
    });
  }

  /**
   * Create a new language
   * @param body - The language data to create
   * @returns Promise with the created language
   */
  createLanguage(body: LanguageManagement.CreateLanguageInput): Promise<LanguageManagement.Language> {
    return this.rest.request<LanguageManagement.CreateLanguageInput, LanguageManagement.Language>({
      method: 'POST',
      url: '/api/language-management/languages',
      body,
    });
  }

  /**
   * Update an existing language
   * @param id - The language ID to update
   * @param body - The updated language data
   * @returns Promise with the updated language
   */
  updateLanguage(
    id: string,
    body: LanguageManagement.UpdateLanguageInput
  ): Promise<LanguageManagement.Language> {
    return this.rest.request<LanguageManagement.UpdateLanguageInput, LanguageManagement.Language>({
      method: 'PUT',
      url: `/api/language-management/languages/${id}`,
      body,
    });
  }

  /**
   * Delete a language
   * @param id - The language ID to delete
   * @returns Promise resolving when complete
   */
  deleteLanguage(id: string): Promise<void> {
    return this.rest.request<null, void>({
      method: 'DELETE',
      url: `/api/language-management/languages/${id}`,
    });
  }

  /**
   * Set a language as the default language
   * @param id - The language ID to set as default
   * @returns Promise resolving when complete
   */
  setAsDefaultLanguage(id: string): Promise<void> {
    return this.rest.request<null, void>({
      method: 'PUT',
      url: `/api/language-management/languages/${id}/set-as-default`,
    });
  }

  // ========================
  // Culture Operations
  // ========================

  /**
   * Get all available cultures
   * @returns Promise with list of cultures
   */
  getCultures(): Promise<LanguageManagement.Culture[]> {
    return this.rest.request<null, LanguageManagement.Culture[]>({
      method: 'GET',
      url: '/api/language-management/languages/culture-list',
    });
  }

  // ========================
  // Resource Operations
  // ========================

  /**
   * Get all available localization resources
   * @returns Promise with list of resources
   */
  getResources(): Promise<LanguageManagement.Resource[]> {
    return this.rest.request<null, LanguageManagement.Resource[]>({
      method: 'GET',
      url: '/api/language-management/languages/resources',
    });
  }

  // ========================
  // Language Text Operations
  // ========================

  /**
   * Get language texts with pagination and filtering
   * @param params - Query parameters including resource name, cultures, and filter options
   * @returns Promise with paginated language text response
   */
  getLanguageTexts(
    params: LanguageManagement.LanguageTextQueryParams
  ): Promise<LanguageManagement.LanguageTextResponse> {
    return this.rest.request<null, LanguageManagement.LanguageTextResponse>({
      method: 'GET',
      url: '/api/language-management/language-texts',
      params: params as unknown as ABP.PageQueryParams,
    });
  }

  /**
   * Get a language text by name
   * @param params - Parameters identifying the language text
   * @returns Promise with the language text
   */
  getLanguageTextByName(
    params: LanguageManagement.LanguageTextRequestByNameParams
  ): Promise<LanguageManagement.LanguageText> {
    return this.rest.request<null, LanguageManagement.LanguageText>({
      method: 'GET',
      url: '/api/language-management/language-texts',
      params: params as unknown as ABP.PageQueryParams,
    });
  }

  /**
   * Update a language text by name
   * @param params - Parameters including the new value
   * @returns Promise with the updated language text
   */
  updateLanguageTextByName(
    params: LanguageManagement.LanguageTextUpdateByNameParams
  ): Promise<LanguageManagement.LanguageText> {
    const { resourceName, cultureName, name, value } = params;
    return this.rest.request<{ value?: string }, LanguageManagement.LanguageText>({
      method: 'PUT',
      url: `/api/language-management/language-texts/${resourceName}/${cultureName}/${name}`,
      body: { value },
    });
  }

  /**
   * Restore a language text to its default value
   * @param params - Parameters identifying the language text
   * @returns Promise resolving when complete
   */
  restoreLanguageTextByName(
    params: LanguageManagement.LanguageTextRequestByNameParams
  ): Promise<void> {
    const { resourceName, cultureName, name } = params;
    return this.rest.request<null, void>({
      method: 'PUT',
      url: `/api/language-management/language-texts/${resourceName}/${cultureName}/${name}/restore`,
    });
  }
}
