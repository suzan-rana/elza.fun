export interface GatedContentItem {
    id: string;
    title: string;
    description: string;
    type: 'file' | 'url' | 'twitter_post' | 'license_key' | 'membership_credentials' | 'text' | 'image' | 'video';
    content: string; // URL, file path, or text content
    file?: File; // For file uploads
    metadata?: {
        platform?: string; // For social media posts
        expiryDate?: string; // For license keys
        username?: string; // For membership credentials
        password?: string; // For membership credentials
    };
}

export interface ProductFormData {
    title: string;
    slug: string;
    description: string;
    product_type: 'digital_product' | 'course' | 'ebook' | 'membership' | 'bundle' | 'service' | 'subscription';
    price: string;
    currency: string;
    imageUrl: string;
    contentUrl: string;
    isActive: boolean;
    // Enhanced media and content fields
    thumbnailUrl: string;
    previewUrl: string;
    downloadUrl: string;
    videoUrl: string;
    externalLinks: Array<{
        id: string;
        title: string;
        type: 'link' | 'text';
        content: string; // URL for links, text content for text
        description: string;
    }>;
    gatedContent: GatedContentItem[];
    // Subscription specific fields
    subscriptionInterval: string;
    subscriptionPrice: string;
    maxSubscriptions: string;
}

export interface ProductType {
    id: string;
    name: string;
    description: string;
    icon: any;
    color: string;
    examples: string[];
}

export interface Step {
    id: number;
    title: string;
    description: string;
    icon: any;
    fields: string[];
}
