'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { FileText, Eye, ImageIcon } from 'lucide-react';
import { ProductFormData } from '../types';
import { productTypes } from '../constants';

interface SettingsPreviewStepProps {
    formData: ProductFormData;
    onInputChange: (field: keyof ProductFormData, value: string | boolean) => void;
}

const SettingsPreviewStep = React.memo(function SettingsPreviewStep({ formData, onInputChange }: SettingsPreviewStepProps) {
    return (
        <div className="space-y-6">
            {/* Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span>Settings</span>
                    </CardTitle>
                    <CardDescription>
                        Configure additional product settings
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => onInputChange('isActive', e.target.checked)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <Label htmlFor="isActive">Product is active and available for purchase</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        If unchecked, the product will not be visible or purchasable.
                    </p>
                </CardContent>
            </Card>

            {/* Product Preview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Eye className="h-5 w-5" />
                        <span>Product Preview</span>
                    </CardTitle>
                    <CardDescription>
                        See how your product will appear to customers
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg p-6 bg-muted/30">
                        <div className="flex space-x-4">
                            {/* Product Image */}
                            <div className="w-32 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                {formData.imageUrl ? (
                                    <img
                                        src={formData.imageUrl}
                                        alt="Product preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                            if (nextElement) {
                                                nextElement.style.display = 'flex';
                                            }
                                        }}
                                    />
                                ) : null}
                                <div className="flex items-center justify-center text-gray-400" style={{ display: formData.imageUrl ? 'none' : 'flex' }}>
                                    <ImageIcon className="h-8 w-8" />
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            {formData.title || 'Product Title'}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {formData.description || 'Product description will appear here...'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold">
                                            {formData.price ? `${formData.price} ${formData.currency}` : 'Price'}
                                        </div>
                                        {formData.product_type === 'subscription' && formData.subscriptionPrice && (
                                            <div className="text-sm text-muted-foreground">
                                                {formData.subscriptionPrice} {formData.currency}/{formData.subscriptionInterval}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Product Type Badge */}
                                <div className="mt-3">
                                    {(() => {
                                        const selectedType = productTypes.find(t => t.id === formData.product_type);
                                        if (selectedType) {
                                            const IconComponent = selectedType.icon;
                                            return (
                                                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                                                    <IconComponent className="h-4 w-4" />
                                                    <span>{selectedType.name}</span>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}
                                </div>

                                {/* Content Links Preview */}
                                {(formData.previewUrl || formData.videoUrl || formData.externalLinks.length > 0 || formData.gatedContent.length > 0) && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-sm font-medium">Available Content:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.previewUrl && (
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                                    Preview Available
                                                </span>
                                            )}
                                            {formData.videoUrl && (
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                    Video Content
                                                </span>
                                            )}
                                            {formData.downloadUrl && (
                                                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                                    Download Available
                                                </span>
                                            )}
                                            {formData.externalLinks.length > 0 && (
                                                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                                                    {formData.externalLinks.length} External Link{formData.externalLinks.length > 1 ? 's' : ''}
                                                </span>
                                            )}
                                            {formData.gatedContent.length > 0 && (
                                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                                    {formData.gatedContent.length} Gated Content{formData.gatedContent.length > 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
});

export { SettingsPreviewStep };
