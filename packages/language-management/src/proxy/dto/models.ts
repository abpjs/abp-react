/**
 * Language Management Proxy DTO Models
 * Translated from @volo/abp.ng.language-management v3.2.0
 *
 * These are the new typed DTOs for the language management module.
 * The legacy types in the LanguageManagement namespace are deprecated.
 *
 * @since 3.2.0
 */

import type { ABP } from '@abpjs/core';

/**
 * DTO for creating a new language.
 */
export interface CreateLanguageDto {
  /** Display name for the language */
  displayName: string;
  /** Culture name (e.g., "en-US") */
  cultureName: string;
  /** UI culture name (e.g., "en-US") */
  uiCultureName: string;
  /** Flag icon identifier */
  flagIcon: string;
  /** Whether the language is enabled */
  isEnabled: boolean;
  /** Extra properties dictionary (optional) */
  extraProperties?: ABP.Dictionary<unknown>;
}

/**
 * DTO for culture information.
 */
export interface CultureInfoDto {
  /** Display name of the culture */
  displayName: string;
  /** Culture name/identifier */
  name: string;
}

/**
 * Input parameters for querying language texts.
 */
export interface GetLanguagesTextsInput {
  /** Filter string for searching */
  filter?: string;
  /** Resource name to filter by */
  resourceName?: string;
  /** Base culture name for comparison */
  baseCultureName?: string;
  /** Target culture name to translate to */
  targetCultureName?: string;
  /** Whether to get only empty/missing values */
  getOnlyEmptyValues?: boolean;
  /** Number of items to skip */
  skipCount?: number;
  /** Maximum number of items to return */
  maxResultCount?: number;
  /** Sorting string */
  sorting?: string;
}

/**
 * DTO for a language entity.
 */
export interface LanguageDto {
  /** Language ID */
  id: string;
  /** Culture name (e.g., "en-US") */
  cultureName: string;
  /** UI culture name (e.g., "en-US") */
  uiCultureName: string;
  /** Display name for the language */
  displayName: string;
  /** Flag icon identifier */
  flagIcon: string;
  /** Whether the language is enabled */
  isEnabled: boolean;
  /** Whether this is the default language */
  isDefaultLanguage: boolean;
  /** Creation time */
  creationTime?: string | Date;
  /** Creator ID */
  creatorId?: string;
  /** Extra properties dictionary (optional) */
  extraProperties?: ABP.Dictionary<unknown>;
}

/**
 * DTO for a language resource.
 */
export interface LanguageResourceDto {
  /** Resource name */
  name: string;
}

/**
 * DTO for a language text (localization string).
 */
export interface LanguageTextDto {
  /** Resource name this text belongs to */
  resourceName: string;
  /** Culture name of this text */
  cultureName: string;
  /** Base culture name for comparison */
  baseCultureName: string;
  /** Value in the base culture */
  baseValue: string;
  /** Key/name of the text */
  name: string;
  /** Translated value */
  value: string;
}

/**
 * DTO for updating a language.
 */
export interface UpdateLanguageDto {
  /** Display name for the language */
  displayName: string;
  /** Flag icon identifier */
  flagIcon: string;
  /** Whether the language is enabled */
  isEnabled: boolean;
  /** Extra properties dictionary (optional) */
  extraProperties?: ABP.Dictionary<unknown>;
}
