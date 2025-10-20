import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

    async create(merchantId: string, createProductDto: any): Promise<Product> {
        const productData = {
            ...createProductDto,
            merchant: { id: merchantId }
        };
        const result = await this.productRepository.insert(productData);
        return await this.productRepository.findOne({ where: { id: result.identifiers[0].id } });
    }

    async findByMerchant(merchantId: string): Promise<Product[]> {
        return this.productRepository.find({
            where: { merchant: { id: merchantId } },
            order: { createdAt: 'DESC' }
        });
    }

    async findOne(merchantId: string, id: string): Promise<Product> {
        return this.productRepository.findOne({
            where: {
                id,
                merchant: { id: merchantId }
            }
        });
    }
}
