/* eslint-disable @typescript-eslint/no-namespace */
import { ComponentType } from 'react';
import { UserManagerSettings } from 'oidc-client-ts';
import type { ABP } from './common';

export namespace Config {
  export interface State {
    [key: string]: any;
  }

  export interface Application {
    name: string;
    /**
     * Base URL of the application
     * @since 3.1.0
     */
    baseUrl?: string;
    logoUrl?: string;
  }

  export interface Environment {
    apis: Apis;
    application?: Application;
    /**
     * Hot Module Replacement flag
     * @since 2.4.0
     */
    hmr?: boolean;
    localization?: {
      defaultResourceName?: string;
    };
    oAuthConfig: UserManagerSettings;
    production: boolean;
    /**
     * Remote environment configuration
     * @since 3.1.0
     */
    remoteEnv?: RemoteEnv;
  }

  /**
   * API configuration with URL and optional additional properties
   * @since 2.4.0
   */
  export interface ApiConfig {
    url: string;
    /**
     * Root namespace for the API
     * @since 3.1.0
     */
    rootNamespace?: string;
    [key: string]: string | undefined;
  }

  /**
   * Custom merge function type for remote environment
   * @since 3.1.0
   */
  export type customMergeFn = (
    localEnv: Partial<Config.Environment>,
    remoteEnv: any
  ) => Config.Environment;

  /**
   * Remote environment configuration
   * @since 3.1.0
   */
  export interface RemoteEnv {
    url: string;
    mergeStrategy: 'deepmerge' | 'overwrite' | customMergeFn;
    method?: string;
    headers?: ABP.Dictionary<string>;
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
