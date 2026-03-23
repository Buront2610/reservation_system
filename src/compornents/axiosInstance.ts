import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { resolveApiBaseUrl } from './apiConfig';

type AuthStorage = Pick<Storage, 'getItem' | 'removeItem'>;

const USER_STORAGE_KEY = 'user';
const LOGIN_TIMESTAMP_STORAGE_KEY = 'loginTimeStamp';

export function clearStoredAuth(storage: AuthStorage = window.localStorage): void {
  storage.removeItem(USER_STORAGE_KEY);
  storage.removeItem(LOGIN_TIMESTAMP_STORAGE_KEY);
}

export function getStoredAuthToken(storage: AuthStorage = window.localStorage): string | null {
  const storedUser = storage.getItem(USER_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(storedUser);
    return typeof parsedUser?.token === 'string' && parsedUser.token !== '' ? parsedUser.token : null;
  } catch (error) {
    clearStoredAuth(storage);
    return null;
  }
}

export function applyAuthorizationHeader(
  config: InternalAxiosRequestConfig,
  storage: AuthStorage = window.localStorage,
): InternalAxiosRequestConfig {
  const token = getStoredAuthToken(storage);

  if (token) {
    if (!config.headers) {
      config.headers = {} as InternalAxiosRequestConfig['headers'];
    }

    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  return config;
}

export function handleApiResponseError(
  error: AxiosError | { response?: { status?: number } },
  storage: AuthStorage = window.localStorage,
): Promise<never> {
  if (error.response?.status === 401) {
    clearStoredAuth(storage);
  }

  return Promise.reject(error);
}

const axiosInstance = axios.create({
  baseURL: resolveApiBaseUrl(),
});

axiosInstance.interceptors.request.use(
  (config) => applyAuthorizationHeader(config),
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => handleApiResponseError(error),
);

export default axiosInstance;
