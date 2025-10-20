'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useAuth } from '@/providers/AuthProvider';
import { apiClient } from '@/lib/api-client';
import { useSimpleToast } from '@/components/ui/simple-toast';
import {
    ShoppingCart,
    Package,
    CreditCard,
    Settings,
    Eye,
    Copy,
    ExternalLink,
    Plus,
    Trash2,
    Edit3,
    DollarSign,
    Calendar,
    Users,
    Link as LinkIcon
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    isActive: boolean;
    subscriptionInterval?: string;
    subscriptionPrice?: number;
    maxSubscriptions?: number;
    createdAt: string;
}

interface CheckoutConfig {
    id?: string;
    name: string;
    description?: string;
    products: string[];
    checkoutType: 'one_time' | 'subscription' | 'mixed';
    customizations: {
        showProductImages: boolean;
        showProductDescriptions: boolean;
        allowQuantitySelection: boolean;
        showMerchantInfo: boolean;
        customMessage?: string;
        successRedirectUrl?: string;
        failureRedirectUrl?: string;
    };
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export default function CheckoutPage() {
    const { user, isLoading: authLoading } = useAuth();
    const { addToast } = useSimpleToast();
    const router = useRouter();

    const [products, setProducts] = useState<Product[]>([]);
    const [checkoutConfigs, setCheckoutConfigs] = useState<CheckoutConfig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Form state for creating new checkout
    const [formData, setFormData] = useState<CheckoutConfig>({
        name: '',
        description: '',
        products: [],
        checkoutType: 'one_time',
        customizations: {
            showProductImages: true,
            showProductDescriptions: true,
            allowQuantitySelection: false,
            showMerchantInfo: true,
            customMessage: '',
            successRedirectUrl: '',
            failureRedirectUrl: ''
        },
        isActive: true
    });

    useEffect(() => {
        if (user && !authLoading) {
            loadData();
        }
    }, [user, authLoading]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [productsData, checkoutData] = await Promise.all([
                apiClient.getProducts(),
                apiClient.getCheckoutConfigs()
            ]);

            setProducts(productsData.filter((product: Product) => product.isActive));
            setCheckoutConfigs(checkoutData);
        } catch (error) {
            console.error('Failed to load data:', error);
            addToast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to load checkout data.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCheckout = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            addToast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Checkout name is required.',
            });
            return;
        }

        if (formData.products.length === 0) {
            addToast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Please select at least one product.',
            });
            return;
        }

        setIsCreating(true);
        try {
            await apiClient.createCheckoutConfig(formData);
            addToast({
                variant: 'success',
                title: 'Success',
                description: 'Checkout configuration created successfully!',
            });
            setShowCreateForm(false);
            setFormData({
                name: '',
                description: '',
                products: [],
                checkoutType: 'one_time',
                customizations: {
                    showProductImages: true,
                    showProductDescriptions: true,
                    allowQuantitySelection: false,
                    showMerchantInfo: true,
                    customMessage: '',
                    successRedirectUrl: '',
                    failureRedirectUrl: ''
                },
                isActive: true
            });
            loadData();
        } catch (error) {
            console.error('Failed to create checkout:', error);
            addToast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to create checkout configuration.',
            });
        } finally {
            setIsCreating(false);
        }
    };

    const handleProductToggle = (productId: string) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.includes(productId)
                ? prev.products.filter(id => id !== productId)
                : [...prev.products, productId]
        }));
    };

    const handleCheckoutTypeChange = (type: 'one_time' | 'subscription' | 'mixed') => {
        setFormData(prev => ({
            ...prev,
            checkoutType: type
        }));
    };

    const copyCheckoutLink = (checkoutId: string) => {
        const link = `${window.location.origin}/checkout/${checkoutId}`;
        navigator.clipboard.writeText(link);
        addToast({
            variant: 'success',
            title: 'Link Copied',
            description: 'Checkout link copied to clipboard!',
        });
    };

    const previewCheckout = (checkoutId: string) => {
        window.open(`/checkout/${checkoutId}`, '_blank');
    };

    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Checkout Management</h1>
                    <p className="text-muted-foreground">
                        Create and manage one-click checkout pages for your products
                    </p>
                </div>
                <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Checkout
                </Button>
            </div>

            {/* Create Checkout Form */}
            {showCreateForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Checkout</CardTitle>
                        <CardDescription>
                            Configure a new checkout page for your products
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateCheckout} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Checkout Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="e.g., Premium Course Bundle"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Brief description of this checkout"
                                    />
                                </div>
                            </div>

                            {/* Checkout Type */}
                            <div>
                                <Label>Checkout Type *</Label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                    {[
                                        { id: 'one_time', label: 'One-Time Purchase', icon: DollarSign },
                                        { id: 'subscription', label: 'Subscription', icon: Calendar },
                                        { id: 'mixed', label: 'Mixed (Both)', icon: Package }
                                    ].map(({ id, label, icon: Icon }) => (
                                        <div
                                            key={id}
                                            onClick={() => handleCheckoutTypeChange(id as any)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${formData.checkoutType === id
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Icon className="h-5 w-5" />
                                                <span className="font-medium">{label}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Product Selection */}
                            <div>
                                <Label>Select Products *</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                                    {products.map((product) => (
                                        <div
                                            key={product.id}
                                            onClick={() => handleProductToggle(product.id)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${formData.products.includes(product.id)
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <div className="flex items-start space-x-3">
                                                {product.imageUrl || product.thumbnailUrl ? (
                                                    <img
                                                        src={product.imageUrl || product.thumbnailUrl}
                                                        alt={product.name}
                                                        className="w-12 h-12 object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        <Package className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        ${product.price} {product.currency}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {product.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Customizations */}
                            <div>
                                <Label>Checkout Customizations</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="showProductImages"
                                                checked={formData.customizations.showProductImages}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    customizations: {
                                                        ...prev.customizations,
                                                        showProductImages: e.target.checked
                                                    }
                                                }))}
                                                className="rounded border-gray-300"
                                            />
                                            <Label htmlFor="showProductImages">Show Product Images</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="showProductDescriptions"
                                                checked={formData.customizations.showProductDescriptions}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    customizations: {
                                                        ...prev.customizations,
                                                        showProductDescriptions: e.target.checked
                                                    }
                                                }))}
                                                className="rounded border-gray-300"
                                            />
                                            <Label htmlFor="showProductDescriptions">Show Product Descriptions</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="allowQuantitySelection"
                                                checked={formData.customizations.allowQuantitySelection}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    customizations: {
                                                        ...prev.customizations,
                                                        allowQuantitySelection: e.target.checked
                                                    }
                                                }))}
                                                className="rounded border-gray-300"
                                            />
                                            <Label htmlFor="allowQuantitySelection">Allow Quantity Selection</Label>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="showMerchantInfo"
                                                checked={formData.customizations.showMerchantInfo}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    customizations: {
                                                        ...prev.customizations,
                                                        showMerchantInfo: e.target.checked
                                                    }
                                                }))}
                                                className="rounded border-gray-300"
                                            />
                                            <Label htmlFor="showMerchantInfo">Show Merchant Info</Label>
                                        </div>
                                        <div>
                                            <Label htmlFor="customMessage">Custom Message</Label>
                                            <Input
                                                id="customMessage"
                                                value={formData.customizations.customMessage}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    customizations: {
                                                        ...prev.customizations,
                                                        customMessage: e.target.value
                                                    }
                                                }))}
                                                placeholder="Optional custom message for customers"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Redirect URLs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="successRedirectUrl">Success Redirect URL</Label>
                                    <Input
                                        id="successRedirectUrl"
                                        value={formData.customizations.successRedirectUrl}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            customizations: {
                                                ...prev.customizations,
                                                successRedirectUrl: e.target.value
                                            }
                                        }))}
                                        placeholder="https://yoursite.com/success"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="failureRedirectUrl">Failure Redirect URL</Label>
                                    <Input
                                        id="failureRedirectUrl"
                                        value={formData.customizations.failureRedirectUrl}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            customizations: {
                                                ...prev.customizations,
                                                failureRedirectUrl: e.target.value
                                            }
                                        }))}
                                        placeholder="https://yoursite.com/failure"
                                    />
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowCreateForm(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isCreating}>
                                    {isCreating ? 'Creating...' : 'Create Checkout'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Existing Checkouts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {checkoutConfigs.map((checkout) => (
                    <Card key={checkout.id} className="overflow-hidden">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg">{checkout.name}</CardTitle>
                                    {checkout.description && (
                                        <CardDescription className="mt-1">
                                            {checkout.description}
                                        </CardDescription>
                                    )}
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyCheckoutLink(checkout.id!)}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => previewCheckout(checkout.id!)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Edit3 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Type:</span>
                                    <span className="font-medium">
                                        {checkout.checkoutType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Products:</span>
                                    <span className="font-medium">{checkout.products.length}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Status:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${checkout.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {checkout.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="pt-2 border-t">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Created {new Date(checkout.createdAt!).toLocaleDateString()}
                                        </span>
                                        <Button variant="outline" size="sm">
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            View
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {checkoutConfigs.length === 0 && !showCreateForm && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Checkout Pages Yet</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            Create your first checkout page to start selling your products
                        </p>
                        <Button onClick={() => setShowCreateForm(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Your First Checkout
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
