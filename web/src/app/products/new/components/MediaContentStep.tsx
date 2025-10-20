'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ImageIcon, Upload, X, Eye } from 'lucide-react';
import { ProductFormData } from '../types';

interface MediaContentStepProps {
    formData: ProductFormData;
    errors: Record<string, string>;
    onInputChange: (field: keyof ProductFormData, value: string | boolean) => void;
    onFileUpload: (field: keyof ProductFormData, file: File) => void;
}

const MediaContentStep = React.memo(function MediaContentStep({ formData, errors, onInputChange, onFileUpload }: MediaContentStepProps) {
    const [uploadedFiles, setUploadedFiles] = useState<{
        productImage?: File;
        coverImage?: File;
    }>({});

    const handleFileUpload = useCallback((field: keyof ProductFormData, file: File) => {
        setUploadedFiles(prev => ({ ...prev, [field]: file }));
        onFileUpload(field, file);
    }, [onFileUpload]);

    const handleFileRemove = useCallback((field: keyof ProductFormData) => {
        setUploadedFiles(prev => {
            const newFiles = { ...prev };
            delete newFiles[field];
            return newFiles;
        });
        onInputChange(field, '');
    }, [onInputChange]);

    const FileUploadArea = ({ field, label, description, currentFile }: {
        field: keyof ProductFormData;
        label: string;
        description: string;
        currentFile?: File;
    }) => {
        const fileInputRef = React.useRef<HTMLInputElement>(null);

        const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                handleFileUpload(field, file);
            }
        };

        const handleDrop = (e: React.DragEvent) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                handleFileUpload(field, file);
            }
        };

        const handleDragOver = (e: React.DragEvent) => {
            e.preventDefault();
        };

        return (
            <div className="space-y-3">
                <div className="text-sm font-medium">{label}</div>
                <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    {currentFile ? (
                        <div className="space-y-3">
                            <div className="relative inline-block">
                                <img
                                    src={URL.createObjectURL(currentFile)}
                                    alt={label}
                                    className="w-32 h-32 object-cover rounded-lg border"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFileRemove(field);
                                    }}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {currentFile.name} ({(currentFile.size / 1024 / 1024).toFixed(2)} MB)
                            </div>
                            <Button type="button" variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                            <div className="text-sm text-muted-foreground">
                                Click to upload or drag and drop
                            </div>
                            <div className="text-xs text-muted-foreground">
                                PNG, JPG, GIF up to 10MB
                            </div>
                        </div>
                    )}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <ImageIcon className="h-5 w-5" />
                    <span>Product Images</span>
                </CardTitle>
                <CardDescription>
                    Upload product images and cover images for your product
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Product Images */}
                <div className="space-y-6">
                    <h4 className="font-medium text-sm flex items-center space-x-2">
                        <ImageIcon className="h-4 w-4" />
                        <span>Product Images</span>
                    </h4>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <FileUploadArea
                            field="imageUrl"
                            label="Main Product Image"
                            description="Primary image displayed on your product page and listings"
                            currentFile={uploadedFiles.productImage}
                        />

                        <FileUploadArea
                            field="thumbnailUrl"
                            label="Cover Image"
                            description="Thumbnail image used in product grids and previews"
                            currentFile={uploadedFiles.coverImage}
                        />
                    </div>
                </div>

                {/* Content Access */}
                <div className="space-y-4">
                    <h4 className="font-medium text-sm">Content Access</h4>
                    <div>
                        <label className="text-sm font-medium">Content URL</label>
                        <input
                            type="url"
                            value={formData.contentUrl}
                            onChange={(e) => onInputChange('contentUrl', e.target.value)}
                            placeholder="https://example.com/your-content"
                            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background ${errors.contentUrl ? 'border-red-500' : ''}`}
                        />
                        {errors.contentUrl && (
                            <p className="text-sm text-red-500 mt-1">{errors.contentUrl}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            Link to your digital product, course, or download
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
});

export { MediaContentStep };
