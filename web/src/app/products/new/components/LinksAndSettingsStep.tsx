'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { ExternalLink, Link, FileText, Plus, Trash2, Eye, Settings } from 'lucide-react';
import { ProductFormData } from '../types';

interface LinksAndSettingsStepProps {
    formData: ProductFormData;
    onAddExternalLink: (type: 'link' | 'text') => void;
    onUpdateExternalLink: (id: string, field: string, value: string) => void;
    onRemoveExternalLink: (id: string) => void;
    onInputChange: (field: keyof ProductFormData, value: string | boolean) => void;
}

// Individual input component with local state to prevent focus issues
const ExternalLinkInput = React.memo(function ExternalLinkInput({
    item,
    onUpdate,
    onRemove
}: {
    item: any;
    onUpdate: (field: string, value: string) => void;
    onRemove: () => void;
}) {
    return (
        <div className="space-y-3 p-4 border rounded-lg bg-card">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {item.type === 'link' ? (
                        <ExternalLink className="h-4 w-4 text-blue-500" />
                    ) : (
                        <FileText className="h-4 w-4 text-green-500" />
                    )}
                    <span className="text-sm font-medium capitalize">{item.type}</span>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onRemove}
                    className="text-red-500 hover:text-red-700"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="space-y-3">
                <div>
                    <Label htmlFor={`title-${item.id}`} className="text-sm font-medium">
                        Title
                    </Label>
                    <Input
                        id={`title-${item.id}`}
                        type="text"
                        placeholder="e.g., Documentation, Support Forum"
                        value={item.title}
                        onChange={(e) => onUpdate('title', e.target.value)}
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor={`content-${item.id}`} className="text-sm font-medium">
                        {item.type === 'link' ? 'URL' : 'Content'}
                    </Label>
                    <Input
                        id={`content-${item.id}`}
                        type={item.type === 'link' ? 'url' : 'text'}
                        placeholder={item.type === 'link' ? 'https://example.com' : 'Your text content here'}
                        value={item.content}
                        onChange={(e) => onUpdate('content', e.target.value)}
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor={`description-${item.id}`} className="text-sm font-medium">
                        Description (Optional)
                    </Label>
                    <Input
                        id={`description-${item.id}`}
                        type="text"
                        placeholder="Brief description of this link"
                        value={item.description}
                        onChange={(e) => onUpdate('description', e.target.value)}
                        className="mt-1"
                    />
                </div>
            </div>
        </div>
    );
});

const LinksAndSettingsStep = React.memo(function LinksAndSettingsStep({
    formData,
    onAddExternalLink,
    onUpdateExternalLink,
    onRemoveExternalLink,
    onInputChange
}: LinksAndSettingsStepProps) {
    return (
        <div className="space-y-6">
            {/* External Links Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <ExternalLink className="h-5 w-5" />
                        <span>External Links</span>
                    </CardTitle>
                    <CardDescription>
                        Add additional resources, documentation, or links that complement your product
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {formData.externalLinks.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <ExternalLink className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-sm">No external links added yet</p>
                            <p className="text-xs">Add links to documentation, support, or related resources</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {formData.externalLinks.map((link) => (
                                <ExternalLinkInput
                                    key={link.id}
                                    item={link}
                                    onUpdate={(field, value) => onUpdateExternalLink(link.id, field, value)}
                                    onRemove={() => onRemoveExternalLink(link.id)}
                                />
                            ))}
                        </div>
                    )}

                    <div className="flex space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onAddExternalLink('link')}
                        >
                            <Link className="h-4 w-4 mr-2" />
                            Add Link
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onAddExternalLink('text')}
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            Add Text
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Settings Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Settings className="h-5 w-5" />
                        <span>Product Settings</span>
                    </CardTitle>
                    <CardDescription>
                        Configure the final settings for your product
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Product Status */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Product Status</Label>
                        <div className="flex items-center space-x-2">
                            <Button
                                type="button"
                                variant={formData.isActive ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                    console.log('Toggle button clicked, current state:', formData.isActive);
                                    onInputChange('isActive', !formData.isActive);
                                }}
                                className={`flex items-center space-x-2 ${formData.isActive
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                            >
                                <div className={`w-2 h-2 rounded-full ${formData.isActive ? 'bg-white' : 'bg-gray-500'
                                    }`} />
                                <span className="text-sm">
                                    {formData.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </Button>
                            <Label className="text-sm">
                                Make this product active and available for purchase
                            </Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Inactive products won't be visible to customers
                        </p>
                    </div>

                    {/* Preview Section */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Product Preview</Label>
                        <div className="p-4 border rounded-lg bg-muted/50">
                            <div className="flex items-center space-x-3 mb-3">
                                {formData.imageUrl || formData.thumbnailUrl ? (
                                    <img
                                        src={formData.imageUrl || formData.thumbnailUrl}
                                        alt={formData.title}
                                        className="w-16 h-16 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <Eye className="h-6 w-6 text-gray-400" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-medium">{formData.title || 'Product Title'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {formData.product_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Product Type'}
                                    </p>
                                    <p className="text-sm font-medium">
                                        ${formData.price || '0'} {formData.currency || 'USDC'}
                                    </p>
                                </div>
                            </div>
                            {formData.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {formData.description}
                                </p>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            This is how your product will appear to customers
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
});

export { LinksAndSettingsStep };
