/**
 * Nav Items Service
 * Translated from @abp/ng.theme.shared/lib/services/nav-items.service.ts v3.1.0
 *
 * Provides a service-based approach to managing navigation items,
 * replacing the utility functions approach from v2.9.0.
 *
 * @since 3.0.0
 * @since 3.1.0 - Updated addItems parameter name to newItems for clarity
 */

import { NavItem, NavItemProps } from '../models/nav-item';

/**
 * NavItemsService manages navigation items with reactive updates.
 * This is a singleton service that provides methods to add, remove, and patch nav items.
 *
 * @since 3.0.0 - Replaces the nav-items utility functions
 *
 * @example
 * ```tsx
 * const navItemsService = NavItemsService.getInstance();
 *
 * // Add items
 * navItemsService.addItems([
 *   { id: 'profile', component: ProfileComponent, order: 1 },
 *   { id: 'settings', component: SettingsComponent, order: 2 },
 * ]);
 *
 * // Subscribe to changes
 * const unsubscribe = navItemsService.subscribe((items) => {
 *   console.log('Items changed:', items);
 * });
 *
 * // Remove an item
 * navItemsService.removeItem('profile');
 *
 * // Patch an item
 * navItemsService.patchItem('settings', { order: 10 });
 * ```
 */
export class NavItemsService {
  private static _instance: NavItemsService | null = null;
  private _items: NavItem[] = [];
  private _listeners: Set<(items: NavItem[]) => void> = new Set();

  /**
   * Get singleton instance
   * @since 3.0.0
   */
  static getInstance(): NavItemsService {
    if (!NavItemsService._instance) {
      NavItemsService._instance = new NavItemsService();
    }
    return NavItemsService._instance;
  }

  /**
   * Reset the singleton instance (useful for testing)
   * @internal
   */
  static resetInstance(): void {
    NavItemsService._instance = null;
  }

  /**
   * Get current items (sorted by order)
   * @since 3.0.0
   */
  get items(): NavItem[] {
    return [...this._items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  /**
   * Subscribe to item changes.
   * Returns an unsubscribe function.
   *
   * @param listener - Callback function to receive item updates
   * @returns Unsubscribe function
   * @since 3.0.0
   */
  subscribe(listener: (items: NavItem[]) => void): () => void {
    this._listeners.add(listener);
    // Immediately notify with current items
    listener(this.items);

    return () => {
      this._listeners.delete(listener);
    };
  }

  /**
   * Get items as an observable-like interface.
   * Compatible with Angular's Observable pattern.
   *
   * @returns Object with subscribe method
   * @since 3.0.0
   */
  get items$(): { subscribe: (callback: (items: NavItem[]) => void) => { unsubscribe: () => void } } {
    return {
      subscribe: (callback: (items: NavItem[]) => void) => {
        const unsubscribe = this.subscribe(callback);
        return { unsubscribe };
      },
    };
  }

  /**
   * Add one or more items.
   * Items are automatically sorted by order.
   *
   * @param newItems - Array of items to add
   * @since 3.0.0
   * @since 3.1.0 - Renamed parameter from items to newItems
   */
  addItems(newItems: (NavItem | NavItemProps)[]): void {
    // Filter out items that already exist
    const existingIds = new Set(this._items.map((item) => item.id));
    const itemsToAdd = newItems
      .filter((item) => !existingIds.has(item.id))
      .map((item) => (item instanceof NavItem ? item : new NavItem(item)));

    this._items = [...this._items, ...itemsToAdd];
    this.notify();
  }

  /**
   * Remove an item by id.
   *
   * @param id - The id of the item to remove
   * @since 3.0.0
   */
  removeItem(id: string | number): void {
    const initialLength = this._items.length;
    this._items = this._items.filter((item) => item.id !== id);

    if (this._items.length !== initialLength) {
      this.notify();
    }
  }

  /**
   * Patch an existing item by id.
   * Updates only the specified properties.
   *
   * @param id - The id of the item to patch
   * @param patch - Partial item data to merge
   * @since 3.0.0
   */
  patchItem(id: string | number, patch: Partial<Omit<NavItem, 'id'>>): void {
    const index = this._items.findIndex((item) => item.id === id);

    if (index !== -1) {
      this._items = [
        ...this._items.slice(0, index),
        { ...this._items[index], ...patch },
        ...this._items.slice(index + 1),
      ];
      this.notify();
    }
  }

  /**
   * Clear all items.
   * @since 3.0.0
   */
  clear(): void {
    if (this._items.length > 0) {
      this._items = [];
      this.notify();
    }
  }

  /**
   * Notify all listeners of changes.
   */
  private notify(): void {
    const currentItems = this.items;
    this._listeners.forEach((listener) => listener(currentItems));
  }
}

/**
 * Get the NavItemsService singleton.
 * @since 3.0.0
 */
export function getNavItemsService(): NavItemsService {
  return NavItemsService.getInstance();
}
