'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ImageIcon, Upload, X, Eye, FileText, Video, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { ProductFormData } from '../types';
import { apiClient } from '@/lib/api-client';
import { useSimpleToast } from '@/components/ui/simple-toast';

interface MediaContentStepProps {
    formData: ProductFormData;
    errors: Record<string, string>;
    onInputChange: (field: keyof ProductFormData, value: string | boolean) => void;
    onFileUpload: (field: keyof ProductFormData, file: File) => void;
}

interface UploadStatus {
    status: 'idle' | 'uploading' | 'success' | 'error';
    progress?: number;
    error?: string;
    result?: any;
}

const MediaContentStep = React.memo(function MediaContentStep({ formData, errors, onInputChange, onFileUpload }: MediaContentStepProps) {
    const { addToast } = useSimpleToast();
    const [uploadedFiles, setUploadedFiles] = useState<{
        imageUrl?: File;
        thumbnailUrl?: File;
    }>({});

    const [uploadStatuses, setUploadStatuses] = useState<Record<string, UploadStatus>>({});

    const handleFileUpload = useCallback(async (field: keyof ProductFormData, file: File) => {
        // Set uploading status
        setUploadStatuses(prev => ({
            ...prev,
            [field]: { status: 'uploading', progress: 0 }
        }));

        try {
            // Upload file to Cloudinary with progress tracking
            const folder = `products/${formData.product_type || 'general'}`;
            const result = await apiClient.uploadImage(file, folder);

            // Update form data with the URL
            onInputChange(field, result.url);

            // Set success status
            setUploadStatuses(prev => ({
                ...prev,
                [field]: {
                    status: 'success',
                    progress: 100,
                    result
                }
            }));

            // Store the uploaded file for preview
            setUploadedFiles(prev => ({ ...prev, [field]: file }));

            addToast({
                variant: 'success',
                title: 'Upload Complete',
                description: `${field} uploaded successfully!`,
            });
        } catch (error) {
            console.error('File upload failed:', error);

            // Set error status
            setUploadStatuses(prev => ({
                ...prev,
                [field]: {
                    status: 'error',
                    error: error instanceof Error ? error.message : 'Upload failed'
                }
            }));

            addToast({
                variant: 'destructive',
                title: 'Upload Failed',
                description: `Failed to upload ${field}. Please try again.`,
            });
        }
    }, [onInputChange, addToast, formData.product_type]);

    const handleFileRemove = useCallback((field: keyof ProductFormData) => {
        setUploadedFiles(prev => {
            const newFiles = { ...prev };
            delete newFiles[field];
            return newFiles;
        });

        setUploadStatuses(prev => {
            const newStatuses = { ...prev };
            delete newStatuses[field];
            return newStatuses;
        });

        onInputChange(field, '');
    }, [onInputChange]);

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return <ImageIcon className="h-8 w-8" />;
        if (mimeType.startsWith('video/')) return <Video className="h-8 w-8" />;
        return <FileText className="h-8 w-8" />;
    };

    const getStatusIcon = (status: UploadStatus) => {
        switch (status.status) {
            case 'uploading':
                return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
            case 'success':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'error':
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            default:
                return null;
        }
    };

    const FileUploadArea = ({ field, label, description, currentFile }: {
        field: keyof ProductFormData;
        label: string;
        description: string;
        currentFile?: File;
    }) => {
        const fileInputRef = useRef<HTMLInputElement>(null);
        const uploadStatus = uploadStatuses[field] || { status: 'idle' };
        const hasUrl = formData[field] && typeof formData[field] === 'string' && formData[field] !== '';

        // Debug logging
        console.log(`FileUploadArea ${field}:`, {
            currentFile,
            hasUrl,
            formDataValue: formData[field],
            uploadStatus
        });

        const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                handleFileUpload(field, file);
            }
        };

        const handleDrop = (e: React.DragEvent) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) {
                handleFileUpload(field, file);
            }
        };

        const handleDragOver = (e: React.DragEvent) => {
            e.preventDefault();
        };

        return (
            <div className="space-y-3">
                <div className="text-sm font-medium flex items-center justify-between">
                    <span>{label}</span>
                    {getStatusIcon(uploadStatus)}
                </div>

                <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${uploadStatus.status === 'uploading'
                        ? 'border-blue-300 bg-blue-50'
                        : uploadStatus.status === 'error'
                            ? 'border-red-300 bg-red-50'
                            : hasUrl
                                ? 'border-green-300 bg-green-50'
                                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                        }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    {uploadStatus.status === 'uploading' ? (
                        <div className="space-y-3">
                            <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-500" />
                            <div className="text-sm text-blue-600">Uploading...</div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadStatus.progress || 0}%` }}
                                ></div>
                            </div>
                        </div>
                    ) : hasUrl ? (
                        <div className="space-y-3">
                            <div className="relative inline-block">
                                {/* Try to show file preview first, then fallback to URL preview */}
                                {currentFile?.type.startsWith('image/') ? (
                                    <img
                                        src={URL.createObjectURL(currentFile)}
                                        alt={label}
                                        className="w-32 h-32 object-cover rounded-lg border"
                                        onError={(e) => {
                                            // Fallback to URL if object URL fails
                                            const target = e.target as HTMLImageElement;
                                            if (formData[field]) {
                                                target.src = formData[field] as string;
                                            }
                                        }}
                                    />
                                ) : currentFile ? (
                                    <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-lg border">
                                        {getFileIcon(currentFile.type || '')}
                                    </div>
                                ) : formData[field] ? (
                                    // Fallback: show URL preview if no file object
                                    <img
                                        src={formData[field] as string}
                                        alt={label}
                                        className="w-32 h-32 object-cover rounded-lg border"
                                        onError={(e) => {
                                            // If URL also fails, show file icon
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            target.nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                ) : (
                                    <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-lg border">
                                        <FileText className="h-8 w-8 text-gray-400" />
                                    </div>
                                )}
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
                                {currentFile?.name || 'Uploaded file'}
                                {currentFile?.size && ` (${((currentFile.size) / 1024 / 1024).toFixed(2)} MB)`}
                            </div>
                            <div className="flex items-center justify-center space-x-2 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm">Upload Complete</span>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (formData[field]) {
                                        window.open(formData[field] as string, '_blank');
                                    }
                                }}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                            </Button>
                        </div>
                    ) : uploadStatus.status === 'error' ? (
                        <div className="space-y-3">
                            <AlertCircle className="h-8 w-8 mx-auto text-red-500" />
                            <div className="text-sm text-red-600">Upload Failed</div>
                            <div className="text-xs text-red-500">{uploadStatus.error}</div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Try Again
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                            <div className="text-sm text-muted-foreground">
                                Click to upload or drag and drop
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Images, Videos, PDFs up to 50MB
                            </div>
                        </div>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*,application/pdf,.doc,.docx,.txt"
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
                    <span>Product Media</span>
                </CardTitle>
                <CardDescription>
                    Upload product images and media files. Files are automatically organized in Cloudinary folders.
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
                            currentFile={uploadedFiles.imageUrl}
                        />

                        <FileUploadArea
                            field="thumbnailUrl"
                            label="Cover Image"
                            description="Thumbnail image used in product grids and previews"
                            currentFile={uploadedFiles.thumbnailUrl}
                        />
                    </div>
                </div>

            </CardContent>
        </Card>
    );
});

export { MediaContentStep };