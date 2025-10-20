import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Merchant } from '../../merchants/entities/merchant.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('subscriptions')
export class Subscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    planId: string;

    @Column()
    amount: number;

    @Column()
    intervalSeconds: number;

    @Column()
    nextPaymentDue: Date;

    @Column({ default: 0 })
    totalPayments: number;

    @Column({ nullable: true })
    maxPayments: number;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isPaused: boolean;

    @Column({ nullable: true })
    lastPaymentAt: Date;

    @Column({ nullable: true })
    cancelledAt: Date;

    @Column({ nullable: true })
    pausedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Merchant, merchant => merchant.subscriptions)
    @JoinColumn({ name: 'merchantId' })
    merchant: Merchant;

    @Column()
    merchantId: string;

    @ManyToOne(() => Customer, customer => customer.subscriptions)
    @JoinColumn({ name: 'customerId' })
    customer: Customer;

    @Column()
    customerId: string;

    @ManyToOne(() => Product, product => product.subscriptions)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column()
    productId: string;
}
