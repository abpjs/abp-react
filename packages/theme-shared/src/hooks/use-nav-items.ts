/**
 * useNavItems Hook
 * @since 3.0.0
 *
 * React hook for subscribing to NavItemsService changes.
 */

import { useState, useEffect } from 'react';
import { NavItem } from '../models/nav-item';
import { getNavItemsService, NavItemsService } from '../services/nav-items.service';

/**
 * Hook to subscribe to nav items from NavItemsService.
 * Returns the current sorted array of nav items.
 *
 * @param service - Optional NavItemsService instance (defaults to singleton)
 * @returns Array of NavItem objects, sorted by order
 *
 * @since 3.0.0
 *
 * @example
 * ```tsx
 * function MyNavComponent() {
 *   const navItems = useNavItems();
 *
 *   return (
 *     <ul>
 *       {navItems.map((item) => (
 *         <li key={item.id}>{item.id}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useNavItems(service?: NavItemsService): NavItem[] {
  const navItemsService = service || getNavItemsService();
  const [items, setItems] = useState<NavItem[]>(navItemsService.items);

  useEffect(() => {
    const unsubscribe = navItemsService.subscribe(setItems);
    return unsubscribe;
  }, [navItemsService]);

  return items;
}
