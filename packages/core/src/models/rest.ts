/* eslint-disable @typescript-eslint/no-namespace */
import { ResponseType } from 'axios';

export namespace Rest {
  /**
   * Configuration for REST requests
   * @since 2.4.0 - Added apiName property
   */
  export type Config = Partial<{
    /**
     * The name of the API to use (as defined in Config.Apis)
     * @since 2.4.0
     */
    apiName: string;
    skipHandleError: boolean;
    observe: Observe;
  }>;

  export enum Observe {
    Body = 'body',
    Events = 'events',
    Response = 'response',
  }

  export enum RestResponseType {
    ArrayBuffer = 'arraybuffer',
    Blob = 'blob',
    JSON = 'json',
    Text = 'text',
  }

  export interface Request<T = any> {
    body?: T;
    headers?: Record<string, string | string[]>;
    method: string;
    params?: Record<string, any>;
    reportProgress?: boolean;
    responseType?: ResponseType;
    url: string;
    withCredentials?: boolean;
  }
}
