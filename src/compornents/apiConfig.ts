const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';

export function resolveApiBaseUrl(): string {
  const configuredBaseUrl = process.env.REACT_APP_API_BASE_URL?.trim();
  return configuredBaseUrl ? configuredBaseUrl.replace(/\/+$/, '') : DEFAULT_API_BASE_URL;
}

export { DEFAULT_API_BASE_URL };
