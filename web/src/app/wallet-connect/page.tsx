'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import {
    Wallet,
    AlertCircle,
    ArrowRight,
    CheckCircle,
    RefreshCw
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

export default function WalletConnectionPage() {
    const { connected, connecting, connect, disconnect, wallet } = useWallet();
    const { setVisible: setWalletModalVisible } = useWalletModal();
    const router = useRouter();
    const [isRetrying, setIsRetrying] = useState(false);

    // Redirect to dashboard when wallet is connected
    useEffect(() => {
        if (connected) {
            const timer = setTimeout(() => {
                router.push('/');
            }, 2000); // 2 second delay to show success message

            return () => clearTimeout(timer);
        }
    }, [connected, router]);

    const handleConnect = async () => {
        try {
            setIsRetrying(true);
            // If no wallet is selected, open the modal instead of calling connect()
            if (!wallet) {
                setWalletModalVisible(true);
                return;
            }
            await connect();
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            // If the error indicates no wallet selected, prompt the modal
            if ((error as any)?.name === 'WalletNotSelectedError') {
                setWalletModalVisible(true);
            }
        } finally {
            setIsRetrying(false);
        }
    };

    const handleDisconnect = () => {
        disconnect();
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Wallet className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        Connect Your Wallet
                    </h1>
                    <p className="text-muted-foreground">
                        Connect your Solana wallet to access the Elza dashboard
                    </p>
                </div>

                {/* Status Card */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            {connected ? (
                                <>
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span>Wallet Connected</span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                                    <span>Wallet Not Connected</span>
                                </>
                            )}
                        </CardTitle>
                        <CardDescription>
                            {connected
                                ? "Your wallet is connected. You can now access the dashboard."
                                : "Please connect your wallet to continue."
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {connected ? (
                            <div className="space-y-4">
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <p className="text-sm text-green-800 dark:text-green-200">
                                        ✅ Wallet successfully connected! Redirecting to dashboard...
                                    </p>
                                </div>
                                <Button
                                    onClick={handleDisconnect}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Disconnect Wallet
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                        ⚠️ No wallet detected. Please install a Solana wallet extension.
                                    </p>
                                </div>
                                <Button
                                    onClick={handleConnect}
                                    disabled={connecting || isRetrying}
                                    className="w-full"
                                >
                                    {(connecting || isRetrying) ? (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                            Connecting...
                                        </>
                                    ) : (
                                        <>
                                            <Wallet className="mr-2 h-4 w-4" />
                                            {wallet ? 'Connect Wallet' : 'Choose Wallet'}
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Instructions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">How to Connect</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                                1
                            </div>
                            <div>
                                <p className="font-medium">Install a Solana Wallet</p>
                                <p className="text-sm text-muted-foreground">
                                    Install Phantom, Solflare, or another Solana wallet extension
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                                2
                            </div>
                            <div>
                                <p className="font-medium">Click Choose Wallet</p>
                                <p className="text-sm text-muted-foreground">
                                    Click the button above to select and open your wallet
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                                3
                            </div>
                            <div>
                                <p className="font-medium">Approve Connection</p>
                                <p className="text-sm text-muted-foreground">
                                    Approve the connection in your wallet popup
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Popular Wallets */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-3">Popular Solana Wallets:</p>
                    <div className="flex justify-center space-x-4">
                        <a
                            href="https://phantom.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                            Phantom
                        </a>
                        <a
                            href="https://solflare.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                            Solflare
                        </a>
                        <a
                            href="https://toruswallet.io"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                            Torus
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
