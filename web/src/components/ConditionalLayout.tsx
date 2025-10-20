'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from '@/components/merchant/Sidebar';
import { UserProfile } from '@/components/UserProfile';
import { OnboardingModal } from '@/components/OnboardingModal';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ClientWalletMultiButton } from '@/components/wallet/ClientWalletMultiButton';

interface ConditionalLayoutProps {
    children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
    const { connected } = useWallet();
    const router = useRouter();
    const pathname = usePathname();

    // Check if current route should hide the sidebar
    const hideSidebar = pathname?.includes('/products/new') || pathname?.includes('/products/') && pathname?.includes('/edit');

    useEffect(() => {
        if (!connected) {
            router.push('/wallet-connect');
        }
    }, [connected, router]);

    if (!connected) {
        return null; // Will redirect to wallet-connect page
    }

    // If sidebar should be hidden, render full-width layout
    if (hideSidebar) {
        return (
            <div className="min-h-screen bg-background">
                {/* Header for sidebar-free pages */}
                <header className="bg-card border-b border-border px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-semibold text-card-foreground">
                                {pathname?.includes('/edit') ? 'Edit Product' : 'Create Product'}
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                {pathname?.includes('/edit') ? 'Update your product information' : 'Build and launch your digital product'}
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <ThemeToggle />
                            <ClientWalletMultiButton />
                            <UserProfile />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-4">
                    {children}
                </main>
                <OnboardingModal />
            </div>
        );
    }

    // Default layout with sidebar
    return (
        <div className="flex h-screen bg-background">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-card border-b border-border px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-semibold text-card-foreground">Elza Dashboard</h1>
                            <p className="text-xs text-muted-foreground">Manage your products, subscriptions, and payments</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <ThemeToggle />
                            <ClientWalletMultiButton />
                            <UserProfile />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4">
                    {children}
                </main>
            </div>
            <OnboardingModal />
        </div>
    );
}
