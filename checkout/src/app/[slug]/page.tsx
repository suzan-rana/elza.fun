'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { api, Product, CheckoutConfig } from '@/lib/api';

export default function PublicCheckoutPage() {
    const params = useParams();
    const checkoutSlug = params?.slug as string;
    const [config, setConfig] = useState<CheckoutConfig | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!checkoutSlug) return;

        const fetchData = async () => {
            try {
                setError(null);
                setLoading(true);

                const [cfg, allProducts] = await Promise.all([
                    api.getPublicCheckoutConfigBySlug(checkoutSlug),
                    api.getProducts(),
                ]);

                setConfig(cfg);
                setProducts(allProducts.filter((p: Product) => cfg.products.includes(p.id) && p.isActive));
            } catch (err) {
                console.error('Error fetching checkout data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load checkout data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [checkoutSlug]);

    const total = useMemo(() => {
        return products.reduce((sum, p) => sum + (config?.checkoutType === 'subscription' && p.subscriptionPrice ? p.subscriptionPrice : p.price), 0);
    }, [products, config]);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        if (value && !validateEmail(value)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    };

    const handlePayment = async () => {
        if (!email) {
            setEmailError('Email is required');
            return;
        }

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        setIsProcessing(true);

        try {
            // TODO: Implement payment processing
            console.log('Processing payment for:', { email, products, total });

            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message or redirect
            alert('Payment processed successfully!');
        } catch (err) {
            console.error('Payment error:', err);
            alert('Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto pt-16">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
                        <p className="text-sm text-gray-600 font-medium">Loading your checkout...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto pt-16">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h2>
                        <p className="text-sm text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!config) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto pt-16">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Checkout not found</h2>
                        <p className="text-sm text-gray-600">The checkout configuration you&apos;re looking for doesn&apos;t exist.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto py-8 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Side - Checkout Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                            <div className="text-center lg:text-left">
                                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                                    {config.name}
                                </h1>

                                {/* Payment Type Badge */}
                                <div className="mb-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.checkoutType === 'subscription'
                                        ? 'bg-blue-100 text-blue-800'
                                        : config.checkoutType === 'mixed'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-green-100 text-green-800'
                                        }`}>
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {config.checkoutType === 'subscription' ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            ) : config.checkoutType === 'mixed' ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            )}
                                        </svg>
                                        {config.checkoutType === 'subscription' ? 'Recurring Payment' :
                                            config.checkoutType === 'mixed' ? 'Mixed Payment' :
                                                'One-Time Payment'}
                                    </span>
                                </div>

                                {config.description && (
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {config.description}
                                    </p>
                                )}

                                {config.merchant && (
                                    <div className="flex items-center justify-center lg:justify-start space-x-3 pt-4 border-t border-gray-100">
                                        {config.merchant.logoUrl && (
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                                <img
                                                    src={config.merchant.logoUrl}
                                                    alt={config.merchant.businessName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {config.merchant.businessName}
                                            </p>
                                            <p className="text-xs text-gray-500 flex items-center">
                                                <svg className="w-3 h-3 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Verified Merchant
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Trust Indicators */}
                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <div className="space-y-3 text-sm text-gray-600">
                                        <div className="flex items-center justify-center lg:justify-start">
                                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            <span>Secure Payment</span>
                                        </div>
                                        <div className="flex items-center justify-center lg:justify-start">
                                            <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span>Instant Processing</span>
                                        </div>
                                        <div className="flex items-center justify-center lg:justify-start">
                                            <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                            </svg>
                                            <span>Solana Powered</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Checkout Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Order Summary */}
                            <div className="px-6 py-5 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        Order Summary
                                    </h2>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.checkoutType === 'subscription'
                                            ? 'bg-blue-100 text-blue-800'
                                            : config.checkoutType === 'mixed'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-green-100 text-green-800'
                                            }`}>
                                            {config.checkoutType === 'subscription' ? 'Recurring' :
                                                config.checkoutType === 'mixed' ? 'Mixed' :
                                                    'One-Time'}
                                        </span>
                                    </div>
                                </div>

                                {/* Payment Type Explanation */}
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-start">
                                        <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div className="text-sm text-gray-700">
                                            {config.checkoutType === 'subscription' ? (
                                                <p>This is a <strong>recurring payment</strong>. You&apos;ll be charged automatically based on the subscription intervals shown below.</p>
                                            ) : config.checkoutType === 'mixed' ? (
                                                <p>This order contains both <strong>one-time</strong> and <strong>recurring</strong> items. Check individual items for payment details.</p>
                                            ) : (
                                                <p>This is a <strong>one-time payment</strong>. You&apos;ll only be charged once for this purchase.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {products.map((p) => (
                                        <div key={p.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                            <div className="flex items-start space-x-4 mb-3">
                                                {p.imageUrl || p.thumbnailUrl ? (
                                                    <img
                                                        src={p.imageUrl || p.thumbnailUrl!}
                                                        alt={p.name}
                                                        className="w-16 h-16 rounded-lg object-cover bg-white shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                                                        {p.name}
                                                    </h3>
                                                    {p.description && (
                                                        <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                                                            {p.description}
                                                        </p>
                                                    )}
                                                    {p.subscriptionInterval && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                            </svg>
                                                            {p.subscriptionInterval}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-gray-900">
                                                        ${config.checkoutType === 'subscription' && p.subscriptionPrice ? p.subscriptionPrice : p.price}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {p.currency}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Additional Product Details */}
                                            <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 bg-white rounded-md p-3">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Type:</span>
                                                    <span className="capitalize">{p.type}</span>
                                                </div>
                                                {p.maxSubscriptions && (
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">Max Subs:</span>
                                                        <span>{p.maxSubscriptions}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between col-span-2">
                                                    <span className="font-medium">Created:</span>
                                                    <span>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Email Collection */}
                            <div className="px-6 py-5 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                    Contact Information
                                </h2>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        placeholder="Enter your email address"
                                        className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${emailError ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        required
                                    />
                                    {emailError && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                            {emailError}
                                        </p>
                                    )}
                                </div>
                                <p className="mt-3 text-sm text-gray-500 flex items-start">
                                    <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    We&apos;ll send you a receipt and important updates about your purchase.
                                </p>
                            </div>

                            {/* Payment Section */}
                            <div className="px-6 py-5">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-lg font-semibold text-gray-900">
                                        Total
                                    </span>
                                    <span className="text-2xl font-bold text-gray-900">
                                        ${total.toFixed(2)} {products[0]?.currency || 'USDC'}
                                    </span>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={isProcessing || !email || !!emailError}
                                    className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none"
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing Payment...
                                        </div>
                                    ) : (
                                        'Complete Payment'
                                    )}
                                </button>

                                <div className="mt-4 text-center">
                                    <p className="text-sm text-gray-500 flex items-center justify-center">
                                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Secure payment powered by Solana blockchain
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}