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
import type { LocalizationParam, Strict } from '@abpjs/core';
import { Toaster } from '../models';

/**
 * Internal toast with numeric ID for tracking.
 * @since 2.0.0 - Uses Toaster.Toast structure with numeric ID
 */
interface InternalToast extends Toaster.Toast {
  /** Numeric ID assigned by the service */
  id: number;
}

/**
 * Subscriber callback type for toasts$ observable pattern
 * @since 2.0.0
 */
type ToastsSubscriber = (toasts: Toaster.Toast[]) => void;

/**
 * ToasterService interface - matches the Angular service API.
 * @since 2.0.0 - Major changes:
 * - Methods now return number (toast ID) instead of Observable<Status>
 * - Added toasts$ ReplaySubject pattern via subscribe method
 * - Removed addAll method (use show directly)
 * @since 4.0.0 - Methods use LocalizationParam, return Toaster.ToasterId
 */
export interface ToasterService {
  /**
   * Creates an info toast with given parameters.
   * @param message Content of the toast
   * @param title Title of the toast
   * @param options Specific style or structural options for individual toast
   * @returns Toast ID
   */
  info(message: LocalizationParam, title?: LocalizationParam, options?: Partial<Toaster.ToastOptions>): Toaster.ToasterId;
  /**
   * Creates a success toast with given parameters.
   * @param message Content of the toast
   * @param title Title of the toast
   * @param options Specific style or structural options for individual toast
   * @returns Toast ID
   */
  success(message: LocalizationParam, title?: LocalizationParam, options?: Partial<Toaster.ToastOptions>): Toaster.ToasterId;
  /**
   * Creates a warning toast with given parameters.
   * @param message Content of the toast
   * @param title Title of the toast
   * @param options Specific style or structural options for individual toast
   * @returns Toast ID
   */
  warn(message: LocalizationParam, title?: LocalizationParam, options?: Partial<Toaster.ToastOptions>): Toaster.ToasterId;
  /**
   * Creates an error toast with given parameters.
   * @param message Content of the toast
   * @param title Title of the toast
   * @param options Specific style or structural options for individual toast
   * @returns Toast ID
   */
  error(message: LocalizationParam, title?: LocalizationParam, options?: Partial<Toaster.ToastOptions>): Toaster.ToasterId;
  /**
   * Creates a toast with given parameters.
   * @param message Content of the toast
   * @param title Title of the toast
   * @param severity Sets color of the toast. "success", "warning" etc.
   * @param options Specific style or structural options for individual toast
   * @returns Toast ID
   */
  show(message: LocalizationParam, title?: LocalizationParam, severity?: Toaster.Severity, options?: Partial<Toaster.ToastOptions>): Toaster.ToasterId;
  /**
   * Removes the toast with given id.
   * @param id ID of the toast to be removed.
   */
  remove(id: number): void;
  /**
   * Removes all open toasts at once.
   * @param containerKey Optional container key to clear toasts from specific container
   * @since 4.0.0 - Renamed parameter from key to containerKey
   */
  clear(containerKey?: string): void;
  /**
   * Subscribe to toast updates (mimics RxJS ReplaySubject pattern).
   * @param subscriber Callback function called with current toasts
   * @returns Unsubscribe function
   */
  subscribe(subscriber: ToastsSubscriber): () => void;
}

/**
 * Type constraint ensuring ToasterService satisfies the Toaster.Service contract.
 * @since 4.0.0
 */
export type ToasterContract = Strict<ToasterService, Toaster.Service>;

/**
 * Context value containing the service and current toasts.
 */
export interface ToasterContextValue {
  service: ToasterService;
  toasts: InternalToast[];
}

const ToasterContext = createContext<ToasterContextValue | null>(null);

/**
 * Counter for generating unique toast IDs.
 * @since 2.0.0 - Changed to number for consistency with Angular
 */
let toastCounter = 0;

/**
 * Generate a unique numeric ID for toasts.
 * @since 2.0.0 - Returns number instead of string
 */
function generateId(): number {
  toastCounter += 1;
  return toastCounter;
}

/**
 * Default toast lifetime in milliseconds.
 */
const DEFAULT_LIFE = 5000;

export interface ToasterProviderProps {
  children: ReactNode;
}

