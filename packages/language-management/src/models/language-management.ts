/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Language Management Models
 * Translated from @volo/abp.ng.language-management v2.0.0
 */

import type { ABP } from '@abpjs/core';

/**
 * Language Management namespace containing all models
 * for language and language text management.
 */
export namespace LanguageManagement {
  /**
   * State interface for language management
   */
  export interface State {
    languageResponse: LanguageResponse;
    languageTextsResponse: LanguageTextResponse;
    selectedItem: Language | null;
    cultures: Culture[];
    resources: Resource[];
  }

  /**
   * Paginated response of languages
   */
  export type LanguageResponse = ABP.PagedResponse<Language>;

  /**
   * Paginated response of language texts
   */
  export type LanguageTextResponse = ABP.PagedResponse<LanguageText>;

  /**
   * Culture information for localization
   */
  export interface Culture {
    displayName: string;
    name: string;
  }

  /**
   * Resource containing localization strings
   */
  export interface Resource {
    name: string;
  }

  /**
   * Language entity
   */
  export interface Language {
    id: string;
    cultureName: string;
    uiCultureName: string;
    displayName: string;
    flagIcon: string;
    isEnabled: boolean;
    isDefaultLanguage: boolean;
    creationTime: string;
    creatorId: string;
  }

  /**
   * Input for updating a language
   */
  export interface UpdateLanguageInput {
    isEnabled: boolean;
    flagIcon: string;
    displayName: string;
  }

  /**
   * Input for creating a new language
   */
  export interface CreateLanguageInput extends UpdateLanguageInput {
    cultureName: string;
    uiCultureName: string;
  }

  /**
   * Language text (localization string) entity
   */
  export interface LanguageText {
    resourceName: string;
    cultureName: string;
    baseCultureName: string;
    baseValue: string;
    name: string;
    value: string;
  }

  /**
   * Query parameters for fetching language texts
   */
  export interface LanguageTextQueryParams extends ABP.PageQueryParams {
    resourceName?: string;
    baseCultureName: string;
    targetCultureName: string;
    getOnlyEmptyValues: boolean;
  }

  /**
   * Parameters for requesting a language text by name
   */
  export interface LanguageTextRequestByNameParams {
    resourceName: string;
    cultureName: string;
    name: string;
  }

  /**
   * Parameters for updating a language text by name
   */
  export interface LanguageTextUpdateByNameParams extends LanguageTextRequestByNameParams {
    value?: string;
  }
}
