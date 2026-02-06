/**
 * Nav Items Utility
 * Translated from @abp/ng.theme.shared/lib/utils/nav-items.ts
 *
 * Provides functions for managing navigation items dynamically.
 *
 * @since 2.9.0
 */

import { ComponentType } from 'react';

/**
 * Navigation item configuration.
 * @since 2.9.0
 */
export interface NavItem {
  /**
   * React component to render for this nav item.
   */
  component?: ComponentType<any>;
  /**
   * Raw HTML string to render (use with caution for XSS).
   */
  html?: string;
  /**
   * Action to execute when the nav item is clicked.
   */
  action?: () => void;
  /**
   * Order for sorting nav items. Lower numbers appear first.
   */
  order?: number;
  /**
   * Permission required to show this nav item.
   */
  permission?: string;
}

// Internal storage for nav items
let navItems: NavItem[] = [];

// Subscribers for nav item changes
type NavItemSubscriber = (items: NavItem[]) => void;
const subscribers: Set<NavItemSubscriber> = new Set();

/**
 * Add a navigation item.
 * @param item - The nav item to add
 * @since 2.9.0
 *
 * @example
 * ```tsx
 * addNavItem({
 *   component: MyComponent,
 *   order: 10,
 *   permission: 'AbpIdentity.Users',
 * });
 * ```
 */
export function addNavItem(item: NavItem): void {
  navItems = [...navItems, item].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  notifySubscribers();
}

/**
 * Remove a navigation item.
 * @param item - The nav item to remove
 * @since 2.9.0
 */
export function removeNavItem(item: NavItem): void {
  navItems = navItems.filter((i) => i !== item);
  notifySubscribers();
}

/**
 * Clear all navigation items.
 * @since 2.9.0
 */
export function clearNavItems(): void {
  navItems = [];
  notifySubscribers();
}

/**
 * Get current navigation items.
 * @returns Array of nav items
 * @since 2.9.0
 */
export function getNavItemsSync(): NavItem[] {
  return [...navItems];
}

/**
 * Subscribe to navigation item changes.
 * Returns an unsubscribe function.
 *
 * @param callback - Function to call when nav items change
 * @returns Unsubscribe function
 * @since 2.9.0
 *
 * @example
 * ```tsx
 * const unsubscribe = subscribeToNavItems((items) => {
 *   console.log('Nav items changed:', items);
 * });
 *
 * // Later, to unsubscribe:
 * unsubscribe();
 * ```
 */
export function subscribeToNavItems(callback: NavItemSubscriber): () => void {
  subscribers.add(callback);
  // Immediately call with current items
  callback([...navItems]);

  return () => {
    subscribers.delete(callback);
  };
}

/**
 * Notify all subscribers of nav item changes.
 */
function notifySubscribers(): void {
  const currentItems = [...navItems];
  subscribers.forEach((callback) => callback(currentItems));
}

/**
 * Get navigation items as an observable-like interface.
 * Compatible with Angular's Observable pattern.
 *
 * @returns Object with subscribe method
 * @since 2.9.0
 *
 * @example
 * ```tsx
 * const subscription = getNavItems().subscribe((items) => {
 *   console.log('Nav items:', items);
 * });
 *
 * // Later, to unsubscribe:
 * subscription.unsubscribe();
 * ```
 */
export function getNavItems(): { subscribe: (callback: NavItemSubscriber) => { unsubscribe: () => void } } {
  return {
    subscribe: (callback: NavItemSubscriber) => {
      const unsubscribe = subscribeToNavItems(callback);
      return { unsubscribe };
    },
  };
}
