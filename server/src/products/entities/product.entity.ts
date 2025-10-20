import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Merchant } from '../../merchants/entities/merchant.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { Receipt } from '../../receipts/entities/receipt.entity';

export enum ProductType {
    ONE_TIME = 'one_time',
    SUBSCRIPTION = 'subscription',
}

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    price: number;

    @Column()
    currency: string;

    @Column({
        type: 'enum',
        enum: ProductType,
        default: ProductType.ONE_TIME,
    })
    type: ProductType;

    @Column({ nullable: true })
    imageUrl: string;

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
