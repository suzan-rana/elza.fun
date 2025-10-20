'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Users,
  Calendar
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function ProductsPage() {
  const [products] = useState([
    {
      id: 1,
      name: 'Premium Course Bundle',
      description: 'Complete course bundle with lifetime access',
      price: 99.99,
      currency: 'USDC',
      type: 'one_time',
      imageUrl: '/placeholder-product.jpg',
      totalSales: 45,
      totalRevenue: 4499.55,
      isActive: true,
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      name: 'Monthly Newsletter',
      description: 'Exclusive monthly content and insights',
      price: 9.99,
      currency: 'USDC',
      type: 'subscription',
      imageUrl: '/placeholder-product.jpg',
      totalSales: 120,
      totalRevenue: 1198.80,
      isActive: true,
      createdAt: '2024-01-05'
    },
    {
      id: 3,
      name: 'Exclusive Content',
      description: 'Premium content and early access',
      price: 29.99,
      currency: 'SOL',
      type: 'one_time',
      imageUrl: '/placeholder-product.jpg',
      totalSales: 23,
      totalRevenue: 689.77,
      isActive: false,
      createdAt: '2024-01-10'
    }
  ]);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your digital products and subscriptions</p>
        </div>
        <Link href="/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Product
          </Button>
        </Link>
      </div>


      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {product.description}
                  </CardDescription>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${product.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
                  }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium text-foreground">
                    {product.price} {product.currency}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium text-foreground capitalize">
                    {product.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sales</span>
                  <span className="font-medium text-foreground">{product.totalSales}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Revenue</span>
                  <span className="font-medium text-foreground">${product.totalRevenue.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="mr-1 h-3 w-3" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-500 text-center mb-4">
              Create your first product to start selling on Solana
            </p>
            <Link href="/products/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
