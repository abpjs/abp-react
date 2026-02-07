/**
 * ReplaceableComponentsService
 * Translated from @abp/ng.core v3.2.0
 *
 * Provides a service for managing replaceable components.
 * This is the recommended approach for component replacement in v3.2.0+.
 *
 * @since 3.2.0
 */

import { ComponentType } from 'react';
import { ReplaceableComponents } from '../models/replaceable-components';

/**
 * Internal store for replaceable components
 */
let replaceableComponentsStore: ReplaceableComponents.ReplaceableComponent[] = [];
let updateListeners: Array<(components: ReplaceableComponents.ReplaceableComponent[]) => void> = [];

/**
 * Service for managing replaceable components
 * Use this instead of the deprecated AddReplaceableComponent action
 *
 * @since 3.2.0
 */
export class ReplaceableComponentsService {
  /**
   * Get all replaceable components
   */
  get replaceableComponents(): ReplaceableComponents.ReplaceableComponent[] {
    return [...replaceableComponentsStore];
  }

  /**
   * Add or replace a component
   * @param replaceableComponent - The component to add or replace
   * @param reload - Whether to reload the current route (no-op in React, included for API compatibility)
   * @since 3.2.0
   */
  add(
    replaceableComponent: ReplaceableComponents.ReplaceableComponent,
    reload: boolean = false
  ): void {
    const existingIndex = replaceableComponentsStore.findIndex(
      (c) => c.key === replaceableComponent.key
    );

    if (existingIndex >= 0) {
      // Replace existing component
      replaceableComponentsStore = [
        ...replaceableComponentsStore.slice(0, existingIndex),
        replaceableComponent,
        ...replaceableComponentsStore.slice(existingIndex + 1),
      ];
    } else {
      // Add new component
      replaceableComponentsStore = [...replaceableComponentsStore, replaceableComponent];
    }

    // Notify listeners
    this.notifyListeners();

    // In Angular, reload triggers a route reload
    // In React, this is typically handled by React's reactivity
    if (reload) {
      // Force a re-render by notifying listeners again
      // The actual route reload behavior would be handled by the consuming application
      console.debug('ReplaceableComponentsService: reload requested for', replaceableComponent.key);
    }
  }

  /**
   * Get a specific component by key
   * @param key - The component key to find
   * @returns The replaceable component or undefined
   * @since 3.2.0
   */
  get(key: string): ReplaceableComponents.ReplaceableComponent | undefined {
    return replaceableComponentsStore.find((c) => c.key === key);
  }

  /**
   * Get a component by key, returning the component type
   * @param key - The component key to find
   * @returns The component type or undefined
   * @since 3.2.0
   */
  getComponent<P = unknown>(key: string): ComponentType<P> | undefined {
    const component = this.get(key);
    return component?.component as ComponentType<P> | undefined;
  }

  /**
   * Subscribe to component updates
   * @param listener - Callback function called when components change
   * @returns Unsubscribe function
   * @since 3.2.0
   */
  onUpdate(
    listener: (components: ReplaceableComponents.ReplaceableComponent[]) => void
  ): () => void {
    updateListeners.push(listener);
    return () => {
      updateListeners = updateListeners.filter((l) => l !== listener);
    };
  }

  /**
   * Remove a component by key
   * @param key - The component key to remove
   * @since 3.2.0
   */
  remove(key: string): void {
    const existingIndex = replaceableComponentsStore.findIndex((c) => c.key === key);
    if (existingIndex >= 0) {
      replaceableComponentsStore = [
        ...replaceableComponentsStore.slice(0, existingIndex),
        ...replaceableComponentsStore.slice(existingIndex + 1),
      ];
      this.notifyListeners();
    }
  }

  /**
   * Clear all replaceable components
   * @internal Primarily for testing
   * @since 3.2.0
   */
  clear(): void {
    replaceableComponentsStore = [];
    this.notifyListeners();
  }

  private notifyListeners(): void {
    const components = this.replaceableComponents;
    updateListeners.forEach((listener) => listener(components));
  }
}

// Export a singleton instance for convenience
export const replaceableComponentsService = new ReplaceableComponentsService();

/**
 * React hook for using replaceable components
 * @param key - The component key to get
 * @param defaultComponent - The default component to use if no replacement is found
 * @returns The component to render
 * @since 3.2.0
 */
export function useReplaceableComponent<P = unknown>(
  key: string,
  defaultComponent: ComponentType<P>
): ComponentType<P> {
  const replacement = replaceableComponentsService.getComponent<P>(key);
  return replacement ?? defaultComponent;
}
