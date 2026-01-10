import { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { Rest } from '../models';

export interface RestError {
  status: number;
  message: string;
  error: any;
}

export class RestService {
  private axiosInstance: AxiosInstance;
  private getApiUrl: (key?: string) => string;
  private onError?: (error: RestError) => void;

  constructor(
    axiosInstance: AxiosInstance,
    getApiUrl: (key?: string) => string,
    onError?: (error: RestError) => void
  ) {
    this.axiosInstance = axiosInstance;
    this.getApiUrl = getApiUrl;
    this.onError = onError;
  }

  private handleError(err: AxiosError): never {
    const restError: RestError = {
      status: err.response?.status || 0,
      message: err.message,
      error: err.response?.data || err,
    };

    if (this.onError) {
      this.onError(restError);
    }

    console.error(err);
    throw restError;
  }

  async request<T, R = T>(
    request: Rest.Request<T>,
    config: Rest.Config = {},
    apiName?: string
  ): Promise<R> {
    const { throwErr = false, observe = Rest.Observe.Body } = config;
    const baseUrl = apiName ? this.getApiUrl(apiName) : this.getApiUrl();
    const url = `${baseUrl}${request.url}`;

    try {
      const response: AxiosResponse<R> = await this.axiosInstance.request({
        method: request.method,
        url,
        data: request.body,
        headers: request.headers as Record<string, string>,
        params: request.params,
        responseType: request.responseType,
        withCredentials: request.withCredentials,
        onUploadProgress: request.reportProgress
          ? () => {
              // Can be extended to emit progress events
            }
          : undefined,
      });

      if (observe === Rest.Observe.Response) {
        return response as any;
      }

      return response.data;
    } catch (err) {
      if (throwErr) {
        throw err;
      }
      return this.handleError(err as AxiosError);
    }
  }

  get<R>(url: string, config?: Rest.Config, apiName?: string): Promise<R> {
    return this.request<void, R>({ method: 'GET', url }, config, apiName);
  }

  post<T, R>(url: string, body: T, config?: Rest.Config, apiName?: string): Promise<R> {
    return this.request<T, R>({ method: 'POST', url, body }, config, apiName);
  }

  put<T, R>(url: string, body: T, config?: Rest.Config, apiName?: string): Promise<R> {
    return this.request<T, R>({ method: 'PUT', url, body }, config, apiName);
  }

  delete<R>(url: string, config?: Rest.Config, apiName?: string): Promise<R> {
    return this.request<void, R>({ method: 'DELETE', url }, config, apiName);
  }

  patch<T, R>(url: string, body: T, config?: Rest.Config, apiName?: string): Promise<R> {
    return this.request<T, R>({ method: 'PATCH', url, body }, config, apiName);
  }
}
