import { ReactNode } from 'react';
import { Config } from './config';
import { eLayoutType } from '../enums';

export namespace ABP {
  export interface Root {
    environment: Partial<Config.Environment>;
    requirements: Config.Requirements;
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
}
