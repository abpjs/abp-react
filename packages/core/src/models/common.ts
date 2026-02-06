/* eslint-disable @typescript-eslint/no-namespace */
import { ComponentType, ReactNode } from 'react';
import { Config } from './config';
import { eLayoutType } from '../enums';

export namespace ABP {
  export interface Root {
    environment: Partial<Config.Environment>;
    /**
     * Skip fetching application configuration on initialization
     * @since 2.7.0
     */
    skipGetAppConfiguration?: boolean;
    /**
     * Send null values as query parameters
     * When true, null values will be included in query strings
     * @since 2.9.0
     */
    sendNullsAsQueryParam?: boolean;
    /**
     * Map culture names to locale file names
     * @since 3.1.0
     */
    cultureNameLocaleFileMap?: Dictionary<string>;
  }

  /**
   * Configuration for test environments
   * @since 2.7.0
   */
  export interface Test {
    baseHref?: string;
  }

  export type PagedResponse<T> = {
    totalCount: number;
  } & PagedItemsResponse<T>;

  export interface PagedItemsResponse<T> {
    items: T[];
  }

  export interface PageQueryParams {
    filter?: string;
    sorting?: string;
    skipCount?: number;
    maxResultCount?: number;
  }

  /**
   * Lookup item for dropdown/select fields
   * @since 3.1.0
   */
  export interface Lookup {
    id: string;
    displayName: string;
  }

  /**
   * Base navigation item interface
   * @since 3.0.0
   */
  export interface Nav {
    name: string;
    parentName?: string;
    requiredPolicy?: string;
    order?: number;
    invisible?: boolean;
  }

  /**
   * Route configuration extending Nav
   * @since 3.0.0 - Updated to extend Nav interface
   */
  export interface Route extends Nav {
    children?: Route[];
    /** Icon to display in navigation (React component or element) */
    icon?: ReactNode;
    layout?: eLayoutType;
    path: string;
    iconClass?: string;
    /** Badge content (number or text) to display at end of link in sidebar */
    badge?: ReactNode;
    /** Badge color palette (default: 'gray') */
    badgeColorPalette?: string;
  }

  /**
   * Tab configuration extending Nav
   * @since 3.0.0
   */
  export interface Tab extends Nav {
    component: ComponentType<any>;
  }

  /**
   * @deprecated Use RoutesService instead. Will be removed in v4.0.0
   * Full route with computed URL
   */
  export interface FullRoute extends Route {
    url?: string;
    wrapper?: boolean;
  }

  export interface BasicItem {
    id: string;
    name: string;
  }

  /**
   * Option type for form selects derived from enum keys
   * @since 2.7.0
   */
  export interface Option<T> {
    key: Extract<keyof T, string>;
    value: T[Extract<keyof T, string>];
  }

  /**
   * Generic dictionary type for key-value pairs
   * @since 1.0.0
   */
  export interface Dictionary<T = any> {
    [key: string]: T;
  }
}
