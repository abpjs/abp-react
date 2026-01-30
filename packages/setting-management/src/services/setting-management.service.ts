/**
 * Setting Management Service
 * Translated from @abp/ng.setting-management v0.9.0
 */

import type { SettingTab } from '@abpjs/theme-shared';

/**
 * Service for managing settings tabs and selection.
 * This service maintains the list of registered setting tabs
 * and tracks the currently selected tab.
 */
export class SettingManagementService {
  private _settings: SettingTab[] = [];
  private _selected: SettingTab | null = null;
  private _subscribers: Set<() => void> = new Set();

  /**
   * Get all registered settings tabs sorted by order
   */
  get settings(): SettingTab[] {
    return [...this._settings].sort((a, b) => a.order - b.order);
  }

  /**
   * Get the currently selected setting tab
   */
  get selected(): SettingTab | null {
    return this._selected;
  }

  /**
   * Register a new setting tab
   * @param tab The setting tab to register
   */
  addSetting(tab: SettingTab): void {
    const exists = this._settings.some((s) => s.name === tab.name);
    if (!exists) {
      this._settings.push(tab);
      this.notifySubscribers();
    }
  }

  /**
   * Register multiple setting tabs at once
   * @param tabs Array of setting tabs to register
   */
  addSettings(tabs: SettingTab[]): void {
    let changed = false;
    for (const tab of tabs) {
      const exists = this._settings.some((s) => s.name === tab.name);
      if (!exists) {
        this._settings.push(tab);
        changed = true;
      }
    }
    if (changed) {
      this.notifySubscribers();
    }
  }

  /**
   * Remove a setting tab by name
   * @param name The name of the setting tab to remove
   */
  removeSetting(name: string): void {
    const index = this._settings.findIndex((s) => s.name === name);
    if (index !== -1) {
      this._settings.splice(index, 1);
      // If we removed the selected tab, clear selection
      if (this._selected?.name === name) {
        this._selected = null;
      }
      this.notifySubscribers();
    }
  }

  /**
   * Set the currently selected setting tab
   * @param tab The tab to select (or null to clear selection)
   */
  setSelected(tab: SettingTab | null): void {
    this._selected = tab;
    this.notifySubscribers();
  }

  /**
   * Select a setting tab by name
   * @param name The name of the tab to select
   */
  selectByName(name: string): void {
    const tab = this._settings.find((s) => s.name === name);
    if (tab) {
      this.setSelected(tab);
    }
  }

  /**
   * Select a setting tab by URL
   * @param url The URL of the tab to select
   */
  selectByUrl(url: string): void {
    const tab = this._settings.find((s) => s.url === url);
    if (tab) {
      this.setSelected(tab);
    }
  }

  /**
   * Clear all registered settings
   */
  clearSettings(): void {
    this._settings = [];
    this._selected = null;
    this.notifySubscribers();
  }

  /**
   * Subscribe to changes in settings or selection
   * @param callback Function to call when changes occur
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

// Singleton instance for global state management
let _instance: SettingManagementService | null = null;

/**
 * Get the singleton instance of SettingManagementService
 */
export function getSettingManagementService(): SettingManagementService {
  if (!_instance) {
    _instance = new SettingManagementService();
  }
  return _instance;
}
