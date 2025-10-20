'use client';

import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { steps } from '../constants';

interface StepNavigationProps {
    currentStep: number;
    completedSteps: number[];
    onStepClick: (stepNumber: number) => void;
}

export function StepNavigation({ currentStep, completedSteps, onStepClick }: StepNavigationProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Create New Product</h1>
                    <p className="text-muted-foreground mt-1">Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}</p>
                </div>
                <Link href="/products">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Products
                    </Button>
                </Link>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => {
                        const IconComponent = step.icon;
                        const isCompleted = completedSteps.includes(step.id);
                        const isCurrent = currentStep === step.id;
                        const isAccessible = step.id <= currentStep || completedSteps.includes(step.id - 1);

                        return (
                            <div key={step.id} className="flex items-center">
                                <div
                                    onClick={() => isAccessible && onStepClick(step.id)}
                                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 cursor-pointer transition-all ${isCompleted
                                        ? 'bg-primary border-primary text-primary-foreground'
                                        : isCurrent
                                            ? 'border-primary text-primary bg-primary/10'
                                            : isAccessible
                                                ? 'border-muted-foreground text-muted-foreground hover:border-primary'
                                                : 'border-muted text-muted'
                                        }`}
                                >
                                    <IconComponent className="h-5 w-5" />
                                </div>
                                <div className="ml-3">
                                    <p className={`text-sm font-medium ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {step.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{step.description}</p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-4 ${completedSteps.includes(step.id) ? 'bg-primary' : 'bg-muted'
                                        }`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
