/* eslint-disable @typescript-eslint/no-namespace */
import { ComponentType } from 'react';
import { ApplicationConfiguration } from './application-configuration';
import type { ABP } from './common';
import { Environment as IEnvironment } from './environment';
import {
  LocalizationParam as ILocalizationParam,
  LocalizationWithDefault as ILocalizationWithDefault,
} from './localization';

export namespace Config {
  /**
   * @deprecated Use ApplicationConfiguration.Response instead. To be deleted in v5.0.
   */
  export type State = ApplicationConfiguration.Response &
    ABP.Root & {
      environment: IEnvironment;
    };

  /**
   * Config.Environment is now a type alias for the standalone Environment interface.
   * @deprecated Use the standalone Environment interface instead. To be deleted in v5.0.
   */
  export type Environment = IEnvironment;

  /**
   * @deprecated Use ApplicationInfo interface instead. To be deleted in v5.0.
   */
  export interface Application {
    name: string;
    baseUrl?: string;
    logoUrl?: string;
  }

  /**
   * @deprecated Use ApiConfig interface from environment model instead. To be deleted in v5.0.
   */
  export type ApiConfig = {
    [key: string]: string;
    url: string;
  } & Partial<{
    rootNamespace: string;
  }>;

  /**
   * @deprecated Use Apis interface from environment model instead. To be deleted in v5.0.
   */
  export interface Apis {
    [key: string]: ApiConfig;
    default: ApiConfig;
  }

  /**
   * Config.LocalizationWithDefault is now a type alias for the standalone interface.
   */
  export type LocalizationWithDefault = ILocalizationWithDefault;

  /**
   * Config.LocalizationParam is now a type alias for the standalone type.
   */
  export type LocalizationParam = ILocalizationParam;

  /**
   * @deprecated Use customMergeFn type from environment model instead. To be deleted in v5.0.
   */
  export type customMergeFn = (
    localEnv: Partial<Config.Environment>,
    remoteEnv: any
  ) => Config.Environment;

  /**
   * @deprecated Use RemoteEnv interface from environment model instead. To be deleted in v5.0.
   */
  export interface RemoteEnv {
    url: string;
    mergeStrategy: 'deepmerge' | 'overwrite' | customMergeFn;
    method?: string;
    headers?: ABP.Dictionary<string>;
  }

  export interface Requirements {
    layouts: ComponentType<any>[];
  }
}
