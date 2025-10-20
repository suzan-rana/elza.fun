'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Package, DollarSign } from 'lucide-react';
import { ProductFormData } from '../types';
import { productTypes } from '../constants';

interface BasicInfoStepProps {
    formData: ProductFormData;
    errors: Record<string, string>;
    onInputChange: (field: keyof ProductFormData, value: string | boolean) => void;
}

const BasicInfoStep = React.memo(function BasicInfoStep({ formData, errors, onInputChange }: BasicInfoStepProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Basic Information</span>
                </CardTitle>
                <CardDescription>
                    Enter the basic details about your product
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Product Title */}
                <div>
                    <Label htmlFor="title">Product Title *</Label>
                    <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => onInputChange('title', e.target.value)}
                        placeholder="Enter product title"
                        maxLength={150}
                        className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && (
                        <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                        {formData.title.length}/150 characters
                    </p>
                </div>

                {/* Product Type */}
                <div>
                    <Label>Product Type *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-3">
                        {productTypes.map((type) => {
                            const IconComponent = type.icon;
                            const isSelected = formData.product_type === type.id;
                            return (
                                <div
                                    key={type.id}
                                    onClick={() => onInputChange('product_type', type.id)}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${isSelected
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <div className="flex flex-col items-center text-center space-y-3">
                                        <div className={`p-3 rounded-lg ${type.color} text-white`}>
                                            <IconComponent className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm">{type.name}</h4>
                                            <p className="text-xs text-muted-foreground">{type.description}</p>
                                            <div className="text-xs text-muted-foreground">
                                                <p className="font-medium mb-1">Examples:</p>
                                                <ul className="space-y-1">
                                                    {type.examples.map((example, idx) => (
                                                        <li key={idx}>• {example}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-medium">Pricing</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="price">Price *</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => onInputChange('price', e.target.value)}
                                placeholder="0.00"
                                className={errors.price ? 'border-red-500' : ''}
                            />
                            {errors.price && (
                                <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="currency">Currency</Label>
                            <select
                                id="currency"
                                value={formData.currency}
                                onChange={(e) => onInputChange('currency', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            >
                                <option value="USDC">USDC</option>
                                <option value="SOL">SOL</option>
                            </select>
                        </div>
                    </div>

                    {formData.product_type === 'subscription' && (
                        <div className="space-y-4 p-4 bg-muted rounded-lg">
                            <h4 className="font-medium">Subscription Settings</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="subscriptionPrice">Subscription Price *</Label>
                                    <Input
                                        id="subscriptionPrice"
                                        type="number"
                                        value={formData.subscriptionPrice}
                                        onChange={(e) => onInputChange('subscriptionPrice', e.target.value)}
                                        placeholder="0.00"
                                        className={errors.subscriptionPrice ? 'border-red-500' : ''}
                                    />
                                    {errors.subscriptionPrice && (
                                        <p className="text-sm text-red-500 mt-1">{errors.subscriptionPrice}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="subscriptionInterval">Billing Interval</Label>
                                    <select
                                        id="subscriptionInterval"
                                        value={formData.subscriptionInterval}
                                        onChange={(e) => onInputChange('subscriptionInterval', e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    >
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                        <option value="weekly">Weekly</option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="maxSubscriptions">Max Subscriptions (Optional)</Label>
                                    <Input
                                        id="maxSubscriptions"
                                        type="number"
                                        value={formData.maxSubscriptions}
                                        onChange={(e) => onInputChange('maxSubscriptions', e.target.value)}
                                        placeholder="Unlimited"
                                        className={errors.maxSubscriptions ? 'border-red-500' : ''}
                                    />
                                    {errors.maxSubscriptions && (
                                        <p className="text-sm text-red-500 mt-1">{errors.maxSubscriptions}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <Label htmlFor="slug">Product Slug *</Label>
                    <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => onInputChange('slug', e.target.value)}
                        placeholder="product-slug"
                        className={errors.slug ? 'border-red-500' : ''}
                    />
                    {errors.slug && (
                        <p className="text-sm text-red-500 mt-1">{errors.slug}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                        SEO-friendly URL identifier (auto-generated from title)
                    </p>
                </div>

                <div>
                    <Label htmlFor="description">Description *</Label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => onInputChange('description', e.target.value)}
                        className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background ${errors.description ? 'border-red-500' : ''}`}
                        placeholder="Enter product description"
                    />
                    {errors.description && (
                        <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
});

export { BasicInfoStep };
