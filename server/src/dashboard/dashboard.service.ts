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
        const products = await this.productRepository.find({
            where: { merchant: { id: merchantId } },
            order: { createdAt: 'DESC' },
            take: 5
        });

        // Transform products to include sales and revenue data
        const productsWithStats = await Promise.all(
            products.map(async (product) => {
                // Get sales count for this product
                const salesCount = await this.receiptRepository.count({
                    where: { product: { id: product.id } }
                });

                // Get total revenue for this product
                const revenueResult = await this.receiptRepository
                    .createQueryBuilder('receipt')
                    .select('SUM(receipt.amount)', 'total')
                    .where('receipt.productId = :productId', { productId: product.id })
                    .getRawOne();

                return {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    sales: salesCount,
                    revenue: parseFloat(revenueResult?.total || '0'),
                    type: product.type,
                    isActive: product.isActive,
                    imageUrl: product.imageUrl,
                    thumbnailUrl: product.thumbnailUrl,
                    createdAt: product.createdAt
                };
            })
        );

        return productsWithStats;
    }

    async getTransactions(merchantId: string) {
        const receipts = await this.receiptRepository.find({
            where: { merchantId },
            order: { createdAt: 'DESC' },
            take: 10,
            relations: ['customer', 'product']
        });

        // Transform receipts to transaction format
        return receipts.map(receipt => ({
            id: receipt.id,
            customer: receipt.customer?.email || 'Unknown Customer',
            product: receipt.product?.name || 'Unknown Product',
            amount: receipt.amount,
            date: receipt.createdAt.toISOString()
        }));
    }
}
