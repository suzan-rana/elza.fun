'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Package, Download, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="max-w-md w-full mx-4">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl">Payment Successful!</CardTitle>
                        <CardDescription>
                            Thank you for your purchase. Your order has been processed successfully.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium text-sm">Confirmation Email</p>
                                    <p className="text-xs text-muted-foreground">
                                        A confirmation email has been sent to your email address
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                                <Package className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium text-sm">Digital Access</p>
                                    <p className="text-xs text-muted-foreground">
                                        Your digital products are now available in your account
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                                <Download className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium text-sm">Download Links</p>
                                    <p className="text-xs text-muted-foreground">
                                        Check your email for download links and access instructions
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <div className="space-y-2">
                                <Button asChild className="w-full">
                                    <Link href="/">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Return to Home
                                    </Link>
                                </Button>
                                <p className="text-xs text-center text-muted-foreground">
                                    Need help? Contact our support team
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
