/**
 * Setting Management State Service
 * Translated from @abp/ng.setting-management v3.0.0
 *
 * This service provides state management for setting tabs,
 * equivalent to the Angular NGXS SettingManagementState.
 *
 * @updated 3.0.0 - Changed state to use undefined instead of null
 */

import type { SettingManagement, SettingTab } from '../models';

/**
 * State service for managing setting management state.
 * Provides methods equivalent to Angular's NGXS state selectors and actions.
 *
 * @since 1.1.0
 * @updated 3.0.0 - Uses undefined instead of null for selectedTab
 */
export class SettingManagementStateService {
  private _state: SettingManagement.State = {
    selectedTab: undefined,
  };

  private _subscribers: Set<() => void> = new Set();

  /**
   * Get the currently selected setting tab
   * Equivalent to Angular's @Selector() getSelectedTab
   * @since 3.0.0 - Returns SettingTab | undefined instead of SettingTab | null
   */
  getSelectedTab(): SettingTab | undefined {
    return this._state.selectedTab;
  }

  /**
   * Set the selected setting tab
   * Equivalent to Angular's SetSelectedSettingTab action
   * @param tab The setting tab to select
   * @since 3.0.0 - Accepts SettingTab | undefined instead of SettingTab | null
   */
  setSelectedTab(tab: SettingTab | undefined): void {
    this._state = {
      ...this._state,
      selectedTab: tab,
    };
    this.notifySubscribers();
  }

  /**
   * Get the current state
   */
  getState(): SettingManagement.State {
    return { ...this._state };
  }

  /**
   * Reset the state to initial values
   */
  reset(): void {
    this._state = {
      selectedTab: undefined,
    };
    this.notifySubscribers();
  }

  /**
   * Subscribe to state changes
   * @param callback Function to call when state changes
   * @returns Unsubscribe function
   */
  subscribe(callback: () => void): () => void {
    this._subscribers.add(callback);
    return () => {
      this._subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    this._subscribers.forEach((callback) => callback());
  }
}

// Singleton instance
let _stateInstance: SettingManagementStateService | null = null;

/**
 * Get the singleton instance of SettingManagementStateService
 * @since 1.1.0
 */
export function getSettingManagementStateService(): SettingManagementStateService {
  if (!_stateInstance) {
    _stateInstance = new SettingManagementStateService();
  }
  return _stateInstance;
}
