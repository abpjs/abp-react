import { ComponentType } from 'react';
import { UserManagerSettings } from 'oidc-client-ts';

export namespace Config {
  export interface State {
    [key: string]: any;
  }

  export interface Application {
    name: string;
    logoUrl?: string;
  }

  export interface Environment {
    application?: Application;
    production: boolean;
    /**
     * Hot Module Replacement flag
     * @since 2.4.0
     */
    hmr?: boolean;
    oAuthConfig: UserManagerSettings;
    apis: Apis;
    localization?: {
      defaultResourceName?: string;
    };
  }

  /**
   * API configuration with URL and optional additional properties
   * @since 2.4.0
   */
  export interface ApiConfig {
    url: string;
    [key: string]: string;
  }

  export interface Apis {
    [key: string]: ApiConfig;
    default: ApiConfig;
  }

  export interface Requirements {
    layouts: ComponentType<any>[];
  }

  /**
   * Localization key with a default value fallback
   * @since 1.0.0
   */
  export interface LocalizationWithDefault {
    key: string;
    defaultValue: string;
  }

  /**
   * Type for localization parameters - can be a simple string key or an object with default value
   * @since 1.1.0
   */
  export type LocalizationParam = string | LocalizationWithDefault;
}
