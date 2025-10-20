'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { apiClient } from '@/lib/api-client';
import { useSimpleToast } from '@/components/ui/simple-toast';
import { StepNavigation } from './components/StepNavigation';
import { BasicInfoStep } from './components/BasicInfoStep';
import { MediaContentStep } from './components/MediaContentStep';
import { GatedContentStep } from './components/GatedContentStep';
import { ExternalLinksStep } from './components/ExternalLinksStep';
import { SettingsPreviewStep } from './components/SettingsPreviewStep';
import { ProductFormData, GatedContentItem } from './types';
import { steps } from './constants';

export default function CreateProductPage() {
    const router = useRouter();
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
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Product title is required';
        } else if (formData.title.length > 150) {
            newErrors.title = 'Product title must be 150 characters or less';
        }

        if (!formData.slug.trim()) {
            newErrors.slug = 'Product slug is required';
        } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
            newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Product description is required';
        }

        if (!formData.price.trim()) {
            newErrors.price = 'Price is required';
        } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
            newErrors.price = 'Price must be a valid positive number';
        }

        if (formData.product_type === 'subscription') {
            if (!formData.subscriptionPrice.trim()) {
                newErrors.subscriptionPrice = 'Subscription price is required';
            } else if (isNaN(Number(formData.subscriptionPrice)) || Number(formData.subscriptionPrice) <= 0) {
                newErrors.subscriptionPrice = 'Subscription price must be a valid positive number';
            }

            if (formData.maxSubscriptions && (isNaN(Number(formData.maxSubscriptions)) || Number(formData.maxSubscriptions) <= 0)) {
                newErrors.maxSubscriptions = 'Max subscriptions must be a valid positive number';
            }
        }

        if (formData.contentUrl && !isValidUrl(formData.contentUrl)) {
            newErrors.contentUrl = 'Please enter a valid URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
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
            externalLinks: prev.externalLinks.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        }));
    }, []);

    const removeExternalLink = useCallback((id: string) => {
        setFormData(prev => ({
            ...prev,
            externalLinks: prev.externalLinks.filter((item) => item.id !== id)
        }));
    }, []);

    const addGatedContent = useCallback((type: GatedContentItem['type'] = 'url') => {
        const newItem: GatedContentItem = {
            id: Math.random().toString(36).substr(2, 9),
            title: '',
            description: '',
            type,
            content: '',
            metadata: {}
        };
        setFormData(prev => ({
            ...prev,
            gatedContent: [...prev.gatedContent, newItem]
        }));
    }, []);

    const updateGatedContent = useCallback((id: string, field: keyof GatedContentItem, value: any) => {
        setFormData(prev => ({
            ...prev,
            gatedContent: prev.gatedContent.map((content) =>
                content.id === id ? { ...content, [field]: value } : content
            )
        }));
    }, []);

    const removeGatedContent = useCallback((id: string) => {
        setFormData(prev => ({
            ...prev,
            gatedContent: prev.gatedContent.filter((content) => content.id !== id)
        }));
    }, []);

    const handleFileUpload = useCallback((id: string, file: File) => {
        setFormData(prev => ({
            ...prev,
            gatedContent: prev.gatedContent.map((content) =>
                content.id === id
                    ? { ...content, file, content: file.name }
                    : content
            )
        }));
    }, []);

    const handleMediaFileUpload = useCallback((field: keyof ProductFormData, file: File) => {
        // For now, we'll store the file name in the URL field
        // In a real app, you'd upload to a service and get a URL
        const fileUrl = URL.createObjectURL(file);
        setFormData(prev => ({
            ...prev,
            [field]: fileUrl
        }));
    }, []);

    const validateStep = (stepNumber: number): boolean => {
        const step = steps.find(s => s.id === stepNumber);
        if (!step) return false;

        const newErrors: Record<string, string> = {};

        step.fields.forEach(field => {
            if (field === 'title' && !formData.title.trim()) {
                newErrors.title = 'Product title is required';
            } else if (field === 'slug' && !formData.slug.trim()) {
                newErrors.slug = 'Product slug is required';
            } else if (field === 'description' && !formData.description.trim()) {
                newErrors.description = 'Product description is required';
            } else if (field === 'price' && !formData.price.trim()) {
                newErrors.price = 'Price is required';
            } else if (field === 'subscriptionPrice' && formData.product_type === 'subscription' && !formData.subscriptionPrice.trim()) {
                newErrors.subscriptionPrice = 'Subscription price is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCompletedSteps(prev => [...prev, currentStep]);
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const goToStep = (stepNumber: number) => {
        if (stepNumber <= currentStep || completedSteps.includes(stepNumber - 1)) {
            setCurrentStep(stepNumber);
        }
    };

    const StepContent = useMemo(() => {
        switch (currentStep) {
            case 1:
                return <BasicInfoStep formData={formData} errors={errors} onInputChange={handleInputChange} />;
            case 2:
                return <MediaContentStep formData={formData} errors={errors} onInputChange={handleInputChange} onFileUpload={handleMediaFileUpload} />;
            case 3:
                return (
                    <GatedContentStep
                        formData={formData}
                        onAddGatedContent={addGatedContent}
                        onUpdateGatedContent={updateGatedContent}
                        onRemoveGatedContent={removeGatedContent}
                        onFileUpload={handleFileUpload}
                    />
                );
            case 4:
                return (
                    <ExternalLinksStep
                        formData={formData}
                        onAddExternalLink={addExternalLink}
                        onUpdateExternalLink={updateExternalLink}
                        onRemoveExternalLink={removeExternalLink}
                    />
                );
            case 5:
                return <SettingsPreviewStep formData={formData} onInputChange={handleInputChange} />;
            default:
                return <BasicInfoStep formData={formData} errors={errors} onInputChange={handleInputChange} />;
        }
    }, [currentStep, formData, errors, handleInputChange, addGatedContent, updateGatedContent, removeGatedContent, handleFileUpload, handleMediaFileUpload, addExternalLink, updateExternalLink, removeExternalLink]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
                imageUrl: formData.imageUrl || null,
                contentUrl: formData.contentUrl || null,
                isActive: formData.isActive,
                // Enhanced media and content fields
                thumbnailUrl: formData.thumbnailUrl || null,
                previewUrl: formData.previewUrl || null,
                downloadUrl: formData.downloadUrl || null,
                videoUrl: formData.videoUrl || null,
                externalLinks: formData.externalLinks.filter(link => link.title && link.content),
                gatedContent: formData.gatedContent.filter(content => content.title && content.content),
                ...(formData.product_type === 'subscription' && {
                    subscriptionInterval: formData.subscriptionInterval,
                    subscriptionPrice: Number(formData.subscriptionPrice),
                    maxSubscriptions: formData.maxSubscriptions ? Number(formData.maxSubscriptions) : null,
                }),
            };

            await apiClient.createProduct(productData);

            addToast({
                variant: 'success',
                title: 'Success',
                description: 'Product created successfully!',
            });
            router.push('/products');
        } catch (error) {
            console.error('Failed to create product:', error);
            let errorMessage = 'Failed to create product';
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

    if (!user) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">Please connect your wallet to create products</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <StepNavigation
                currentStep={currentStep}
                completedSteps={completedSteps}
                onStepClick={goToStep}
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                {StepContent}

                {/* Step Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>

                    <div className="flex space-x-2">
                        {currentStep < steps.length ? (
                            <Button
                                type="button"
                                onClick={nextStep}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            >
                                Next Step
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Create Product
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}