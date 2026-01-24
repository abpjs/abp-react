import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { loaderActions, LoaderPayload } from '../slices/loader.slice';
import { AppDispatch } from '../store';

export interface ApiInterceptorConfig {
  getAccessToken: () => string | null;
  getLanguage: () => string | null;
  /** Optional dispatch function to enable loader actions */
  dispatch?: AppDispatch;
}

/**
 * Creates axios request/response interceptors that:
 * - Add Authorization and Accept-Language headers
 * - Dispatch LoaderStart/LoaderStop actions if dispatch is provided
 *
 * Returns an object with interceptor IDs which can be used to eject (remove) the interceptors later.
 *
 * @param axiosInstance - The axios instance to add the interceptor to
 * @param config - Configuration with getter functions for token, language, and optional dispatch
 * @returns Object with request and response interceptor IDs
 */
export function createApiInterceptor(
  axiosInstance: AxiosInstance,
  config: ApiInterceptorConfig
): { requestId: number; responseId: number } {
  const requestId = axiosInstance.interceptors.request.use(
    (requestConfig: InternalAxiosRequestConfig) => {
      const token = config.getAccessToken();
      if (token && !requestConfig.headers.has('Authorization')) {
        requestConfig.headers.set('Authorization', `Bearer ${token}`);
      }

      const lang = config.getLanguage();
      if (lang && !requestConfig.headers.has('Accept-Language')) {
        requestConfig.headers.set('Accept-Language', lang);
      }

      // Dispatch LoaderStart if dispatch is available
      if (config.dispatch) {
        const payload: LoaderPayload = {
          url: requestConfig.url,
          method: requestConfig.method,
        };
        config.dispatch(loaderActions.start(payload));
      }

      return requestConfig;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const responseId = axiosInstance.interceptors.response.use(
    (response) => {
      // Dispatch LoaderStop on successful response
      if (config.dispatch) {
        const payload: LoaderPayload = {
          url: response.config.url,
          method: response.config.method,
        };
        config.dispatch(loaderActions.stop(payload));
      }
      return response;
    },
    (error) => {
      // Dispatch LoaderStop on error response
      if (config.dispatch && error.config) {
        const payload: LoaderPayload = {
          url: error.config.url,
          method: error.config.method,
        };
        config.dispatch(loaderActions.stop(payload));
      }
      return Promise.reject(error);
    }
  );

  return { requestId, responseId };
}