/**
 * ToasterProvider - Provides toast notification functionality.
 *
 * This is the React equivalent of Angular's ToasterService.
 * Wrap your app with this provider to enable toast notifications.
 *
 * @since 2.0.0 - Major changes:
 * - Methods now return number (toast ID) instead of Promise<Status>
 * - Added subscribe method for observable pattern
 * - Severity 'warn' changed to 'warning'
 *
 * @example
 * ```tsx
 * <ToasterProvider>
 *   <App />
 *   <ToastContainer />
 * </ToasterProvider>
 * ```
 */
export function ToasterProvider({ children }: ToasterProviderProps): React.ReactElement {
  const [toasts, setToasts] = useState<InternalToast[]>([]);
  const subscribersRef = useRef<Set<ToastsSubscriber>>(new Set());

  // Notify all subscribers when toasts change
  useEffect(() => {
    subscribersRef.current.forEach((subscriber) => {
      subscriber(toasts);
    });
  }, [toasts]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (
      message: LocalizationParam,
      title?: LocalizationParam,
      severity: Toaster.Severity = 'info',
      options?: Partial<Toaster.ToastOptions>
    ): Toaster.ToasterId => {
      const id = typeof options?.id === 'number' ? options.id : generateId();
      const life = options?.sticky ? undefined : options?.life ?? DEFAULT_LIFE;

      const toast: InternalToast = {
        id,
        message,
        title,
        severity,
        options: {
          ...options,
          id,
        },
      };

      setToasts((prev) => [...prev, toast]);

      // Auto-dismiss after life duration
      if (life) {
        setTimeout(() => {
          remove(id);
        }, life);
      }

      return id;
    },
    [remove]
  );

  const info = useCallback(
    (message: LocalizationParam, title?: LocalizationParam, options?: Partial<Toaster.ToastOptions>) =>
      show(message, title, 'info', options),
    [show]
  );

  const success = useCallback(
    (message: LocalizationParam, title?: LocalizationParam, options?: Partial<Toaster.ToastOptions>) =>
      show(message, title, 'success', options),
    [show]
  );

  const warn = useCallback(
    (message: LocalizationParam, title?: LocalizationParam, options?: Partial<Toaster.ToastOptions>) =>
      show(message, title, 'warning', options),
    [show]
  );

  const error = useCallback(
    (message: LocalizationParam, title?: LocalizationParam, options?: Partial<Toaster.ToastOptions>) =>
      show(message, title, 'error', options),
    [show]
  );

  const clear = useCallback((containerKey?: string) => {
    setToasts((prev) => {
      if (containerKey) {
        return prev.filter((toast) => toast.options?.containerKey !== containerKey);
      }
      return [];
    });
  }, []);

  const subscribe = useCallback((subscriber: ToastsSubscriber): (() => void) => {
    subscribersRef.current.add(subscriber);
    // Immediately notify with current toasts (ReplaySubject behavior)
    subscriber(toasts);
    return () => {
      subscribersRef.current.delete(subscriber);
    };
  }, [toasts]);

  const service = useMemo<ToasterService>(
    () => ({
      info,
      success,
      warn,
      error,
      show,
      remove,
      clear,
      subscribe,
    }),
    [info, success, warn, error, show, remove, clear, subscribe]
  );

  const value = useMemo<ToasterContextValue>(
    () => ({ service, toasts }),
    [service, toasts]
  );

  return <ToasterContext.Provider value={value}>{children}</ToasterContext.Provider>;
}

/**
 * Hook to access the toaster service.
 *
 * @returns ToasterService with methods to show toast notifications
 * @throws Error if used outside of ToasterProvider
 *
 * @since 2.0.0 - Service methods now return number (toast ID)
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const toaster = useToaster();
 *
 *   const handleSave = async () => {
 *     try {
 *       await saveData();
 *       const toastId = toaster.success('Data saved successfully!', 'Success');
 *       // Can later remove: toaster.remove(toastId);
 *     } catch (error) {
 *       toaster.error('Failed to save data', 'Error');
 *     }
 *   };
 *
 *   return <button onClick={handleSave}>Save</button>;
 * }
 * ```
 */
export function useToaster(): ToasterService {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToaster must be used within a ToasterProvider');
  }
  return context.service;
}

/**
 * Hook to access the current toasts (for rendering).
 * This is typically used by the ToastContainer component.
 *
 * @returns Array of current toast messages
 */
export function useToasts(): InternalToast[] {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToasts must be used within a ToasterProvider');
  }
  return context.toasts;
}

/**
 * Hook to access both the service and toasts.
 *
 * @returns ToasterContextValue with service and toasts
 */
export function useToasterContext(): ToasterContextValue {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToasterContext must be used within a ToasterProvider');
  }
  return context;
}
