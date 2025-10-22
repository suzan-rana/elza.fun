import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// Create axios instance with default configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding common headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any common headers or auth tokens here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.statusText;
      throw new Error(`API ${error.response.status}: ${message}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error: No response from server');
    } else {
      // Something else happened
      throw new Error(`Request error: ${error.message}`);
    }
  }
);

async function request<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
  try {
    const response = await axiosInstance.get<T>(path, {
      ...config,
      // Disable caching for dynamic data
      headers: {
        'Cache-Control': 'no-cache',
        ...config?.headers,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Enhanced API methods with better error handling and typing
export const api = {
  // GET requests
  getPublicCheckoutConfig: (id: string) => request<CheckoutConfig>(`/checkout/public/${id}`),
  getPublicCheckoutConfigBySlug: (slug: string) => request<CheckoutConfig>(`/checkout/public/slug/${slug}`),
  getPublicCheckoutConfigByDomain: (domain: string) => request<CheckoutConfig>(`/checkout/public/domain/${domain}`),
  getProducts: () => request<Product[]>('/products/public'),

  // POST requests (for future use)
  createOrder: <TBody extends Record<string, unknown>, TResp = unknown>(orderData: TBody): Promise<AxiosResponse<TResp>> =>
    axiosInstance.post<TResp>('/orders', orderData),
  processPayment: <TBody extends Record<string, unknown>, TResp = unknown>(paymentData: TBody): Promise<AxiosResponse<TResp>> =>
    axiosInstance.post<TResp>('/payments', paymentData),

  // PUT requests (for future use)
  updateOrder: <TBody extends Record<string, unknown>, TResp = unknown>(id: string, orderData: TBody): Promise<AxiosResponse<TResp>> =>
    axiosInstance.put<TResp>(`/orders/${id}`, orderData),

  // DELETE requests (for future use)
  cancelOrder: <TResp = unknown>(id: string): Promise<AxiosResponse<TResp>> =>
    axiosInstance.delete<TResp>(`/orders/${id}`),
};

// Type definitions for better TypeScript support
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  type: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  isActive: boolean;
  subscriptionInterval?: string;
  subscriptionPrice?: number;
  maxSubscriptions?: number; // optional, used in UI when present
  createdAt?: string; // optional, used for display
}

export interface CheckoutConfig {
  id: string;
  name: string;
  description?: string;
  slug: string;
  customDomain?: string;
  products: string[];
  checkoutType: 'one_time' | 'subscription' | 'mixed';
  customizations: Record<string, unknown>;
  merchant: {
    businessName: string;
    email: string;
    logoUrl?: string;
  };
}
