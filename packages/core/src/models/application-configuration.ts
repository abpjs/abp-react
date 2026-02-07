/* eslint-disable @typescript-eslint/no-namespace */
import { ABP } from './common';

export namespace ApplicationConfiguration {
  /**
   * @deprecated Use the ApplicationConfigurationDto interface instead. To be deleted in v5.0.
   */
  export interface Response {
    localization: Localization;
    auth: Auth;
    setting: Value;
    currentUser: CurrentUser;
    /**
     * Current tenant information
     * @since 4.0.0
     */
    currentTenant: CurrentTenant;
    features: Value;
  }

  /**
   * @deprecated Use the ApplicationLocalizationConfigurationDto interface instead. To be deleted in v5.0.
   */
  export interface Localization {
    currentCulture: CurrentCulture;
    defaultResourceName: string;
    languages: Language[];
    values: LocalizationValue;
  }

  /**
   * Information about the current culture/locale
   * @deprecated Use the CurrentCultureDto interface instead. To be deleted in v5.0.
   * @since 2.7.0
   */
  export interface CurrentCulture {
    cultureName: string;
    dateTimeFormat: DateTimeFormat;
    displayName: string;
    englishName: string;
    isRightToLeft: boolean;
    name: string;
    nativeName: string;
    threeLetterIsoLanguageName: string;
    twoLetterIsoLanguageName: string;
  }

  /**
   * Date/time formatting information for the current culture
   * @deprecated Use the DateTimeFormatDto interface instead. To be deleted in v5.0.
   * @since 2.7.0
   */
  export interface DateTimeFormat {
    calendarAlgorithmType: string;
    dateSeparator: string;
    fullDateTimePattern: string;
    longTimePattern: string;
    shortDatePattern: string;
    shortTimePattern: string;
  }

  /**
   * @deprecated Use the Record<string, Record<string, string>> type instead. To be deleted in v5.0.
   */
  export interface LocalizationValue {
    [key: string]: {
      [key: string]: string;
    };
  }

  /**
   * @deprecated Use the LanguageInfo interface instead. To be deleted in v5.0.
   */
  export interface Language {
    cultureName: string;
    uiCultureName: string;
    displayName: string;
    flagIcon: string;
  }

  /**
   * @deprecated Use the ApplicationAuthConfigurationDto interface instead. To be deleted in v5.0.
   */
  export interface Auth {
    policies: Policy;
    grantedPolicies: Policy;
  }

  /**
   * @deprecated Use the Record<string, boolean> type instead. To be deleted in v5.0.
   */
  export interface Policy {
    [key: string]: boolean;
  }

  /**
   * Generic value container for settings and features
   * @deprecated To be deleted in v5.0.
   * @since 1.0.0
   */
  export interface Value {
    values: ABP.Dictionary<string>;
  }

  /**
   * @deprecated Use Value instead
   */
  export type Setting = Value;

  /**
   * @deprecated Use Value instead
   */
  export type Features = Value;

  /**
   * @deprecated Use the CurrentUserDto interface instead. To be deleted in v5.0.
   */
  export interface CurrentUser {
    email: string;
    emailVerified: boolean;
    id: string;
    isAuthenticated: boolean;
    name: string;
    phoneNumber: string;
    phoneNumberVerified: boolean;
    roles: string[];
    surName: string;
    tenantId: string;
    userName: string;
  }

  /**
   * Current tenant information
   * @deprecated Use the CurrentTenantDto interface instead. To be deleted in v5.0.
   * @since 4.0.0
   */
  export interface CurrentTenant {
    id: string;
    name: string;
    isAvailable?: boolean;
  }
}
