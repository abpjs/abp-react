import { useCallback, useState } from 'react';
import { useConfirmation } from '../contexts/confirmation.context';
import { Confirmation } from '../models';
import { ErrorComponentProps } from '../components/errors/ErrorComponent';

// Optional navigation function type
type NavigateFunction = (to: string) => void;

/**
 * HTTP error response structure (matching ABP error format).
 */
export interface HttpErrorResponse {
  status: number;
  statusText?: string;
  error?: {
    error?: {
      message?: string;
      details?: string;
      code?: string;
      validationErrors?: Array<{
        message: string;
        members: string[];
      }>;
    };
  };
}

/**
 * Error component instance configuration.
 */
export interface ErrorComponentInstance {
  title: string;
  details: string;
}

/**
 * Error handler interface.
 * @since 3.0.0 - showError now returns Confirmation.Status instead of Toaster.Status
 */
export interface ErrorHandler {
  /** Handle an HTTP error response */
  handleError: (error: HttpErrorResponse) => Promise<void>;
  /** Show an error message in a confirmation dialog */
  showError: (message: string, title?: string) => Promise<Confirmation.Status>;
  /** Navigate to the login page */
  navigateToLogin: () => void;
  /** Create error component props for full-page error display */
  createErrorComponent: (instance: Partial<ErrorComponentInstance>) => ErrorComponentProps;
  /** Current error component props (null if no error) */
  errorComponentProps: ErrorComponentProps | null;
  /** Clear the current error component */
  clearErrorComponent: () => void;
}

/**
 * Default error messages for common HTTP status codes.
 */
const DEFAULT_ERROR_MESSAGES: Record<number, string> = {
  400: 'AbpUi::DefaultErrorMessage400',
  401: 'AbpUi::DefaultErrorMessage401',
  403: 'AbpUi::DefaultErrorMessage403',
  404: 'AbpUi::DefaultErrorMessage404',
  500: 'AbpUi::DefaultErrorMessage500',
  503: 'AbpUi::DefaultErrorMessage503',
};

export interface UseErrorHandlerOptions {
  /**
   * Custom navigate function. If not provided, navigation to login will be a no-op.
   * Pass `useNavigate()` from react-router-dom if you want navigation support.
   */
  navigate?: NavigateFunction;
  /**
   * Custom login path. Defaults to '/account/login'.
   */
  loginPath?: string;
}

/**
 * useErrorHandler - Hook for global error handling.
 *
 * This is the React equivalent of Angular's ErrorHandler service.
 * It provides methods to handle HTTP errors and display error dialogs.
 *
 * @param options - Optional configuration including navigate function
 *
 * @example
 * ```tsx
 * import { useNavigate } from 'react-router-dom';
 *
 * function MyComponent() {
 *   const navigate = useNavigate();
 *   const errorHandler = useErrorHandler({ navigate });
 *
 *   const handleApiCall = async () => {
 *     try {
 *       await fetchData();
 *     } catch (error) {
 *       await errorHandler.handleError(error as HttpErrorResponse);
 *     }
 *   };
 *
 *   return <button onClick={handleApiCall}>Fetch</button>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Without navigation (will only show error dialogs)
 * function MyComponent() {
 *   const errorHandler = useErrorHandler();
 *   // 401 errors will show dialog but won't redirect
 * }
 * ```
 */
export function useErrorHandler(options: UseErrorHandlerOptions = {}): ErrorHandler {
  const { navigate, loginPath = '/account/login' } = options;
  const confirmation = useConfirmation();
  const [errorComponentProps, setErrorComponentProps] = useState<ErrorComponentProps | null>(null);

  const navigateToLogin = useCallback(() => {
    if (navigate) {
      navigate(loginPath);
    }
    // If no navigate function provided, silently skip navigation
    // The component should handle this case appropriately
  }, [navigate, loginPath]);

  const showError = useCallback(
    async (message: string, title?: string): Promise<Confirmation.Status> => {
      return confirmation.error(message, title || 'AbpUi::Error');
    },
    [confirmation]
  );

  const clearErrorComponent = useCallback(() => {
    setErrorComponentProps(null);
  }, []);

  const createErrorComponent = useCallback(
    (instance: Partial<ErrorComponentInstance>): ErrorComponentProps => {
      const props: ErrorComponentProps = {
        title: instance.title || 'Error',
        details: instance.details || 'An error has occurred.',
        onDestroy: clearErrorComponent,
        showCloseButton: true,
      };
      setErrorComponentProps(props);
      return props;
    },
    [clearErrorComponent]
  );

  const handleError = useCallback(
    async (error: HttpErrorResponse): Promise<void> => {
      // Handle 401 Unauthorized - redirect to login
      if (error.status === 401) {
        navigateToLogin();
        return;
      }

      // Extract error message from the response
      let message = error.error?.error?.message;
      let title = 'AbpUi::Error';

      // If no message in response, use default message for status code
      if (!message) {
        message = DEFAULT_ERROR_MESSAGES[error.status] || 'AbpUi::DefaultErrorMessage';
      }

      // Handle validation errors
      const validationErrors = error.error?.error?.validationErrors;
      if (validationErrors && validationErrors.length > 0) {
        message = validationErrors.map((e) => e.message).join('\n');
        title = 'AbpUi::ValidationError';
      }

      // Show error confirmation dialog
      await showError(message, title);
    },
    [navigateToLogin, showError]
  );

  return {
    handleError,
    showError,
    navigateToLogin,
    createErrorComponent,
    errorComponentProps,
    clearErrorComponent,
  };
}

/**
 * createErrorInterceptor - Creates an axios response error interceptor.
 *
 * This can be used to set up global error handling for axios.
 *
 * @param errorHandler - The error handler to use
 * @returns An error interceptor function
 *
 * @example
 * ```tsx
 * function SetupInterceptors() {
 *   const errorHandler = useErrorHandler();
 *
 *   useEffect(() => {
 *     const interceptor = axios.interceptors.response.use(
 *       (response) => response,
 *       createErrorInterceptor(errorHandler)
 *     );
 *
 *     return () => {
 *       axios.interceptors.response.eject(interceptor);
 *     };
 *   }, [errorHandler]);
 *
 *   return null;
 * }
 * ```
 */
export function createErrorInterceptor(
  errorHandler: ErrorHandler
): (error: unknown) => Promise<never> {
  return async (error: unknown) => {
    if (isHttpErrorResponse(error)) {
      await errorHandler.handleError(error);
    }
    return Promise.reject(error);
  };
}

/**
 * Type guard to check if an error is an HttpErrorResponse.
 */
function isHttpErrorResponse(error: unknown): error is HttpErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as HttpErrorResponse).status === 'number'
  );
}

export default useErrorHandler;
