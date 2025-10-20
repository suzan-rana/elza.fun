'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useUser } from '@/providers/UserProvider';
import { Button } from '@/components/ui/Button';
import {
    User,
    LogOut,
    Settings,
    ChevronDown
} from 'lucide-react';
import { useState } from 'react';

export function UserProfile() {
    const { wallet, disconnect, connected } = useWallet();
    const { user, logout } = useUser();
    const [showDropdown, setShowDropdown] = useState(false);

    if (!connected || !wallet) {
        return null;
    }

    const truncateAddress = (address: string) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    const handleLogout = () => {
        logout();
        disconnect();
        setShowDropdown(false);
    };

    return (
        <div className="relative">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2"
            >
                <User className="h-4 w-4" />
                <span className="font-mono text-xs">
                    {truncateAddress(wallet.adapter.publicKey?.toString() || '')}
                </span>
                <ChevronDown className="h-3 w-3" />
            </Button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg z-50">
                    <div className="p-3 border-b border-border">
                        <p className="text-sm font-medium text-foreground">
                            {user?.firstName && user?.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : 'Connected Wallet'
                            }
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                            {wallet.adapter.publicKey?.toString()}
                        </p>
                        {user?.email && (
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                        )}
                    </div>
                    <div className="p-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                                // TODO: Navigate to profile settings
                                setShowDropdown(false);
                            }}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Profile Settings
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-destructive hover:text-destructive"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Disconnect
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
