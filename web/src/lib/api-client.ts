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
            method: 'PATCH',
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

    // Upload endpoints
    async uploadImage(file: File, folder?: string) {
        const formData = new FormData();
        formData.append('file', file);

        return this.request<any>('/upload/image', {
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            params: folder ? { folder } : {},
        });
    }

    async uploadImages(files: File[], folder?: string) {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        return this.request<any[]>('/upload/images', {
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            params: folder ? { folder } : {},
        });
    }

    async deleteImage(publicId: string) {
        return this.request<{ success: boolean; message: string }>(`/upload/image/${publicId}`, {
            method: 'DELETE',
        });
    }

    // Enhanced product creation with file uploads
    async createProductWithFiles(productData: any, files?: {
        imageUrl?: File;
        thumbnailUrl?: File;
        previewUrl?: File;
        downloadUrl?: File;
        videoUrl?: File;
    }) {
        const formData = new FormData();

        // Add product data
        Object.keys(productData).forEach(key => {
            if (productData[key] !== null && productData[key] !== undefined) {
                if (typeof productData[key] === 'object') {
                    formData.append(key, JSON.stringify(productData[key]));
                } else {
                    formData.append(key, productData[key].toString());
                }
            }
        });

        // Add files
        if (files) {
            Object.keys(files).forEach(key => {
                if (files[key]) {
                    formData.append(key, files[key]);
                }
            });
        }

        return this.request<any>('/products', {
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    async updateProductWithFiles(id: string, productData: any, files?: {
        imageUrl?: File;
        thumbnailUrl?: File;
        previewUrl?: File;
        downloadUrl?: File;
        videoUrl?: File;
    }) {
        const formData = new FormData();

        // Add product data
        Object.keys(productData).forEach(key => {
            if (productData[key] !== null && productData[key] !== undefined) {
                if (typeof productData[key] === 'object') {
                    formData.append(key, JSON.stringify(productData[key]));
                } else {
                    formData.append(key, productData[key].toString());
                }
            }
        });

        // Add files
        if (files) {
            Object.keys(files).forEach(key => {
                if (files[key]) {
                    formData.append(key, files[key]);
                }
            });
        }

        return this.request<any>(`/products/${id}`, {
            method: 'PUT',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
}

export const apiClient = new ApiClient(API_BASE_URL);