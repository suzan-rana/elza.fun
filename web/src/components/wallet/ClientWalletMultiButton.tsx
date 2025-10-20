'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';

export function ClientWalletMultiButton() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="wallet-adapter-button wallet-adapter-button-trigger">
                <button className="wallet-adapter-button-start-icon">
                    Select Wallet
                </button>
            </div>
        );
    }

    return <WalletMultiButton />;
}
