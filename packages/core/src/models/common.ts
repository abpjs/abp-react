import { ReactNode } from 'react';
import { Config } from './config';
import { eLayoutType } from '../enums';

export namespace ABP {
  export interface Root {
    environment: Partial<Config.Environment>;
    /**
     * @deprecated To be deleted in v3.0
     */
    requirements?: Config.Requirements;
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

  export interface Route {
    children?: Route[];
    /** Icon to display in navigation (React component or element) */
    icon?: ReactNode;
    invisible?: boolean;
    layout?: eLayoutType;
    name: string;
    order?: number;
    parentName?: string;
    path: string;
    requiredPolicy?: string;
    /** Badge content (number or text) to display at end of link in sidebar */
    badge?: ReactNode;
    /** Badge color palette (default: 'gray') */
    badgeColorPalette?: string;
  }

  export interface FullRoute extends Route {
    url?: string;
    wrapper?: boolean;
  }

  export interface BasicItem {
    id: string;
    name: string;
  }

  /**
   * Generic dictionary type for key-value pairs
   * @since 1.0.0
   */
  export interface Dictionary<T = any> {
    [key: string]: T;
  }
}
