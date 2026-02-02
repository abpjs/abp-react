import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  useMemo,
  type ReactNode,
  type ReactElement,
} from 'react';

/**
 * Modal template render function type.
 * @since 2.7.0
 */
export type ModalTemplateRender<T = unknown> = (context?: T) => ReactElement | null;

/**
 * Modal state containing the current template and context.
 * @since 2.7.0
 */
export interface ModalState<T = unknown> {
  /** The render function for the modal content */
  render: ModalTemplateRender<T>;
  /** Context passed to the render function */
  context?: T;
}

/**
 * ModalService interface - matches the Angular service API.
 *
 * In Angular, ModalService uses ContentProjectionService to render templates
 * in a container. In React, we use context and state to manage modal content.
 *
 * @since 2.7.0
 */
export interface ModalService {
  /**
   * Render a template in the modal container.
   * @param render - Function that returns the modal content
   * @param context - Optional context to pass to the render function
   * @since 2.7.0
   */
  renderTemplate<T = unknown>(render: ModalTemplateRender<T>, context?: T): void;
  /**
   * Clear the current modal.
   * @since 2.7.0
   */
  clearModal(): void;
  /**
   * Get the container ref for the modal.
   * In React, this returns a ref to the container element.
   * @since 2.7.0
   */
  getContainer(): React.RefObject<HTMLDivElement | null>;
  /**
   * Trigger a re-render of the modal content.
   * In React, this forces a state update.
   * @since 2.7.0
   */
  detectChanges(): void;
}

/**
 * Context value containing the service and current modal state.
 * @since 2.7.0
 */
export interface ModalContextValue {
  service: ModalService;
  /** Current modal state */
  modalState: ModalState | null;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export interface ModalProviderProps {
  children: ReactNode;
}

/**
 * ModalProvider - Provides modal service functionality.
 *
 * This is the React equivalent of Angular's ModalService.
 * Wrap your app with this provider to enable modal service functionality.
 *
 * @since 2.7.0
 *
 * @example
 * ```tsx
 * <ModalProvider>
 *   <App />
 *   <ModalContainer />
 * </ModalProvider>
 * ```
 */
export function ModalProvider({ children }: ModalProviderProps): ReactElement {
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const [, setUpdateCounter] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const renderTemplate = useCallback(<T,>(render: ModalTemplateRender<T>, context?: T): void => {
    setModalState({ render: render as ModalTemplateRender, context });
  }, []);

  const clearModal = useCallback((): void => {
    setModalState(null);
  }, []);

  const getContainer = useCallback((): React.RefObject<HTMLDivElement | null> => {
    return containerRef;
  }, []);

  const detectChanges = useCallback((): void => {
    // Force a re-render by incrementing a counter
    setUpdateCounter((prev) => prev + 1);
  }, []);

  const service = useMemo<ModalService>(
    () => ({
      renderTemplate,
      clearModal,
      getContainer,
      detectChanges,
    }),
    [renderTemplate, clearModal, getContainer, detectChanges]
  );

  const value = useMemo<ModalContextValue>(
    () => ({ service, modalState }),
    [service, modalState]
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      {/* Container for modal content */}
      <div ref={containerRef} id="modal-container" />
    </ModalContext.Provider>
  );
}

/**
 * Hook to access the modal service.
 *
 * @returns ModalService with methods to manage modal content
 * @throws Error if used outside of ModalProvider
 *
 * @since 2.7.0
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const modal = useModal();
 *
 *   const openModal = () => {
 *     modal.renderTemplate((context) => (
 *       <Dialog open onClose={() => modal.clearModal()}>
 *         <DialogContent>Hello {context?.name}</DialogContent>
 *       </Dialog>
 *     ), { name: 'World' });
 *   };
 *
 *   return <button onClick={openModal}>Open Modal</button>;
 * }
 * ```
 */
export function useModal(): ModalService {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context.service;
}

/**
 * Hook to access the current modal state.
 * This is typically used by the ModalContainer component.
 *
 * @returns Current modal state or null
 * @since 2.7.0
 */
export function useModalState(): ModalState | null {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalState must be used within a ModalProvider');
  }
  return context.modalState;
}

/**
 * Hook to access the full modal context.
 *
 * @returns ModalContextValue with service and modal state
 * @since 2.7.0
 */
export function useModalContext(): ModalContextValue {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
}

/**
 * ModalContainer component - renders the current modal content.
 * Place this component once in your app to display modal content.
 *
 * @since 2.7.0
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ModalProvider>
 *       <MainContent />
 *       <ModalContainer />
 *     </ModalProvider>
 *   );
 * }
 * ```
 */
export function ModalContainer(): ReactElement | null {
  const modalState = useModalState();

  if (!modalState) {
    return null;
  }

  return modalState.render(modalState.context);
}
