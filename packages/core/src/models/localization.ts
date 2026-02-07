/**
 * Standalone Localization models
 * Translated from @abp/ng.core v4.0.0
 *
 * These types were previously only available inside the Config namespace.
 * In v4.0.0 they are promoted to standalone exports, and Config.LocalizationWithDefault
 * and Config.LocalizationParam become type aliases.
 *
 * @since 4.0.0
 */

export interface LocalizationWithDefault {
  key: string;
  defaultValue: string;
}

export type LocalizationParam = string | LocalizationWithDefault;
