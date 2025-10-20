'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useUser } from './UserProvider';

interface OnboardingContextType {
    isOnboarding: boolean;
    isCompleted: boolean;
    currentStep: number;
    nextStep: () => void;
    prevStep: () => void;
    completeOnboarding: () => void;
    userInfo: {
        email: string;
        firstName: string;
        lastName: string;
    };
    updateUserInfo: (info: Partial<OnboardingContextType['userInfo']>) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
    const { connected, publicKey } = useWallet();
    const { user, completeUserOnboarding } = useUser();
    const [isOnboarding, setIsOnboarding] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);
    const [userInfo, setUserInfo] = useState({
        email: '',
        firstName: '',
        lastName: '',
    });

    useEffect(() => {
        if (connected && publicKey && user && !hasCheckedOnboarding) {
            setHasCheckedOnboarding(true);

            // Check if user has completed onboarding
            const hasCompleted = localStorage.getItem('onboarding_completed');
            const needsOnboarding = !user.isOnboarded || !user.email || !user.firstName || !user.lastName;

            if (needsOnboarding && !hasCompleted) {
                setIsOnboarding(true);
                // Pre-populate with any existing user data
                setUserInfo({
                    email: user.email || '',
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                });
            } else {
                setIsCompleted(true);
            }
        }
    }, [connected, publicKey, user, hasCheckedOnboarding]);

    // Reset onboarding state when wallet disconnects
    useEffect(() => {
        if (!connected) {
            setHasCheckedOnboarding(false);
            setIsOnboarding(false);
            setIsCompleted(false);
            setCurrentStep(0);
            setUserInfo({
                email: '',
                firstName: '',
                lastName: '',
            });
        }
    }, [connected]);

    const nextStep = () => {
        setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(0, prev - 1));
    };

    const completeOnboarding = async () => {
        try {
            const success = await completeUserOnboarding(userInfo);
            if (success) {
                setIsOnboarding(false);
                setIsCompleted(true);
                localStorage.setItem('onboarding_completed', 'true');
            }
        } catch (error) {
            console.error('Failed to complete onboarding:', error);
        }
    };

    const updateUserInfo = (info: Partial<OnboardingContextType['userInfo']>) => {
        setUserInfo(prev => ({ ...prev, ...info }));
    };

    return (
        <OnboardingContext.Provider
            value={{
                isOnboarding,
                isCompleted,
                currentStep,
                nextStep,
                prevStep,
                completeOnboarding,
                userInfo,
                updateUserInfo,
            }}
        >
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
}
