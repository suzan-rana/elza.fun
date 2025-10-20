'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
    BarChart3,
    Download,
    Filter,
    Search,
    Eye,
    CheckCircle,
    Clock,
    XCircle
} from 'lucide-react';
import { useState } from 'react';

export default function TransactionsPage() {
    const [transactions] = useState([
        {
            id: 1,
            customer: 'john@example.com',
            product: 'Premium Course Bundle',
            amount: 99.99,
            currency: 'USDC',
            status: 'completed',
            type: 'one_time',
            transactionHash: '5J7X...8K2M',
            timestamp: '2024-01-15T10:30:00Z',
            receiptId: 'RCP-001'
        },
        {
            id: 2,
            customer: 'jane@example.com',
            product: 'Monthly Newsletter',
            amount: 9.99,
            currency: 'USDC',
            status: 'completed',
            type: 'subscription',
            transactionHash: '3H9Y...7L4N',
            timestamp: '2024-01-15T09:15:00Z',
            receiptId: 'RCP-002'
        },
        {
            id: 3,
            customer: 'bob@example.com',
            product: 'Exclusive Content',
            amount: 29.99,
            currency: 'SOL',
            status: 'pending',
            type: 'one_time',
            transactionHash: '8M2P...9Q5R',
            timestamp: '2024-01-14T16:45:00Z',
            receiptId: 'RCP-003'
        },
        {
            id: 4,
            customer: 'alice@example.com',
            product: 'Premium Access',
            amount: 49.99,
            currency: 'USDC',
            status: 'failed',
            type: 'one_time',
            transactionHash: '2K6W...4T8U',
            timestamp: '2024-01-14T14:20:00Z',
            receiptId: null
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.transactionHash.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        totalTransactions: transactions.length,
        completedTransactions: transactions.filter(t => t.status === 'completed').length,
        pendingTransactions: transactions.filter(t => t.status === 'pending').length,
        failedTransactions: transactions.filter(t => t.status === 'failed').length,
        totalRevenue: transactions
            .filter(t => t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0)
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'failed':
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return <Clock className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
                    <p className="text-muted-foreground">View and manage all payment transactions</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalTransactions}</div>
                        <p className="text-xs text-muted-foreground">
                            All time transactions
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.completedTransactions}</div>
                        <p className="text-xs text-muted-foreground">
                            Successful payments
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.pendingTransactions}</div>
                        <p className="text-xs text-muted-foreground">
                            Awaiting confirmation
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            From completed transactions
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search transactions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>
                            <Button variant="outline">
                                <Filter className="mr-2 h-4 w-4" />
                                More Filters
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Transactions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                        Detailed view of all payment transactions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredTransactions.map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        {getStatusIcon(transaction.status)}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <h3 className="font-medium text-gray-900">{transaction.customer}</h3>
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(transaction.status)}`}>
                                                {transaction.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">{transaction.product}</p>
                                        <div className="flex items-center space-x-4 mt-1">
                                            <span className="text-sm text-gray-600 font-mono">
                                                {transaction.transactionHash}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                {new Date(transaction.timestamp).toLocaleString()}
                                            </span>
                                            <span className="text-sm text-gray-600 capitalize">
                                                {transaction.type.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <p className="font-medium text-lg">
                                            {transaction.amount} {transaction.currency}
                                        </p>
                                        {transaction.receiptId && (
                                            <p className="text-sm text-gray-500">
                                                Receipt: {transaction.receiptId}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex space-x-1">
                                        <Button size="sm" variant="outline">
                                            <Eye className="h-3 w-3" />
                                        </Button>
                                        {transaction.receiptId && (
                                            <Button size="sm" variant="outline">
                                                View Receipt
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredTransactions.length === 0 && (
                        <div className="text-center py-12">
                            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                            <p className="text-gray-500">
                                {searchTerm || statusFilter !== 'all'
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'Transactions will appear here once customers make purchases'
                                }
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
