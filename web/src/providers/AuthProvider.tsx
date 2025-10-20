'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

interface User {
    id: string;
    walletAddress: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    isOnboarded: boolean;
    merchant?: {
        id: string;
        businessName?: string;
        description?: string;
        website?: string;
        logoUrl?: string;
    };
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticating: boolean;
    authenticate: () => Promise<void>;
    updateProfile: (data: any) => Promise<void>;
    completeUserOnboarding: (userInfo: any) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Global state to prevent multiple authentication attempts
let globalAuthState = {
    isAuthenticating: false,
    hasAuthenticated: false,
    currentWallet: null as string | null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const { connected, publicKey, signMessage } = useWallet();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [hasToken, setHasToken] = useState(false);
    const authAttemptRef = useRef<boolean>(false);

    const authenticate = async () => {
        if (!connected || !publicKey || !signMessage) {
            return;
        }

        const walletAddress = publicKey.toString();

        // Prevent multiple authentication attempts
        if (globalAuthState.isAuthenticating ||
            globalAuthState.hasAuthenticated ||
            globalAuthState.currentWallet === walletAddress ||
            authAttemptRef.current) {
            return;
        }

        // Set global state
        globalAuthState.isAuthenticating = true;
        globalAuthState.currentWallet = walletAddress;
        authAttemptRef.current = true;
        setIsAuthenticating(true);
        setIsLoading(true);
        setError(null);

        try {
            // Create a message to sign
            const message = `Sign this message to authenticate with Elza.\nWallet: ${walletAddress}\nTimestamp: ${Date.now()}`;

            // Sign the message
            const encodedMessage = new TextEncoder().encode(message);
            const signature = await signMessage(encodedMessage);

            // Convert signature to base64
            const signatureBase64 = Buffer.from(signature).toString('base64');

            // Authenticate with backend
            const response = await apiClient.authenticateWithWallet(walletAddress, signatureBase64);

            // Set the auth token
            apiClient.setToken(response.token);

            // Set user data
            setUser(response.user);
            globalAuthState.hasAuthenticated = true;

            // Redirect to dashboard on successful authentication
            router.push('/');

        } catch (err) {
            console.error('Authentication failed:', err);
            setError(err instanceof Error ? err.message : 'Authentication failed');
            globalAuthState.hasAuthenticated = false;

            // Redirect to wallet connection page on authentication failure
            router.push('/wallet-connect');
        } finally {
            setIsLoading(false);
            setIsAuthenticating(false);
            globalAuthState.isAuthenticating = false;
            authAttemptRef.current = false;
        }
    };

    const updateProfile = async (profileData: Partial<User>) => {
        if (!user) return;

        setIsLoading(true);
        setError(null);

        try {
            const updatedUser = await apiClient.updateProfile(profileData);
            setUser(updatedUser);
        } catch (err) {
            console.error('Profile update failed:', err);
            setError(err instanceof Error ? err.message : 'Profile update failed');
        } finally {
            setIsLoading(false);
        }
    };

    const completeUserOnboarding = async (userInfo: any) => {
        if (!user) return false;

        try {
            await updateProfile({
                email: userInfo.email,
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                isOnboarded: true,
            });
            return true;
        } catch (err) {
            console.error('Onboarding completion failed:', err);
            setError(err instanceof Error ? err.message : 'Onboarding completion failed');
            return false;
        }
    };

    const logout = () => {
        apiClient.clearToken();
        setUser(null);
        setError(null);
        globalAuthState.hasAuthenticated = false;
        globalAuthState.currentWallet = null;
        authAttemptRef.current = false;
        setHasToken(false);
    };

    // Restore session from existing token on first load
    useEffect(() => {
        let cancelled = false;
        async function restoreSession() {
            try {
                setIsLoading(true);
                const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
                if (!token) {
                    setHasToken(false);
                    return;
                }
                setHasToken(true);
                // apiClient reads token from localStorage on construction; ensure it's set as well
                apiClient.setToken(token);
                const profile = await apiClient.getProfile();
                if (!cancelled) {
                    setUser(profile);
                    globalAuthState.hasAuthenticated = true;
                }
            } catch (e) {
                // Token invalid/expired
                apiClient.clearToken();
                setHasToken(false);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }
        restoreSession();
        return () => { cancelled = true; };
    }, []);

    // Redirect to wallet connection if no wallet is connected and no token exists
    useEffect(() => {
        if (!connected && !isLoading && !hasToken) {
            // Only redirect if we're not already on the wallet-connect page
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/wallet-connect')) {
                router.push('/wallet-connect');
            }
        }
    }, [connected, isLoading, hasToken, router]);

    // Auto-authenticate when wallet connects
    useEffect(() => {
        if (connected && publicKey && !user && !isLoading && !isAuthenticating && !hasToken) {
            const walletAddress = publicKey.toString();

            // Only authenticate if we haven't already authenticated this wallet
            if (!globalAuthState.hasAuthenticated || globalAuthState.currentWallet !== walletAddress) {
                // Add a delay to prevent rapid-fire attempts
                const timeoutId = setTimeout(() => {
                    authenticate();
                }, 200);

                return () => clearTimeout(timeoutId);
            }
        }
    }, [connected, publicKey, user, isLoading, isAuthenticating, hasToken]);

    // Clear user when wallet disconnects
    useEffect(() => {
        if (!connected) {
            setUser(null);
            setIsAuthenticating(false);
            setIsLoading(false);
            globalAuthState.hasAuthenticated = false;
            globalAuthState.currentWallet = null;
            authAttemptRef.current = false;
        }
    }, [connected]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                error,
                isAuthenticating,
                authenticate,
                updateProfile,
                completeUserOnboarding,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
