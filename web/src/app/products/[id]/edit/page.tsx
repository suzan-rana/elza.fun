'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Package, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { apiClient } from '@/lib/api-client';
import { useSimpleToast } from '@/components/ui/simple-toast';
import Link from 'next/link';
import { StepNavigation } from '../../new/components/StepNavigation';
import { BasicInfoStep } from '../../new/components/BasicInfoStep';
import { MediaContentStep } from '../../new/components/MediaContentStep';
import { GatedContentStep } from '../../new/components/GatedContentStep';
import { LinksAndSettingsStep } from '../../new/components/LinksAndSettingsStep';
import { ProductFormData, GatedContentItem } from '../../new/types';
import { steps } from '../../new/constants';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params?.id as string;
    const { user } = useAuth();
    const { addToast } = useSimpleToast();

    const [formData, setFormData] = useState<ProductFormData>({
        title: '',
        slug: '',
        description: '',
        product_type: 'digital_product',
        price: '',
        currency: 'USDC',
        imageUrl: '',
        contentUrl: '',
        isActive: true,
        // Enhanced media and content fields
        thumbnailUrl: '',
        previewUrl: '',
        downloadUrl: '',
        videoUrl: '',
        externalLinks: [],
        gatedContent: [],
        // Subscription specific fields
        subscriptionInterval: 'monthly',
        subscriptionPrice: '',
        maxSubscriptions: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    // Load existing product data
    useEffect(() => {
        const loadProduct = async () => {
            if (!productId || !user) return;

            try {
                setIsLoading(true);
                const products = await apiClient.getProducts();
                const product = products.find(p => p.id === productId);

                if (!product) {
                    addToast({
                        variant: 'destructive',
                        title: 'Error',
                        description: 'Product not found.',
                    });
                    router.push('/products');
                    return;
                }

                // Populate form with existing data
                setFormData({
                    title: product.name || '',
                    slug: product.slug || '',
                    description: product.description || '',
                    product_type: product.type || 'digital_product',
                    price: product.price?.toString() || '',
                    currency: 'USDC', // Default currency
                    imageUrl: product.imageUrl || '',
                    contentUrl: product.contentUrl || '',
                    isActive: product.isActive ?? true,
                    thumbnailUrl: product.thumbnailUrl || '',
                    previewUrl: product.previewUrl || '',
                    downloadUrl: product.downloadUrl || '',
                    videoUrl: product.videoUrl || '',
                    externalLinks: product.externalLinks || [],
                    gatedContent: product.gatedContent || [],
                    subscriptionInterval: product.subscriptionInterval || 'monthly',
                    subscriptionPrice: product.subscriptionPrice?.toString() || '',
                    maxSubscriptions: product.maxSubscriptions?.toString() || ''
                });

            } catch (error) {
                console.error('Failed to load product:', error);
                addToast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to load product data.',
                });
                router.push('/products');
            } finally {
                setIsLoading(false);
            }
        };

        loadProduct();
    }, [productId, user, router, addToast]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Product title is required';
        }

        if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
            newErrors.price = 'Valid price is required';
        }

        if (formData.product_type === 'subscription') {
            if (!formData.subscriptionPrice || isNaN(Number(formData.subscriptionPrice)) || Number(formData.subscriptionPrice) < 0) {
                newErrors.subscriptionPrice = 'Valid subscription price is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep = (stepNumber: number): boolean => {
        const step = steps.find(s => s.id === stepNumber);
        if (!step) return false;

        const newErrors: Record<string, string> = {};
        step.fields.forEach(field => {
            if (field === 'title' && !formData.title.trim()) {
                newErrors.title = 'Product title is required';
            }
            if (field === 'price' && (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) < 0)) {
                newErrors.price = 'Valid price is required';
            }
            if (field === 'subscriptionPrice' && formData.product_type === 'subscription' &&
                (!formData.subscriptionPrice || isNaN(Number(formData.subscriptionPrice)) || Number(formData.subscriptionPrice) < 0)) {
                newErrors.subscriptionPrice = 'Valid subscription price is required';
            }
            // Step 3 (Gated Content) and Step 4 (Links & Settings) don't require validation
            // gatedContent, externalLinks, and isActive are optional fields
        });

        setErrors(prev => ({ ...prev, ...newErrors }));
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = useCallback((field: keyof ProductFormData, value: string | boolean) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };

            // Auto-generate slug when title changes
            if (field === 'title' && typeof value === 'string') {
                newData.slug = generateSlug(value);
            }

            return newData;
        });

        // Clear error for this field if it exists
        setErrors(prev => {
            if (prev[field]) {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            }
            return prev;
        });
    }, []);

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const addExternalLink = useCallback((type: 'link' | 'text' = 'link') => {
        const newItem = {
            id: Math.random().toString(36).substr(2, 9),
            title: '',
            type,
            content: '',
            description: ''
        };
        setFormData(prev => ({
            ...prev,
            externalLinks: [...prev.externalLinks, newItem]
        }));
    }, []);

    const updateExternalLink = useCallback((id: string, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            externalLinks: prev.externalLinks.map(link =>
                link.id === id ? { ...link, [field]: value } : link
            )
        }));
    }, []);

    const removeExternalLink = useCallback((id: string) => {
        setFormData(prev => ({
            ...prev,
            externalLinks: prev.externalLinks.filter(link => link.id !== id)
        }));
    }, []);

    const addGatedContent = useCallback((type: 'file' | 'text' | 'video' | 'link' = 'file') => {
        const newItem: GatedContentItem = {
            id: Math.random().toString(36).substr(2, 9),
            title: '',
            type,
            content: '',
            description: '',
            metadata: {}
        };
        setFormData(prev => ({
            ...prev,
            gatedContent: [...prev.gatedContent, newItem]
        }));
    }, []);

    const updateGatedContent = useCallback((id: string, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            gatedContent: prev.gatedContent.map(content =>
                content.id === id ? { ...content, [field]: value } : content
            )
        }));
    }, []);

    const removeGatedContent = useCallback((id: string) => {
        setFormData(prev => ({
            ...prev,
            gatedContent: prev.gatedContent.filter(content => content.id !== id)
        }));
    }, []);

    const handleFileUpload = useCallback(async (id: string, file: File) => {
        try {
            // Upload file to Cloudinary
            const result = await apiClient.uploadImage(file, 'products');

            setFormData(prev => ({
                ...prev,
                gatedContent: prev.gatedContent.map((content) =>
                    content.id === id
                        ? { ...content, file, content: result.url }
                        : content
                )
            }));

            addToast({
                variant: 'success',
                title: 'File Uploaded',
                description: 'File uploaded successfully!',
            });
        } catch (error) {
            console.error('File upload failed:', error);
            addToast({
                variant: 'destructive',
                title: 'Upload Failed',
                description: 'Failed to upload file. Please try again.',
            });
        }
    }, [addToast]);

    const handleMediaFileUpload = useCallback(async (field: keyof ProductFormData, file: File) => {
        try {
            // Upload file to Cloudinary with organized folder structure
            const folder = `products/${formData.product_type || 'general'}`;
            const result = await apiClient.uploadImage(file, folder);

            setFormData(prev => ({
                ...prev,
                [field]: result.url
            }));

            addToast({
                variant: 'success',
                title: 'Media Uploaded',
                description: `${field} uploaded successfully to ${result.folder}!`,
            });
        } catch (error) {
            console.error('Media upload failed:', error);
            addToast({
                variant: 'destructive',
                title: 'Upload Failed',
                description: `Failed to upload ${field}. Please try again.`,
            });
        }
    }, [addToast, formData.product_type]);

    const handleStepComplete = useCallback((stepNumber: number) => {
        if (validateStep(stepNumber)) {
            setCompletedSteps(prev => [...new Set([...prev, stepNumber])]);
            if (stepNumber < steps.length) {
                setCurrentStep(stepNumber + 1);
            }
        }
    }, [formData]);

    const handleStepClick = useCallback((stepNumber: number) => {
        // Allow navigation to any step that's not beyond the current step + 1
        // This allows users to go to step 4 from step 3
        if (stepNumber <= currentStep + 1 || completedSteps.includes(stepNumber - 1)) {
            setCurrentStep(stepNumber);
        }
    }, [currentStep, completedSteps]);

    const StepContent = () => {
        switch (currentStep) {
            case 1:
                return <BasicInfoStep formData={formData} errors={errors} onInputChange={handleInputChange} />;
            case 2:
                return <MediaContentStep formData={formData} errors={errors} onInputChange={handleInputChange} onFileUpload={handleMediaFileUpload} />;
            case 3:
                return <GatedContentStep
                    formData={formData}
                    onAddGatedContent={addGatedContent}
                    onUpdateGatedContent={updateGatedContent}
                    onRemoveGatedContent={removeGatedContent}
                    onFileUpload={handleFileUpload}
                />;
            case 4:
                return <LinksAndSettingsStep
                    formData={formData}
                    onAddExternalLink={addExternalLink}
                    onUpdateExternalLink={updateExternalLink}
                    onRemoveExternalLink={removeExternalLink}
                    onInputChange={handleInputChange}
                />;
            default:
                return <BasicInfoStep formData={formData} errors={errors} onInputChange={handleInputChange} />;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!productId) {
            addToast({
                variant: "destructive",
                title: "Error",
                description: "Product ID is missing.",
            });
            return;
        }

        if (!validateForm()) {
            addToast({
                variant: "destructive",
                title: "Validation Error",
                description: "Please fix the errors below before saving.",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const productData = {
                title: formData.title,
                slug: formData.slug,
                description: formData.description,
                product_type: formData.product_type,
                price: Number(formData.price),
                currency: formData.currency,
                isActive: formData.isActive,
                // Only include fields that have values
                ...(formData.imageUrl && { imageUrl: formData.imageUrl }),
                ...(formData.contentUrl && { contentUrl: formData.contentUrl }),
                ...(formData.thumbnailUrl && { thumbnailUrl: formData.thumbnailUrl }),
                ...(formData.previewUrl && { previewUrl: formData.previewUrl }),
                ...(formData.downloadUrl && { downloadUrl: formData.downloadUrl }),
                ...(formData.videoUrl && { videoUrl: formData.videoUrl }),
                externalLinks: formData.externalLinks.filter(link => link.title && link.content),
                gatedContent: formData.gatedContent.filter(content => content.title && content.content),
                ...(formData.product_type === 'subscription' && {
                    subscriptionInterval: formData.subscriptionInterval,
                    subscriptionPrice: Number(formData.subscriptionPrice),
                    ...(formData.maxSubscriptions && { maxSubscriptions: Number(formData.maxSubscriptions) }),
                }),
            };

            // Use the regular update method for now (without file uploads)
            console.log('Updating product with data:', productData);
            await apiClient.updateProduct(productId, productData);

            addToast({
                variant: 'success',
                title: 'Success',
                description: 'Product updated successfully!',
            });
            router.push(`/products/${productId}`);
        } catch (error) {
            console.error('Failed to update product:', error);

            // Get more specific error information
            let errorMessage = 'Failed to update product. Please try again.';
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'object' && error !== null && 'response' in error) {
                const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
                if (axiosError.response?.status === 400) {
                    errorMessage = axiosError.response?.data?.message || 'Bad request. Please check your input.';
                } else if (axiosError.response?.status === 401) {
                    errorMessage = 'Unauthorized. Please log in again.';
                } else if (axiosError.response?.status === 500) {
                    errorMessage = 'Server error. Please try again later.';
                }
            }

            addToast({
                variant: 'destructive',
                title: 'Error',
                description: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <span>Loading product data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex items-center space-x-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                </Button>
                <div className="flex items-center space-x-2">
                    <Link href="/products">
                        <Button variant="outline" size="sm">
                            <Package className="mr-2 h-4 w-4" />
                            All Products
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" size="sm">
                            <Home className="mr-2 h-4 w-4" />
                            Dashboard
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Step Navigation */}
            <StepNavigation
                currentStep={currentStep}
                completedSteps={completedSteps}
                onStepClick={handleStepClick}
                title="Edit Product"
                showBackButton={false}
                showHeader={false}
            />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <StepContent />

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                    <div className="flex space-x-2">
                        {currentStep > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCurrentStep(currentStep - 1)}
                            >
                                Previous
                            </Button>
                        )}
                        {currentStep < steps.length && (
                            <Button
                                type="button"
                                onClick={() => handleStepComplete(currentStep)}
                            >
                                Next
                            </Button>
                        )}
                    </div>

                    <div className="flex space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center space-x-2"
                        >
                            <Save className="h-4 w-4" />
                            <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
