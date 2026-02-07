import type { AccountManageProfileTabName } from '../config/enums/manage-profile-tab-names';
import { eAccountManageProfileTabNames } from '../config/enums/manage-profile-tab-names';

/**
 * Tab definition for manage profile tabs
 * @since 3.2.0
 * @deprecated To be deleted in v5.0. ManageProfileTabsService was removed from Angular config/services in v4.0.0.
 */
export interface ManageProfileTab {
  /**
   * Unique key for the tab
   */
  key: string;

  /**
   * Display name/label for the tab (localization key)
   */
  name: AccountManageProfileTabName;

  /**
   * Order priority for tab display (lower numbers appear first)
   */
  order: number;

  /**
   * Component to render for this tab
   */
  component: React.ComponentType;

  /**
   * Whether this tab is visible
   * @default true
   */
  visible?: boolean;
}

/**
 * Input for adding a new manage profile tab
 * @since 3.2.0
 */
export interface AddManageProfileTabInput {
  /**
   * Unique key for the tab
   */
  key: string;

  /**
   * Display name/label for the tab (localization key)
   */
  name: AccountManageProfileTabName | string;

  /**
   * Order priority for tab display (lower numbers appear first)
   */
  order: number;

  /**
   * Component to render for this tab
   */
  component: React.ComponentType;

  /**
   * Whether this tab is visible
   * @default true
   */
  visible?: boolean;
}

/**
 * ManageProfileTabsService - Service for managing profile tabs
 *
 * This is the React equivalent of Angular's ManageProfileTabsService from @volo/abp.ng.account.
 * Provides methods for adding, removing, and managing profile tabs in the ManageProfile component.
 *
 * @example
 * ```typescript
 * import { getManageProfileTabsService } from '@abpjs/account-pro';
 *
 * const tabsService = getManageProfileTabsService();
 *
 * // Add a custom tab
 * tabsService.addTab({
 *   key: 'custom-tab',
 *   name: 'My Custom Tab',
 *   order: 50,
 *   component: MyCustomComponent,
 * });
 *
 * // Get all visible tabs
 * const tabs = tabsService.getVisibleTabs();
 * ```
 *
 * @since 3.2.0
 */
export class ManageProfileTabsService {
  private tabs: Map<string, ManageProfileTab> = new Map();

  constructor() {
    // Initialize with default tabs - these will be populated by components
    // that register themselves during module initialization
  }

  /**
   * Add a new tab to the manage profile page
   *
   * @param input - The tab configuration
   */
  addTab(input: AddManageProfileTabInput): void {
    this.tabs.set(input.key, {
      key: input.key,
      name: input.name as AccountManageProfileTabName,
      order: input.order,
      component: input.component,
      visible: input.visible ?? true,
    });
  }

  /**
   * Remove a tab by key
   *
   * @param key - The unique key of the tab to remove
   * @returns true if the tab was removed, false if it didn't exist
   */
  removeTab(key: string): boolean {
    return this.tabs.delete(key);
  }

  /**
   * Get a tab by key
   *
   * @param key - The unique key of the tab
   * @returns The tab configuration or undefined if not found
   */
  getTab(key: string): ManageProfileTab | undefined {
    return this.tabs.get(key);
  }

  /**
   * Get all registered tabs
   *
   * @returns Array of all tabs sorted by order
   */
  getTabs(): ManageProfileTab[] {
    return Array.from(this.tabs.values()).sort((a, b) => a.order - b.order);
  }

  /**
   * Get all visible tabs
   *
   * @returns Array of visible tabs sorted by order
   */
  getVisibleTabs(): ManageProfileTab[] {
    return this.getTabs().filter((tab) => tab.visible !== false);
  }

  /**
   * Update tab visibility
   *
   * @param key - The unique key of the tab
   * @param visible - Whether the tab should be visible
   * @returns true if the tab was updated, false if it didn't exist
   */
  setTabVisibility(key: string, visible: boolean): boolean {
    const tab = this.tabs.get(key);
    if (tab) {
      tab.visible = visible;
      return true;
    }
    return false;
  }

  /**
   * Update tab order
   *
   * @param key - The unique key of the tab
   * @param order - The new order priority
   * @returns true if the tab was updated, false if it didn't exist
   */
  setTabOrder(key: string, order: number): boolean {
    const tab = this.tabs.get(key);
    if (tab) {
      tab.order = order;
      return true;
    }
    return false;
  }

  /**
   * Check if a tab exists
   *
   * @param key - The unique key of the tab
   * @returns true if the tab exists
   */
  hasTab(key: string): boolean {
    return this.tabs.has(key);
  }

  /**
   * Clear all tabs
   */
  clearTabs(): void {
    this.tabs.clear();
  }
}

// Singleton instance
let manageProfileTabsServiceInstance: ManageProfileTabsService | null = null;

/**
 * Get the singleton ManageProfileTabsService instance
 *
 * @returns The ManageProfileTabsService instance
 * @since 3.2.0
 */
export function getManageProfileTabsService(): ManageProfileTabsService {
  if (!manageProfileTabsServiceInstance) {
    manageProfileTabsServiceInstance = new ManageProfileTabsService();
  }
  return manageProfileTabsServiceInstance;
}

/**
 * Default tab providers for manage profile
 * These are the standard tabs provided by the Account Pro module
 * @since 3.2.0
 */
export const ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS = {
  /**
   * Profile picture tab configuration key
   */
  PROFILE_PICTURE: 'profile-picture',

  /**
   * Change password tab configuration key
   */
  CHANGE_PASSWORD: 'change-password',

  /**
   * Personal settings tab configuration key
   */
  PERSONAL_SETTINGS: 'personal-settings',

  /**
   * Two-factor authentication tab configuration key
   */
  TWO_FACTOR: 'two-factor',
} as const;

/**
 * Default tab orders for manage profile tabs
 * @since 3.2.0
 */
export const ACCOUNT_MANAGE_PROFILE_TAB_ORDERS = {
  [ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.PROFILE_PICTURE]: 10,
  [ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.CHANGE_PASSWORD]: 20,
  [ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.PERSONAL_SETTINGS]: 30,
  [ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.TWO_FACTOR]: 40,
} as const;

/**
 * Default tab names for manage profile tabs
 * @since 3.2.0
 */
export const ACCOUNT_MANAGE_PROFILE_TAB_NAMES = {
  [ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.PROFILE_PICTURE]:
    eAccountManageProfileTabNames.ProfilePicture,
  [ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.CHANGE_PASSWORD]:
    eAccountManageProfileTabNames.ChangePassword,
  [ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.PERSONAL_SETTINGS]:
    eAccountManageProfileTabNames.PersonalSettings,
  [ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.TWO_FACTOR]:
    eAccountManageProfileTabNames.TwoFactor,
} as const;
