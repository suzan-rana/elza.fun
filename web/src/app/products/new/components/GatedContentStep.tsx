'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
    Lock,
    Upload,
    Link,
    Globe,
    Key,
    Users,
    FileText,
    ImageIcon,
    Video
} from 'lucide-react';
import { ProductFormData, GatedContentItem } from '../types';

interface GatedContentStepProps {
    formData: ProductFormData;
    onAddGatedContent: (type: GatedContentItem['type']) => void;
    onUpdateGatedContent: (id: string, field: keyof GatedContentItem, value: any) => void;
    onRemoveGatedContent: (id: string) => void;
    onFileUpload: (id: string, file: File) => void;
}

const GatedContentStep = React.memo(function GatedContentStep({
    formData,
    onAddGatedContent,
    onUpdateGatedContent,
    onRemoveGatedContent,
    onFileUpload
}: GatedContentStepProps) {
    const contentTypes = [
        { id: 'file', name: 'File Upload', icon: Upload, description: 'Upload documents, images, videos, etc.' },
        { id: 'url', name: 'External URL', icon: Link, description: 'Link to external content or resources' },
        { id: 'twitter_post', name: 'Twitter Post', icon: Globe, description: 'Share Twitter/X posts or threads' },
        { id: 'license_key', name: 'License Key', icon: Key, description: 'Software license keys or activation codes' },
        { id: 'membership_credentials', name: 'Membership Access', icon: Users, description: 'Username/password for exclusive access' },
        { id: 'text', name: 'Text Content', icon: FileText, description: 'Plain text, instructions, or notes' },
        { id: 'image', name: 'Image', icon: ImageIcon, description: 'Images, screenshots, or graphics' },
        { id: 'video', name: 'Video', icon: Video, description: 'Video content or tutorials' }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Lock className="h-5 w-5" />
                    <span>Gated Content</span>
                </CardTitle>
                <CardDescription>
                    Add premium content, materials, and exclusive access items
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Content Types</h4>
                    <div className="flex flex-wrap gap-2">
                        {contentTypes.map((type) => {
                            const IconComponent = type.icon;
                            return (
                                <Button
                                    key={type.id}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onAddGatedContent(type.id as GatedContentItem['type'])}
                                    className="flex items-center space-x-2"
                                >
                                    <IconComponent className="h-4 w-4" />
                                    <span>{type.name}</span>
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {formData.gatedContent.map((content) => (
                    <div key={content.id} className="p-4 border rounded-lg bg-muted/30">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-2">
                                {(() => {
                                    const typeInfo = contentTypes.find(t => t.id === content.type);
                                    if (typeInfo) {
                                        const IconComponent = typeInfo.icon;
                                        return (
                                            <>
                                                <IconComponent className="h-5 w-5 text-primary" />
                                                <h5 className="font-medium text-sm">{typeInfo.name}</h5>
                                            </>
                                        );
                                    }
                                    return <h5 className="font-medium text-sm">Content</h5>;
                                })()}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => onRemoveGatedContent(content.id)}
                                className="text-red-600 hover:text-red-700"
                            >
                                Remove
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Content Title *</Label>
                                    <Input
                                        placeholder="e.g., Chapter 1: Introduction"
                                        value={content.title}
                                        onChange={(e) => onUpdateGatedContent(content.id, 'title', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Content Type</Label>
                                    <select
                                        value={content.type}
                                        onChange={(e) => onUpdateGatedContent(content.id, 'type', e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    >
                                        {contentTypes.map((type) => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <Label>Description</Label>
                                <textarea
                                    placeholder="Describe this content..."
                                    value={content.description}
                                    onChange={(e) => onUpdateGatedContent(content.id, 'description', e.target.value)}
                                    className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                />
                            </div>

                            {/* Content-specific fields */}
                            {content.type === 'file' && (
                                <div>
                                    <Label>File Upload</Label>
                                    <div className="mt-2">
                                        <input
                                            type="file"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) onFileUpload(content.id, file);
                                            }}
                                            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                        />
                                        {content.file && (
                                            <p className="text-sm text-muted-foreground mt-2">
                                                Selected: {content.file.name} ({(content.file.size / 1024 / 1024).toFixed(2)} MB)
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {content.type === 'url' && (
                                <div>
                                    <Label>URL</Label>
                                    <Input
                                        placeholder="https://example.com/content"
                                        value={content.content}
                                        onChange={(e) => onUpdateGatedContent(content.id, 'content', e.target.value)}
                                    />
                                </div>
                            )}

                            {content.type === 'twitter_post' && (
                                <div className="space-y-4">
                                    <div>
                                        <Label>Twitter/X Post URL</Label>
                                        <Input
                                            placeholder="https://twitter.com/username/status/1234567890"
                                            value={content.content}
                                            onChange={(e) => onUpdateGatedContent(content.id, 'content', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>Platform</Label>
                                        <select
                                            value={content.metadata?.platform || 'twitter'}
                                            onChange={(e) => onUpdateGatedContent(content.id, 'metadata', { ...content.metadata, platform: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                        >
                                            <option value="twitter">Twitter/X</option>
                                            <option value="linkedin">LinkedIn</option>
                                            <option value="instagram">Instagram</option>
                                            <option value="tiktok">TikTok</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {content.type === 'license_key' && (
                                <div className="space-y-4">
                                    <div>
                                        <Label>License Key</Label>
                                        <Input
                                            placeholder="XXXX-XXXX-XXXX-XXXX"
                                            value={content.content}
                                            onChange={(e) => onUpdateGatedContent(content.id, 'content', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>Expiry Date (Optional)</Label>
                                        <Input
                                            type="date"
                                            value={content.metadata?.expiryDate || ''}
                                            onChange={(e) => onUpdateGatedContent(content.id, 'metadata', { ...content.metadata, expiryDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            {content.type === 'membership_credentials' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Username</Label>
                                            <Input
                                                placeholder="username"
                                                value={content.metadata?.username || ''}
                                                onChange={(e) => onUpdateGatedContent(content.id, 'metadata', { ...content.metadata, username: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label>Password</Label>
                                            <Input
                                                type="password"
                                                placeholder="password"
                                                value={content.metadata?.password || ''}
                                                onChange={(e) => onUpdateGatedContent(content.id, 'metadata', { ...content.metadata, password: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Access URL (Optional)</Label>
                                        <Input
                                            placeholder="https://example.com/login"
                                            value={content.content}
                                            onChange={(e) => onUpdateGatedContent(content.id, 'content', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {content.type === 'text' && (
                                <div>
                                    <Label>Text Content</Label>
                                    <textarea
                                        placeholder="Enter your text content here..."
                                        value={content.content}
                                        onChange={(e) => onUpdateGatedContent(content.id, 'content', e.target.value)}
                                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    />
                                </div>
                            )}

                            {content.type === 'image' && (
                                <div>
                                    <Label>Image URL</Label>
                                    <Input
                                        placeholder="https://example.com/image.jpg"
                                        value={content.content}
                                        onChange={(e) => onUpdateGatedContent(content.id, 'content', e.target.value)}
                                    />
                                </div>
                            )}

                            {content.type === 'video' && (
                                <div>
                                    <Label>Video URL</Label>
                                    <Input
                                        placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                                        value={content.content}
                                        onChange={(e) => onUpdateGatedContent(content.id, 'content', e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {formData.gatedContent.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                        <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-muted-foreground mb-2">No gated content yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Add premium content, files, or exclusive access items for your customers
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {contentTypes.slice(0, 4).map((type) => {
                                const IconComponent = type.icon;
                                return (
                                    <Button
                                        key={type.id}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onAddGatedContent(type.id as GatedContentItem['type'])}
                                        className="flex items-center space-x-2"
                                    >
                                        <IconComponent className="h-4 w-4" />
                                        <span>{type.name}</span>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
});

export { GatedContentStep };
