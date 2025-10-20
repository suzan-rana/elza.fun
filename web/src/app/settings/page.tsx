'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
    Save,
    Upload,
    Palette,
    User,
    Building
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { apiClient } from '@/lib/api-client';
import { useSimpleToast } from '@/components/ui/simple-toast';

interface UserSettings {
    // Personal Information
    firstName: string;
    lastName: string;
    email: string;

    // Merchant Information
    businessName: string;
    website: string;
    description: string;
    logoUrl: string;

    // Branding
    primaryColor: string;
    secondaryColor: string;

    // Preferences
    currency: string;
    timezone: string;

    // Notifications
    notifications: {
        newOrders: boolean;
        payments: boolean;
        subscriptions: boolean;
        marketing: boolean;
    };
}

export default function SettingsPage() {
    const { user, updateProfile } = useAuth();
    const { addToast } = useSimpleToast();
    const [settings, setSettings] = useState<UserSettings>({
        firstName: '',
        lastName: '',
        email: '',
        businessName: '',
        website: '',
        description: '',
        logoUrl: '',
        primaryColor: '#8B5CF6',
        secondaryColor: '#3B82F6',
        timezone: 'UTC',
        currency: 'USDC',
        notifications: {
            newOrders: true,
            payments: true,
            subscriptions: true,
            marketing: false
        }
    });

    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Load user data when component mounts
    useEffect(() => {
        if (user) {
            setSettings(prev => ({
                ...prev,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                businessName: user.merchant?.businessName || '',
                website: user.merchant?.website || '',
                description: user.merchant?.description || '',
                logoUrl: user.merchant?.logoUrl || '',
            }));
        }
    }, [user]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!settings.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        if (!settings.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        if (!settings.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(settings.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!settings.businessName.trim()) {
            newErrors.businessName = 'Business name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            addToast({
                variant: "destructive",
                title: "Validation Error",
                description: "Please fix the errors below before saving.",
            });
            return;
        }

        setIsSaving(true);

        try {
            // Update user profile
            await updateProfile({
                firstName: settings.firstName,
                lastName: settings.lastName,
                email: settings.email,
            });

            // Update merchant information
            await apiClient.updateMerchant({
                businessName: settings.businessName,
                website: settings.website,
                description: settings.description,
                logoUrl: settings.logoUrl,
            });

            addToast({
                variant: "success",
                title: "Success",
                description: "Settings saved successfully!",
            });
        } catch (error) {
            console.error('Failed to save settings:', error);

            let errorMessage = 'Failed to save settings';
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'object' && error !== null && 'response' in error) {
                const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
                if (axiosError.response?.status === 400) {
                    errorMessage = axiosError.response?.data?.message || 'Bad request. Please check your input.';
                } else if (axiosError.response?.status === 401) {
                    errorMessage = 'Unauthorized. Please log in again.';
                } else if (axiosError.response?.status === 500) {
                    errorMessage = 'Server error. Please try again later.';
                }
            }

            addToast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
            });
        } finally {
            setIsSaving(false);
        }
    };


    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground">Manage your account and business settings</p>
            </div>


            {/* Personal Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>Personal Information</span>
                    </CardTitle>
                    <CardDescription>
                        Update your personal details
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                                id="firstName"
                                value={settings.firstName}
                                onChange={(e) => {
                                    setSettings({ ...settings, firstName: e.target.value });
                                    if (errors.firstName) {
                                        setErrors(prev => ({ ...prev, firstName: '' }));
                                    }
                                }}
                                className={errors.firstName ? 'border-red-500' : ''}
                            />
                            {errors.firstName && (
                                <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                                id="lastName"
                                value={settings.lastName}
                                onChange={(e) => {
                                    setSettings({ ...settings, lastName: e.target.value });
                                    if (errors.lastName) {
                                        setErrors(prev => ({ ...prev, lastName: '' }));
                                    }
                                }}
                                className={errors.lastName ? 'border-red-500' : ''}
                            />
                            {errors.lastName && (
                                <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                            id="email"
                            type="email"
                            value={settings.email}
                            onChange={(e) => {
                                setSettings({ ...settings, email: e.target.value });
                                if (errors.email) {
                                    setErrors(prev => ({ ...prev, email: '' }));
                                }
                            }}
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Building className="h-5 w-5" />
                        <span>Business Information</span>
                    </CardTitle>
                    <CardDescription>
                        Update your business details and branding
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="businessName">Business Name *</Label>
                            <Input
                                id="businessName"
                                value={settings.businessName}
                                onChange={(e) => {
                                    setSettings({ ...settings, businessName: e.target.value });
                                    if (errors.businessName) {
                                        setErrors(prev => ({ ...prev, businessName: '' }));
                                    }
                                }}
                                className={errors.businessName ? 'border-red-500' : ''}
                            />
                            {errors.businessName && (
                                <p className="text-sm text-red-500 mt-1">{errors.businessName}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                value={settings.website}
                                onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                                placeholder="https://yourwebsite.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="currency">Default Currency</Label>
                            <select
                                value={settings.currency}
                                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            >
                                <option value="USDC">USDC</option>
                                <option value="SOL">SOL</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="timezone">Timezone</Label>
                            <select
                                value={settings.timezone}
                                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            >
                                <option value="UTC">UTC</option>
                                <option value="America/New_York">Eastern Time</option>
                                <option value="America/Chicago">Central Time</option>
                                <option value="America/Denver">Mountain Time</option>
                                <option value="America/Los_Angeles">Pacific Time</option>
                                <option value="Europe/London">London</option>
                                <option value="Europe/Paris">Paris</option>
                                <option value="Asia/Tokyo">Tokyo</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="description">Business Description</Label>
                        <textarea
                            id="description"
                            value={settings.description}
                            onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            placeholder="Describe your business..."
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Branding */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Palette className="h-5 w-5" />
                        <span>Branding</span>
                    </CardTitle>
                    <CardDescription>
                        Customize your checkout pages and branding
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="logo">Logo</Label>
                        <div className="mt-2 flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                {settings.logoUrl ? (
                                    <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                    <Upload className="h-6 w-6 text-gray-400" />
                                )}
                            </div>
                            <Button variant="outline">
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Logo
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="primaryColor">Primary Color</Label>
                            <div className="flex items-center space-x-2 mt-2">
                                <Input
                                    id="primaryColor"
                                    type="color"
                                    value={settings.primaryColor}
                                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                    className="w-16 h-10 p-1"
                                />
                                <Input
                                    value={settings.primaryColor}
                                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                    className="flex-1"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="secondaryColor">Secondary Color</Label>
                            <div className="flex items-center space-x-2 mt-2">
                                <Input
                                    id="secondaryColor"
                                    type="color"
                                    value={settings.secondaryColor}
                                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                                    className="w-16 h-10 p-1"
                                />
                                <Input
                                    value={settings.secondaryColor}
                                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                                    className="flex-1"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications */}
            {/* <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Bell className="h-5 w-5" />
                        <span>Notifications</span>
                    </CardTitle>
                    <CardDescription>
                        Choose what notifications you want to receive
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        {Object.entries(settings.notifications).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                                <div>
                                    <Label className="text-sm font-medium capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </Label>
                                    <p className="text-xs text-gray-500">
                                        {key === 'newOrders' && 'Get notified when new orders are placed'}
                                        {key === 'payments' && 'Get notified when payments are received'}
                                        {key === 'subscriptions' && 'Get notified about subscription changes'}
                                        {key === 'marketing' && 'Get marketing updates and tips'}
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        notifications: {
                                            ...settings.notifications,
                                            [key]: e.target.checked
                                        }
                                    })}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card> */}

            {/* Security */}
            {/* <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-5 w-5" />
                        <span>Security</span>
                    </CardTitle>
                    <CardDescription>
                        Manage your account security settings
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                            Change Password
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            Enable Two-Factor Authentication
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            View API Keys
                        </Button>
                    </div>
                </CardContent>
            </Card> */}

            {/* Save Button */}
            <div className="flex justify-end space-x-4">
                <Button
                    variant="outline"
                    onClick={() => {
                        setErrors({});
                        // Reset to original values
                        if (user) {
                            setSettings(prev => ({
                                ...prev,
                                firstName: user.firstName || '',
                                lastName: user.lastName || '',
                                email: user.email || '',
                                businessName: user.merchant?.businessName || '',
                                website: user.merchant?.website || '',
                                description: user.merchant?.description || '',
                                logoUrl: user.merchant?.logoUrl || '',
                            }));
                        }
                    }}
                >
                    Reset
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                    {isSaving ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Settings
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
