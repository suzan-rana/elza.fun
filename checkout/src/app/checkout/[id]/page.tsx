'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

interface Product { id: string; name: string; description?: string; price: number; currency: string; type: string; imageUrl?: string; thumbnailUrl?: string; isActive: boolean; subscriptionInterval?: string; subscriptionPrice?: number; }
interface CheckoutConfig { id: string; name: string; description?: string; products: string[]; checkoutType: 'one_time'|'subscription'|'mixed'; customizations: any; merchant: { businessName: string; email: string; logoUrl?: string; }; }

export default function PublicCheckoutPage() {
  const params = useParams();
  const checkoutId = params?.id as string;
  const [config, setConfig] = useState<CheckoutConfig | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!checkoutId) return;
    (async () => {
      try {
        const [cfg, allProducts] = await Promise.all([
          api.getPublicCheckoutConfig(checkoutId),
          api.getProducts(),
        ]);
        setConfig(cfg);
        setProducts(allProducts.filter((p: Product) => cfg.products.includes(p.id) && p.isActive));
      } finally {
        setLoading(false);
      }
    })();
  }, [checkoutId]);

  const total = useMemo(() => {
    return products.reduce((sum, p) => sum + (config?.checkoutType === 'subscription' && p.subscriptionPrice ? p.subscriptionPrice : p.price), 0);
  }, [products, config]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!config) return <div className="p-8 text-center">Checkout not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{config.name}</h1>
        {config.description && <p className="text-sm text-gray-500 dark:text-gray-400">{config.description}</p>}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4 border rounded-lg">
              {p.imageUrl || p.thumbnailUrl ? (
                <img src={p.imageUrl || p.thumbnailUrl!} alt={p.name} className="w-16 h-16 rounded object-cover" />
              ) : (
                <div className="w-16 h-16 rounded bg-gray-100 dark:bg-gray-800" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{p.name}</div>
                {p.description && <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{p.description}</div>}
              </div>
              <div className="text-right whitespace-nowrap">
                ${config.checkoutType === 'subscription' && p.subscriptionPrice ? p.subscriptionPrice : p.price} {p.currency}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="font-medium">Total</div>
              <div>${total.toFixed(2)} {products[0]?.currency || 'USDC'}</div>
            </div>
            <button className="mt-4 w-full py-2 rounded bg-black text-white dark:bg-white dark:text-black">Pay</button>
          </div>
        </div>
      </div>
    </div>
  );
}
