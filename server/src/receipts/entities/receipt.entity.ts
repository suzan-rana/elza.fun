import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Merchant } from '../../merchants/entities/merchant.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('receipts')
export class Receipt {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    receiptId: string;

    @Column()
    productName: string;

    @Column()
    amount: number;

    @Column()
    currency: string;

    @Column()
    metadataUri: string;

    @Column({ nullable: true })
    nftMintAddress: string;

    @Column({ default: false })
    isSubscription: boolean;

    @Column({ nullable: true })
    subscriptionId: string;

    @Column({ nullable: true })
    updatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Merchant, merchant => merchant.receipts)
    @JoinColumn({ name: 'merchantId' })
    merchant: Merchant;

    @Column()
    merchantId: string;

    @ManyToOne(() => Customer, customer => customer.receipts)
    @JoinColumn({ name: 'customerId' })
    customer: Customer;

    @Column()
    customerId: string;

    @ManyToOne(() => Product, product => product.receipts)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column()
    productId: string;
}
