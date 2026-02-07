/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Language Management Models
 * Translated from @volo/abp.ng.language-management v4.0.0
 *
 * @since 2.0.0
 * @updated 3.2.0 - State now uses new proxy types, legacy types deprecated
 * @updated 4.0.0 - State.languageResponse changed to PagedResultDto, deprecated types kept for v5.0
 */

import type { ABP, PagedResultDto } from '@abpjs/core';
import type {
  CultureInfoDto,
  LanguageDto,
  LanguageResourceDto,
  LanguageTextDto,
} from '../proxy/dto/models';

/**
 * Language Management namespace containing all models
 * for language and language text management.
 */
export namespace LanguageManagement {
  /**
   * State interface for language management
   * @updated 3.2.0 - Now uses new proxy types
   * @updated 4.0.0 - languageResponse changed from ListResultDto to PagedResultDto
   */
  export interface State {
    languageResponse: PagedResultDto<LanguageDto>;
    languageTextsResponse: PagedResultDto<LanguageTextDto>;
    selectedItem: LanguageDto | null;
    cultures: CultureInfoDto[];
    resources: LanguageResourceDto[];
  }

  // ========================
  // Deprecated types - To be deleted in v5.0
  // These are kept for backward compatibility with consumers
  // that haven't migrated to proxy/dto/models yet.
  // ========================

  /**
   * Paginated response of languages
   * @deprecated To be deleted in v5.0. Use PagedResultDto<LanguageDto> instead.
   */
  export type LanguageResponse = ABP.PagedResponse<Language>;

  /**
   * Paginated response of language texts
   * @deprecated To be deleted in v5.0. Use PagedResultDto<LanguageTextDto> instead.
   */
  export type LanguageTextResponse = ABP.PagedResponse<LanguageText>;

  /**
   * Culture information for localization
   * @deprecated To be deleted in v5.0. Use CultureInfoDto from proxy/dto instead.
   */
  export interface Culture {
    displayName: string;
    name: string;
  }

  /**
   * Resource containing localization strings
   * @deprecated To be deleted in v5.0. Use LanguageResourceDto from proxy/dto instead.
   */
  export interface Resource {
    name: string;
  }

  /**
   * Language entity
   * @deprecated To be deleted in v5.0. Use LanguageDto from proxy/dto instead.
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
   * @deprecated To be deleted in v5.0. Use UpdateLanguageDto from proxy/dto instead.
   */
  export interface UpdateLanguageInput {
    isEnabled: boolean;
    flagIcon: string;
    displayName: string;
  }

  /**
   * Input for creating a new language
   * @deprecated To be deleted in v5.0. Use CreateLanguageDto from proxy/dto instead.
   */
  export interface CreateLanguageInput extends UpdateLanguageInput {
    cultureName: string;
    uiCultureName: string;
  }

  /**
   * Language text (localization string) entity
   * @deprecated To be deleted in v5.0. Use LanguageTextDto from proxy/dto instead.
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
   * @deprecated To be deleted in v5.0. Use GetLanguagesTextsInput from proxy/dto instead.
   */
  export interface LanguageTextQueryParams extends ABP.PageQueryParams {
    resourceName?: string;
    baseCultureName: string;
    targetCultureName: string;
    getOnlyEmptyValues: boolean;
  }

  /**
   * Parameters for requesting a language text by name
   * @deprecated To be deleted in v5.0. Use individual parameters instead.
   */
  export interface LanguageTextRequestByNameParams {
    resourceName: string;
    cultureName: string;
    name: string;
  }

  /**
   * Parameters for updating a language text by name
   * @deprecated To be deleted in v5.0. Use individual parameters instead.
   */
  export interface LanguageTextUpdateByNameParams extends LanguageTextRequestByNameParams {
    value?: string;
  }
}
