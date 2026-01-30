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
    values: LocalizationValue;
    languages: Language[];
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
    isAuthenticated: boolean;
    id: string;
    tenantId: string;
    userName: string;
  }
}
