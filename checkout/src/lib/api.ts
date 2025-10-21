import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

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
  getProducts: () => request<Product[]>('/products/public'),

  // POST requests (for future use)
  createOrder: (orderData: any) => axiosInstance.post('/orders', orderData),
  processPayment: (paymentData: any) => axiosInstance.post('/payments', paymentData),

  // PUT requests (for future use)
  updateOrder: (id: string, orderData: any) => axiosInstance.put(`/orders/${id}`, orderData),

  // DELETE requests (for future use)
  cancelOrder: (id: string) => axiosInstance.delete(`/orders/${id}`),
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
}

export interface CheckoutConfig {
  id: string;
  name: string;
  description?: string;
  products: string[];
  checkoutType: 'one_time' | 'subscription' | 'mixed';
  customizations: any;
  merchant: {
    businessName: string;
    email: string;
    logoUrl?: string;
  };
}
