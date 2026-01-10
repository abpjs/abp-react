import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Layout } from '../models';

/**
 * Service interface for managing layout navigation elements.
 * Translated from NGXS LayoutState actions.
 */
export interface LayoutService {
  /**
   * Add one or more navigation elements to the layout.
   * Duplicate names are ignored.
   * @param elements - Single element or array of elements to add
   */
  addNavigationElement: (
    elements: Layout.NavigationElement | Layout.NavigationElement[]
  ) => void;

  /**
   * Remove a navigation element by name.
   * @param name - Name of the element to remove
   */
  removeNavigationElement: (name: string) => void;

  /**
   * Clear all navigation elements.
   */
  clearNavigationElements: () => void;
}

/**
 * Context value containing both the state and service.
 */
export interface LayoutContextValue {
  /** Current layout state */
  state: Layout.State;
  /** Service for modifying layout state */
  service: LayoutService;
}

const LayoutContext = createContext<LayoutContextValue | null>(null);

export interface LayoutProviderProps {
  children: ReactNode;
}

/**
 * Provider component for layout state management.
 * Replaces NGXS LayoutState from Angular.
 *
 * @example
 * ```tsx
 * <LayoutProvider>
 *   <App />
 * </LayoutProvider>
 * ```
 */
export function LayoutProvider({ children }: LayoutProviderProps): React.ReactElement {
  const [navigationElements, setNavigationElements] = useState<Layout.NavigationElement[]>([]);

  const addNavigationElement = useCallback(
    (elements: Layout.NavigationElement | Layout.NavigationElement[]) => {
      const payloadArray = Array.isArray(elements) ? elements : [elements];

      setNavigationElements((prev) => {
        // Filter out elements that already exist by name
        const newElements = payloadArray.filter(
          ({ name }) => prev.findIndex((nav) => nav.name === name) < 0
        );

        if (newElements.length === 0) {
          return prev;
        }

        // Merge, set default order, and sort
        const merged = [...prev, ...newElements]
          .map((element) => ({
            ...element,
            order: element.order ?? 99,
          }))
          .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

        return merged;
      });
    },
    []
  );

  const removeNavigationElement = useCallback((name: string) => {
    setNavigationElements((prev) => prev.filter((el) => el.name !== name));
  }, []);

  const clearNavigationElements = useCallback(() => {
    setNavigationElements([]);
  }, []);

  const state: Layout.State = useMemo(
    () => ({
      navigationElements,
    }),
    [navigationElements]
  );

  const service: LayoutService = useMemo(
    () => ({
      addNavigationElement,
      removeNavigationElement,
      clearNavigationElements,
    }),
    [addNavigationElement, removeNavigationElement, clearNavigationElements]
  );

  const contextValue: LayoutContextValue = useMemo(
    () => ({
      state,
      service,
    }),
    [state, service]
  );

  return <LayoutContext.Provider value={contextValue}>{children}</LayoutContext.Provider>;
}

/**
 * Hook to access the full layout context (state and service).
 * @throws Error if used outside of LayoutProvider
 */
export function useLayoutContext(): LayoutContextValue {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayoutContext must be used within a LayoutProvider');
  }
  return context;
}

/**
 * Hook to access just the layout service for modifying state.
 */
export function useLayoutService(): LayoutService {
  return useLayoutContext().service;
}

/**
 * Hook to access the current navigation elements.
 */
export function useNavigationElements(): Layout.NavigationElement[] {
  return useLayoutContext().state.navigationElements;
}
