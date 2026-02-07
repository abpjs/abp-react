/**
 * Configuration options for file management module
 * @since v3.2.0
 * @updated v4.0.0 - Added xsrfHeaderName option
 *
 * Translated from @volo/abp.ng.file-management/lib/models/config-options
 */

import type { DirectoryContentDto } from '../proxy/directories/models';
import type { eFileManagementComponents } from '../enums/components';

/**
 * Entity action contributor callback type
 */
export type EntityActionContributorCallback<T> = (actions: EntityAction<T>[]) => void;

/**
 * Entity prop contributor callback type
 */
export type EntityPropContributorCallback<T> = (props: EntityProp<T>[]) => void;

/**
 * Toolbar action contributor callback type
 */
export type ToolbarActionContributorCallback<T> = (actions: ToolbarAction<T>[]) => void;

/**
 * Entity action definition
 */
export interface EntityAction<T> {
  /**
   * Action text/label
   */
  text: string;
  /**
   * Action callback
   */
  action: (record: T) => void;
  /**
   * Optional permission check
   */
  permission?: string;
  /**
   * Optional visibility function
   */
  visible?: (record: T) => boolean;
  /**
   * Optional icon class
   */
  icon?: string;
}

/**
 * Entity prop definition
 */
export interface EntityProp<T> {
  /**
   * Property type
   */
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum';
  /**
   * Property name (key)
   */
  name: keyof T | string;
  /**
   * Display text/label
   */
  displayName: string;
  /**
   * Optional sort order
   */
  sortable?: boolean;
  /**
   * Optional visibility function
   */
  visible?: (record: T) => boolean;
  /**
   * Optional value template function
   */
  valueResolver?: (record: T) => string | number | boolean;
}

/**
 * Toolbar action definition
 */
export interface ToolbarAction<T> {
  /**
   * Action text/label
   */
  text: string;
  /**
   * Action callback
   */
  action: (data: T) => void;
  /**
   * Optional permission check
   */
  permission?: string;
  /**
   * Optional visibility function
   */
  visible?: (data: T) => boolean;
  /**
   * Optional icon class
   */
  icon?: string;
}

/**
 * Entity action contributors for file management
 */
export type FileManagementEntityActionContributors = Partial<{
  [eFileManagementComponents.FolderContent]: EntityActionContributorCallback<DirectoryContentDto>[];
}>;

/**
 * Toolbar action contributors for file management
 */
export type FileManagementToolbarActionContributors = Partial<{
  [eFileManagementComponents.FolderContent]: ToolbarActionContributorCallback<DirectoryContentDto[]>[];
}>;

/**
 * Entity prop contributors for file management
 */
export type FileManagementEntityPropContributors = Partial<{
  [eFileManagementComponents.FolderContent]: EntityPropContributorCallback<DirectoryContentDto>[];
}>;

/**
 * Configuration options for file management module
 */
export interface FileManagementConfigOptions {
  /**
   * Entity action contributors
   */
  entityActionContributors?: FileManagementEntityActionContributors;
  /**
   * Entity prop contributors
   */
  entityPropContributors?: FileManagementEntityPropContributors;
  /**
   * Toolbar action contributors (v3.2.0+)
   */
  toolbarActionContributors?: FileManagementToolbarActionContributors;
  /**
   * Custom XSRF header name for file uploads (v4.0.0+)
   */
  xsrfHeaderName?: string;
}
