'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { ExternalLink, Link, FileText, Plus, Trash2 } from 'lucide-react';
import { ProductFormData } from '../types';

interface ExternalLinksStepProps {
    formData: ProductFormData;
    onAddExternalLink: (type: 'link' | 'text') => void;
    onUpdateExternalLink: (id: string, field: string, value: string) => void;
    onRemoveExternalLink: (id: string) => void;
}

// Individual input component with local state to prevent focus issues
const ExternalLinkInput = React.memo(function ExternalLinkInput({
    item,
    onUpdate
}: {
    item: any;
    onUpdate: (id: string, field: string, value: string) => void;
}) {
    const [localData, setLocalData] = useState({
        title: item.title,
        type: item.type,
        content: item.content,
        description: item.description
    });

    // Update local state when item changes
    useEffect(() => {
        setLocalData({
            title: item.title,
            type: item.type,
            content: item.content,
            description: item.description
        });
    }, [item.id]); // Only update when ID changes, not content

    const handleChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setLocalData(prev => ({ ...prev, [field]: value }));

        // Debounce the update to parent
        setTimeout(() => {
            onUpdate(item.id, field, value);
        }, 100);
    }, [item.id, onUpdate]);

    return (
        <div className="p-4 border rounded-lg bg-muted/30">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                    {item.type === 'link' ? (
                        <>
                            <Link className="h-5 w-5 text-primary" />
                            <h5 className="font-medium text-sm">External Link</h5>
                        </>
                    ) : (
                        <>
                            <FileText className="h-5 w-5 text-primary" />
                            <h5 className="font-medium text-sm">Text Content</h5>
                        </>
                    )}
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdate(item.id, 'remove', '')}
                    className="text-red-600 hover:text-red-700"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Title *</Label>
                        <Input
                            placeholder="e.g., Documentation, FAQ, Support"
                            value={localData.title}
                            onChange={handleChange('title')}
                        />
                    </div>
                    <div>
                        <Label>Type</Label>
                        <select
                            value={localData.type}
                            onChange={handleChange('type')}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        >
                            <option value="link">External Link</option>
                            <option value="text">Text Content</option>
                        </select>
                    </div>
                </div>

                <div>
                    <Label>{item.type === 'link' ? 'URL *' : 'Content *'}</Label>
                    {item.type === 'link' ? (
                        <Input
                            placeholder="https://example.com"
                            value={localData.content}
                            onChange={handleChange('content')}
                        />
                    ) : (
                        <textarea
                            placeholder="Enter your text content here..."
                            value={localData.content}
                            onChange={handleChange('content')}
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        />
                    )}
                </div>

                <div>
                    <Label>Description</Label>
                    <Input
                        placeholder="Brief description of this resource"
                        value={localData.description}
                        onChange={handleChange('description')}
                    />
                </div>
            </div>
        </div>
    );
});

const ExternalLinksStep = React.memo(function ExternalLinksStep({
    formData,
    onAddExternalLink,
    onUpdateExternalLink,
    onRemoveExternalLink
}: ExternalLinksStepProps) {
    const handleUpdate = useCallback((id: string, field: string, value: string) => {
        if (field === 'remove') {
            onRemoveExternalLink(id);
        } else {
            onUpdateExternalLink(id, field, value);
        }
    }, [onUpdateExternalLink, onRemoveExternalLink]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <ExternalLink className="h-5 w-5" />
                    <span>External Links</span>
                </CardTitle>
                <CardDescription>
                    Add additional resources, documentation, and helpful links
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Additional Resources</h4>
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
                </div>

                {formData.externalLinks.map((item) => (
                    <ExternalLinkInput
                        key={item.id}
                        item={item}
                        onUpdate={handleUpdate}
                    />
                ))}

                {formData.externalLinks.length === 0 && (
                    <div className="text-center py-8">
                        <ExternalLink className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-muted-foreground mb-2">No additional resources yet</h3>
                        <p className="text-muted-foreground mb-4">
                            Add links to documentation, FAQs, or additional text content
                        </p>
                        <div className="flex justify-center space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onAddExternalLink('link')}
                            >
                                <Link className="h-4 w-4 mr-2" />
                                Add First Link
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onAddExternalLink('text')}
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Add First Text
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
});

export { ExternalLinksStep };
