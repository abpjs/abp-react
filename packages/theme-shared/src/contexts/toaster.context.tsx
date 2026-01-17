import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  useMemo,
  type ReactNode,
} from 'react';
import { Toaster } from '../models';

/**
 * Internal toast message with unique ID for tracking.
 */
interface InternalToast extends Toaster.Message {
  id: string;
}

/**
 * ToasterService interface - matches the Angular service API.
 */
export interface ToasterService {
  /** Show an info toast */
  info(message: string, title?: string, options?: Toaster.Options): Promise<Toaster.Status>;
  /** Show a success toast */
  success(message: string, title?: string, options?: Toaster.Options): Promise<Toaster.Status>;
  /** Show a warning toast */
  warn(message: string, title?: string, options?: Toaster.Options): Promise<Toaster.Status>;
  /** Show an error toast */
  error(message: string, title?: string, options?: Toaster.Options): Promise<Toaster.Status>;
  /** Add multiple messages at once */
  addAll(messages: Toaster.Message[]): void;
  /** Clear all toasts or a specific one by status */
  clear(status?: Toaster.Status): void;
  /** Remove a specific toast by ID */
  remove(id: string): void;
}

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
 */
let toastCounter = 0;

/**
 * Generate a unique ID for toasts.
 */
function generateId(): string {
  toastCounter += 1;
  return `toast-${Date.now()}-${toastCounter}-${Math.random().toString(36).substring(2, 9)}`;
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
  const resolversRef = useRef<Map<string, (status: Toaster.Status) => void>>(new Map());

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    // Resolve with dismiss status when removed
    const resolver = resolversRef.current.get(id);
    if (resolver) {
      resolver(Toaster.Status.dismiss);
      resolversRef.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (
      message: string,
      title: string | undefined,
      severity: Toaster.Severity,
      options?: Toaster.Options
    ): Promise<Toaster.Status> => {
      const id = options?.id?.toString() || generateId();
      const life = options?.sticky ? undefined : options?.life ?? DEFAULT_LIFE;

      const toast: InternalToast = {
        id,
        message,
        title,
        severity,
        ...options,
      };

      setToasts((prev) => [...prev, toast]);

      // Auto-dismiss after life duration
      if (life) {
        setTimeout(() => {
          remove(id);
        }, life);
      }

      // Return a promise that resolves when the toast is dismissed
      return new Promise<Toaster.Status>((resolve) => {
        resolversRef.current.set(id, resolve);
      });
    },
    [remove]
  );

  const info = useCallback(
    (message: string, title?: string, options?: Toaster.Options) => show(message, title, 'info', options),
    [show]
  );

  const success = useCallback(
    (message: string, title?: string, options?: Toaster.Options) => show(message, title, 'success', options),
    [show]
  );

  const warn = useCallback(
    (message: string, title?: string, options?: Toaster.Options) => show(message, title, 'warn', options),
    [show]
  );

  const error = useCallback(
    (message: string, title?: string, options?: Toaster.Options) => show(message, title, 'error', options),
    [show]
  );

  const addAll = useCallback(
    (messages: Toaster.Message[]) => {
      messages.forEach((msg) => {
        show(msg.message, msg.title, msg.severity, msg);
      });
    },
    [show]
  );

  const clear = useCallback((status?: Toaster.Status) => {
    setToasts((prev) => {
      prev.forEach((toast) => {
        const resolver = resolversRef.current.get(toast.id);
        if (resolver) {
          resolver(status ?? Toaster.Status.dismiss);
          resolversRef.current.delete(toast.id);
        }
      });
      return [];
    });
  }, []);

  const service = useMemo<ToasterService>(
    () => ({
      info,
      success,
      warn,
      error,
      addAll,
      clear,
      remove,
    }),
    [info, success, warn, error, addAll, clear, remove]
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
 * @example
 * ```tsx
 * function MyComponent() {
 *   const toaster = useToaster();
 *
 *   const handleSave = async () => {
 *     try {
 *       await saveData();
 *       toaster.success('Data saved successfully!', 'Success');
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
