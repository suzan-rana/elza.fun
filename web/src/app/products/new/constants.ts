import {
    Package,
    DollarSign,
    ImageIcon,
    Lock,
    ExternalLink,
    Eye,
    GraduationCap,
    BookOpen,
    Users2,
    Gift,
    Coffee,
    CreditCard
} from 'lucide-react';
import { ProductType, Step } from './types';

export const productTypes: ProductType[] = [
    {
        id: 'digital_product',
        name: 'Digital Product',
        description: 'Software, templates, tools, or digital assets',
        icon: Package,
        color: 'bg-blue-500',
        examples: ['Software licenses', 'Design templates', 'Digital tools']
    },
    {
        id: 'course',
        name: 'Course',
        description: 'Educational content with structured learning',
        icon: GraduationCap,
        color: 'bg-green-500',
        examples: ['Video courses', 'Online tutorials', 'Training programs']
    },
    {
        id: 'ebook',
        name: 'E-book',
        description: 'Digital books, guides, or written content',
        icon: BookOpen,
        color: 'bg-purple-500',
        examples: ['PDF guides', 'Digital books', 'Research papers']
    },
    {
        id: 'membership',
        name: 'Membership',
        description: 'Exclusive access to community or content',
        icon: Users2,
        color: 'bg-orange-500',
        examples: ['Community access', 'Premium content', 'VIP groups']
    },
    {
        id: 'bundle',
        name: 'Bundle',
        description: 'Multiple products sold together at a discount',
        icon: Gift,
        color: 'bg-pink-500',
        examples: ['Course bundles', 'Tool packages', 'Resource collections']
    },
    {
        id: 'service',
        name: 'Service',
        description: 'Consulting, coaching, or professional services',
        icon: Coffee,
        color: 'bg-yellow-500',
        examples: ['Consulting calls', 'Coaching sessions', 'Custom work']
    },
    {
        id: 'subscription',
        name: 'Subscription',
        description: 'Recurring access to content or services',
        icon: CreditCard,
        color: 'bg-indigo-500',
        examples: ['Monthly content', 'SaaS access', 'Premium features']
    }
];

export const steps: Step[] = [
    {
        id: 1,
        title: 'Basic Information',
        description: 'Product details, type, and pricing',
        icon: Package,
        fields: ['title', 'slug', 'description', 'product_type', 'price', 'currency', 'subscriptionPrice', 'subscriptionInterval', 'maxSubscriptions']
    },
    {
        id: 2,
        title: 'Product Images',
        description: 'Upload product images and cover images',
        icon: ImageIcon,
        fields: ['imageUrl', 'thumbnailUrl', 'contentUrl']
    },
    {
        id: 3,
        title: 'Gated Content',
        description: 'Premium content and materials',
        icon: Lock,
        fields: ['gatedContent']
    },
    {
        id: 4,
        title: 'Links & Settings',
        description: 'External links and final settings',
        icon: ExternalLink,
        fields: ['externalLinks', 'isActive']
    }
];
