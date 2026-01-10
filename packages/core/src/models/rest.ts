import { ResponseType } from 'axios';

export namespace Rest {
  export interface Config {
    throwErr?: boolean;
    observe?: Observe;
  }

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
