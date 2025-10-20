import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Merchant } from '../../merchants/entities/merchant.entity';

export enum CheckoutType {
    ONE_TIME = 'one_time',
    SUBSCRIPTION = 'subscription',
    MIXED = 'mixed',
}

@Entity('checkout_configs')
export class CheckoutConfig {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'json' })
    products: string[];

    @Column({
        type: 'enum',
        enum: CheckoutType,
        default: CheckoutType.ONE_TIME,
    })
    checkoutType: CheckoutType;

    @Column({ type: 'json' })
    customizations: {
        showProductImages: boolean;
        showProductDescriptions: boolean;
        allowQuantitySelection: boolean;
        showMerchantInfo: boolean;
        customMessage?: string;
        successRedirectUrl?: string;
        failureRedirectUrl?: string;
    };

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Merchant, merchant => merchant.checkoutConfigs)
    @JoinColumn({ name: 'merchantId' })
    merchant: Merchant;

    @Column()
    merchantId: string;
}
