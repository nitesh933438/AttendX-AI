// AttendX AI - API Service Layer

import { logger } from '../lib/logger';

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

export class APIError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

async function request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options;

  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const token = localStorage.getItem('attendx_jwt_token');

  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...customConfig,
  };

  try {
    logger.debug(`API Request: ${config.method} ${url}`);
    const response = await fetch(url, config);

    let data: any;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = data?.error || data?.message || `HTTP ${response.status} Error`;
      logger.error(`API Request Failed [${response.status}]: ${url}`, errorMessage);
      throw new APIError(errorMessage, response.status, data);
    }

    return data as T;
  } catch (error: any) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error(`Network Error: ${url}`, error);
    throw new APIError(error?.message || 'Network request failed', 0);
  }
}

export const apiClient = {
  get: <T = any>(endpoint: string, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),

  put: <T = any>(endpoint: string, body?: any, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),

  delete: <T = any>(endpoint: string, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
