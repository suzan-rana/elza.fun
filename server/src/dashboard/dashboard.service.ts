import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Receipt } from '../receipts/entities/receipt.entity';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Subscription)
        private subscriptionRepository: Repository<Subscription>,
        @InjectRepository(Receipt)
        private receiptRepository: Repository<Receipt>,
    ) { }

    async getDashboardStats(merchantId: string) {
        const [
            totalProducts,
            activeSubscriptions,
            totalReceipts,
            totalRevenue
        ] = await Promise.all([
            this.productRepository.count({ where: { merchant: { id: merchantId } } }),
            this.subscriptionRepository.count({ where: { merchant: { id: merchantId }, isActive: true } }),
            this.receiptRepository.count({ where: { merchantId } }),
            this.receiptRepository
                .createQueryBuilder('receipt')
                .select('SUM(receipt.amount)', 'total')
                .where('receipt.merchantId = :merchantId', { merchantId })
                .getRawOne()
        ]);

        // Get unique customers count
        const uniqueCustomers = await this.receiptRepository
            .createQueryBuilder('receipt')
            .leftJoin('receipt.customer', 'customer')
            .select('COUNT(DISTINCT customer.email)', 'count')
            .where('receipt.merchantId = :merchantId', { merchantId })
            .getRawOne();

        return {
            totalRevenue: parseFloat(totalRevenue?.total || '0'),
            totalCustomers: parseInt(uniqueCustomers?.count || '0'),
            totalProducts,
            activeSubscriptions,
            monthlyRevenue: parseFloat(totalRevenue?.total || '0') * 0.3, // Mock monthly calculation
            conversionRate: 3.2 // Mock conversion rate
        };
    }

    async getProducts(merchantId: string) {
        return this.productRepository.find({
            where: { merchant: { id: merchantId } },
            order: { createdAt: 'DESC' }
        });
    }

    async getTransactions(merchantId: string) {
        return this.receiptRepository.find({
            where: { merchantId },
            order: { createdAt: 'DESC' },
            take: 10
        });
    }
}
