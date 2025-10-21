'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { api, Product, CheckoutConfig } from '@/lib/api';

export default function PublicCheckoutPage() {
  const params = useParams();
  const checkoutId = params?.id as string;
  const [config, setConfig] = useState<CheckoutConfig | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!checkoutId) return;

    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);

        // Use Promise.all for parallel requests with axios
        const [cfg, allProducts] = await Promise.all([
          api.getPublicCheckoutConfig(checkoutId),
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
  }, [checkoutId]);

  const total = useMemo(() => {
    return products.reduce((sum, p) => sum + (config?.checkoutType === 'subscription' && p.subscriptionPrice ? p.subscriptionPrice : p.price), 0);
  }, [products, config]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-md mx-auto pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 font-sora-medium">Loading...</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-sora-light">Please wait while we prepare your checkout</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-md mx-auto pt-20">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2 font-sora-medium">Something went wrong</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-sora-light">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors font-sora-medium"
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
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-md mx-auto pt-20">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2 font-sora-medium">Checkout not found</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-sora-light">The checkout configuration you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2 font-sora-semibold">
            {config.name}
          </h1>
          {config.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 font-sora-light">
              {config.description}
            </p>
          )}
          {config.merchant && (
            <div className="mt-4 flex items-center justify-center space-x-2">
              {config.merchant.logoUrl && (
                <img
                  src={config.merchant.logoUrl}
                  alt={config.merchant.businessName}
                  className="w-5 h-5 rounded-full object-cover"
                />
              )}
              <span className="text-xs text-gray-400 dark:text-gray-500 font-sora-light">
                by {config.merchant.businessName}
              </span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Order Items */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 font-sora-medium">
              Order summary
            </h2>
            <div className="space-y-4">
              {products.map((p) => (
                <div key={p.id} className="flex items-center space-x-3">
                  {p.imageUrl || p.thumbnailUrl ? (
                    <img
                      src={p.imageUrl || p.thumbnailUrl!}
                      alt={p.name}
                      className="w-12 h-12 rounded-md object-cover bg-gray-100 dark:bg-gray-700"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white font-sora-medium">
                      {p.name}
                    </h3>
                    {p.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 font-sora-light">
                        {p.description}
                      </p>
                    )}
                    {p.subscriptionInterval && (
                      <span className="inline-block mt-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full font-sora-light">
                        {p.subscriptionInterval}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white font-sora-medium">
                      ${config.checkoutType === 'subscription' && p.subscriptionPrice ? p.subscriptionPrice : p.price}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-sora-light">
                      {p.currency}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Section */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-medium text-gray-900 dark:text-white font-sora-medium">
                Total
              </span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white font-sora-semibold">
                ${total.toFixed(2)} {products[0]?.currency || 'USDC'}
              </span>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors font-sora-medium">
              Complete payment
            </button>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-sora-light">
                Secure payment powered by blockchain technology
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-400 dark:text-gray-500">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-sora-light">Secure</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-sora-light">Fast</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
              <span className="font-sora-light">Decentralized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
