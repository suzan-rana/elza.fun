'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { apiClient } from '@/lib/api-client';
import { useSimpleToast } from '@/components/ui/simple-toast';
import {
    Package,
    Edit,
    Trash2,
    DollarSign,
    Users,
    Calendar,
    Image as ImageIcon,
    RefreshCw,
    ArrowLeft,
    Eye,
    Download,
    ExternalLink,
    Lock,
    Play
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

interface Product {
    id: string;
    name: string;
    slug?: string;
    description?: string;
    price: number;
    currency: string;
    type: string;
    imageUrl?: string;
    thumbnailUrl?: string;
    previewUrl?: string;
    downloadUrl?: string;
    videoUrl?: string;
    contentUrl?: string;
    isActive: boolean;
    totalSales?: number;
    totalRevenue?: number;
    subscriptionInterval?: string;
    subscriptionPrice?: number;
    maxSubscriptions?: number;
    externalLinks?: Array<{
        id: string;
        title: string;
        type: 'link' | 'text';
        content: string;
        description: string;
    }>;
    gatedContent?: Array<{
        id: string;
        title: string;
        type: 'file' | 'text' | 'video' | 'link';
        content: string;
        description: string;
        metadata?: any;
    }>;
    createdAt: string;
    updatedAt: string;
}

export default function ProductDetailPage() {
    const { user, isLoading: authLoading } = useAuth();
    const { addToast } = useSimpleToast();
    const router = useRouter();
    const params = useParams();
    const productId = params?.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProduct = async () => {
        if (!user || !productId) return;

        try {
            setIsLoading(true);
            setError(null);
            const productData = await apiClient.getProducts();
            const foundProduct = productData.find(p => p.id === productId);

            if (!foundProduct) {
                setError('Product not found');
                return;
            }

            setProduct(foundProduct);
        } catch (err) {
            console.error('Failed to fetch product:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch product');
            addToast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to load product. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user && !authLoading && productId) {
            fetchProduct();
        }
    }, [user, authLoading, productId]);

    const handleDeleteProduct = async () => {
        if (!product) return;

        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

        try {
            await apiClient.deleteProduct(product.id);
            addToast({
                variant: 'success',
                title: 'Success',
                description: 'Product deleted successfully!',
            });
            router.push('/products');
        } catch (err) {
            console.error('Failed to delete product:', err);
            addToast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to delete product. Please try again.',
            });
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{authLoading ? 'Connecting wallet...' : 'Loading product...'}</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">Please connect your wallet to view products</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-destructive mb-4">{error || 'Product not found'}</p>
                    <div className="flex gap-2 justify-center">
                        <Button onClick={fetchProduct} variant="outline">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Retry
                        </Button>
                        <Link href="/products">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Products
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/products">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{product.name}</h1>
                        <p className="text-muted-foreground">
                            {product.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} • Created {new Date(product.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push(`/products/${product.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Product
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteProduct}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Product Image */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="aspect-video bg-gray-100 relative">
                                {product.imageUrl || product.thumbnailUrl ? (
                                    <img
                                        src={product.imageUrl || product.thumbnailUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="h-24 w-24 text-gray-400" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {product.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description */}
                    {product.description && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Gated Content */}
                    {product.gatedContent && product.gatedContent.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Lock className="h-5 w-5" />
                                    <span>Gated Content</span>
                                </CardTitle>
                                <CardDescription>
                                    Premium content available to customers
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {product.gatedContent.map((content) => (
                                        <div key={content.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                {content.type === 'video' && <Play className="h-4 w-4 text-blue-500" />}
                                                {content.type === 'file' && <Download className="h-4 w-4 text-green-500" />}
                                                {content.type === 'link' && <ExternalLink className="h-4 w-4 text-purple-500" />}
                                                {content.type === 'text' && <Package className="h-4 w-4 text-gray-500" />}
                                                <div>
                                                    <p className="font-medium">{content.title}</p>
                                                    {content.description && (
                                                        <p className="text-sm text-muted-foreground">{content.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4 mr-2" />
                                                Preview
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* External Links */}
                    {product.externalLinks && product.externalLinks.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <ExternalLink className="h-5 w-5" />
                                    <span>External Links</span>
                                </CardTitle>
                                <CardDescription>
                                    Additional resources and links
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {product.externalLinks.map((link) => (
                                        <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">{link.title}</p>
                                                {link.description && (
                                                    <p className="text-sm text-muted-foreground">{link.description}</p>
                                                )}
                                            </div>
                                            <Button variant="outline" size="sm">
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                Visit
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Price</span>
                                <span className="font-medium">${product.price}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Currency</span>
                                <span className="font-medium">{product.currency}</span>
                            </div>
                            {product.type === 'subscription' && product.subscriptionPrice && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Subscription Price</span>
                                        <span className="font-medium">${product.subscriptionPrice}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Interval</span>
                                        <span className="font-medium">{product.subscriptionInterval}</span>
                                    </div>
                                    {product.maxSubscriptions && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Max Subscriptions</span>
                                            <span className="font-medium">{product.maxSubscriptions}</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Total Sales</span>
                                </div>
                                <span className="font-medium">{product.totalSales || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Total Revenue</span>
                                </div>
                                <span className="font-medium">${(product.totalRevenue || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Created</span>
                                </div>
                                <span className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button className="w-full" onClick={() => router.push(`/products/${product.id}/edit`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Product
                            </Button>
                            <Button variant="outline" className="w-full">
                                <Eye className="mr-2 h-4 w-4" />
                                View Public Page
                            </Button>
                            <Button variant="outline" className="w-full">
                                <Download className="mr-2 h-4 w-4" />
                                Export Data
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
