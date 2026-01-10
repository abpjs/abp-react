import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  useMemo,
  type ReactNode,
} from 'react';
import { Confirmation, Toaster } from '../models';

/**
 * Internal confirmation message structure.
 */
export interface ConfirmationMessage {
  /** Unique ID for this confirmation */
  id: string;
  /** Message content (can be localization key) */
  message: string;
  /** Title (can be localization key) */
  title?: string;
  /** Severity level affects the styling */
  severity: Toaster.Severity;
  /** Options for the confirmation */
  options: Confirmation.Options;
}

/**
 * ConfirmationService interface - matches the Angular service API.
 */
export interface ConfirmationService {
  /** Show an info confirmation */
  info(message: string, title?: string, options?: Confirmation.Options): Promise<Toaster.Status>;
  /** Show a success confirmation */
  success(message: string, title?: string, options?: Confirmation.Options): Promise<Toaster.Status>;
  /** Show a warning confirmation */
  warn(message: string, title?: string, options?: Confirmation.Options): Promise<Toaster.Status>;
  /** Show an error confirmation */
  error(message: string, title?: string, options?: Confirmation.Options): Promise<Toaster.Status>;
  /** Clear the current confirmation */
  clear(status?: Toaster.Status): void;
}

/**
 * Context value containing the service and current confirmation.
 */
export interface ConfirmationContextValue {
  service: ConfirmationService;
  confirmation: ConfirmationMessage | null;
  /** Respond to the current confirmation */
  respond: (status: Toaster.Status) => void;
}

const ConfirmationContext = createContext<ConfirmationContextValue | null>(null);

/**
 * Generate a unique ID for confirmations.
 */
function generateId(): string {
  return `confirmation-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export interface ConfirmationProviderProps {
  children: ReactNode;
}

/**
 * ConfirmationProvider - Provides confirmation dialog functionality.
 *
 * This is the React equivalent of Angular's ConfirmationService.
 * Wrap your app with this provider to enable confirmation dialogs.
 *
 * @example
 * ```tsx
 * <ConfirmationProvider>
 *   <App />
 *   <ConfirmationDialog />
 * </ConfirmationProvider>
 * ```
 */
export function ConfirmationProvider({ children }: ConfirmationProviderProps): React.ReactElement {
  const [confirmation, setConfirmation] = useState<ConfirmationMessage | null>(null);
  const resolverRef = useRef<((status: Toaster.Status) => void) | null>(null);

  const respond = useCallback((status: Toaster.Status) => {
    if (resolverRef.current) {
      resolverRef.current(status);
      resolverRef.current = null;
    }
    setConfirmation(null);
  }, []);

  const show = useCallback(
    (
      message: string,
      title: string | undefined,
      severity: Toaster.Severity,
      options: Confirmation.Options = {}
    ): Promise<Toaster.Status> => {
      // If there's already a confirmation, dismiss it first
      if (resolverRef.current) {
        resolverRef.current(Toaster.Status.dismiss);
      }

      const id = options.id?.toString() || generateId();

      const confirmationMessage: ConfirmationMessage = {
        id,
        message,
        title,
        severity,
        options,
      };

      setConfirmation(confirmationMessage);

      return new Promise<Toaster.Status>((resolve) => {
        resolverRef.current = resolve;
      });
    },
    []
  );

  const info = useCallback(
    (message: string, title?: string, options?: Confirmation.Options) =>
      show(message, title, 'info', options),
    [show]
  );

  const success = useCallback(
    (message: string, title?: string, options?: Confirmation.Options) =>
      show(message, title, 'success', options),
    [show]
  );

  const warn = useCallback(
    (message: string, title?: string, options?: Confirmation.Options) =>
      show(message, title, 'warn', options),
    [show]
  );

  const error = useCallback(
    (message: string, title?: string, options?: Confirmation.Options) =>
      show(message, title, 'error', options),
    [show]
  );

  const clear = useCallback(
    (status?: Toaster.Status) => {
      respond(status ?? Toaster.Status.dismiss);
    },
    [respond]
  );

  const service = useMemo<ConfirmationService>(
    () => ({
      info,
      success,
      warn,
      error,
      clear,
    }),
    [info, success, warn, error, clear]
  );

  const value = useMemo<ConfirmationContextValue>(
    () => ({ service, confirmation, respond }),
    [service, confirmation, respond]
  );

  return <ConfirmationContext.Provider value={value}>{children}</ConfirmationContext.Provider>;
}

/**
 * Hook to access the confirmation service.
 *
 * @returns ConfirmationService with methods to show confirmation dialogs
 * @throws Error if used outside of ConfirmationProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const confirmation = useConfirmation();
 *
 *   const handleDelete = async () => {
 *     const status = await confirmation.warn(
 *       'Are you sure you want to delete this item?',
 *       'Confirm Delete',
 *       { yesCopy: 'Delete', cancelCopy: 'Cancel' }
 *     );
 *
 *     if (status === Toaster.Status.confirm) {
 *       await deleteItem();
 *     }
 *   };
 *
 *   return <button onClick={handleDelete}>Delete</button>;
 * }
 * ```
 */
export function useConfirmation(): ConfirmationService {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context.service;
}

/**
 * Hook to access the current confirmation state.
 * This is typically used by the ConfirmationDialog component.
 *
 * @returns Current confirmation message and respond function
 */
export function useConfirmationState(): Pick<ConfirmationContextValue, 'confirmation' | 'respond'> {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmationState must be used within a ConfirmationProvider');
  }
  return { confirmation: context.confirmation, respond: context.respond };
}

/**
 * Hook to access the full confirmation context.
 *
 * @returns ConfirmationContextValue with service, confirmation, and respond
 */
export function useConfirmationContext(): ConfirmationContextValue {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmationContext must be used within a ConfirmationProvider');
  }
  return context;
}
