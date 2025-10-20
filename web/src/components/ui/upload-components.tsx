'use client';

import React from 'react';
import { CheckCircle, AlertCircle, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface UploadStatusProps {
    status: 'idle' | 'uploading' | 'success' | 'error';
    progress?: number;
    error?: string;
    fileName?: string;
    fileSize?: number;
    onRetry?: () => void;
    onRemove?: () => void;
}

export const UploadStatus: React.FC<UploadStatusProps> = ({
    status,
    progress = 0,
    error,
    fileName,
    fileSize,
    onRetry,
    onRemove
}) => {
    const getStatusIcon = () => {
        switch (status) {
            case 'uploading':
                return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
            case 'success':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'error':
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            default:
                return <Upload className="h-4 w-4 text-gray-400" />;
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'uploading':
                return 'Uploading...';
            case 'success':
                return 'Upload Complete';
            case 'error':
                return 'Upload Failed';
            default:
                return 'Ready to Upload';
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'uploading':
                return 'text-blue-600';
            case 'success':
                return 'text-green-600';
            case 'error':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className={`p-3 rounded-lg border ${status === 'uploading' ? 'border-blue-200 bg-blue-50' :
                status === 'success' ? 'border-green-200 bg-green-50' :
                    status === 'error' ? 'border-red-200 bg-red-50' :
                        'border-gray-200 bg-gray-50'
            }`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {getStatusIcon()}
                    <div>
                        <div className={`text-sm font-medium ${getStatusColor()}`}>
                            {getStatusText()}
                        </div>
                        {fileName && (
                            <div className="text-xs text-gray-500">
                                {fileName} {fileSize && `(${(fileSize / 1024 / 1024).toFixed(2)} MB)`}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    {status === 'error' && onRetry && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onRetry}
                        >
                            Retry
                        </Button>
                    )}

                    {status === 'success' && onRemove && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onRemove}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {status === 'uploading' && (
                <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-center">
                        {progress}%
                    </div>
                </div>
            )}

            {status === 'error' && error && (
                <div className="mt-2 text-xs text-red-600">
                    {error}
                </div>
            )}
        </div>
    );
};

interface FilePreviewProps {
    file: File;
    url?: string;
    onRemove?: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, url, onRemove }) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const previewUrl = url || URL.createObjectURL(file);

    return (
        <div className="relative group">
            <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                {isImage ? (
                    <img
                        src={previewUrl}
                        alt={file.name}
                        className="w-full h-full object-cover"
                    />
                ) : isVideo ? (
                    <video
                        src={previewUrl}
                        className="w-full h-full object-cover"
                        controls
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-2xl mb-2">📄</div>
                            <div className="text-sm text-gray-600">{file.name}</div>
                        </div>
                    </div>
                )}
            </div>

            {onRemove && (
                <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={onRemove}
                >
                    <X className="h-3 w-3" />
                </Button>
            )}

            <div className="mt-2 text-xs text-gray-500">
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
        </div>
    );
};
