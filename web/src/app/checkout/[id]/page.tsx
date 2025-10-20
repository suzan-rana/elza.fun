'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { apiClient } from '@/lib/api-client';
import { useSimpleToast } from '@/components/ui/simple-toast';
import {
    ShoppingCart,
    Package,
    CreditCard,
    DollarSign,
    Calendar,
    User,
    Mail,
    Lock,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { useParams } from 'next/navigation';

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
}

interface CheckoutConfig {
    id: string;
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
    merchant: {
        id: string;
        businessName: string;
        email: string;
        logoUrl?: string;
    };
}

interface CartItem {
    product: Product;
    quantity: number;
}

export default function PublicCheckoutPage() {
    const params = useParams();
    const checkoutId = params.id as string;
    const { addToast } = useSimpleToast();

    const [checkoutConfig, setCheckoutConfig] = useState<CheckoutConfig | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    // Customer information
    const [customerInfo, setCustomerInfo] = useState({
        email: '',
        firstName: '',
        lastName: ''
    });

    useEffect(() => {
        if (checkoutId) {
            loadCheckoutData();
        }
    }, [checkoutId]);

    const loadCheckoutData = async () => {
        try {
            setIsLoading(true);
            const [config, productsData] = await Promise.all([
                apiClient.getCheckoutConfig(checkoutId),
                apiClient.getProducts()
            ]);

            setCheckoutConfig(config);

            // Filter products that are included in this checkout
            const checkoutProducts = productsData.filter((product: Product) =>
                config.products.includes(product.id) && product.isActive
            );
            setProducts(checkoutProducts);

            // Initialize cart with all products (quantity 1)
            const initialCart = checkoutProducts.map(product => ({
                product,
                quantity: 1
            }));
            setCart(initialCart);

        } catch (error) {
            console.error('Failed to load checkout data:', error);
            addToast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to load checkout page.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return;

        setCart(prev => prev.map(item =>
            item.product.id === productId
                ? { ...item, quantity }
                : item
        ));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const price = checkoutConfig?.checkoutType === 'subscription' && item.product.subscriptionPrice
                ? item.product.subscriptionPrice
                : item.product.price;
            return total + (price * item.quantity);
        }, 0);
    };

    const handleCheckout = async () => {
        if (!customerInfo.email || !customerInfo.firstName || !customerInfo.lastName) {
            addToast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Please fill in all required fields.',
            });
            return;
        }

        setIsProcessing(true);
        try {
            // Here you would integrate with your payment processor
            // For now, we'll simulate a successful payment
            await new Promise(resolve => setTimeout(resolve, 2000));

            addToast({
                variant: 'success',
                title: 'Payment Successful!',
                description: 'Your order has been processed successfully.',
            });

            // Redirect to success page or custom URL
            if (checkoutConfig?.customizations.successRedirectUrl) {
                window.location.href = checkoutConfig.customizations.successRedirectUrl;
            } else {
                // Default success page
                window.location.href = '/checkout/success';
            }

        } catch (error) {
            console.error('Payment failed:', error);
            addToast({
                variant: 'destructive',
                title: 'Payment Failed',
                description: 'There was an error processing your payment. Please try again.',
            });
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading checkout page...</p>
                </div>
            </div>
        );
    }

    if (!checkoutConfig) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Checkout Not Found</h1>
                    <p className="text-muted-foreground">This checkout page is not available or has been deactivated.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">{checkoutConfig.name}</h1>
                        {checkoutConfig.description && (
                            <p className="text-muted-foreground">{checkoutConfig.description}</p>
                        )}
                        {checkoutConfig.customizations.customMessage && (
                            <div className="mt-4 p-4 bg-muted rounded-lg">
                                <p className="text-sm">{checkoutConfig.customizations.customMessage}</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Products */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <ShoppingCart className="h-5 w-5" />
                                        <span>Your Order</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {cart.map((item) => (
                                        <div key={item.product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                                            {checkoutConfig.customizations.showProductImages && (item.product.imageUrl || item.product.thumbnailUrl) && (
                                                <img
                                                    src={item.product.imageUrl || item.product.thumbnailUrl}
                                                    alt={item.product.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{item.product.name}</h3>
                                                {checkoutConfig.customizations.showProductDescriptions && item.product.description && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {item.product.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center space-x-4 mt-2">
                                                    <span className="text-sm text-muted-foreground">
                                                        {item.product.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    </span>
                                                    {checkoutConfig.checkoutType === 'subscription' && item.product.subscriptionPrice && (
                                                        <span className="text-sm text-muted-foreground">
                                                            {item.product.subscriptionInterval}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold">
                                                    ${checkoutConfig.checkoutType === 'subscription' && item.product.subscriptionPrice
                                                        ? item.product.subscriptionPrice
                                                        : item.product.price
                                                    } {item.product.currency}
                                                </div>
                                                {checkoutConfig.customizations.allowQuantitySelection && (
                                                    <div className="flex items-center space-x-2 mt-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            -
                                                        </Button>
                                                        <span className="w-8 text-center">{item.quantity}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                        >
                                                            +
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Customer Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <User className="h-5 w-5" />
                                        <span>Customer Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="firstName">First Name *</Label>
                                            <Input
                                                id="firstName"
                                                value={customerInfo.firstName}
                                                onChange={(e) => setCustomerInfo(prev => ({ ...prev, firstName: e.target.value }))}
                                                placeholder="Enter your first name"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="lastName">Last Name *</Label>
                                            <Input
                                                id="lastName"
                                                value={customerInfo.lastName}
                                                onChange={(e) => setCustomerInfo(prev => ({ ...prev, lastName: e.target.value }))}
                                                placeholder="Enter your last name"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={customerInfo.email}
                                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                                            placeholder="Enter your email address"
                                            required
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <CreditCard className="h-5 w-5" />
                                        <span>Order Summary</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {cart.map((item) => (
                                        <div key={item.product.id} className="flex justify-between text-sm">
                                            <span>
                                                {item.product.name} {item.quantity > 1 && `× ${item.quantity}`}
                                            </span>
                                            <span>
                                                ${((checkoutConfig.checkoutType === 'subscription' && item.product.subscriptionPrice
                                                    ? item.product.subscriptionPrice
                                                    : item.product.price) * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between font-semibold">
                                            <span>Total</span>
                                            <span>${calculateTotal().toFixed(2)} {products[0]?.currency || 'USDC'}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Merchant Info */}
                            {checkoutConfig.customizations.showMerchantInfo && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm">Sold by</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center space-x-3">
                                            {checkoutConfig.merchant.logoUrl && (
                                                <img
                                                    src={checkoutConfig.merchant.logoUrl}
                                                    alt={checkoutConfig.merchant.businessName}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium text-sm">{checkoutConfig.merchant.businessName}</p>
                                                <p className="text-xs text-muted-foreground">{checkoutConfig.merchant.email}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Checkout Button */}
                            <Button
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                className="w-full"
                                size="lg"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="mr-2 h-4 w-4" />
                                        Complete Purchase
                                    </>
                                )}
                            </Button>

                            <div className="text-center">
                                <p className="text-xs text-muted-foreground">
                                    Secure payment processing powered by blockchain technology
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
