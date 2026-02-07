import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react';
import type { LocalizationParam } from '@abpjs/core';
import { Confirmation } from '../models';

/**
 * Subscriber callback type for confirmation$ observable pattern
 * @since 2.0.0
 */
type ConfirmationSubscriber = (data: Confirmation.DialogData | null) => void;

/**
 * ConfirmationService interface - matches the Angular service API.
 * @since 2.0.0 - Major changes:
 * - No longer extends AbstractToaster
 * - Added confirmation$ ReplaySubject pattern via subscribe method
 * - Now accepts LocalizationParam for message and title
 *
 * @since 2.1.0 - Changed from Toaster.Status to Confirmation.Status
 */
export interface ConfirmationService {
  /**
   * Show an info confirmation
   * @param message Message content (supports localization)
   * @param title Title (supports localization)
   * @param options Confirmation options
   * @returns Promise resolving to user's response status
   */
  info(message: LocalizationParam, title?: LocalizationParam, options?: Partial<Confirmation.Options>): Promise<Confirmation.Status>;
  /**
   * Show a success confirmation
   * @param message Message content (supports localization)
   * @param title Title (supports localization)
   * @param options Confirmation options
   * @returns Promise resolving to user's response status
   */
  success(message: LocalizationParam, title?: LocalizationParam, options?: Partial<Confirmation.Options>): Promise<Confirmation.Status>;
  /**
   * Show a warning confirmation
   * @param message Message content (supports localization)
   * @param title Title (supports localization)
   * @param options Confirmation options
   * @returns Promise resolving to user's response status
   */
  warn(message: LocalizationParam, title?: LocalizationParam, options?: Partial<Confirmation.Options>): Promise<Confirmation.Status>;
  /**
   * Show an error confirmation
   * @param message Message content (supports localization)
   * @param title Title (supports localization)
   * @param options Confirmation options
   * @returns Promise resolving to user's response status
   */
  error(message: LocalizationParam, title?: LocalizationParam, options?: Partial<Confirmation.Options>): Promise<Confirmation.Status>;
  /**
   * Show a confirmation with specified severity
   * @param message Message content (supports localization)
   * @param title Title (supports localization)
   * @param severity Severity level for styling
   * @param options Confirmation options
   * @returns Promise resolving to user's response status
   * @since 2.0.0
   * @since 2.1.0 - Uses Confirmation.Severity instead of Toaster.Severity
   */
  show(message: LocalizationParam, title?: LocalizationParam, severity?: Confirmation.Severity, options?: Partial<Confirmation.Options>): Promise<Confirmation.Status>;
  /**
   * Clear the current confirmation
   * @param status Optional status to resolve with (default: dismiss)
   * @since 2.1.0 - Uses Confirmation.Status instead of Toaster.Status
   */
  clear(status?: Confirmation.Status): void;
  /**
   * Listen for escape key to dismiss confirmation
   * @since 2.0.0
   */
  listenToEscape(): void;
  /**
   * Subscribe to confirmation updates (mimics RxJS ReplaySubject pattern).
   * @param subscriber Callback function called with current confirmation data
   * @returns Unsubscribe function
   * @since 2.0.0
   */
  subscribe(subscriber: ConfirmationSubscriber): () => void;
}

/**
 * Context value containing the service and current confirmation.
 * @since 2.1.0 - respond uses Confirmation.Status instead of Toaster.Status
 */
export interface ConfirmationContextValue {
  service: ConfirmationService;
  /** Current confirmation dialog data */
  confirmation: Confirmation.DialogData | null;
  /** Respond to the current confirmation */
  respond: (status: Confirmation.Status) => void;
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
 * @since 2.0.0 - Major changes:
 * - Now accepts LocalizationParam for message and title
 * - Added subscribe method for observable pattern
 * - Added listenToEscape method
 * - Uses Confirmation.DialogData structure
 *
 * @since 2.1.0 - Uses Confirmation.Status instead of Toaster.Status
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
  const [confirmation, setConfirmation] = useState<Confirmation.DialogData | null>(null);
  const resolverRef = useRef<((status: Confirmation.Status) => void) | null>(null);
  const subscribersRef = useRef<Set<ConfirmationSubscriber>>(new Set());
  const escapeListenerRef = useRef<boolean>(false);

  // Notify all subscribers when confirmation changes
  useEffect(() => {
    subscribersRef.current.forEach((subscriber) => {
      subscriber(confirmation);
    });
  }, [confirmation]);

  const respond = useCallback((status: Confirmation.Status) => {
    if (resolverRef.current) {
      resolverRef.current(status);
      resolverRef.current = null;
    }
    setConfirmation(null);
  }, []);

  // Handle escape key press
  useEffect(() => {
    if (!escapeListenerRef.current) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && confirmation && confirmation.options?.dismissible !== false) {
        respond(Confirmation.Status.dismiss);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [confirmation, respond]);

  const show = useCallback(
    (
      message: LocalizationParam,
      title?: LocalizationParam,
      severity: Confirmation.Severity = 'neutral',
      options: Partial<Confirmation.Options> = {}
    ): Promise<Confirmation.Status> => {
      // If there's already a confirmation, dismiss it first
      if (resolverRef.current) {
        resolverRef.current(Confirmation.Status.dismiss);
      }

      const id = options.id?.toString() || generateId();

      const dialogData: Confirmation.DialogData = {
        message,
        title,
        severity,
        options: {
          ...options,
          id,
        },
      };

      setConfirmation(dialogData);

      return new Promise<Confirmation.Status>((resolve) => {
        resolverRef.current = resolve;
      });
    },
    []
  );

  const info = useCallback(
    (message: LocalizationParam, title?: LocalizationParam, options?: Partial<Confirmation.Options>) =>
      show(message, title, 'info', options),
    [show]
  );

  const success = useCallback(
    (message: LocalizationParam, title?: LocalizationParam, options?: Partial<Confirmation.Options>) =>
      show(message, title, 'success', options),
    [show]
  );

  const warn = useCallback(
    (message: LocalizationParam, title?: LocalizationParam, options?: Partial<Confirmation.Options>) =>
      show(message, title, 'warning', options),
    [show]
  );

  const error = useCallback(
    (message: LocalizationParam, title?: LocalizationParam, options?: Partial<Confirmation.Options>) =>
      show(message, title, 'error', options),
    [show]
  );

  const clear = useCallback(
    (status?: Confirmation.Status) => {
      respond(status ?? Confirmation.Status.dismiss);
    },
    [respond]
  );

  const listenToEscape = useCallback(() => {
    escapeListenerRef.current = true;
  }, []);

  const subscribe = useCallback((subscriber: ConfirmationSubscriber): (() => void) => {
    subscribersRef.current.add(subscriber);
    // Immediately notify with current confirmation (ReplaySubject behavior)
    subscriber(confirmation);
    return () => {
      subscribersRef.current.delete(subscriber);
    };
  }, [confirmation]);

  const service = useMemo<ConfirmationService>(
    () => ({
      info,
      success,
      warn,
      error,
      show,
      clear,
      listenToEscape,
      subscribe,
    }),
    [info, success, warn, error, show, clear, listenToEscape, subscribe]
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
 * @since 2.0.0 - Service now accepts LocalizationParam
 * @since 2.1.0 - Uses Confirmation.Status instead of Toaster.Status
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
 *       { yesText: 'Delete', cancelText: 'Cancel' }
 *     );
 *
 *     if (status === Confirmation.Status.confirm) {
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
 * @returns Current confirmation data and respond function
 * @since 2.1.0 - respond uses Confirmation.Status
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
