import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { Receipt } from '../../receipts/entities/receipt.entity';

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    walletAddress: string;

    @Column()
    email: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: 0 })
    totalSpent: number;

    @Column({ default: 0 })
    totalOrders: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Subscription, subscription => subscription.customer)
    subscriptions: Subscription[];

    @OneToMany(() => Receipt, receipt => receipt.customer)
    receipts: Receipt[];
}
