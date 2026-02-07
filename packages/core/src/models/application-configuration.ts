/* eslint-disable @typescript-eslint/no-namespace */
import { ABP } from './common';

export namespace ApplicationConfiguration {
  export interface Response {
    localization: Localization;
    auth: Auth;
    setting: Value;
    currentUser: CurrentUser;
    features: Value;
  }

  export interface Localization {
    currentCulture: CurrentCulture;
    defaultResourceName: string;
    languages: Language[];
    values: LocalizationValue;
  }

  /**
   * Information about the current culture/locale
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

  export interface LocalizationValue {
    [key: string]: {
      [key: string]: string;
    };
  }

  export interface Language {
    cultureName: string;
    uiCultureName: string;
    displayName: string;
    flagIcon: string;
  }

  export interface Auth {
    policies: Policy;
    grantedPolicies: Policy;
  }

  export interface Policy {
    [key: string]: boolean;
  }

  /**
   * Generic value container for settings and features
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

  export interface CurrentUser {
    /**
     * User's email address
     * @since 2.9.0
     */
    email: string;
    /**
     * Whether the user's email is verified
     * @since 3.2.0
     */
    emailVerified: boolean;
    id: string;
    isAuthenticated: boolean;
    /**
     * User's first name
     * @since 3.2.0
     */
    name: string;
    /**
     * User's phone number
     * @since 3.2.0
     */
    phoneNumber: string;
    /**
     * Whether the user's phone number is verified
     * @since 3.2.0
     */
    phoneNumberVerified: boolean;
    /**
     * User's assigned roles
     * @since 3.0.0
     */
    roles: string[];
    /**
     * User's surname/last name
     * @since 3.2.0
     */
    surName: string;
    tenantId: string;
    userName: string;
  }
}
