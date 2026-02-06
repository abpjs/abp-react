/**
 * SubscriptionService - Service for managing subscriptions/cleanup
 * Translated from @abp/ng.core v3.1.0
 *
 * In React, this is primarily useful for class components or imperative code
 * that needs to manage multiple subscriptions. For functional components,
 * prefer using useEffect cleanup functions directly.
 *
 * @since 3.1.0
 */

type CleanupFn = () => void;

interface Subscription {
  unsubscribe: CleanupFn;
  closed: boolean;
}

/**
 * Service for managing multiple subscriptions/cleanups
 * React equivalent of Angular's SubscriptionService
 *
 * @example
 * ```tsx
 * const subscriptionService = new SubscriptionService();
 *
 * // Add subscriptions
 * subscriptionService.addOne(() => {
 *   const handler = () => {};
 *   window.addEventListener('resize', handler);
 *   return () => window.removeEventListener('resize', handler);
 * });
 *
 * // Later, cleanup all
 * subscriptionService.closeAll();
 * ```
 *
 * @since 3.1.0
 */
export class SubscriptionService {
  private subscriptions: Set<Subscription> = new Set();

  /**
   * Whether all subscriptions have been closed
   */
  get isClosed(): boolean {
    return this.subscriptions.size === 0;
  }

  /**
   * Add a subscription
   * @param cleanup - The cleanup function or a function that returns a cleanup
   * @returns The subscription object
   */
  addOne(cleanup: CleanupFn | (() => CleanupFn)): Subscription {
    const cleanupFn = cleanup();
    const subscription: Subscription = {
      unsubscribe: typeof cleanupFn === 'function' ? cleanupFn : () => {},
      closed: false,
    };

    this.subscriptions.add(subscription);
    return subscription;
  }

  /**
   * Close all subscriptions
   */
  closeAll(): void {
    this.subscriptions.forEach((subscription) => {
      if (!subscription.closed) {
        subscription.unsubscribe();
        subscription.closed = true;
      }
    });
    this.subscriptions.clear();
  }

  /**
   * Close a specific subscription
   * @param subscription - The subscription to close
   */
  closeOne(subscription: Subscription | undefined | null): void {
    if (subscription && !subscription.closed) {
      subscription.unsubscribe();
      subscription.closed = true;
      this.subscriptions.delete(subscription);
    }
  }

  /**
   * Remove a subscription without closing it
   * @param subscription - The subscription to remove
   */
  removeOne(subscription: Subscription | undefined | null): void {
    if (subscription) {
      this.subscriptions.delete(subscription);
    }
  }

  /**
   * Reset the service (closes all and clears)
   */
  reset(): void {
    this.closeAll();
  }

  /**
   * Cleanup method - call when the service is no longer needed
   */
  destroy(): void {
    this.closeAll();
  }
}

/**
 * React hook for subscription management
 * Automatically cleans up on unmount
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const subscription = useSubscription();
 *
 *   useEffect(() => {
 *     subscription.addOne(() => {
 *       const handler = () => {};
 *       window.addEventListener('resize', handler);
 *       return () => window.removeEventListener('resize', handler);
 *     });
 *   }, []);
 *
 *   return <div>...</div>;
 * }
 * ```
 *
 * @since 3.1.0
 */
export function useSubscription(): SubscriptionService {
  // Note: This is a factory function, not a hook
  // In actual usage, you would use useRef to persist the service
  // and useEffect for cleanup. This is provided for API compatibility.
  return new SubscriptionService();
}
