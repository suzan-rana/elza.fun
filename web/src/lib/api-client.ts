import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
    private axiosInstance: AxiosInstance;
    private token: string | null = null;

    constructor(baseURL: string) {
        this.axiosInstance = axios.create({
            baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

        // Request interceptor to add auth token
        this.axiosInstance.interceptors.request.use(
            (config) => {
                if (this.token) {
                    config.headers.Authorization = `Bearer ${this.token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor for error handling
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    // Handle unauthorized access
                    this.clearToken();
                    if (typeof window !== 'undefined') {
                        window.location.href = '/wallet-connect';
                    }
                }

                console.log({ error })

                // Log error for debugging
                console.error('API request failed:', {
                    url: error.config?.url,
                    method: error.config?.method,
                    status: error.response?.status,
                    message: error.message,
                    data: error.response?.data,
                });

                return Promise.reject(error);
            }
        );
    }

    setToken(token: string) {
        this.token = token;
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
        }
    }

    clearToken() {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
        }
    }

    private async request<T>(
        endpoint: string,
        options: AxiosRequestConfig = {}
    ): Promise<T> {
        try {
            const response = await this.axiosInstance.request<T>({
                url: endpoint,
                ...options,
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message || 'Request failed';
                throw new Error(errorMessage);
            }
            throw error;
        }
    }

    // Auth endpoints
    async authenticateWithWallet(walletAddress: string, signature: string) {
        return this.request<{ token: string; user: any }>('/auth/wallet', {
            method: 'POST',
            data: { walletAddress, signature },
        });
    }

    async getProfile() {
        return this.request<any>('/auth/profile');
    }

    async updateProfile(data: any) {
        return this.request<any>('/auth/profile', {
            method: 'PUT',
            data,
        });
    }

    // Merchant endpoints
    async getMerchant() {
        return this.request<any>('/merchants');
    }

    async updateMerchant(data: any) {
        return this.request<any>('/merchants', {
            method: 'PUT',
            data,
        });
    }

    // Product endpoints
    async getProducts() {
        return this.request<any[]>('/products');
    }

    async createProduct(data: any) {
        return this.request<any>('/products', {
            method: 'POST',
            data,
        });
    }

    async updateProduct(id: string, data: any) {
        return this.request<any>(`/products/${id}`, {
            method: 'PUT',
            data,
        });
    }

    async deleteProduct(id: string) {
        return this.request<void>(`/products/${id}`, {
            method: 'DELETE',
        });
    }

    // Subscription endpoints
    async getSubscriptions() {
        return this.request<any[]>('/subscriptions');
    }

    async getSubscriptionStats() {
        return this.request<any>('/subscriptions/stats');
    }

    // Transaction endpoints
    async getTransactions() {
        return this.request<any[]>('/transactions');
    }

    async getTransactionStats() {
        return this.request<any>('/transactions/stats');
    }

    // Dashboard stats
    async getDashboardStats() {
        return this.request<any>('/dashboard/stats');
    }

    async getRecentProducts() {
        return this.request<any[]>('/dashboard/products');
    }

    async getRecentTransactions() {
        return this.request<any[]>('/dashboard/transactions');
    }
}

export const apiClient = new ApiClient(API_BASE_URL);