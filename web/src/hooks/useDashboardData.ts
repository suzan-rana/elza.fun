'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/providers/AuthProvider';

interface DashboardStats {
    totalRevenue: number;
    totalCustomers: number;
    totalProducts: number;
    activeSubscriptions: number;
    monthlyRevenue: number;
    conversionRate: number;
}

interface Product {
    id: string;
    name: string;
    price: number;
    sales: number;
    revenue: number;
    type: 'one_time' | 'subscription' | 'digital_product' | 'course' | 'ebook' | 'membership' | 'bundle' | 'service';
    isActive: boolean;
    imageUrl?: string;
    thumbnailUrl?: string;
    previewUrl?: string;
    downloadUrl?: string;
    videoUrl?: string;
    contentUrl?: string;
    createdAt: string;
}

interface Transaction {
    id: string;
    customer: string;
    product: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    date: string;
}

export function useDashboardData() {
    const { user, isLoading: authLoading } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = async () => {
        // Don't fetch data if user is not authenticated
        if (!user) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const [statsData, productsData, transactionsData] = await Promise.all([
                apiClient.getDashboardStats(),
                apiClient.getRecentProducts(),
                apiClient.getRecentTransactions(),
            ]);

            setStats(statsData);
            setProducts(productsData);
            setTransactions(transactionsData);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch data when user is authenticated and not loading
        if (user && !authLoading) {
            fetchDashboardData();
        } else if (!user && !authLoading) {
            // If no user and auth is not loading, stop loading
            setIsLoading(false);
        }
    }, [user, authLoading]);

    const refreshData = () => {
        fetchDashboardData();
    };

    return {
        stats,
        products,
        transactions,
        isLoading,
        error,
        refreshData,
    };
}
