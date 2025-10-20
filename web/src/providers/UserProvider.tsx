'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthProvider';

interface UserContextType {
    user: any;
    isLoading: boolean;
    error: string | null;
    updateProfile: (data: any) => Promise<void>;
    completeUserOnboarding: (userInfo: any) => Promise<boolean>;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const auth = useAuth();

    return (
        <UserContext.Provider value={auth}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
