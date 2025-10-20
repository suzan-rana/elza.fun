import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { Receipt } from '../../receipts/entities/receipt.entity';

@Entity('merchants')
export class Merchant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    walletAddress: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: true })
    businessName: string;

    @Column({ nullable: true })
    logoUrl: string;

    @Column({ nullable: true })
    website: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: 0 })
    totalRevenue: number;

    @Column({ default: 0 })
    totalCustomers: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Product, product => product.merchant)
    products: Product[];

    @OneToMany(() => Subscription, subscription => subscription.merchant)
    subscriptions: Subscription[];

    @OneToMany(() => Receipt, receipt => receipt.merchant)
    receipts: Receipt[];
}
