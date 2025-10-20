'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Wallet,
  Plus,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';

export default function WalletConfigPage() {
  const [wallets] = useState([
    {
      id: 1,
      name: 'Primary Wallet',
      address: '9gMgXjZsarFV2JcvCTm1BF2UXVJ9FVoDP1wRbCDggbhW',
      percentage: 100,
      isActive: true,
      isVerified: true
    },
    {
      id: 2,
      name: 'Team Wallet',
      address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      percentage: 0,
      isActive: false,
      isVerified: true
    }
  ]);

  const [showAddWallet, setShowAddWallet] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const totalPercentage = wallets.reduce((sum, wallet) => sum + wallet.percentage, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Wallet Configuration</h1>
          <p className="text-muted-foreground">Manage your wallet addresses and revenue splitting</p>
        </div>
        <Button onClick={() => setShowAddWallet(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Wallet
        </Button>
      </div>

      {/* Revenue Split Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Split Configuration</CardTitle>
          <CardDescription>
            Configure how revenue is distributed across your wallets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Percentage</span>
              <span className={`text-sm font-bold ${totalPercentage === 100 ? 'text-green-600' : 'text-red-600'
                }`}>
                {totalPercentage}%
              </span>
            </div>
            {totalPercentage !== 100 && (
              <div className="flex items-center space-x-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>Total percentage must equal 100%</span>
              </div>
            )}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(totalPercentage, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Wallet Form */}
      {showAddWallet && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Wallet</CardTitle>
            <CardDescription>
              Add a new wallet address for revenue splitting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="walletName">Wallet Name</Label>
                <Input id="walletName" placeholder="e.g., Team Wallet" />
              </div>
              <div>
                <Label htmlFor="walletAddress">Wallet Address</Label>
                <Input id="walletAddress" placeholder="Enter Solana wallet address" />
              </div>
              <div>
                <Label htmlFor="percentage">Revenue Percentage</Label>
                <Input
                  id="percentage"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button>Add Wallet</Button>
              <Button variant="outline" onClick={() => setShowAddWallet(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wallets List */}
      <div className="space-y-4">
        {wallets.map((wallet) => (
          <Card key={wallet.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900">{wallet.name}</h3>
                      {wallet.isVerified && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 font-mono">{wallet.address}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600">
                        {wallet.percentage}% revenue
                      </span>
                      <span className={`text-sm px-2 py-1 rounded-full ${wallet.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}>
                        {wallet.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(wallet.address)}
                  >
                    {copiedAddress === wallet.address ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How Revenue Splitting Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">1. Primary Wallet</h4>
            <p className="text-sm text-gray-600">
              Your primary wallet receives the specified percentage of all revenue.
              This is typically your main business wallet.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">2. Team Wallets</h4>
            <p className="text-sm text-gray-600">
              Add team member wallets to automatically split revenue.
              Perfect for partnerships, affiliates, or team members.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">3. Automatic Distribution</h4>
            <p className="text-sm text-gray-600">
              Revenue is automatically distributed to all active wallets
              based on their configured percentages.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
