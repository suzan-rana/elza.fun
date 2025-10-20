export interface Merchant {
    id: string;
    walletAddress: string;
    email: string;
    businessName?: string;
    logoUrl?: string;
    website?: string;
    description?: string;
    isActive: boolean;
    totalRevenue: number;
    totalCustomers: number;
    createdAt: string;
    updatedAt: string;
}

export interface Customer {
    id: string;
    walletAddress: string;
    email: string;
    firstName?: string;
    lastName?: string;
    isActive: boolean;
    totalSpent: number;
    totalOrders: number;
    createdAt: string;
    updatedAt: string;
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    type: 'one_time' | 'subscription';
    imageUrl?: string;
    contentUrl?: string;
    isActive: boolean;
    totalSales: number;
    totalRevenue: number;
    subscriptionInterval?: string;
    subscriptionPrice?: number;
    maxSubscriptions?: number;
    merchantId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Subscription {
    id: string;
    planId: string;
    amount: number;
    intervalSeconds: number;
    nextPaymentDue: string;
    totalPayments: number;
    maxPayments?: number;
    isActive: boolean;
    isPaused: boolean;
    lastPaymentAt?: string;
    cancelledAt?: string;
    pausedAt?: string;
    merchantId: string;
    customerId: string;
    productId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Receipt {
    id: string;
    receiptId: string;
    productName: string;
    amount: number;
    currency: string;
    metadataUri: string;
    nftMintAddress?: string;
    isSubscription: boolean;
    subscriptionId?: string;
    merchantId: string;
    customerId: string;
    productId: string;
    createdAt: string;
    updatedAt?: string;
}

export interface CheckoutLink {
    id: string;
    productId: string;
    merchantId: string;
    customDomain?: string;
    customStyling?: {
        primaryColor?: string;
        backgroundColor?: string;
        logoUrl?: string;
    };
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
