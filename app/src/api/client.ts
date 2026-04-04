const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

// Store for the auth token — set this when the user logs in
let authToken: string | null = null;

export const setAuthToken = (token: string | null): void => {
  authToken = token;
};

interface RequestOptions extends RequestInit {
  timeout?: number;
}

const request = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { timeout = 10000, headers, ...rest } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  const mergedHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(headers as Record<string, string>),
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...rest,
      headers: mergedHeaders,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API Error:', response.status, errorBody);
      throw new Error(`HTTP ${response.status}: ${errorBody}`);
    }

    return response.json() as Promise<T>;
  } finally {
    clearTimeout(timer);
  }
};

const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'GET', ...options }),

  post: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
    }),

  put: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...options,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'DELETE', ...options }),
};

export default apiClient;
