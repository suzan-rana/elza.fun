'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useOnboarding } from '@/providers/OnboardingProvider';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

export function OnboardingModal() {
    const {
        isOnboarding,
        currentStep,
        nextStep,
        prevStep,
        completeOnboarding,
        userInfo,
        updateUserInfo
    } = useOnboarding();

    const [errors, setErrors] = useState<Record<string, string>>({});

    if (!isOnboarding) return null;

    const steps = [
        {
            title: 'Welcome to Elza!',
            description: 'Let\'s get you set up to start selling on Solana.',
            content: (
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto flex items-center justify-center">
                        <Check className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-muted-foreground">
                        You're connected with your wallet. Now let's create your merchant profile.
                    </p>
                </div>
            )
        },
        {
            title: 'Personal Information',
            description: 'Tell us a bit about yourself to personalize your experience.',
            content: (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={userInfo.firstName}
                                onChange={(e) => {
                                    updateUserInfo({ firstName: e.target.value });
                                    if (errors.firstName) {
                                        setErrors(prev => ({ ...prev, firstName: '' }));
                                    }
                                }}
                                placeholder="Enter your first name"
                            />
                            {errors.firstName && (
                                <p className="text-sm text-destructive mt-1">{errors.firstName}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={userInfo.lastName}
                                onChange={(e) => {
                                    updateUserInfo({ lastName: e.target.value });
                                    if (errors.lastName) {
                                        setErrors(prev => ({ ...prev, lastName: '' }));
                                    }
                                }}
                                placeholder="Enter your last name"
                            />
                            {errors.lastName && (
                                <p className="text-sm text-destructive mt-1">{errors.lastName}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={userInfo.email}
                            onChange={(e) => {
                                updateUserInfo({ email: e.target.value });
                                if (errors.email) {
                                    setErrors(prev => ({ ...prev, email: '' }));
                                }
                            }}
                            placeholder="Enter your email address"
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive mt-1">{errors.email}</p>
                        )}
                    </div>
                </div>
            )
        },
        {
            title: 'Business Setup',
            description: 'Configure your business settings and preferences.',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">Default Settings</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Currency: USDC (can be changed later)</li>
                            <li>• Network: Solana Devnet</li>
                            <li>• Theme: Dark mode</li>
                        </ul>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        You can customize these settings and add more details in your profile later.
                    </p>
                </div>
            )
        }
    ];

    const validateStep = () => {
        const newErrors: Record<string, string> = {};

        if (currentStep === 1) {
            if (!userInfo.firstName.trim()) {
                newErrors.firstName = 'First name is required';
            }
            if (!userInfo.lastName.trim()) {
                newErrors.lastName = 'Last name is required';
            }
            if (!userInfo.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        if (validateStep()) {
            if (currentStep === steps.length - 1) {
                try {
                    await completeOnboarding();
                } catch (error) {
                    console.error('Failed to complete onboarding:', error);
                }
            } else {
                nextStep();
            }
        }
    };

    const currentStepData = steps[currentStep];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                    <CardDescription>{currentStepData.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {currentStepData.content}

                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <Button onClick={handleNext}>
                            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
                            {currentStep < steps.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
                        </Button>
                    </div>

                    <div className="flex justify-center space-x-2">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${index === currentStep ? 'bg-primary' : 'bg-muted'
                                    }`}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
