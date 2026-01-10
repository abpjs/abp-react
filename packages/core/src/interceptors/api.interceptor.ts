import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export interface ApiInterceptorConfig {
  getAccessToken: () => string | null;
  getLanguage: () => string | null;
}

/**
 * Creates an axios request interceptor that adds Authorization and Accept-Language headers.
 * Returns the interceptor ID which can be used to eject (remove) the interceptor later.
 *
 * @param axiosInstance - The axios instance to add the interceptor to
 * @param config - Configuration with getter functions for token and language
 * @returns The interceptor ID for later removal via axiosInstance.interceptors.request.eject(id)
 */
export function createApiInterceptor(
  axiosInstance: AxiosInstance,
  config: ApiInterceptorConfig
): number {
  return axiosInstance.interceptors.request.use(
    (requestConfig: InternalAxiosRequestConfig) => {
      const token = config.getAccessToken();
      if (token && !requestConfig.headers.has('Authorization')) {
        requestConfig.headers.set('Authorization', `Bearer ${token}`);
      }

      const lang = config.getLanguage();
      if (lang && !requestConfig.headers.has('Accept-Language')) {
        requestConfig.headers.set('Accept-Language', lang);
      }

      return requestConfig;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}
