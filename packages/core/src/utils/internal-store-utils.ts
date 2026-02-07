/**
 * Internal Store Utilities
 * Translated from @abp/ng.core v3.2.0
 *
 * Provides a simple internal store pattern for managing state
 * outside of React/Redux contexts.
 *
 * @since 3.2.0
 */

import { DeepPartial } from '../models/utility';

/**
 * Listener function type for state updates
 */
type StateListener<T> = (state: T) => void;
type UpdateListener<T> = (update: DeepPartial<T>) => void;

/**
 * InternalStore - A simple state management class for internal use
 *
 * This provides a lightweight alternative to full state management
 * when you need to manage state outside of React components.
 *
 * @since 3.2.0
 */
export class InternalStore<State extends object> {
  private _state: State;
  private stateListeners: StateListener<State>[] = [];
  private updateListeners: UpdateListener<State>[] = [];

  /**
   * Get the current state
   */
  get state(): State {
    return { ...this._state };
  }

  constructor(private initialState: State) {
    this._state = { ...initialState };
  }

  /**
   * Subscribe to a slice of state with optional comparison function
   * @param selector - Function to select a slice of state
   * @param compareFn - Optional comparison function (defaults to strict equality)
   * @returns Function to call with state that will only notify if the slice changed
   * @since 3.2.0
   */
  sliceState<Slice>(
    selector: (state: State) => Slice,
    compareFn: (s1: Slice, s2: Slice) => boolean = (s1, s2) => s1 === s2
  ): {
    subscribe: (listener: (slice: Slice) => void) => () => void;
    get: () => Slice;
  } {
    let lastSlice = selector(this._state);

    return {
      subscribe: (listener: (slice: Slice) => void) => {
        const wrappedListener = (state: State) => {
          const newSlice = selector(state);
          if (!compareFn(lastSlice, newSlice)) {
            lastSlice = newSlice;
            listener(newSlice);
          }
        };
        this.stateListeners.push(wrappedListener);
        return () => {
          this.stateListeners = this.stateListeners.filter((l) => l !== wrappedListener);
        };
      },
      get: () => selector(this._state),
    };
  }

  /**
   * Subscribe to updates (partial state changes) with optional filter
   * @param selector - Function to select a slice from the update
   * @param filterFn - Optional filter function
   * @returns Subscription utilities
   * @since 3.2.0
   */
  sliceUpdate<Slice>(
    selector: (state: DeepPartial<State>) => Slice,
    filterFn: (x: Slice) => boolean = () => true
  ): {
    subscribe: (listener: (slice: Slice) => void) => () => void;
  } {
    return {
      subscribe: (listener: (slice: Slice) => void) => {
        const wrappedListener = (update: DeepPartial<State>) => {
          const slice = selector(update);
          if (filterFn(slice)) {
            listener(slice);
          }
        };
        this.updateListeners.push(wrappedListener);
        return () => {
          this.updateListeners = this.updateListeners.filter((l) => l !== wrappedListener);
        };
      },
    };
  }

  /**
   * Patch the state with partial updates
   * @param state - Partial state to merge
   * @since 3.2.0
   */
  patch(state: DeepPartial<State>): void {
    this._state = this.deepMerge(this._state, state);

    // Notify update listeners
    this.updateListeners.forEach((listener) => listener(state));

    // Notify state listeners
    this.stateListeners.forEach((listener) => listener(this._state));
  }

  /**
   * Reset the store to initial state
   * @since 3.2.0
   */
  reset(): void {
    this._state = { ...this.initialState };
    this.stateListeners.forEach((listener) => listener(this._state));
  }

  /**
   * Subscribe to state changes
   * @param listener - Function called when state changes
   * @returns Unsubscribe function
   * @since 3.2.0
   */
  subscribe(listener: StateListener<State>): () => void {
    this.stateListeners.push(listener);
    return () => {
      this.stateListeners = this.stateListeners.filter((l) => l !== listener);
    };
  }

  /**
   * Deep merge utility for state updates
   */
  private deepMerge<T extends object>(target: T, source: DeepPartial<T>): T {
    const result = { ...target };

    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key];
        const targetValue = target[key];

        if (
          sourceValue !== null &&
          typeof sourceValue === 'object' &&
          !Array.isArray(sourceValue) &&
          targetValue !== null &&
          typeof targetValue === 'object' &&
          !Array.isArray(targetValue)
        ) {
          (result as Record<string, unknown>)[key] = this.deepMerge(
            targetValue as object,
            sourceValue as DeepPartial<object>
          );
        } else {
          (result as Record<string, unknown>)[key] = sourceValue;
        }
      }
    }

    return result;
  }
}
