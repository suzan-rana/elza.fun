import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductType } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

    async create(merchantId: string, createProductDto: CreateProductDto): Promise<Product> {
        try {
            // Generate slug if not provided
            const slug = createProductDto.slug || this.generateSlug(createProductDto.title);

            const productData = {
                name: createProductDto.title,
                slug,
                description: createProductDto.description,
                price: createProductDto.price,
                currency: createProductDto.currency,
                type: createProductDto.product_type,
                imageUrl: createProductDto.imageUrl,
                thumbnailUrl: createProductDto.thumbnailUrl,
                previewUrl: createProductDto.previewUrl,
                downloadUrl: createProductDto.downloadUrl,
                videoUrl: createProductDto.videoUrl,
                contentUrl: createProductDto.contentUrl,
                isActive: createProductDto.isActive ?? true,
                subscriptionInterval: createProductDto.subscriptionInterval,
                subscriptionPrice: createProductDto.subscriptionPrice,
                maxSubscriptions: createProductDto.maxSubscriptions,
                externalLinks: createProductDto.externalLinks || [],
                gatedContent: createProductDto.gatedContent || [],
                merchant: { id: merchantId }
            };

            const result = await this.productRepository.insert(productData);
            return await this.productRepository.findOne({
                where: { id: result.identifiers[0].id },
                relations: ['merchant']
            });
        } catch (error) {
            throw new BadRequestException(`Failed to create product: ${error.message}`);
        }
    }

    async findByMerchant(merchantId: string): Promise<Product[]> {
        return this.productRepository.find({
            where: { merchant: { id: merchantId } },
            order: { createdAt: 'DESC' },
            relations: ['merchant']
        });
    }

    async findOne(merchantId: string, id: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: {
                id,
                merchant: { id: merchantId }
            },
            relations: ['merchant']
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return product;
    }

    async update(merchantId: string, id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        const product = await this.findOne(merchantId, id);

        try {
            const updateData: any = { ...updateProductDto };

            // Update name if title is provided
            if (updateProductDto.title) {
                updateData.name = updateProductDto.title;
                // Remove title field to avoid TypeORM error
                delete updateData.title;
            }

            // Map product_type to type
            if (updateProductDto.product_type) {
                updateData.type = updateProductDto.product_type;
                // Remove product_type field to avoid TypeORM error
                delete updateData.product_type;
            }

            // Generate new slug if title changed
            if (updateProductDto.title && !updateProductDto.slug) {
                updateData.slug = this.generateSlug(updateProductDto.title);
            }

            await this.productRepository.update(id, updateData);
            return await this.findOne(merchantId, id);
        } catch (error) {
            throw new BadRequestException(`Failed to update product: ${error.message}`);
        }
    }

    async remove(merchantId: string, id: string): Promise<void> {
        const product = await this.findOne(merchantId, id);
        await this.productRepository.remove(product);
    }

    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .trim();
    }
}
