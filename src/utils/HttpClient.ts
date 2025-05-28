import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import qs from 'qs';
import { getStorageToken, parsedToken, setStorageToken } from './AuthHelper';
import DateTime from './DateTime';
import { __BASEURL__ } from '@/config';
import { ACCESS_TOKEN } from '@/constants/auth';
import { NotificationContextValue } from '@/contexts/Notification';

const accessToken = parsedToken(ACCESS_TOKEN);
const config: AxiosRequestConfig = {

  baseURL: __BASEURL__,
  headers: {
    'Content-Type': 'application/json',
    TimeZone: DateTime.TimeZone(),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  },
  timeout: 10 * 60 * 1000,
  paramsSerializer: (params) => qs.stringify(params, { skipNulls: true }),
};

class Axios {
  private isRefreshing = false;
  private instance: AxiosInstance;
  private failedQueue: Array<{ resolve: Function; reject: Function }> = [];
  private setLogout: (() => void) | null = null;
  private notify?: NotificationContextValue

  constructor() {
    const instance = axios.create(config);

    // Request interceptor
    instance.interceptors.request.use(
      (config) => {
        const accessToken = parsedToken(ACCESS_TOKEN);
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },

      (error) => Promise.reject(error),
    );

    // Response interceptor
    instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        const { response, config } = error;

        if (response?.status === 401 && !this.isRefreshing && !config?.url?.includes('/auth/login')) {
          return this.handleTokenRefresh(error);
        }

        return Promise.reject(error);
      },
    );

    this.instance = instance;
  }

  async handleTokenRefresh(error: AxiosError) {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (!this.isRefreshing) {
      this.isRefreshing = true;

      try {
        const refreshToken = getStorageToken.refreshToken;
        const result = await axios.post(import.meta.env.VITE_API_BASE_URL + "/auth/refresh-tokens", {
          // headers: {
          //   Authorization: `Bearer ` + refreshToken,
          // },
          refreshToken: refreshToken
        });
        const { data } = result.data;

        setStorageToken().accessToken(data.accessToken);
        const newToken = data.accessToken;

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          this.failedQueue.forEach((req) => req.resolve(newToken));
          this.failedQueue = [];

          return this.instance(originalRequest);
        }
      } catch (refreshError) {

        this.failedQueue.forEach((req) => req.reject(refreshError));
        this.failedQueue = [];

        if (this.setLogout && this.notify) {
          this.notify({
            error: 'Phiên đăng nhập đã hết hạn. Mời bạn đăng nhập lại',
            onForward: this.setLogout,
            alertProps: { severity: 'error' },
            snackbarProps: { autoHideDuration: null },
          })
        }

        return Promise.reject(refreshError);
      } finally {
        this.isRefreshing = false;
      }
    } else {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      }).then((token: any) => {
        if (originalRequest) {
          originalRequest.headers.Authorization = `Bearer ${token.access_token}`;
          return this.instance(originalRequest);
        }
      });
    }
  }

  public get Instance(): AxiosInstance {
    return this.instance;
  }

  public post<D = any>(url: string): Promise<D>;
  public post<D = any, R = any>(url: string, data: D, config?: AxiosRequestConfig<D>): Promise<R>;
  public post<D = any, R = any>(
    url: string,
    data: D,
    config: AxiosRequestConfig<D> & { integrity: true },
  ): Promise<AxiosResponse<R, D>>;
  public post<D, R>(url: string, data?: D, config: any = {}): Promise<unknown> {
    const { integrity, ...rest } = config;
    return new Promise((resolve, reject) => {
      this.Instance.post<D, AxiosResponse<R>>(url, data, rest)
        .then((response) => resolve(integrity ? response : response.data))
        .catch((error: AxiosError) => reject(error.response?.data));
    });
  }

  public get<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    return new Promise((resolve, reject) => {
      this.Instance.get<T, AxiosResponse<R>, D>(url, config)
        .then((response) => resolve(response.data))
        .catch((error: AxiosError) => {
          reject(error.response?.data);
        });
    });
  }

  public put<D = any, R = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return new Promise((resolve, reject) => {
      this.Instance.put<D, AxiosResponse<R>>(url, data, config)
        .then((response) => resolve(response.data))
        .catch((error: AxiosError) => reject(error.response?.data));
    });
  }

  public patch<D = any, R = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    return new Promise((resolve, reject) => {
      this.Instance.patch<D, AxiosResponse<R>>(url, data, config)
        .then((response) => resolve(response.data))
        .catch((error: AxiosError) => reject(error.response?.data));
    });
  }

  // Delete
  public delete<D = any, R = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    return new Promise((resolve, reject) => {
      this.Instance.delete<D, AxiosResponse<R>>(url, config)
        .then((response) => resolve(response.data))
        .catch((error: AxiosError) => reject(error.response?.data));
    });
  }
}

const HttpClient = new Axios();
export default HttpClient;