import { useLayoutContext } from '../contexts/layout.context';
import { Layout } from '../models';

/**
 * Interface for the LayoutStateService.
 * Provides methods to access and modify layout state.
 *
 * @since 2.7.0
 * @deprecated This service was removed in Angular v3.0.0. Use NavItemsService from
 * @abpjs/theme-shared instead. This export is kept for backwards compatibility
 * and will be removed in a future version.
 *
 * @see {@link NavItemsService} from @abpjs/theme-shared
 */
export interface LayoutStateService {
  /**
   * Get all navigation elements from the layout state.
   * @returns Array of navigation elements
   */
  getNavigationElements(): Layout.NavigationElement[];

  /**
   * Dispatch action to add navigation elements.
   * Wraps the layout service's addNavigationElement method.
   *
   * @param elements - Single element or array of elements to add
   */
  dispatchAddNavigationElement(
    elements: Layout.NavigationElement | Layout.NavigationElement[]
  ): void;

  /**
   * Dispatch action to remove a navigation element by name.
   * Wraps the layout service's removeNavigationElement method.
   *
   * @param name - Name of the element to remove
   */
  dispatchRemoveNavigationElementByName(name: string): void;
}

/**
 * Hook to get the LayoutStateService.
 * Provides a service-like interface matching the Angular LayoutStateService.
 *
 * @since 2.7.0
 * @deprecated This hook was removed in Angular v3.0.0. Use NavItemsService from
 * @abpjs/theme-shared instead. This export is kept for backwards compatibility
 * and will be removed in a future version.
 *
 * @see {@link getNavItemsService} and {@link useNavItems} from @abpjs/theme-shared
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const layoutStateService = useLayoutStateService();
 *
 *   // Get current navigation elements
 *   const elements = layoutStateService.getNavigationElements();
 *
 *   // Add a new element
 *   layoutStateService.dispatchAddNavigationElement({
 *     name: 'MyElement',
 *     element: <MyNavItem />,
 *     order: 1,
 *   });
 *
 *   // Remove an element
 *   layoutStateService.dispatchRemoveNavigationElementByName('MyElement');
 * }
 * ```
 */
export function useLayoutStateService(): LayoutStateService {
  const { state, service } = useLayoutContext();

  return {
    getNavigationElements: () => state.navigationElements,
    dispatchAddNavigationElement: (elements) => service.addNavigationElement(elements),
    dispatchRemoveNavigationElementByName: (name) => service.removeNavigationElement(name),
  };
}
