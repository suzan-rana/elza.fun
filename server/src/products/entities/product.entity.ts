import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Merchant } from '../../merchants/entities/merchant.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { Receipt } from '../../receipts/entities/receipt.entity';

export enum ProductType {
    DIGITAL_PRODUCT = 'digital_product',
    COURSE = 'course',
    EBOOK = 'ebook',
    MEMBERSHIP = 'membership',
    BUNDLE = 'bundle',
    SERVICE = 'service',
    SUBSCRIPTION = 'subscription',
}

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    slug: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    price: number;

    @Column()
    currency: string;

    @Column({
        type: 'enum',
        enum: ProductType,
        default: ProductType.DIGITAL_PRODUCT,
    })
    type: ProductType;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ nullable: true })
    thumbnailUrl: string;

    @Column({ nullable: true })
    previewUrl: string;

    @Column({ nullable: true })
    downloadUrl: string;

    @Column({ nullable: true })
    videoUrl: string;

    @Column({ nullable: true })
    contentUrl: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: 0 })
    totalSales: number;

    @Column({ default: 0 })
    totalRevenue: number;

    @Column({ nullable: true })
    subscriptionInterval: string; // 'monthly', 'yearly', etc.

    @Column({ nullable: true })
    subscriptionPrice: number;

    @Column({ nullable: true })
    maxSubscriptions: number;

    @Column({ type: 'json', nullable: true })
    externalLinks: Array<{
        id: string;
        title: string;
        type: 'link' | 'text';
        content: string;
        description: string;
    }>;

    @Column({ type: 'json', nullable: true })
    gatedContent: Array<{
        id: string;
        title: string;
        type: 'file' | 'text' | 'video' | 'link';
        content: string;
        description: string;
        metadata?: any;
    }>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Merchant, merchant => merchant.products)
    @JoinColumn({ name: 'merchantId' })
    merchant: Merchant;

    @Column()
    merchantId: string;

    @OneToMany(() => Subscription, subscription => subscription.product)
    subscriptions: Subscription[];

    @OneToMany(() => Receipt, receipt => receipt.product)
    receipts: Receipt[];
}
