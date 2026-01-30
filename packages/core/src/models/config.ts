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
    oAuthConfig: UserManagerSettings;
    apis: Apis;
    localization?: {
      defaultResourceName?: string;
    };
  }

  export interface Apis {
    [key: string]: {
      url: string;
      [key: string]: string;
    };
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
}
