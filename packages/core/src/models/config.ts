import { ComponentType } from 'react';
import { UserManagerSettings } from 'oidc-client-ts';

export namespace Config {
  export interface State {
    [key: string]: any;
  }

  export interface Environment {
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
}
